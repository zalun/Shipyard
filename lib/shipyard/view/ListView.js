var Class = require('../class/Class'),
    Container = require('./Container');

module.exports = new Class({
   
    Extends: Container,

    options: {
		tag: 'ul',
		templateName: 'list.ejs',
		data: [],
		empty: 'No items in list.'
	},

	isEmpty: function isEmpty() {
		return !(this.options.data && this.options.data.length);
	},

	addItem: function addItem(item) {
		this.options.data.push(item);
		this.invalidate();
	},

	getRenderOptions: function getRenderOptions() {
		var opts = this.parent(),
			view = this;
		opts.isEmpty = function isEmpty() { return view.isEmpty(); };
		return opts;
	}

});
