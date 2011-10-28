// Parts copied or inspired by MooTools (http://mootools.net) 
// - MIT Licence
var Class = require('../class/Class'),
	Node = require('./Node');

var Document = module.exports = new Class({

	Extends: Node,

    getWindow: function() {
        return this.node.window;
    },

	createElement: function(tag) {
		return Node.wrap(this.node.createElement(tag));
	},

	toString: function() {
		return '<document>';
	}

});
