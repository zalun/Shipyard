var Class = require('../class'),
	Options = require('../class/Options');

module.exports = new Class({

	Implements: Options,

	options: {
		table: null
	},

	initialize: function(options) {
		this.setOptions(options)
	}

});
