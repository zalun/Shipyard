// Parts copied or inspired by MooTools (http://mootools.net) 
// - MIT Licence
var Class = require('./'),
	overloadSetter = require('../utils/function').overloadSetter;

function addEvent(evt, fn, internal) {
	evt = removeOn(evt);

	var events = this.$events[evt] = (this.$events[evt] || [])
	events.push(fn);
	return this;
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

	removeEvents: overloadSetter(removeEvent),

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
