var Class = require('../../class'),
	Field = require('./Field');

var DateField = new Class({

	Extends: Field,

	options: {
		type: Date
	}

});

module.exports = function(options) {
	return new DateField(options);
};
