// Parts copied or inspired by MooTools (http://mootools.net)
// - MIT Licence
var Class = require('../class/Class'),
    Accessor = require('../utils/Accessor'),
    Color = require('../utils/Color'),
    object = require('../utils/object'),
    string = require('../utils/string'),
    array = require('../utils/array'),
    func = require('../utils/function'),
    typeOf = require('../utils/type').typeOf,
    Node = require('./Node'),
    Slick = require('./Slick'),
    Parser = Slick.Parser,
    Finder = Slick.Finder;


var classRegExps = {};
var classRegExpOf = function(string) {
    return classRegExps[string] ||
        (classRegExps[string] = new RegExp('(^|\\s)' + Parser.escapeRegExp(string) + '(?:\\s|$)'));
};


var Element = new Class({
    
    Extends: Node,

    Matches: '*',

    initialize: function Element(node, options) {
        this.parent(node);
        this.set(options);
    },

    toString: function() {
        return '<' + this.get('tag') + '>';
    },

    getDocument: function getDocument() {
        return this.node.ownerDocument;
    },


    //standard methods
    
    appendChild: function(child) {
        this.node.appendChild(child);
        return this;
    },

    setAttribute: function(name, value) {
        this.node.setAttribute(name, value);
        return this;
    },

    getAttribute: function(name) {
        return this.node.getAttribute(name);
    },

    removeAttribute: function(name) {
        this.node.removeAttribute(name);
        return this;
    },

    contains: function(node) {
        return Finder.contains(this.node, node.getNode ? node.getNode() : node);
    },

    match: function(expression) {
        return Finder.match(this.node, expression);
    },

    
    // className methods
    
    hasClass: function(className) {
        return classRegExpOf(className).test(this.node.className);
    },

    addClass: function(className) {
        var node = this.node;
        if (!this.hasClass(className)) {
            node.className = (node.className + ' ' + className);
        }
        return this;
    },

    removeClass: function(className) {
        var node = this.node;
        node.className = (node.className.replace(classRegExpOf(className), '$1'));
        return this;
    },

    dispose: function dispose() {
        if (this.node.parentNode) {
            this.node.parentNode.removeChild(this.node);
		}
        return this;
    },

    destroy: function destroy() {
        //TODO: this should destroy childNodes, and storage
        this.dispose().empty().removeListeners();
		delete this.node;
		return null;
    },

    empty: function empty(shouldDestroy) {
        var children = this.node.childNodes;
        for (var i = children.length - 1; i >= 0; i--) {
            this.node.removeChild(children[i]);
        }
        return this;
    },

	clone: function clone(keepContents, keepID) {
		keepContents = keepContents !== false;

		var node = this.node.cloneNode(keepContents);
		var clone_ = Element.wrap(node);

		if (!keepID) {
			var clones = clone_.getElements();
			clones.push(clone_);

			clones.set('id', null);
		}

		return clone_;
	},

    serialize: function serialize() {
        var values = {},
            undefined_;
        this.search("input, select, textarea").forEach(function forEach(el) {
            var type = el.get('type'),
                name = el.get('name');
            if(!name ||
                el.get('disabled') ||
                type==="submit" ||
                type==="reset" ||
                type==="file") {
                return;
            }
            var n = (el.get('tag') === 'select') ?
                el.search('option:selected').map(function(o) { return o.get('value'); }) :
                ((type === 'radio' || type === 'checkbox') && !el.get('checked')) ?
                    null :
                    el.get('value');
            if (typeOf(n) === 'array' && n.length < 2) {
                n = n[0];
            }
            if (!values[name]) {
                values[name] = n;
            } else if (n !=/*=*/ undefined_) {
                values[name] = Array(values[name]);
                values[name].push(n);
            }
        });
        return values;
    
    },

    focus: function() {
        this.node.focus();
    },

    blur: function() {
        this.node.blur();
    }

});

// Inserters

