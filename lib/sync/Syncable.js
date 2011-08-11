var Class = require('../class'),
	Events = require('../class/Events'),
	object = require('../utils/object');

var DEFAULT = 'default';

function getSync(obj, name) {
	var using = name || DEFAULT,
		sync = obj.$syncs[using];

	if (!sync) 
		throw new Error('This Syncable does not have a sync named "' + using +'"')
	return sync;
}

var Syncable = new Class({
	
	Implements: Events,
	
	save: function save(options) {
		options = options || {};

		this.fireEvent('preSave');

		var id = this.get('id'),
			isNew = !id;

		var sync = getSync(this.constructor, options.using);
		if (isNew) {
			sync.create(this);
		} else {
			sync.update(id, this);
		}

		return this;
	},

	destroy: function destroy(options) {
		options = options || {};
		
		this.fireEvent('preDestroy');

		var id = this.get('id');
		if (!id) return null;

		var sync = getSync(this.constructor, options.using);
		sync.destroy(id);

		return null;
	}

});

Syncable.find = function find(conditions, options, callback) {
	var klass = this;
	conditions = conditions || {};
	options = options || {};
	function wrap(rows) {
		return rows.map(function(row) { return new klass(row); });
	}

	var sync = getSync(this, options.using);

	sync.read(conditions, function(rows) {
		rows = wrap(rows);
		if (typeof callback == 'function') callback(rows);
	});
	return this;
};

Syncable.$syncs = {};

Syncable.addSync = function addSync(name, sync) {
	this.$syncs[name] = sync;
	return this;
};

Syncable.removeSync = function removeSync(name) {
	delete this.$syncs[name];
	return this;
};


// Sync mutator

Syncable.Mutators.Sync = function Sync(syncs) {
	object.forEach(syncs, function(options, name) {
		var klass = options.driver;
		delete options.driver;
		this.addSync(name, new klass(options));
	}, this);
};

module.exports = Syncable;
