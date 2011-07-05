var Class = require('../../class'),
	Field = require('./Field');

var NumberField = new Class({
	
	Extends: Field,

	options: {
		type: Number
	}

});

module.exports = function(options) {
	return new NumberField(options);
};
