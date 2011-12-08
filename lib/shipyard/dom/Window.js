// Parts copied or inspired by MooTools (http://mootools.net)
// - MIT Licence
var Class = require('../class/Class'),
	Node = require('./Node');


var Window = module.exports = new Class({

	Extends: Node,

    getWindow: function() {
        return this.node;
    },

    getDocument: function() {
        return this.node.document;
    },

	toString: function() {
		return '<window>';
	},

	get: function(name) {
		return this.node[name];
	},

    set: function(name, value) {
        this.node[name] = value;
    }

});
