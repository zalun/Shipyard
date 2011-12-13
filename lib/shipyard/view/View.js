var Class = require('../class/Class'),
    Observable = require('../class/Observable'),
    Binding = require('../class/Binding'),
    Options = require('../class/Options'),
    Template = require('../template/ejs/Template'),
    dom = require('../dom'),
    overloadSetter = require('../utils/function').overloadSetter,
    object = require('../utils/object'),
    string = require('../utils/string'),
    log = require('../utils/log');

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
 *      var View = require('shipyard/view/View');
 *
 *      var v = new View({
 *          content: model
 *      });
 *
 */
var View = module.exports = new Class({

    Extends: Observable,
    
    Implements: [Options],

    parentView: null,

    options: {
        tag: 'span',
        templateName: 'base.ejs'
    },

    // will be output on the top level element
    attributes: {
        id: null,
        'class': 'shipyard-view'
    },

    // internal events attached at instantiation
    events: {},

    bindings: [],

    $propHashes: ['attributes', 'options', '$data'],

    initialize: function initialize(options) {
        this.set(options);
        this.addEvents(this.events);
        this._setupAttributeBindings();
        this._setupContentBinding();
        if (!this.attributes.id) {
            this.attributes.id = string.uniqueID();
        }
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
        if (!this.template) {
            this.prepare();
        }
        this.fireEvent('preRender');
        this.rendered = this.template.render(this, this.getRenderHelpers());

        delete this.element;
        this.fireEvent('render');
        return this.rendered;
    },

    getRenderHelpers: function getRenderHelpers() {
        var attrs = this.attributes;
        return {
            attrs: function() {
                var buffer = [],
                    escape = this.escape;
                for (var attr in attrs) {
                    if (attrs[attr]) {
                        buffer.push(' '+attr+'="'+escape(attrs[attr])+'"');
                    }
                }
                return buffer.join('');
            }
        };
    },

    invalidate: function() {
        if (this.rendered) {
            var oldEl = this.toElement();
            this.render();
            this.createElement().replace(oldEl);
            oldEl.destroy();
        }
        return this;
    },

    // Bind lets us observe an object, update the view's
    // properties, and re-render
    bind: function(observable, map) {
        var binding = new Binding(this, observable, map);
        this.bindings.push(binding);
        object.forEach(map, function(from, to) {
            this.set(to, observable.get(from));
        }, this);
        return this;
    },

    attach: function attach(where) {
        if (this.parentView) {
            throw new Error('Woah, but this has a parent!');
        }
        
        where = where || dom.document.body;
        dom.$(where).appendChild(this);

        return this;
    },

    detach: function detach() {
        if (this.element) {
            this.element.destroy();
        }
        return this;
    },
    
    createElement: function createElement() {
        if (!this.rendered) {
            this.render();
        }
        var temp = new dom.Element('div');
        temp.set('html', this.rendered);
        this.element = temp.getFirst();
        this.fireEvent('elementCreated', this.element);
        return this.element;
    },

    toElement: function toElement() {
        if (!this.get('element')) {
            this.createElement();
        }
        return this.element;
    },

    toString: function toString() {
        return this.rendered || this.render();
        //return '[object View]';
    },

    _setupAttributeBindings: function _setupAttributeBindings() {
        function observeAttr(attr) {
            this.observe(attr, function(value) {
                var el = this.get('element');
                if (el) {
                    el.set(attr, value);
                }
            });
        }
        for (var key in this.attributes) {
            observeAttr.call(this, key);
        }
    },

    _setupContentBinding: function _setupContentBinding() {
        this.observe('content', function() {
            // it would be easy to do element.set('text', content), but
            // with templates we don't know if the content should
            // actually go a couple elements deep.
            log.debug('content set for %s', this.get('id'));
            if (this.rendered) {
                this.invalidate();
            }
        });
    }

});

View.defineSetter('content', function(value) {
    this.content = value;
}).defineGetter('content', function() {
    return this.content;
});

View.defineSetter('data', function(value) {
    this.set('content', value);
}).defineGetter('data', function() {
    return this.get('content');
});

View.defineGetter('element', function() {
    if (this.parentView && this.parentView.get('element')) {
        this.element = dom.$(this.parentView).find('#'+ this.get('id'));
    }
    return this.element;
});
