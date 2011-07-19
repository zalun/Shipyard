var Class = require('../../lib/class'),
	model = require('../../lib/model');

module.exports = new Class({
	
	Extends: model.Model,
	
	fields: {
		id: model.fields.NumberField(),
		title: model.fields.TextField(),
		created_at: model.fields.DateField(),
		is_done: model.fields.BooleanField()
	},

	toString: function() {
		return this.get('title');
	}
	
});
