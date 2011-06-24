var Class = require('../class'),
    overloadSetter = require('../utils/function').overloadSetter;

module.exports = new Class({
   
    $data: {},
    
    fields: {
        //default to always having an ID field?
    }, 
    
    initialize: function(data) {
        this.set(data || {});
    },
    
    set: overloadSetter(function(key, value) {
        if (key in this.fields) {
            this.$data[key] = this.fields[key].set(value);
        }
    }),
    
    get: function(key) {
        if (key in this.fields) {
            return this.fields[key].get(this.$data[key]);
        }
    },
    
    save: function() {
        
    },
    
    destroy: function() {
        
    }

});
