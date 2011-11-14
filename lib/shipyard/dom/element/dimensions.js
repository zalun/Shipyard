// Parts copied or inspired by MooTools (http://mootools.net)
// - MIT Licence
var Element = require('../Element'),
    Document = require('../Document'),
    Window = require('../Window'),
    object = require('../../utils/object'),
    string = require('../../utils/string'),
    env = require('../../env'),
    Browser = env.browser;

function isOffsetParentBroken(node) {
    var document = node.ownerDocument;
    var element = document.createElement('div'),
        child = document.createElement('div');
    element.style.height = '0';
    element.appendChild(child);
    return (child.offsetParent === element);
}

// private methods

var styleString = Element.prototype.getComputedStyle;

function isBody(element) {
    return (/^(?:body|html)$/i).test(element.tagName);
}

var isOffset = function(el) {
    return styleString.call(el, 'position') !== 'static' || isBody(el);
};

var isOffsetStatic = function(el) {
    return isOffset(el) || (/^(?:table|td|th)$/i).test(el.tagName);
};

function styleNumber(element, style) {
    return parseInt(styleString.call(element, style), 10) || 0;
}

function borderBox(element) {
    return styleString.call(element, '-moz-box-sizing') === 'border-box';
}

function topBorder(element) {
    return styleNumber(element, 'border-top-width');
}

function leftBorder(element) {
    return styleNumber(element, 'border-left-width');
}

function getCompatElement(element) {
    var doc = element.getDocument();
    return (!doc.compatMode || doc.compatMode === 'CSS1Compat') ? doc.html : doc.body;
}



Element.implement({

    scrollTo: function(x, y) {
        if (isBody(this.node)) {
            this.getWindow().scrollTo(x, y);
        } else {
            this.node.scrollLeft = x;
            this.node.scrollTop = y;
        }
        return this;
    },

    getSize: function() {
        if (isBody(this.node)) {
            return this.getWindow().getSize();
        }
        return {
            x: this.node.offsetWidth,
            y: this.node.offsetHeight
        };
    },

    getScrollSize: function() {
        if (isBody(this.node)) {
            return this.getWindow().getScrollSize();
        }
        return {
            x: this.node.scrollWidth,
            y: this.node.scrollHeight
        };
    },

    getScroll: function() {
        if (isBody(this.node)) {
            return this.getWindow().getScroll();
        }
        return {
            x: this.node.scrollLeft,
            y: this.node.scrollTop
        };
    },

    getScrolls: function() {
        var element = this.node.parentNode, position = {x: 0, y: 0};
        while (element && !isBody(element)) {
            position.x += element.scrollLeft;
            position.y += element.scrollTop;
            element = element.parentNode;
        }
        return position;
    },

    getOffsetParent: function() {
        this.prototype.getOffsetParent = isOffsetParentBroken(this.node) ? function getBrokenOffsetParent() {

            var element = this;
            if (isBody(element) || styleString.call(element, 'position') === 'fixed') {
                return null;
            }

            var isOffsetCheck = (styleString.call(element, 'position') === 'static') ? isOffsetStatic : isOffset;
            while ((element = element.parentNode)) {
                if (isOffsetCheck(element)) {
                    return element;
                }
            }
            return null;
        } : function getOffsetParent() {
            var element = this.node;
            if (isBody(element) || styleString.call(element, 'position') === 'fixed') {
                return null;
            }

            try {
                return element.offsetParent;
            } catch(dontCare) {}
            return null;
        };
        this.getOffsetParent();
    },

    getOffsets: function() {
        if (this.node.getBoundingClientRect && !env.platform.ios) {
            var bound = this.node.getBoundingClientRect(),
                html = Element.wrap(this.getDocument().documentElement),
                htmlScroll = html.getScroll(),
                elemScrolls = this.getScrolls(),
                isFixed = (styleString.call(this.node, 'position') === 'fixed');

            return {
                x: parseInt(bound.left, 10) + elemScrolls.x + ((isFixed) ? 0 : htmlScroll.x) - html.clientLeft,
                y: parseInt(bound.top, 10)  + elemScrolls.y + ((isFixed) ? 0 : htmlScroll.y) - html.clientTop
            };
        }

        var element = this.node, position = {x: 0, y: 0};
        if (isBody(element)) {
            return position;
        }

        while (element && !isBody(element)) {
            position.x += element.offsetLeft;
            position.y += element.offsetTop;

            if (Browser.firefox) {
                if (!borderBox(element)) {
                    position.x += leftBorder(element);
                    position.y += topBorder(element);
                }
                var parent = element.parentNode;
                if (parent && styleString.call(parent, 'overflow') !== 'visible') {
                    position.x += leftBorder(parent);
                    position.y += topBorder(parent);
                }
            } else if (element !== this.node && Browser.safari) {
                position.x += leftBorder(element);
                position.y += topBorder(element);
            }

            element = element.offsetParent;
        }
        if (Browser.firefox && !borderBox(this.node)) {
            position.x -= leftBorder(this.node);
            position.y -= topBorder(this.node);
        }
        return position;
    },

    getPosition: function getPosition(relative) {
        var offset = this.getOffsets(),
            scroll = this.getScrolls();
        var position = {
            x: offset.x - scroll.x,
            y: offset.y - scroll.y
        };

        if (relative && (relative = Element.wrap(relative))) {
            var relativePosition = relative.getPosition();
            return {x: position.x - relativePosition.x - leftBorder(relative), y: position.y - relativePosition.y - topBorder(relative)};
        }
        return position;
    },

    getCoordinates: function getCoordinates(element) {
        if (isBody(this.node)) {
            return this.getWindow().getCoordinates();
        }
        var position = this.getPosition(element),
            size = this.getSize();
        var obj = {
            left: position.x,
            top: position.y,
            width: size.x,
            height: size.y
        };
        obj.right = obj.left + obj.width;
        obj.bottom = obj.top + obj.height;
        return obj;
    },

    computePosition: function(obj) {
        return {
            left: obj.x - styleNumber(this.node, 'margin-left'),
            top: obj.y - styleNumber(this.node, 'margin-top')
        };
    },

    setPosition: function(obj) {
        return this.setStyles(this.computePosition(obj));
    }

});


