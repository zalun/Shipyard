var Class = require('../../class'),
	Field = require('./Field');

var BooleanField = new Class({

	Extends: Field,

	options: {
		type: Boolean
	}

});

module.exports = function(options) {
	return new BooleanField(options);
};
