// Parts copied or inspired by MooTools (http://mootools.net) 
// - MIT Licence
var typeOf = require('./type').typeOf;

exports.extend = function extend(child, parent) {
	for(var i in parent) {
		child[i] = parent[i];
	} 
	return child;
};

var mergeOne = function(source, key, current){
	switch (typeOf(current)){
		case 'object':
			if (typeOf(source[key]) == 'object') mergeObject(source[key], current);
			else source[key] = cloneObject(current);
		break;
		case 'array': source[key] = cloneArray(current); break;
		default: source[key] = current;
	}
	return source;
};

var mergeObject = exports.merge = function merge(source, k, v) {
	if (typeOf(k) == 'string') return mergeOne(source, k, v);
	for (var i = 1, l = arguments.length; i < l; i++){
		var object = arguments[i];
		for (var key in object) mergeOne(source, key, object[key]);
	}
	return source;
};

var cloneOf = exports.clone = function clone(item) {
	switch (typeOf(item)){
		case 'array': return cloneArray(item);
		case 'object': return cloneObject(item);
		default: return item;
	}
};

var cloneArray = function(arr) {
	var i = arr.length, clone = [];
	while (i--) clone[i] = cloneOf(arr[i]);
	return clone;
};

var cloneObject = function(obj) {
	var clone = {};
	for (var key in obj) clone[key] = cloneOf(obj[key]);
	return clone;
}

exports.forEach = function forEach(obj, fn, bind) {
	for (var key in obj) if (obj.hasOwnProperty(key)) {
		fn.call(bind || obj, obj[key], key, obj);
	}
};

exports.map = function map(obj, fn, bind) {
	var results = {};
	for (var key in obj) results[key] = fn.call(bind || obj, obj[key], key, obj);
	return results;
}

exports.create = Object.create || function create(obj) {
	var F = function(){};
	F.prototype = obj;
	return new F;
};
