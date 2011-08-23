// Parts copied or inspired by MooTools (http://mootools.net) 
// - MIT Licence
var Class = require('../class'),
	typeOf = require('../utils/type').typeOf,
	object = require('../utils/object'),
	lazy = require('../utils/function').lazy,
	Slick = require('./Slick'),
	Finder = Slick.Finder;


var Node = new Class({

	initialize: function Node(node) {
		this.node = node;
		wrappers[Finder.uidOf(node)] = this;
	},
	
	find: function(expression) {
		return Node.wrap(Finder.find(this.node, expression));
	},
	
	search: function(expression) {
		var nodes = Finder.search(this.node, expression);
		for (var i = 0; i < nodes.length; i++) nodes[i] = Node.wrap(nodes[i]);
		return nodes;
	}

});

Node.prototype.valueOf = function(){
	return this.node;
};


var wrappers = {}, matchers = [];

Node.Mutators.Matches = function(match){
	matchers.push({_match: match, _class: this});
};

Node.wrap = function(node) {
	if (node == null) return null;
	var uid = Finder.uidOf(node), wrapper = wrappers[uid];
	if (wrapper) return wrapper;
	for (var l = matchers.length; l--; l){
		var current = matchers[l];
		if (Finder.match(node, current._match)) 
			return (new current._class(node));
	}

};



// Event Listeners

function addEventListener(type, fn) {
	this.node.addEventListener(type, fn, false);
	return this;
}

function attachEvent(type, fn) {
	this.node.attachEvent('on' + type, fn);
	return this;
}

function removeEventListner(type, fn) {
	this.node.removeEventListener(type, fn, false);
	return this;
}

function detachEvent(type, fn) {
	this.node.detachEvent('on' + type, fn);
	return this;
}

lazy(Node.prototype, 'addEvent', function() {
	return this.node.addEventListener ? addEventListener : attachEvent;
});

lazy(Node.prototype, 'removeEvent', function() {
	return this.node.removeEventListener ? removeEventListener : detachEvent;
});


module.exports = Node;
