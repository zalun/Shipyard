var Class = require('../class/Class'),
	Observable = require('../class/Observable'),
	overloadSetter = require('../utils/function').overloadSetter;

var Model = module.exports = new Class({
	
    Extends: Observable,
	
	fields: {
		//default to always having an ID field?
	}, 
	
	_set: function _set(key, value) {
		if (key in this.fields && this.fields[key].isField) {
			this.parent(key, this.fields[key].from(value));
		}
    },
	
	_get: function _get(key) {
		if (key in this.fields) {
			return this.parent(key);
		}
		throw new Error('Accessing undefined field "'+key+'"');
	},

	toJSON: function toJSON() {
		var data = {};
		for (var key in this.fields) {
			data[key] = this.fields[key].serialize(this.get(key));
		}
		return data;
	},

	toString: function toString() {
		// you should override this, since some Views will cast the
		// Model to a string when rendering
		return '[object Model]';
	}

});
