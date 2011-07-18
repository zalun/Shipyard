var Class = require('../class'),
    Options = require('../class/Options');

//<node>
var Loader = require('./Loader');
//</node>

var templates = {};

module.exports = new Class({

    Implements: Options,

    options: {
        fileExt: '.js',
        fileName: null,
        paths: ['templates', 'view/templates', __dirname+'/../view/templates']
    },
    
    initialize: function(options) {
        this.setOptions(options);
    },

    setTemplate: function(text) {
        this.template = text;             
    },

    load: function() {
        //build path (id)
        //check `templates` if required before
        //require template
        if (!this.options.fileName) throw new TypeError('fileName must be set.');
        var fullName = this.options.fileName + this.options.fileExt;
        
        var text = templates[fullName];
        
        //<node>
        if (!text) {
            var loader = new Loader(fullName, this.options.paths);
            text = templates[fullName] = loader.get();
        }
        //</node>
        
        
        
        if (!text) {
			console.log('require.paths: ', require.paths);
			console.log('tried paths:', this.options.paths);
			throw new Error('Template not found: ' + fullName);
		}
        this.setTemplate(text);

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
