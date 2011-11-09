// Parts copied or inspired by MooTools (http://mootools.net)
// - MIT Licence
var Class = require('./Class'),
    assert = require('../error/assert'),
    typeOf = require('../utils/type').typeOf,
	overloadSetter = require('../utils/function').overloadSetter;

function Listener(obj, evt, fn) {
    this.obj = obj;
    this.evt = evt;
    this.fn = fn;
}

Listener.prototype.detach = function detach() {
    this.obj.removeEvent(this.evt, this.fn);
};

Listener.prototype.attach = function attach() {
    this.obj.addEvent(this.evt, this.fn);
};


function addEvent(evt, fn, internal) {
	assert(fn, 'Cannot addEvent with a null handler');
    evt = removeOn(evt);

	var events = this.$events[evt] = (this.$events[evt] || []);
	events.push(fn);
	return new Listener(this, evt, fn);
}

function removeEvent(evt, fn) {
	evt = removeOn(evt);
	
	var events = this.$events[evt];
	if (events) {
		var index = events.indexOf(fn);
		if (~index) delete events[index];
	}
	return this;
}

function removeEvents(events) {
    if (typeOf(events) === 'object') {
        for (var key in events) {
            removeEvent(key, events[key]);
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

function removeOn(string) {
	return string.replace(/^on([A-Z])/, function(full, first) {
		return first.toLowerCase();
	});
}

module.exports = new Class({
	
	$events: {},
	
	addEvent: addEvent,

	addEvents: overloadSetter(addEvent),

	removeEvent: removeEvent,

	removeEvents: removeEvents,

	fireEvent: function fireEvent(evt) {
		evt = removeOn(evt);

		var events = this.$events[evt];
		if (!events) return this;

		var args = [].slice.call(arguments, 1);

		events.forEach(function(fn) {
			fn.apply(this, args);
		}, this);
		
		return this;
	}

});
