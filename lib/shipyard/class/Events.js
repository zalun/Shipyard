// Parts copied or inspired by MooTools (http://mootools.net)
// - MIT Licence
var Class = require('./Class'),
    assert = require('../error/assert'),
    log = require('../utils/log'),
    typeOf = require('../utils/type').typeOf,
    overloadSetter = require('../utils/function').overloadSetter;

function Listener(obj, evt, fn) {
    this.obj = obj;
    this.evt = evt;
    this.fn = fn;
}

Listener.prototype.detach = function detach() {
    this.obj.removeListener(this.evt, this.fn);
    return this;
};

Listener.prototype.attach = function attach() {
    this.obj.addListener(this.evt, this.fn);
    return this;
};

function removeOn(string) {
    return string.replace(/^on([A-Z])/, function(full, first) {
        return first.toLowerCase();
    });
}

function getListenerIndex(events, fn) {
    var index = -1;
    for (var i = 0; i < events.length; i++) {
        if (events[i] && (events[i] === fn || events[i].listener === fn)) {
            index = i;
            break;
        }
    }
    return index;
}

function addListener(evt, fn, internal) {
    assert(typeOf(evt) === 'string', 'Cannot addListener with no type');
    assert(typeOf(fn) === 'function', 'Cannot addListener with no function.');
    evt = removeOn(evt);

    var events = this.$events[evt] = (this.$events[evt] || []);
    var existing = getListenerIndex(events, fn) >= 0;
    if (!existing) {
        events.push(fn);
    }
    return new Listener(this, evt, fn);
}

function removeEvent(evt, fn) {
    evt = removeOn(evt);
    
    var events = this.$events[evt];
    if (events) {
        var index = getListenerIndex(events, fn);
        if (index >= 0) {
            delete events[index];
        }
    }
    return this;
}

function removeEvents(events) {
    if (typeOf(events) === 'object') {
        for (var key in events) {
            this.removeListener(key, events[key]);
        }
    } else {
        if (events) {
            events = removeOn(events);
            this.$events[events] = [];
        } else {
            this.$events = {};
        }
        return this;
    }
}

function emit(evt) {
    evt = removeOn(evt);

    var events = this.$events[evt];
    if (!events) {
        return this;
    }

    var args = [].slice.call(arguments, 1);

    events.forEach(function(fn) {
        fn.apply(this, args);
    }, this);
    
    return this;
}

function useAddListener(evt, fn) {
    //TODO: Uncomment this to help find all the places using legacy api.
    //log.debug('Ensuring addListener is called.');
    return this.addListener(evt, fn);
}

function useRemoveListener(evt, fn) {
    return this.removeListener(evt, fn);
}

var EventEmitter = module.exports = new Class({
    
    $events: {},

    addListener: addListener,
    addListeners: overloadSetter(useAddListener),
    once: function once(evt, fn) {
        var emitter = this;
        function one() {
            fn.apply(emitter, arguments);
            emitter.removeListener(evt, fn);
        }

        one.listener = fn;
        return this.addListener(evt, one);
    },
    removeListener: removeEvent,
    removeListeners: removeEvents,
    emit: emit,
    
    // legacy
    addEvent: useAddListener,
    addEvents: overloadSetter(useAddListener),
    removeEvent: useRemoveListener,
    removeEvents: removeEvents,
    fireEvent: emit

});
