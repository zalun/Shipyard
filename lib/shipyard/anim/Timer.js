var Class = require('../class/Class'),
    Events = require('../class/Events'),
    Options = require('../class/Options');

var Durations;

// global timers

var instances = {}, timers = {};

var loop = function() {
    var now = Date.now();
    for (var i = this.length; i--;) {
        var instance = this[i];
        if (instance) {
            instance.step(now);
        }
    }
};

var pushInstance = function(fps) {
    var list = instances[fps] || (instances[fps] = []);
    list.push(this);
    if (!timers[fps]) {
        timers[fps] = setInterval(function() {
            loop.call(list);
        }, Math.round(1000 / fps));
    }
};

var pullInstance = function(fps) {
    var list = instances[fps];
    if (list) {
        var i = list.indexOf(this);
        if (i >= 0) {
            list.splice(i, 1);
        }
        if (!list.length && timers[fps]) {
            delete instances[fps];
            timers[fps] = clearInterval(timers[fps]);
        }
    }
};

var linear = function(p) {
    return p;
};

var Timer = module.exports = new Class({
    
    Implements: [Events, Options],

    options: {
        fps: 60,
        unit: false,
        duration: 500,
        frames: null,
        frameSkip: true,
        transition: null
    },

    initialize: function Timer(options) {
        this.subject = this.subject || this;
        this.setOptions(options);
    },

    getTransition: function getTransition() {
        var trans = this.getOption('transition');
        if (!trans) {
            return linear;
        } else if (trans.easeIn) {
            return trans.easeIn;
        } else {
            return trans;
        }
    },

    step: function(now) {
        if (this.options.frameSkip) {
            var diff = (this.time != null) ? (now - this.time) : 0, frames = diff / this.frameInterval;
            this.time = now;
            this.frame += frames;
        } else {
            this.frame++;
        }

        if (this.frame < this.frames) {
            var delta = this.transition(this.frame / this.frames);
            this.set(this.compute(this.from, this.to, delta));
        } else {
            this.frame = this.frames;
            this.set(this.compute(this.from, this.to, 1));
            this.stop();
        }
    },

    set: function(now) {
        // To be overriden in subclasses.
        return now;
    },

    compute: function(from, to, delta) {
        return Timer.compute(from, to, delta);
    },

    check: function() {
        return !this.isRunning();
    },

    start: function(from, to) {
        if (!this.check(from, to)) {
            return this;
        }
        this.from = from;
        this.to = to;
        this.frame = (this.options.frameSkip) ? 0 : -1;
        this.time = null;
        this.transition = this.getTransition();
        var frames = this.options.frames, fps = this.options.fps, duration = this.options.duration;
        this.duration = Durations[duration] || parseInt(duration, 10);
        this.frameInterval = 1000 / fps;
        this.frames = frames || Math.round(this.duration / this.frameInterval);
        this.fireEvent('start', this.subject);
        pushInstance.call(this, fps);
        return this;
    },

    stop: function() {
        if (this.isRunning()) {
            this.time = null;
            pullInstance.call(this, this.options.fps);
            if (this.frames === this.frame) {
                this.fireEvent('complete', this.subject);
            } else {
                this.fireEvent('stop', this.subject);
            }
        }
        return this;
    },

    cancel: function() {
        if (this.isRunning()) {
            this.time = null;
            pullInstance.call(this, this.options.fps);
            this.frame = this.frames;
            this.fireEvent('cancel', this.subject);
        }
        return this;
    },

    pause: function() {
        if (this.isRunning()) {
            this.time = null;
            pullInstance.call(this, this.options.fps);
        }
        return this;
    },

    resume: function() {
        if ((this.frame < this.frames) && !this.isRunning()) {
            pushInstance.call(this, this.options.fps);
        }
        return this;
    },

    isRunning: function() {
        var list = instances[this.options.fps];
        return list && (list.indexOf(this) >= 0);
    }

});

Timer.compute = function(from, to, delta) {
    return (to - from) * delta + from;
};


Timer.SHORT = 250;
Timer.NORMAL = 500;
Timer.LONG = 1000;
Durations = {
    'short': Timer.SHORT,
    'normal': Timer.NORMAL,
    'long': Timer.LONG
};


