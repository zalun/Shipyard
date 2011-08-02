var Class = require('../class'),
	Sync = require('./Sync'),
	dom = require('../dom'),
	string = require('../utils/string'),
	object = require('../utils/object');

var $store = dom.window.valueOf().localStorage;

function getTable(name) {
	return JSON.parse($store.getItem(name)) || {};
}

function setTable(name, table) {
	$store.setItem(name, JSON.stringify(table));
}

module.exports = new Class({

	Extends: Sync,

	create: function(data, callback) {
		var store = getTable(this.options.table),
			id = string.uniqueID();

		store[id] = data;
		setTable(this.options.table, store);
		if (typeof callback == 'function') callback(data);
	},

	update: function(id, data, callback) {
		var store = getTable(this.options.table);

		store[id] = data;
		setTable(this.options.table, store);
		if (typeof callback == 'function') callback(data);
	},

	read: function(params, callback) {
		var store = getTable(this.options.table),
			rows = [];

		object.forEach(store, function(values, id) {
			for (var k in params) if (params.hasOwnProperty(k)) {
				if (values[k] != params[k]) {
					values.id = id;
					return;
				}
			}
			rows.push(values);
		}, this);

		if (typeof callback == 'function') callback(rows);
	},

	destroy: function(id, callback) {
		var store = getTable(this.options.table);

		delete store[id];
		setTable(this.options.table, store);
		if (typeof callback == 'function') callback(id);
	}

});
