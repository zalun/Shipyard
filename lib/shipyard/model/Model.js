var Class = require('../class/Class'),
	Observable = require('../class/Observable'),
    ShipyardError = require('../error/Error'),
	overloadSetter = require('../utils/function').overloadSetter;

var PK = 'pk';
var undefined;

var Model = module.exports = new Class({
	
    Extends: Observable,
	
	fields: {
		//default to always having an ID field?
	}, 

    pk: 'id',

    initialize: function Model(data) {
        this.parent(data);
        for (var f in this.fields) {
            var field = this.fields[f];
            if (!field.isField) continue;

            var def = field.getOption('default');
            if (this.get(f) === undefined && def != null) {
                this.set(f, def);
            }
        }
    },
	
	_set: function _set(key, value) {
        if (key === PK) key = this.pk;
		if (key in this.fields && this.fields[key].isField) {
			this.parent(key, this.fields[key].from(value));
		}
    },
	
	_get: function _get(key) {
		if (key === PK) key = this.pk;
        if ((key in this.fields) || (key in this)) {
			return this.parent(key);
		}
		throw new ShipyardError('Accessing undefined field "'+key+'"');
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
