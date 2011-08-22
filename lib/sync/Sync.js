var Class = require('../class'),
	Options = require('../class/Options');

module.exports = new Class({

	Implements: Options,

	options: {},

	initialize: function(options) {
		this.setOptions(options)
	}

});