var inserters = {

    before: function(context, element) {
        var parent = element.parentNode;
        if (parent) {
            parent.insertBefore(context, element);
        }
    },

    after: function(context, element) {
        var parent = element.parentNode;
        if (parent) {
            parent.insertBefore(context, element.nextSibling);
        }
    },

    bottom: function(context, element) {
        element.appendChild(context);
    },

    top: function(context, element) {
        element.insertBefore(context, element.firstChild);
    }

};

inserters.inside = inserters.bottom;

Element.implement({

    inject: function(element, where) {
        inserters[where || 'bottom'](this.node, element);
        return this;
    },

    eject: function() {
        var parent = this.node.parentNode;
        if (parent) {
            parent.removeChild(this.node);
        }
        return this;
    },

    appendText: function(text, where) {
        var doc = this.node.ownerDocument;
        inserters[where || 'bottom'](doc.createTextNode(text), this.node);
        return this;
    },

    grab: function(element, where) {
        inserters[where || 'bottom'](element, this.node);
        return this;
    },

    replace: function(element) {
        element.parentNode.replaceChild(this.node, element);
        return this;
    },

    wrap: function(element, where) {
        return this.replace(element).grab(element, where);
    }

});

/* Tree Walking */

var methods = {
    find: {
        getNext: '~',
        getPrevious: '!~',
        getFirst: '^',
        getLast: '!^',
        getParent: '!'
    },
    search: {
        getAllNext: '~',
        getAllPrevious: '!~',
        getSiblings: '~~',
        getChildren: '>',
        getParents: '!'
    }
};

object.forEach(methods, function(getters, method) {
    Element.implement(object.map(getters, function(combinator) {
        return function(expression) {
            return this[method](combinator + (expression || '*'));
        };
    }));
});



// Getter / Setter

Accessor.call(Element, 'Getter');
Accessor.call(Element, 'Setter');

var properties = {
    'html': 'innerHTML',
    'class': 'className',
    'for': 'htmlFor'
};

[
    'checked', 'defaultChecked', 'type', 'value', 'accessKey', 'cellPadding',
    'cellSpacing', 'colSpan', 'frameBorder', 'maxLength', 'readOnly',
    'rowSpan', 'tabIndex', 'useMap',
    // Attributes
    'id', 'attributes', 'childNodes', 'className', 'clientHeight',
    'clientLeft', 'clientTop', 'clientWidth', 'dir', 'firstChild',
    'lang', 'lastChild', 'name', 'nextSibling', 'nodeName', 'nodeType',
    'nodeValue', 'offsetHeight', 'offsetLeft', 'offsetParent', 'offsetTop',
    'offsetWidth', 'ownerDocument', 'parentNode', 'prefix', 'previousSibling',
    'innerHTML', 'title'
].forEach(function(property) {
    properties[property] = property;
});


object.forEach(properties, function(real, key) {
    Element.defineSetter(key, function(value) {
        return (this.node[real] = value);
    }).defineGetter(key, function() {
        return this.node[real];
    });
});

var booleans = ['compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked',
    'disabled', 'multiple', 'readonly', 'selected', 'noresize', 'defer'];

booleans.forEach(function(bool) {
    Element.defineSetter(bool, function(value) {
        return (this.node[bool] = !!value);
    }).defineGetter(bool, function() {
        return !!this.node[bool];
    });
});

Element.defineGetters({

    'class': function() {
        var node = this.node;
        return ('className' in node) ? node.className : node.getAttribute('class');
    },

    'for': function() {
        var node = this.node;
        return ('htmlFor' in node) ? node.htmlFor : node.getAttribute('for');
    },

    'href': function() {
        var node = this.node;
        return ('href' in node) ? node.getAttribute('href', 2) : node.getAttribute('href');
    },

    'style': function() {
        var node = this.node;
        return (node.style) ? node.style.cssText : node.getAttribute('style');
    }

}).defineSetters({

    'class': function(value) {
        var node = this.node;
        return ('className' in node) ? node.className = value : node.setAttribute('class', value);
    },

    'for': function(value) {
        var node = this.node;
        return ('htmlFor' in node) ? node.htmlFor = value : node.setAttribute('for', value);
    },

    'style': function(value) {
        var node = this.node;
        return (node.style) ? node.style.cssText = value : node.setAttribute('style', value);
    }

});


