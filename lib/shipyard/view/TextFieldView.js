var Class = require('../class/Class'),
	View = require('./View');

module.exports = new Class({

	Extends: View,

	options: {
		tag: 'input'
	},

	initialize: function(options) {
		this.parent(options);

		this.attributes.name = this.options.name;
		this.attributes.placeholder = this.options.placeholder; 
	}

});
