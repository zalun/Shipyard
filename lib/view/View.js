var Class = require('../class'),
	Events = require('../class/Events'),
	Options = require('../class/Options'),
	Template = require('../template/ejs/Template'),
	dom = require('../dom'),
	object = require('../utils/object'),
	string = require('../utils/string');

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
 *		var View = require('shipyard/view/View');
 *
 *		var v = new View({
 *			model: model
 *		});
 *
 */
module.exports = new Class({

	Implements: [Events, Options],

	parentView: null,

	options: {
		tag: 'span',
		templateName: 'base.ejs'
	},

	// will be output on the top level element
	attributes: {},

	// internal events attached at instantiation
	events: {},

	initialize: function initialize(options) {
		this.setOptions(options);
		this.addEvents(this.events);
		this.attributes.id = string.uniqueID();
	},

	setTemplate: function setTemplate(path) {
		this.templateName = path;
	},

	prepare: function prepare() {
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

	render: function render() {
		if (!this.template) this.prepare();
		this.fireEvent('preRender');

		this.rendered = this.template.render(this.getRenderOptions());

		delete this.element;
		this.fireEvent('render');
		return this.rendered;
	},

	getRenderOptions: function getRenderOptions() {
		var attrs = this.attributes;
		return object.merge({}, this.options, {
			attrs: function() {
				var str = '',
					escape = this.escape;
				object.forEach(attrs, function(val, key) {
					if (val) str += ' '+key+'="'+escape(val)+'"';
				});
				return str;
			}
		});
	},

	invalidate: function() {
		var oldEl = this.element;
		this.render();
		if (oldEl) {
			this.toElement().replaces(oldEl);
		} else if (this.parentView) {
			this.parentView.invalidate();
		}
		return this;
	},

	attach: function attach(where) {
		if (this.parentView) throw new Error('Woah, but this has a parent!');
		
		if (!where) where = dom.document.body;
		dom.$(where).appendChild(this);

		return this;
	},

	detach: function detach() {
		dom.$(this).dispose();
		return this;
	},

	toElement: function toElement() {
		if (!this.rendered) {
			this.render();
		}
		if (!this.element) {
			var temp = new dom.Element('div');
			temp.set('html', this.rendered);
			this.element = temp.find('> *');
			this.fireEvent('elementCreated', this.element);
		}
		return this.element;
	},

	toString: function toString() {
		return '[object View]';
	}

});
