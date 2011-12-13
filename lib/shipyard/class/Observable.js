var Class = require('./Class'),
    Events = require('./Events'),
    Accessor = require('../utils/Accessor'),
    assert = require('../error/assert'),
    func = require('../utils/function'),
    typeOf = require('../utils/type').typeOf;

var Observable = module.exports = new Class({
    
    Extends: Events,

    $data: {},

    $propHashes: ['$data'],

    initialize: function Observable(data) {
        this._setupProperties();
        this.set(data);
    },

    _get: function _get(key) {
        var getter = this.constructor.lookupGetter(key) || this[key];
        if (getter && typeOf(getter) === 'function') {
            return getter.call(this);
        } else if (getter) {
            return getter;
        }
        var hashes = this.$propHashes;
        for (var i = 0, len = hashes.length; i < len; i++) {
            if (key in this[hashes[i]]) {
                return this[hashes[i]][key];
            }
        }
    },

    get: func.overloadGetter(function get(key) {
        return this._get(key);
    }),

    _set: function set(key, value) {
        var old;
        var setter = this.constructor.lookupSetter(key) || this[key];
        if (setter && typeOf(setter) === 'function') {
            old = this.get(key);
            setter.call(this, value);
        } else {
            var hashes = this.$propHashes,
                isSet = false;
            for (var i = 0, len = hashes.length; i < len; i++) {
                var hash = this[hashes[i]];
                if (key in hash) {
                    old = hash[key];
                    hash[key] = value;
                    isSet = true;
                    break;
                }
            }

            if (!isSet) {
                this.$data[key] = value;
            }
        }
        if (old !== value) {
            this.emit('change', key, value, old);
        }
        return this;
    },

    set: func.overloadSetter(function set(key, value) {
        this._set(key, value);
    }),

    observe: function observe(prop, handler) {
        return this.addListener('change', function(key) {
            var args = [].slice.call(arguments);
            // slice the 'key' off, since it's assumed because we're
            // observing only that 'key'.
            if (key === prop) {
                handler.apply(this, args.slice(1));
            }
        });
    },

    _setupProperties: function() {
        var observable = this;

        function setup(name, current, dep) {
            observable.observe(dep, function() {
                var updated = this.get(name);
                observable.emit('change', name, updated, current);
                current = updated;
            });
        }
        for (var key in this) {
            var prop = this[key];
            if (prop && prop.isProperty) {
                this[key] = prop.fn;
                var current = this.get(key);
                for (var i = 0; i < prop.keys.length; i++) {
                    setup(key, current, prop.keys[i]);
                }
            }
        }
    }

});

var slice = Array.prototype.slice;
Observable.property = function property(fn /*, dependentKeys... */) {
    var keys = slice.call(arguments, 1);
    assert(keys, "Computed properties require dependent keys to watch.");
    return {
        isProperty: true,
        fn: fn,
        keys: keys
    };
};

Accessor.call(Observable, 'Getter');
Accessor.call(Observable, 'Setter');
