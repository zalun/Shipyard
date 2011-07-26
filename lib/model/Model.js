var Class = require('../class'),
    Events = require('../class/Events'),
    overloadSetter = require('../utils/function').overloadSetter;

module.exports = new Class({
    
    Extends: Events,

    $data: {},
    
    fields: {
        //default to always having an ID field?
    }, 
    
    initialize: function Model(data) {
        this.set(data);
    },
    
    set: overloadSetter(function set(key, value) {
        if (key in this.fields) {
            var oldValue = this.get(key);
            var newValue = this.$data[key] = this.fields[key].from(value);
            if (oldValue !== newValue) {
                this.propertyChanged(key, newValue, oldValue);
            }
        }
    }),
    
    get: function get(key) {
        if (key in this.fields) {
            return this.$data[key];
        }
        return null;
    },

    propertyChanged: function propertyChanged(prop, newVal, oldVal) {
        this.fireEvent('propertyChange', prop, newVal, oldVal);
    },
    
    save: function save() {
        this.fireEvent('save');
		return this;
    },
    
    destroy: function destroy() {
        this.fireEvent('destroy');
		return null;
    },

    toString: function toString() {
        // you should override this, since some Views will cast the
        // Model to a string when rendering
        return '[object Model]';
    }

});
