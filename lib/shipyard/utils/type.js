// Parts copied or inspired by MooTools (http://mootools.net) 
// - MIT Licence
var toString = Object.prototype.toString;
var typeCheck = /\[object\s(\w*)\]/;
var toType = function(item) {
	return toString.call(item).replace(typeCheck, '$1').toLowerCase();
}

exports.typeOf = exports.of = function(item) {
	if (item == null) return 'null';
	var type = toType(item);
	if (type !== 'object') return type;

	if (item.nodeName){
		if (item.nodeType === 1) return 'element';
		if (item.nodeType === 3) return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
	} else if (typeof item.length === 'number'){
		if (item.callee) return 'arguments';
		if ('item' in item) return 'collection';
	}

	return typeof item;
};
