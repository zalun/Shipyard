// Parts copied or inspired by MooTools (http://mootools.net) 
// - MIT Licence
var Class = require('./'),
	overloadSetter = require('../utils/function').overloadSetter;

function addEvent(evt, fn, internal) {
	var events = this.$events[evt] = (this.$events[evt] || [])
	events.push(fn);
	return this;
}

function removeEvent(evt, fn) {
	var events = this.$events[evt];
	if (events) {
		var index = events.indexOf(fn);
		if (~index) delete events[index];
	}
	return this;
}


module.exports = new Class({
	
	$events: {},
	
	addEvent: addEvent,

	addEvents: overloadSetter(addEvent),

	removeEvent: removeEvent,

	removeEvents: overloadSetter(removeEvent),

	fireEvent: function(evt, args) {
		var events = this.$events[evt];
		if (!events) return this;

		events.forEach(function(fn) {
			fn.apply(this, args);
		}, this);
		
		return this;
	}

});
