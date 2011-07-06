var Class = require('../class'),
	Node = require('./Node'),
	Slick = require('./Slick'),
	Parser = Slick.Parser,
	Finder = Slick.Finder;


var classRegExps = {};
var classRegExpOf = function(string){
	return classRegExps[string] || 
		(classRegExps[string] = new RegExp('(^|\\s)' + Parser.escapeRegExp(string) + '(?:\\s|$)'));
};

var inserters = {

	before: function(context, element){
		var parent = element.parentNode;
		if (parent) parent.insertBefore(context, element);
	},

	after: function(context, element){
		var parent = element.parentNode;
		if (parent) parent.insertBefore(context, element.nextSibling);
	},

	bottom: function(context, element){
		element.appendChild(context);
	},

	top: function(context, element){
		element.insertBefore(context, element.firstChild);
	}

};


var Element = new Class({
	
	Extends: Node,

	Matches: '*',

	//standard methods
	
	appendChild: function(child){
		this.node.appendChild(child);
		return this;
	},

	setAttribute: function(name, value){
		this.node.setAttribute(name, value);
		return this;
	},

	getAttribute: function(name){
		return this.node.getAttribute(name);
	},

	removeAttribute: function(name){
		this.node.removeAttribute(name);
		return this;
	},

	/*contains: function(node){
		return ((node = select(node))) ? Slick.contains(this.node, node.valueOf()) : false;
	},*/

	match: function(expression){
		return Slick.match(this.node, expression);
	},

	
	// className methods
	
	hasClass: function(className){
		return classRegExpOf(className).test(this.node.className);
	},

	addClass: function(className){
		var node = this.node;
		if (!this.hasClass(className)) 
			node.className = (node.className + ' ' + className);
		return this;
	},

	removeClass: function(className){
		var node = this.node;
		node.className = (node.className.replace(classRegExpOf(className), '$1'));
		return this;
	}


});

module.exports = Element;
