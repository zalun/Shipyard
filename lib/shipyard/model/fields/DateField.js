var Class = require('../../class/Class'),
	Field = require('./Field'),
    typeOf = require('../../utils/type').typeOf;

var DateField = new Class({

	Extends: Field,

    from: function(value) {
        if (value instanceof Date) return value;
        if (typeOf(value) == 'number') return new Date(value);

        if (value == null) return null;

        //throw new ValidationError('Value must be a date');
    }

});

module.exports = function(options) {
	return new DateField(options);
};
