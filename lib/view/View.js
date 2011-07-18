var Class = require('../class'),
    Events = require('../class/Events'),
    Options = require('../class/Options'),
    Template = require('../template/ejs/Template'),
    dom = require('../dom');

/**
 *  View
 *
 *  View is a base class that handles rendering data from Models into
 *  HTML, and then emits events that make sense for each view. Views use
 *  a templating system to render themselves, allowing developers to
 *  override and completely customize the HTML of a View. However, the
 *  goal of the Shipyard View system is that most developers will no
 *  longer need to think about HTML at all.
 *
 *  ## Use
 *
 *    	var View = require('shipyard/view/View');
 *
 *    	var v = new View({
 *    		model: model
 *    	});
 *
 */
module.exports = new Class({

    Implements: [Events, Options],

    tag: 'div',

    templateName: 'base.ejs',

    initialize: function(options) {
    	this.setOptions(options);
    },

    setTemplate: function(path) {
    	this.templateName = path;
    },

    prepare: function() {
    	// load template
        var parts = this.templateName.split('.'),
    		fileExt = parts.pop(),
    		fileName = parts.join('.');

    	if (!fileName) {
    		fileName = fileExt;
    		fileExt = '';
    	} else if (fileExt) {
    		fileExt = '.'+fileExt;
    	}
    	this.template = new Template({ fileName: fileName, fileExt: fileExt });
    	// render template with data
    	// render all child views
    	this.template.load();
    	this.template.compile();
    },

    render: function() {
    	this.prepare();
    	this.fireEvent('preRender');
    	this.rendered = this.template.render(this);
		delete this.element;
    	this.fireEvent('render');
		return this.rendered;
    },

	attach: function(where) {
		dom.document.body.appendChild(this.toElement());
	},

	detach: function() {
		
	},

	toElement: function() {
		if (!this.element) {
			var temp = new dom.Element('div');
			temp.set('html', this.rendered);
			this.element = temp.find('> *');
		}
		return this.element;
	},

	toString: function() {
			  
	}

});