[Document, Window].forEach(function(obj) {
    
    obj.implement({

        getSize: function() {
            var doc = getCompatElement(this.node);
            return {x: doc.clientWidth, y: doc.clientHeight};
        },

        getScroll: function() {
            var win = this.getWindow(), doc = getCompatElement(this.node);
            return {x: win.pageXOffset || doc.scrollLeft, y: win.pageYOffset || doc.scrollTop};
        },

        getScrollSize: function() {
            var doc = getCompatElement(this.node),
                min = this.getSize(),
                body = this.getDocument().body;

            return {x: Math.max(doc.scrollWidth, body.scrollWidth, min.x), y: Math.max(doc.scrollHeight, body.scrollHeight, min.y)};
        },

        getPosition: function() {
            return {x: 0, y: 0};
        },

        getCoordinates: function() {
            var size = this.getSize();
            return {top: 0, left: 0, bottom: size.y, right: size.x, height: size.y, width: size.x};
        }

    });

});

//aliases
Element.implement({position: Element.prototype.setPosition}); //compatability

[Window, Document, Element].forEach(function(obj) {
    
    obj.implement({

        getHeight: function() {
            return this.getSize().y;
        },

        getWidth: function() {
            return this.getSize().x;
        },

        getScrollTop: function() {
            return this.getScroll().y;
        },

        getScrollLeft: function() {
            return this.getScroll().x;
        },

        getScrollHeight: function() {
            return this.getScrollSize().y;
        },

        getScrollWidth: function() {
            return this.getScrollSize().x;
        },

        getTop: function() {
            return this.getPosition().y;
        },

        getLeft: function() {
            return this.getPosition().x;
        }

    });

});

module.exports = Element;
