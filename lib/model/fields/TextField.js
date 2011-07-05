var Class = require('../../class'),
	Field = require('./Field');

var TextField = new Class({

	Extends: Field,

	options: {
		type: String
	}

});

module.exports = function(options) {
	return new TextField(options);
};
