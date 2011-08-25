// Parts copied or inspired by MooTools (http://mootools.net) 
// - MIT Licence
var object = require('../utils/object'),
	typeOf = require('../utils/type').typeOf,
	overloadSetter = require('../utils/function').overloadSetter,
	merge = object.merge,
	extend = object.extend;

function Class(params) {
	function klass() {
		reset(this);
		return this.initialize ? this.initialize.apply(this, arguments) : this;
	};
	if (typeOf(params) == 'function') params = { initialize: params };
	params = params || { initialize: function(){} };
	
	//Extends "embedded" mutator
	var parent = params.Extends || Class;
	delete params.Extends;
	if (parent != Class && !(parent.prototype instanceof Class)) 
		throw new Error('Class must extend from another Class.');
	var proto = reset(object.create(parent.prototype));
	merge(klass, parent); //inherit "static" properties
	klass.prototype = proto;
	klass.prototype.constructor = klass;
	klass.implement = implement;
	mutate(klass, params);
	klass.parent = parent;
	return klass;
};

Class.prototype.parent = function parent() {
	if (!this.$caller) throw new Error('The method "parent" cannot be called.');
	var name = this.$caller.$name,
		parent = this.$caller.$owner.parent,
		previous = parent ? parent.prototype[name] : null;
	if (!previous) throw new Error('The method "' + name + '" has no parent.');
	return previous.apply(this, arguments);
};

Class.prototype.toString = function toString() {
	return '[object Class]';
};

var dontMutate = ['constructor', 'parent'];
function mutate(child, parent, nowrap) {
	for (var key in parent) {
		var val = parent[key];
		if (child.Mutators.hasOwnProperty(key)) {
			val = child.Mutators[key].call(child, val);
			if (val == null) continue;
		}
		
		if (~dontMutate.indexOf(key)) continue;

		if (!nowrap && typeOf(val) == 'function') {
			val = wrap(child, key, val)
		}
		merge(child.prototype, key, val);
	}
};

var parentPattern = /xyz/.test(function(){xyz;}) ? /\.parent[\(\.\[]/ : null;
function wrap(me, key, fn) {
	if (fn.$origin) fn = fn.$origin;
	if (parentPattern && !parentPattern.test(fn)) return fn;
	var wrapper = extend(function method() {
		var caller = this.caller,
			current = this.$caller;
		this.caller = current;
		this.$caller = wrapper;
		var result = fn.apply(this, arguments);
		this.$caller = current;
		this.caller = caller;
		return result;
	}, { $name: key, $origin: fn, $owner: me });
	return wrapper;
};



var implement = overloadSetter(function implement(key, value) {
	var params = {};
	params[key] = value;
	mutate(this, params);
	return this;
});


function reset(obj) {
	for (var key in obj) {
		var value = obj[key];
		switch (typeOf(value)) {
			case 'object':
				obj[key] = reset(object.create(value));
				break;
			case 'array':
				obj[key] = object.clone(value);
				break;
		}
	}
	return obj;
};

function isArray(obj) {
	return obj.length !== null && !~['function', 'string'].indexOf(typeof obj);
};

Class.Mutators = {
	Implements: function Implements(mixins) {
		mixins = isArray(mixins) ? mixins : [mixins];
		for (var i = 0, len = mixins.length; i < len; i++) {
			merge(this, mixins[i]);
			mutate(this, object.create(mixins[i].prototype), true);
		}
	}
}

module.exports = Class;
