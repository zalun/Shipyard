var Class = require('../class'),
	Node = require('./Node'),
	Window = require('./Window'),
	Document = require('./Document'),
	Element = require('./Element'),
	Elements = require('./Elements');
	Slick = require('./Slick'),
	Parser = Slick.Parser,
	Finder = Slick.Finder,
	typeOf = require('../utils/type').typeOf;

//TODO: some monkey work to require jsdom when testing from node
var window, document;
if (typeof this.window == "undefined") {
	var jsdom = require('jsdom');
	window = jsdom.html().createWindow();
	document = window.document;
} else {
	window = this.window;
	document = this.document;
}

var hostWindow = new Window(window);
var hostDoc = new Document(document);

var overloadNode = function overloadNode() {
	var el =select(arguments[0])
	if (el) {
		arguments[0] = el.valueOf();
		return this.parent.apply(this, arguments);
	} else {
		return this;
	}
};

var overloadMethods = ['appendChild', 'inject', 'grab', 'replace'];
var DOMElement = new Class({

	Extends: Element,

	Matches: '*', // so that his comes before the origin Element

	initialize: function DOMElement(node, options) {
		var type = typeOf(node);
		if (type == 'string') node = hostDoc.createElement(node).valueOf();
		this.parent(node, options);
	}
	
});

overloadMethods.forEach(function(methodName) {
	DOMElement.implement(methodName, overloadNode);
});


// $ and $$



var select = function(node){
	if (node != null){
		if (typeof node == 'string') return hostDoc.find('#'+node);
		if (node instanceof Node) return node;
		if (node === window) return hostWindow;
		if (node === document) return hostDoc;
		if (node.toElement) return node.toElement();
		return DOMElement.wrap(node);
	}
	return null;
};



var collect = function(){
	var list = [];
	for (var i = 0; i < arguments.length; i++) {
		var arg = arguments[i],
			type = typeOf(arg);

		if (type == 'string') list = list.concat(hostDoc.search(arg));
		else list.push(arg);
	}
	return new Elements(list);
};

hostDoc.body = new DOMElement(document.body);
//hostDoc.head = new DOMElement(document.getElementsByTagName('head')[0]);


exports.window = hostWindow;
exports.document = hostDoc;
exports.Element = DOMElement;
exports.Elements = Elements;
exports.$ = exports.select = select;
exports.$$ = exports.collect = collect;
