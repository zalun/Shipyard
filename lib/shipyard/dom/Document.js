// Parts copied or inspired by MooTools (http://mootools.net)
// - MIT Licence
var Class = require('../class/Class'),
	Node = require('./Node');

var Document = module.exports = new Class({

	Extends: Node,

	getDocument: function() {
		return this.node;
	},

    getWindow: function() {
        return this.node.defaultView;
    },

	createElement: function(tag) {
		return Node.wrap(this.node.createElement(tag));
	},

	toString: function() {
		return '<document>';
	},

    get: function(name) {
        return this.node[name];
    },

    set: function(name, value) {
        this.node[name] = value;
        return this;
    }

});