var TEXT = 'text';
function textCheck(el) {
     var temp = el.getDocument().createElement('div');
    return (temp.innerText == null) ? 'textContent' : 'innerText';
}

function textAccessors(el) {
    var real = textCheck(el);

    el.constructor.defineSetter(TEXT, function(value) {
        this.node[real] = value;
    }).defineGetter(TEXT, function() {
        return this.node[real];
    });
}

Element.defineSetter(TEXT, function(value) {
    textAccessors(this);
    this.set(TEXT, value);
}).defineGetter(TEXT, function() {
    textAccessors(this);
    return this.get(TEXT);
});

/* get, set */

Element.implement({

    set: func.overloadSetter(function set(name, value) {
        var setter = this.constructor.lookupSetter(name);
        if (setter) {
            setter.call(this, value);
        } else if (value == null) {
            this.node.removeAttribute(name);
        } else {
            this.node.setAttribute(name, value);
        }
        return this;
    }),

    get: func.overloadGetter(function get(name) {
        var getter = this.constructor.lookupGetter(name);
        if (getter) {
            return getter.call(this);
        }
        return this.node.getAttribute(name);
    })

});

Element.defineGetter('node', function() {
    return this.node;
});

Element.defineGetter('tag', function() {
    return this.node.tagName.toLowerCase();
});


// Styles
var StyleMap = {
    left: '@px', top: '@px', bottom: '@px', right: '@px',
    width: '@px', height: '@px', maxWidth: '@px', maxHeight: '@px', minWidth: '@px', minHeight: '@px',
    backgroundColor: 'rgb(@, @, @)', backgroundPosition: '@px @px', color: 'rgb(@, @, @)',
    fontSize: '@px', letterSpacing: '@px', lineHeight: '@px', clip: 'rect(@px @px @px @px)',
    margin: '@px @px @px @px', padding: '@px @px @px @px', border: '@px @ rgb(@, @, @) @px @ rgb(@, @, @) @px @ rgb(@, @, @)',
    borderWidth: '@px @px @px @px', borderStyle: '@ @ @ @', borderColor: 'rgb(@, @, @) rgb(@, @, @) rgb(@, @, @) rgb(@, @, @)',
    zIndex: '@', 'zoom': '@', fontWeight: '@', textIndent: '@px', opacity: '@'
};

var ShortStyles = {
    margin: {}, padding: {}, border: {}, borderWidth: {}, borderStyle: {}, borderColor: {}
};

['Top', 'Right', 'Bottom', 'Left'].forEach(function(direction){
    var Short = ShortStyles;
    var All = StyleMap;
    ['margin', 'padding'].forEach(function(style){
        var sd = style + direction;
        Short[style][sd] = All[sd] = '@px';
    });
    var bd = 'border' + direction;
    Short.border[bd] = All[bd] = '@px @ rgb(@, @, @)';
    var bdw = bd + 'Width', bds = bd + 'Style', bdc = bd + 'Color';
    Short[bd] = {};
    Short.borderWidth[bdw] = Short[bd][bdw] = All[bdw] = '@px';
    Short.borderStyle[bds] = Short[bd][bds] = All[bds] = '@';
    Short.borderColor[bdc] = Short[bd][bdc] = All[bdc] = 'rgb(@, @, @)';
});

var hasOpacity,
    hasFilter,
    reAlpha = /alpha\(opacity=([\d.]+)\)/i;

function checkOpacity(el) {
    var html = el.getDocument().documentElement;
    hasOpacity = html.style.opacity != null;
    hasFilter = html.style.filter != null;
    if (hasOpacity) {
        setOpacity = _setOpacity;
        getOpacity = _getOpacity;
    } else if (hasFilter) {
        setOpacity = _setAlpha;
        getOpacity = _getAlpha;
    } else {
        setOpacity = _storeOpacity;
        getOpacity = _retrieveOpacity;
    }
}

