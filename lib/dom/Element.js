var Class = require('../class'),
    Accessor = require('../utils/Accessor'),
    object = require('../utils/object'),
	Node = require('./Node'),
    Slick = require('./Slick'),
    Parser = Slick.Parser,
    Finder = Slick.Finder;


var classRegExps = {};
var classRegExpOf = function(string){
    return classRegExps[string] || 
        (classRegExps[string] = new RegExp('(^|\\s)' + Parser.escapeRegExp(string) + '(?:\\s|$)'));
};

var inserters = {

    before: function(context, element){
        var parent = element.parentNode;
        if (parent) parent.insertBefore(context, element);
    },

    after: function(context, element){
        var parent = element.parentNode;
        if (parent) parent.insertBefore(context, element.nextSibling);
    },

    bottom: function(context, element){
        element.appendChild(context);
    },

    top: function(context, element){
        element.insertBefore(context, element.firstChild);
    }

};


var Element = new Class({
    
    Extends: Node,

    Matches: '*',


    //standard methods
    
    appendChild: function(child){
        this.node.appendChild(child);
        return this;
    },

    setAttribute: function(name, value){
        this.node.setAttribute(name, value);
        return this;
    },

    getAttribute: function(name){
        return this.node.getAttribute(name);
    },

    removeAttribute: function(name){
        this.node.removeAttribute(name);
        return this;
    },

    /*contains: function(node){
        return ((node = select(node))) ? Slick.contains(this.node, node.valueOf()) : false;
    },*/

    match: function(expression){
        return Slick.match(this.node, expression);
    },

    
    // className methods
    
    hasClass: function(className){
        return classRegExpOf(className).test(this.node.className);
    },

    addClass: function(className){
        var node = this.node;
        if (!this.hasClass(className)) 
            node.className = (node.className + ' ' + className);
        return this;
    },

    removeClass: function(className){
        var node = this.node;
        node.className = (node.className.replace(classRegExpOf(className), '$1'));
        return this;
    }


});



// Getter / Setter

Accessor.call(Element, 'Getter');
Accessor.call(Element, 'Setter');

var properties = {
    'html': 'innerHTML',
    'class': 'className',
    'for': 'htmlFor'/*,
    'text': (function(){
        var temp = document.createElement('div');
        return (temp.innerText == null) ? 'textContent' : 'innerText';
    })()*/
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
].forEach(function(property){
    properties[property] = property;
});


object.forEach(properties, function(real, key){
    Element.defineSetter(key, function(value){
        return this.node[real] = value;
    }).defineGetter(key, function(){
        return this.node[real];
    });
});

var booleans = ['compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked',
    'disabled', 'multiple', 'readonly', 'selected', 'noresize', 'defer'];

booleans.forEach(function(bool){
    Element.defineSetter(bool, function(value){
        return this.node[bool] = !!value;
    }).defineGetter(bool, function(){
        return !!this.node[bool];
    });
});

Element.defineGetters({

    'class': function(){
        var node = this.node;
        return ('className' in node) ? node.className : node.getAttribute('class');
    },

    'for': function(){
        var node = this.node;
        return ('htmlFor' in node) ? node.htmlFor : node.getAttribute('for');
    },

    'href': function(){
        var node = this.node;
        return ('href' in node) ? node.getAttribute('href', 2) : node.getAttribute('href');
    },

    'style': function(){
        var node = this.node;
        return (node.style) ? node.style.cssText : node.getAttribute('style');
    }

}).defineSetters({

    'class': function(value){
        var node = this.node;
        return ('className' in node) ? node.className = value : node.setAttribute('class', value);
    },

    'for': function(value){
        var node = this.node;
        return ('htmlFor' in node) ? node.htmlFor = value : node.setAttribute('for', value);
    },

    'style': function(value){
        var node = this.node;
        return (node.style) ? node.style.cssText = value : node.setAttribute('style', value);
    }

});

/* get, set */

Element.implement({

    set: function(name, value){
        if (typeof name != 'string') for (var k in name) this.set(k, name[k]); else {
            var setter = Element.lookupSetter(name);
            if (setter) setter.call(this, value);
            else if (value == null) this.node.removeAttribute(name);
            else this.node.setAttribute(name, value);
        }
        return this;
    },

    get: function(name){
        if (arguments.length > 1) return Array.prototype.map.call(arguments, function(v, i){
            return this.get(v);
        }, this);
        var getter = Element.lookupGetter(name);
        if (getter) return getter.call(this);
        return this.node.getAttribute(name);
    }

});

Element.defineGetter('tag', function(){
    return this.node.tagName.toLowerCase();
});


module.exports = Element;
