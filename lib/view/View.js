var Class = require('../class'),
    Events = require('../class/Events'),
    Options = require('../class/Options'),
    Template = require('../template/ejs/Template'),
    dom = require('../dom'),
	object = require('../utils/object');

function template() {

}

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
 *        var View = require('shipyard/view/View');
 *
 *        var v = new View({
 *            model: model
 *        });
 *
 */
module.exports = new Class({

    Implements: [Events, Options],

	parentView: null,

	children: [],

    options: {
        tag: 'div',
        templateName: 'base.ejs'
    },

    initialize: function(options) {
        this.setOptions(options);
    },

    setTemplate: function(path) {
        this.templateName = path;
    },

    prepare: function() {
        // load template
        var parts = this.options.templateName.split('.'),
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
        if (!this.template) this.prepare();
        this.fireEvent('preRender');

        this.rendered = this.template.render(this.getRenderOptions());

        delete this.element;
        this.fireEvent('render');
		return this.rendered;
    },

	getRenderOptions: function() {
		var data = object.merge({}, this.options, {
			views: this.childViews,
			children: function(data) {
				var text = '';
				this.views.forEach(function(child) {
					text 
				}, this);
			}
		});
	},

    attach: function(where) {
        if (this.parentView) throw new Error('Woah, but this has a parent!');
		
		if (!where) where = dom.document.body;
		dom.$(where).appendChild(this);
    },

    detach: function() {
        dom.$(this).dispose();
    },

	addView: function(child) {
		if (child.parentView) {
			child.parentView.removeView(child);
		}
		
		this.children.push(child);
		child.parentView = this;
		this.fireEvent('childAdded', child);
		//child.fireEvent('')
	},

	removeView: function(child) {
		var index = this.childViews.indexOf(child);
		if (~index) {
			this.childViews.splice(index, 1);
			child.parentView = null;
			this.fireEvent('childRemoved', child);
			//child.fireEvent('?')
		}
	},

    toElement: function() {
		if (!this.rendered) {
			this.render();
		}
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
