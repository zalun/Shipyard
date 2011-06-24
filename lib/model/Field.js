var Class = require('../class'),
    Options = require('../class/Options');


/*
    Field: all properties on a Model are stored via the help of Fields.
    Data is stored with primitive values, but Fields can convert the data
    to useful data formats.
    
    Example: a DateField could accept a Date with it's setter, converting it
    into a string format that can be saved in a data store. The getter can
    convert the string back into a Date object, so the application can use the
    smartest object format.
*/
module.exports = new Class({
    
    Implements: Options,
    
    options: {
        'type': String,
        'default': null
    },
    
    initialize: function(opts) {
        this.setOptions(opts);
    },
    
    get: function(value) {
        if (typeof value === 'undefined') return this.options['default'];
        return value && (value instanceof this.options.type ?
            value :
            this.options.type(value)
        );
    },
    
    set: function(value) {
        return value;
    }
    
});
