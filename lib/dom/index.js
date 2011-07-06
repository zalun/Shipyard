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
if (typeof window == "undefined") {
	var jsdom = require('jsdom');
	window = jsdom.html().createWindow(),
	document = window.document;
}

var hostWindow = new Window(window);
var hostDoc = new Document(document);


var DOMElement = new Class({

	Extends: Element,

	Matches: '*', // so that his comes before the origin Element

	
	//wrap some of the files to use `select` on the Element arguments
	
	appendChild: function(child) {
		if ((child = select(child))) return this.parent(child.valueOf());
		return this;
	}

});

// $ and $$



var select = function(node){
	if (node != null){
		if (typeof node == 'string') return hostDoc.find('#'+node);
		if (node instanceof Node) return node;
		if (node === window) return hostWindow;
		if (node === document) return hostDoc;
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


exports.Window = hostWindow;
exports.Document = hostDoc;
exports.Element = DOMElement;
exports.Elements = Elements;
exports.$ = exports.select = select;
exports.$$ = exports.collect = collect;
