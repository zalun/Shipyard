var Class = require('../class/Class'),
	Options = require('../class/Options');

module.exports = new Class({

	Implements: Options,

	options: {},

	initialize: function(options) {
		this.setOptions(options)
	}

});
