var Class = require('./Class'),
    Events = require('./Events'),
    Accessor = require('../utils/Accessor'),
    func = require('../utils/function');

var Observable = module.exports = new Class({
    
    Extends: Events,

    $data: {},

    $propHashes: ['$data'],

    initialize: function Observable(data) {
        this.set(data);
    },

    get: func.overloadGetter(function get(key) {
        var getter = this.constructor.lookupGetter(key);
        if (getter) return getter.call(this);
        var hashes = this.$propHashes;
        for (var i = 0, len = hashes.length; i < len; i++) {
            if (key in this[hashes[i]]) return this[hashes[i]][key];
        }
    }),

    set: func.overloadSetter(function set(key, value) {
        var hashes = this.$propHashes,
            old,
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
        if (old !== value) {
            this.fireEvent('change', key, value, old);
        }
        return this;
    }),

    observe: function observe(prop, handler) {
        return this.addEvent('change', function(key) {
            var args = [].slice.call(arguments);
            // slice the 'key' off, since it's assumed because we're
            // observing only that 'key'.
            if (key == prop) handler.apply(this, args.slice(1)); 
        });
    }

});

Accessor.call(Observable, 'Getter');
Accessor.call(Observable, 'Setter');
