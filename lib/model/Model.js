var Class = require('../class'),
    Events = require('../class/Events'),
    overloadSetter = require('../utils/function').overloadSetter;

module.exports = new Class({
    
    Extends: Events,

    $data: {},
    
    fields: {
        //default to always having an ID field?
    }, 
    
    initialize: function(data) {
		this.set(data);
    },
    
    set: overloadSetter(function(key, value) {
        if (key in this.fields) {
            var oldValue = this.get(key);
            var newValue = this.$data[key] = this.fields[key].from(value);
            if (oldValue !== newValue) {
                this.propertyChanged(key, newValue, oldValue);
            }
        }
    }),
    
    get: function(key) {
        if (key in this.fields) {
            return this.$data[key];
        }
        return null;
    },

    propertyChanged: function(prop, newVal, oldVal) {
        this.fireEvent('propertyChange', [prop, newVal, oldVal]);
    },
    
    save: function() {
        
    },
    
    destroy: function() {
        
    }

});
