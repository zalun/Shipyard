var Class = require('../class/Class'),
	Sync = require('./Sync'),
	dom = require('../dom'),
	string = require('../utils/string'),
	object = require('../utils/object');

var FUNCTION = 'function';
var $store = dom.window.valueOf().localStorage;

function getTable(name) {
	return JSON.parse($store.getItem(name)) || {};
}

function setTable(name, table) {
	$store.setItem(name, JSON.stringify(table));
}

module.exports = new Class({

	Extends: Sync,

	create: function create(data, callback) {
		var store = getTable(this.options.table),
			id = string.uniqueID();

		store[id] = data;
		setTable(this.options.table, store);
		if (typeof callback == FUNCTION) callback(data);
	},

	update: function update(id, data, callback) {
		var store = getTable(this.options.table);

		store[id] = data;
		setTable(this.options.table, store);
		if (typeof callback == FUNCTION) callback(data);
	},

	read: function read(params, callback) {
		var store = getTable(this.options.table),
			rows = [];

		object.forEach(store, function(values, id) {
			for (var k in params) if (params.hasOwnProperty(k)) {
				if (values[k] != params[k]) {
					return;
				}
			}
			values.id = id;
			rows.push(values);
		}, this);

		if (typeof callback == FUNCTION) callback(rows);
	},

	destroy: function destroy(id, callback) {
		var store = getTable(this.options.table);

		delete store[id];
		setTable(this.options.table, store);
		if (typeof callback == FUNCTION) callback(id);
	}

});
