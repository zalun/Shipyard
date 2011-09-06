var Class = require('../class/Class'),
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

		var id = this.get('id'),
			isNew = !id;

		this.fireEvent('preSave', isNew);

		var onSave = function onSave() {
			this.fireEvent('save', isNew);
		}.bind(this);

		var sync = getSync(this.constructor, options.using);
		if (isNew) {
			sync.create(this, onSave);
		} else {
			sync.update(id, this, onSave);
		}

		return this;
	},

	destroy: function destroy(options) {
		options = options || {};
		
		var id = this.get('id');
		if (!id) return null;

		this.fireEvent('preDestroy');

		var sync = getSync(this.constructor, options.using);
		sync.destroy(id, function onDelete(id) {
			this.fireEvent('destroy', id);
		}.bind(this));

		return null;
	},

	fireEvent: function fireEvent(evt) {
		// overwrite Syncable.fireEvent so that all events a syncable instances
		// fires can be observed by listening to the syncable Class
		Events.prototype.fireEvent.apply(this, arguments);

		var _class_ = this.constructor;
		var args = [].slice.call(arguments, 1);
		args.unshift(this);
		args.unshift(evt);

		_class_.fireEvent.apply(_class_, args);
	}

});

object.merge(Syncable, new Events);

Syncable.find = function find(options) {
	var klass = this;
	options = options || {};
	function wrap(rows) {
		return rows.map(function(row) { return new klass(row); });
	}

	var sync = getSync(this, options.using);

	sync.read(options.conditions || {}, function(rows) {
		rows = wrap(rows);
		if (typeof options.callback == 'function') options.callback(rows);
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
