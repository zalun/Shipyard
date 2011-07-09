var Class = require('../class');

module.exports = new Class({

    initialize: function() {
    },

    setTemplate: function(text) {
        this.template = text;             
    },

    compile: function() {
        // stub - to be overridden
        var text = this.template;
        this.compiled = function () { return text; }
    },

    render: function(context) {
        return this.compiled(context);
    }

});
