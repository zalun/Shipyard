// Parts copied or inspired by MooTools (http://mootools.net) 
// - MIT Licence
var object = require('../utils/object'),
	typeOf = require('../utils/type').typeOf,
	overloadSetter = require('../utils/function').overloadSetter,
	merge = object.merge,
	extend = object.extend;

var mutate = function mutate(child, parent) {
	for (var m in Class.Mutators) if (Class.Mutators.hasOwnProperty(m)) {
		if (parent.hasOwnProperty(m)) {
			Class.Mutators[m].call(child, parent[m]);
			delete parent[m];
		}
	}
	for (var key in parent) {
		var val = parent[key];
		if (typeOf(val) == 'function') {
			val = wrap(child, key, val)
		}
		merge(child.prototype, key, val);
	}
};

var blueprint = function blurprint(klass) {
	klass.$prototyping = true;
	var proto = new klass();
	delete klass.$prototyping;
	return proto;
};

var wrap = function wrap(me, key, method) {
	if (method.$origin) method = method.$origin;
	var wrapper = extend(function klass_wrapper() {
		var caller = this.caller,
			current = this.$caller;
		this.caller = current;
		this.$caller = wrapper;
		var result = method.apply(this, arguments);
		this.$caller = current;
		this.caller = caller;
		return result;
	}, { $name: key, $origin: method, $owner: me });
	return wrapper;
};

var parent = function parent() {
	if (!this.$caller) throw new Error('The method "parent" cannot be called from outside the Class.');
	var name = this.$caller.$name,
		parent = this.$caller.$owner.parent,
		previous = parent ? parent.prototype[name] : null;
	if (!previous) throw new Error('The method "' + name + '" has no parent.');
	return previous.apply(this, arguments);
};

var implement = overloadSetter(function implement(key, value) {
	var params = {};
	params[key] = value;
	mutate(this, params);
	return this;
});

var alias = function alias(original, other) {
	this.implement(other, this[original]);
};

var reset = function reset(obj) {
	for (var key in obj) {
		var value = obj[key];
		switch (typeOf(value)) {
			case 'object':
				var F = function object(){};
				F.prototype = value;
				obj[key] = reset(new F);
				break;
			case 'array':
				obj[key] = object.clone(value);
				break;
		}
	}
	return obj;
};

var Class = function Class(params) {
	var newClass = extend(function klass() {
		reset(this);
		if (klass.$prototyping) return this;
		this.$caller = null;
		var value = this.initialize ? this.initialize.apply(this, arguments) : this;
		this.$caller = this.caller = null;
		return value;
	}, this);
	if (typeOf(params) == 'function') params = { initialize: params };
	params = params || { initialize: function(){} };
	mutate(newClass, params);
	newClass.prototype.constructor = newClass;
	newClass.prototype.parent = parent;
	newClass.constructor = Class;
	newClass.implement = implement;
	return newClass;
};

var isArray = function(obj) {
	return obj.length !== null && typeof obj !== 'function';
};

Class.Mutators = {
	Extends: function Extends(parent) {
		merge(this, parent);
		this.parent = parent;
		this.prototype = blueprint(parent);
	},
	Implements: function Implements(mixins) {
		mixins = isArray(mixins) ? mixins : [mixins];
		for (var i = 0, len = mixins.length; i < len; i++) {
			mutate(this, blueprint(mixins[i]));
		}
	}
}

module.exports = Class;
