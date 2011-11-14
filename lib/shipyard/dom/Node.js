// Parts copied or inspired by MooTools (http://mootools.net)
// - MIT Licence
var Class = require('../class/Class'),
    Events = require('../class/Events'),
    Store = require('../class/Store'),
    typeOf = require('../utils/type').typeOf,
    object = require('../utils/object'),
    DOMEvent = require('./Event'),
    Slick = require('./Slick'),
    Finder = Slick.Finder;

var wrappers = {}, matchers = [];

var Node = new Class({

    Implements: [Events, Store],

    initialize: function Node(node) {
        this.node = node;
        wrappers[Finder.uidOf(node)] = this;
    },
    
    find: function(expression) {
        return Node.wrap(Finder.find(this.node, expression));
    },

    getElement: function(expression) {
        return this.find(expression);
    },
    
    search: function(expression) {
        var nodes = Finder.search(this.node, expression);
        for (var i = 0; i < nodes.length; i++) {
            nodes[i] = Node.wrap(nodes[i]);
        }
        return nodes;
    },

    getNode: function getNode() {
        return this.node;
    },

    getWindow: function() {
        return Node.wrap(this.node.ownerDocument).getWindow();
    },

    addListener: function addListener(name, fn) {
        fn = wrapHandler(this, name, fn);
        _addEvent.call(this, name, fn);
        return Events.prototype.addListener.call(this, name, fn);
    },

    removeListener: function removeListener(name, fn) {
        fn = unwrapHandler(this, name, fn);
        _removeEvent.call(this, name, fn);
        return Events.prototype.removeListener.call(this, name, fn);
    }

});

Node.prototype.valueOf = function(){
    return this.node;
};



Node.Mutators.Matches = function(match){
    matchers.push({_match: match, _class: this});
};

Node.wrap = function(node) {
    if (node == null) {
        return null;
    }
    if (node instanceof Node) {
        return node;
    }
    var uid = Finder.uidOf(node), wrapper = wrappers[uid];
    if (wrapper) {
        return wrapper;
    }
    for (var l = matchers.length; l--; l){
        var current = matchers[l];
        if (Finder.match(node, current._match)) {
            return (new current._class(node));
        }
    }

};



// Event Listeners

function relay(e){
    var related = e.relatedTarget;
    if (related == null) {
        return true;
    }
    if (!related) {
        return false;
    }
    return (related !== this.getNode() && related.prefix !== 'xul' && !this.contains(related));
}

var CustomEvents = {
    mouseenter: {
        base: 'mouseover',
        condition: relay
    },
    mouseleave: {
        base: 'mouseout',
        condition: relay
    }
};

function wrapHandler(node, type, fn) {
    var realType = type,
        condition = fn;
    var events = node.$wrappedEvents || (node.$wrappedEvents = {
        wraps: [],
        origs: []
    });

    var wrapped = events.wraps[events.origs.indexOf(fn)];
    if (!wrapped) {
        var custom = CustomEvents[type];
        if (custom) {
            if (custom.condition) {
                condition = function(e) {
                    if (custom.condition.call(this, e, type)) {
                        return fn.call(this, e);
                    }
                    return true;
                };
            }
            if (custom.base) {
                realType = Function.from(custom.base).call(this, type);
            }
        }
        wrapped = function(e) {
            if (e) {
                e = new DOMEvent(e, node.getWindow());
            }
            condition.call(this, e);
        };
        events.origs.push(fn);
        events.wraps.push(wrapped);
    }

    return wrapped;
}

function unwrapHandler(node, type, fn) {
    var events = node.$wrappedEvents || (node.$wrappedEvents = {
        wraps: [],
        origs: []
    });

    var index = events.origs.indexOf(fn);
    var wrapped = events.wraps[index];
    if (wrapped) {
        delete events.wraps[index];
        delete events.origs[index];
        return wrapped;
    }
}

var _addEvent = function() {
    _addEvent = this.node.addEventListener ?
        addEventListener :
        attachEvent;

    _addEvent.apply(this, arguments);
};

var _removeEvent = function() {
    _removeEvent = this.node.removeEventListener ?
        removeEventListener :
        detachEvent;

    _removeEvent.apply(this, arguments);
};

function addEventListener(type, fn) {
    this.node.addEventListener(type, fn, false);
    return this;
}

function attachEvent(type, fn) {
    this.node.attachEvent('on' + type, fn);
    return this;
}

function removeEventListner(type, fn) {
    this.node.removeEventListener(type, fn, false);
    return this;
}

function detachEvent(type, fn) {
    this.node.detachEvent('on' + type, fn);
    return this;
}

module.exports = Node;
