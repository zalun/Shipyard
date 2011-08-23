var Class = require('../../lib/shipyard/class'),
	model = require('../../lib/shipyard/model'),
	Syncable = require('../../lib/shipyard/sync/Syncable'),
	BrowserSync = require('../../lib/shipyard/sync/Browser');

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
		id: model.fields.TextField(),
		title: model.fields.TextField(),
		created_at: model.fields.DateField(),
		is_done: model.fields.BooleanField({ 'default': false })
	},

	toString: function() {
		return this.get('title');
	}
	
});