function _setOpacity(el, value) {
    el.node.style.opacity = value;
}

function _getOpacity(el) {
    var opacity = el.node.style.opacity || el.getComputedStyle('opacity');
    return (opacity === '') ? 1 : parseFloat(opacity, 10);
}

function _setAlpha(element, opacity) {
    if (!element.node.currentStyle || !element.node.currentStyle.hasLayout) {
        element.style.zoom = 1;
    }
    opacity = Math.round(Math.max(Math.min(100, (opacity * 100)), 0));
    opacity = (opacity === 100) ? '' : 'alpha(opacity=' + opacity + ')';
    var filter = element.node.style.filter || element.getComputedStyle('filter') || '';
    element.node.style.filter = reAlpha.test(filter) ? filter.replace(reAlpha, opacity) : filter + opacity;
}

function _getAlpha(element) {
    var filter = (element.node.style.filter || element.getComputedStyle('filter')),
        opacity;
    if (filter) {
        opacity = filter.match(reAlpha);
    }
    return (opacity == null || filter == null) ? 1 : (opacity[1] / 100);
}

function _storeOpacity(element, opacity) {
    element.store('opacity', opacity);
}

function _retrieveOpacity(element) {
    return element.retrieve('opacity');
}

var setOpacity = function(el, value) {
    checkOpacity(el);
    setOpacity(el, value);
};

var getOpacity = function(el) {
    checkOpacity(el);
    return getOpacity(el);
};

function getFloatName(node) {
    return (node.cssFloat == null) ? 'styleFloat' : 'cssFloat';
}

function setStyle(property, value) {
    if (property === 'opacity') {
        setOpacity(this, parseFloat(value));
        return this;
    }
    property = (property === 'float' ? getFloatName(this.node) : string.camelCase(property));
    if (typeOf(value) !== 'string') {
        var map = (StyleMap[property] || '@').split(' ');
        value = array.from(value).map(function(val, i){
            if (!map[i]) {
                return '';
            }
            return (typeOf(val) === 'number') ? map[i].replace('@', Math.round(val)) : val;
        }).join(' ');
    } else if (value === String(Number(value))) {
        value = Math.round(value);
    }
    this.node.style[property] = value;
    return this;
}

function getStyle(property) {
    if (property === 'opacity') {
        return getOpacity(this);
    }
    property = (property === 'float' ? getFloatName(this.node) : string.camelCase(property));
    var result = this.node.style[property];
    if (!result) {
        result = [];
        for (var style in Element.ShortStyles){
            if (property !== style) {
                continue;
            }
            for (var s in Element.ShortStyles[style]) {
                result.push(this.getStyle(s));
            }
            return result.join(' ');
        }
        result = this.getComputedStyle(property);
    }
    if (result) {
        result = String(result);
        var color = result.match(/rgba?\([\d\s,]+\)/);
        if (color) {
            result = Color.rgb(result).toHEX();
        }
    }
    return result;
}



Element.implement({
   
    getComputedStyle: function getComputedStyle(property) {
        if (this.node.currentStyle) {
            return this.node.currentStyle[string.camelCase(property)];
        }
        var defaultView = this.node.ownerDocument.defaultView,
            floatName = getFloatName(this.node),
            computed = defaultView ? defaultView.getComputedStyle(this.node, null) : null;
        if (computed) {
            return computed.getPropertyValue((property === floatName) ?
                'float' :
                string.hyphenate(property));
        } else {
            return null;
        }
    },

    getStyle: getStyle,
    
    getStyles: func.overloadGetter(getStyle),

    setStyle: setStyle,

    setStyles: func.overloadSetter(setStyle)

});

Element.defineSetter('styles', function(styles) {
    return this.setStyles(styles);
});

Element.defineSetter('events', function(events) {
    return this.addEvents(events);
});


module.exports = Element;
