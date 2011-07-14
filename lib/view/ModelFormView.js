var Class = require('../class'),
	FormView = require('./FormView');

module.exports = new Class({

	Extends: FormView,

	options: {
		model: null,
		fields: null,
		exclude: null
	}

});
