var Class = require('../../lib/class'),
	model = require('../../lib/model'),
	Syncable = require('../../lib/sync/Syncable'),
	BrowserSync = require('../../lib/sync/Browser');

var Task = module.exports = new Class({
	
	Extends: model.Model,

	Implements: Syncable,

	Sync: {
		'default': {
			table: 'tasks',
			driver: BrowserSync
		}
	},
	
	fields: {
		id: model.fields.NumberField(),
		title: model.fields.TextField(),
		created_at: model.fields.DateField(),
		is_done: model.fields.BooleanField({ 'default': false })
	},

	toString: function() {
		return this.get('title');
	}
	
});
