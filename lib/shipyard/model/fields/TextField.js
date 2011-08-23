var Class = require('../../class'),
	Field = require('./Field');

var TextField = new Class({

	Extends: Field,

    from: function(value) {
        if (value == null) return null;
        return String(value);
    }

});

module.exports = function(options) {
	return new TextField(options);
};
