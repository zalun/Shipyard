var Class = require('../class'),
	Events = require('../class/Events'),
	object = require('../utils/object');

var Syncable = new Class({
	
	Implements: Events,
	
	save: function(options) {
		this.fireEvent('preSave');

		var id = this.get('id'),
			isNew = !id;

		this.constructor.$syncs.forEach(function(sync) {
			if (isNew) {
				sync.create(this);
			} else {
				sync.update(id, this);
			}
		}, this);

		return this;
	},

	destroy: function(options) {
		this.fireEvent('preDestroy');

		var id = this.get('id');
		if (!id) return null;

		this.constructor.$syncs.forEach(function(sync) {
			sync.destroy(id);
		}, this);

		return null;
	}

});

Syncable.find = function find(conditions, options, callback) {
	var klass = this;
	function wrap(rows) {
		return rows.map(function(row) { return new klass(row); });
	}
	this.$syncs.forEach(function(sync) {
		sync.read(conditions, function(rows) {
			rows = wrap(rows);
			console.log(rows);
			callback(rows);
		});
	})
};

Syncable.$syncs = [];

Syncable.addSync = function addSync(sync) {
	this.$syncs.push(sync);
};

Syncable.removeSync = function removeSync(sync) {
	
};


// Sync mutator

Syncable.Mutators.Sync = function Sync(syncs) {
	object.forEach(syncs, function(options, name) {
		var klass = options.driver;
		delete options.driver;
		console.log(this);
		this.addSync(new klass(options));
	}, this);
};

module.exports = Syncable;
