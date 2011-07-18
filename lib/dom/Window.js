// Parts copied or inspired by MooTools (http://mootools.net) 
// - MIT Licence
var Class = require('../class'),
	Node = require('./Node');


var Window = module.exports = new Class({

	Extends: Node,

	toString: function() {
		return '<window>';
	}

});
