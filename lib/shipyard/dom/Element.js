// Parts copied or inspired by MooTools (http://mootools.net) 
// - MIT Licence
var Class = require('../class'),
	Accessor = require('../utils/Accessor'),
	object = require('../utils/object'),
	typeOf = require('../utils/type').typeOf,
	Node = require('./Node'),
	Slick = require('./Slick'),
	Parser = Slick.Parser,
	Finder = Slick.Finder;


var classRegExps = {};
var classRegExpOf = function(string){
	return classRegExps[string] || 
		(classRegExps[string] = new RegExp('(^|\\s)' + Parser.escapeRegExp(string) + '(?:\\s|$)'));
};


var Element = new Class({
	
	Extends: Node,

	Matches: '*',

	initialize: function Element(node, options) {
		this.parent(node);
		this.set(options);
	},

	toString: function() {
		return '<' + this.get('tag') + '>';
	},


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
	},

	dispose: function dispose() {
		return (this.node.parentNode) ? 
			this.parentNode.removeChild(this.node) : 
			this;
	},

	empty: function(shouldDestroy) {
		var children = this.node.childNodes;
		for (var i = 0, length = children.length; i < length; i++) {
			this.node.removeChild(children[i]);
		}
		return this;
	},

	serialize: function serialize() {
		var values = {},
			undefined;
		this.search("input, select, textarea").forEach(function forEach(el) {
			var type = el.get('type'),
				name = el.get('name');
			if(!name
				|| el.get('disabled')
				|| type=="submit" 
				|| type=="reset" 
				|| type=="file") return;
			var n = (el.get('tag') == 'select') ?
				el.search('option:selected').map(function(o){ return o.get('value'); }) :
				((type == 'radio' || type == 'checkbox') && !el.get('checked')) ?
					null :
					el.get('value');
			if (typeOf(n) == 'array' && n.length < 2) n = n[0];
			if(!values[name])
				values[name] = n;
			else if(n != undefined) {
				values[name] = Array(values[name]);
				values[name].push(n);
			}
		});
		return values;
	
	}


});

// Inserters

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

Element.implement({

	inject: function(element, where){
		inserters[where || 'bottom'](this.node, element);
		return this;
	},

	eject: function(){
		var parent = this.node.parentNode;
		if (parent) parent.removeChild(this.node);
		return this;
	},

/*	adopt: function(){
		Array.forEach(arguments, function(element){
			if ((element = select(element))) this.node.appendChild(element.valueOf());
		}, this);
		return this;
	},*/

	appendText: function(text, where){
		inserters[where || 'bottom'](document.createTextNode(text), this.node);
		return this;
	},

	grab: function(element, where){
		inserters[where || 'bottom'](element, this.node);
		return this;
	},

	replace: function(element){
		element.parentNode.replaceChild(this.node, element);
		return this;
	},

	wrap: function(element, where){
		return this.replace(element).grab(element, where);
	}

});

/* Tree Walking */

var methods = {
	find: {
		getNext: '~',
		getPrevious: '!~',
		getFirst: '^',
		getLast: '!^',
		getParent: '!'
	},
	search: {
		getAllNext: '~',
		getAllPrevious: '!~',
		getSiblings: '~~',
		getChildren: '>',
		getParents: '!'
	}
};

object.forEach(methods, function(getters, method){
	Element.implement(object.map(getters, function(combinator){
		return function(expression){
			return this[method](combinator + (expression || '*'));
		};
	}));
});



// Getter / Setter

Accessor.call(Element, 'Getter');
Accessor.call(Element, 'Setter');

var properties = {
	'html': 'innerHTML',
	'class': 'className',
	'for': 'htmlFor'/*,
	'text': (function(){
		var temp = document.createElement('div');
		return (temp.innerText == null) ? 'textContent' : 'innerText';
	})()*/
};

[
	'checked', 'defaultChecked', 'type', 'value', 'accessKey', 'cellPadding', 
	'cellSpacing', 'colSpan', 'frameBorder', 'maxLength', 'readOnly', 
	'rowSpan', 'tabIndex', 'useMap',
	// Attributes
	'id', 'attributes', 'childNodes', 'className', 'clientHeight', 
	'clientLeft', 'clientTop', 'clientWidth', 'dir', 'firstChild',
	'lang', 'lastChild', 'name', 'nextSibling', 'nodeName', 'nodeType', 
	'nodeValue', 'offsetHeight', 'offsetLeft', 'offsetParent', 'offsetTop', 
	'offsetWidth', 'ownerDocument', 'parentNode', 'prefix', 'previousSibling', 
	'innerHTML', 'title'
].forEach(function(property){
	properties[property] = property;
});


object.forEach(properties, function(real, key){
	Element.defineSetter(key, function(value){
		return this.node[real] = value;
	}).defineGetter(key, function(){
		return this.node[real];
	});
});

var booleans = ['compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked',
	'disabled', 'multiple', 'readonly', 'selected', 'noresize', 'defer'];

booleans.forEach(function(bool){
	Element.defineSetter(bool, function(value){
		return this.node[bool] = !!value;
	}).defineGetter(bool, function(){
		return !!this.node[bool];
	});
});

Element.defineGetters({

	'class': function(){
		var node = this.node;
		return ('className' in node) ? node.className : node.getAttribute('class');
	},

	'for': function(){
		var node = this.node;
		return ('htmlFor' in node) ? node.htmlFor : node.getAttribute('for');
	},

	'href': function(){
		var node = this.node;
		return ('href' in node) ? node.getAttribute('href', 2) : node.getAttribute('href');
	},

	'style': function(){
		var node = this.node;
		return (node.style) ? node.style.cssText : node.getAttribute('style');
	}

}).defineSetters({

	'class': function(value){
		var node = this.node;
		return ('className' in node) ? node.className = value : node.setAttribute('class', value);
	},

	'for': function(value){
		var node = this.node;
		return ('htmlFor' in node) ? node.htmlFor = value : node.setAttribute('for', value);
	},

	'style': function(value){
		var node = this.node;
		return (node.style) ? node.style.cssText = value : node.setAttribute('style', value);
	}

});

/* get, set */

Element.implement({

	set: function(name, value){
		if (typeof name != 'string') for (var k in name) this.set(k, name[k]); else {
			var setter = Element.lookupSetter(name);
			if (setter) setter.call(this, value);
			else if (value == null) this.node.removeAttribute(name);
			else this.node.setAttribute(name, value);
		}
		return this;
	},

	get: function(name){
		if (arguments.length > 1) return Array.prototype.map.call(arguments, function(v, i){
			return this.get(v);
		}, this);
		var getter = Element.lookupGetter(name);
		if (getter) return getter.call(this);
		return this.node.getAttribute(name);
	}

});

Element.defineGetter('tag', function(){
	return this.node.tagName.toLowerCase();
});


module.exports = Element;
