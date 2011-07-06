var object = require('../utils/object'),
	typeOf = require('../utils/type').typeOf,
	overloadSetter = require('../utils/function').overloadSetter,
	merge = object.merge,
	extend = object.extend;

var mutate = function(child, parent) {
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

var blueprint = function(klass) {
    klass.$prototyping = true;
    var proto = new klass();
    delete klass.$prototyping;
    return proto;
};

var wrap = function(me, key, method) {
	if (method.$origin) method = method.$origin;
	var wrapper = extend(function() {
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

var parent = function() {
	if (!this.$caller) throw new Error('The method "parent" cannot be called from outside the Class.');
	var name = this.$caller.$name,
		parent = this.$caller.$owner.parent,
		previous = parent ? parent.prototype[name] : null;
	if (!previous) throw new Error('The method "' + name + '" has no parent.');
	return previous.apply(this, arguments);
};

var implement = overloadSetter(function(key, value) {
	var params = {};
	params[key] = value;
	mutate(this, params);
	return this;
});

var Class = function(params) {
	var klass = extend(function() {
		if (klass.$prototype) return this;
        return this.initialize ? this.initialize.apply(this, arguments) : this;
	}, this);
	if (typeOf(params) == 'function') params = { initialize: params };
	params = params || { initialize: function(){} };
	mutate(klass, params);
	klass.prototype.constructor = klass;
	klass.prototype.parent = parent;
	klass.constructor = Class;
	klass.implement = implement;
	return klass;
}

var isArray = function(obj) {
    return obj.length !== null && typeof obj !== 'function';
};

Class.Mutators = {
    Extends: function(parent) {
        merge(this, parent);
		this.parent = parent;
		this.prototype = blueprint(parent);
    },
    Implements: function(mixins) {
		mixins = isArray(mixins) ? mixins : [mixins];
        for (var i = 0, len = mixins.length; i < len; i++) {
			mutate(this, blueprint(mixins[i]));
        }
    }
}

module.exports = Class;
