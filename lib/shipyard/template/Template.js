var Class = require('../class'),
	Options = require('../class/Options'),
	object = require('../utils/object');

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

	// helpers are functions that will be available in the template
	// context
	helpers: {
		template: function(temp, data) {
			if (!(temp instanceof this.Template)) 
				temp = new this.Template({ fileName: temp });
			return temp.render(data);
		},
		escape: function(text) {
			return String(text)
				.replace(/&(?!\w+;)/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;');
		}
	},
	
	initialize: function(options) {
		this.setOptions(options);
	},

	setTemplate: function setTemplate(text) {
		this.template = text;			 
	},

	getFileName: function getFileName() {
		if (!this.options.fileName) throw new TypeError('fileName must be set.');
		return this.options.fileName + this.options.fileExt;
	},

	load: function load() {
		//build path (id)
		//check `templates` if required before
		//require template
		var fullName = this.getFileName();

		var text = templates[fullName];
		
		//<node>
		if (!text) {
			var loader = new Loader(fullName, this.options.paths);
			text = templates[fullName] = loader.get();
		}
		//</node>
		
		
		
		if (!text) {
			throw new Error('Template not found: ' + fullName);
		}
		this.setTemplate(text);

	},

	compile: function compile() {
		// stub - to be overridden
		// but be sure to call this.parent()
		if (!this.template) this.load();

		var text = this.template;
		this.compiled = function () { return text; }
	},

	render: function render(data) {
		if (!this.compiled) this.compile();
		
		var context = this.getRenderOptions(data);
		return this.compiled(context);
	},

	getRenderOptions: function(data) {
		return object.merge(data, this.helpers, { 
			Template: this.constructor
		});

	}

});
