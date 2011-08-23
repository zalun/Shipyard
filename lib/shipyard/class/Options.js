// Parts copied or inspired by MooTools (http://mootools.net) 
// - MIT Licence
var Class = require('./'),
	merge = require('../utils/object').merge
	overloadSetter = require('../utils/function').overloadSetter;

var onEventRE = /^on[A-Z]/;

function getOption(name) {
	if (!this.options) return null;
	return this.options[name];
}

function setOption(name, value) {
	if (!this.options) this.options = {};
	if (this.addEvent && onEventRE.test(name) && typeof value == 'function') {
		this.addEvent(name, value);
	} else {
		merge(this.options, name, value);
	}
	return this;
}

module.exports = new Class({

	getOption: getOption,

	setOption: setOption,
	
	setOptions: overloadSetter(setOption)

});
