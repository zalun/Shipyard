var Class = require('../class'),
	Element = require('./Element');

var Elements = new Class({

	Extends: Array,

	initialize: function(list /*TODO: string, array, Elements */) {
		list.forEach(function(el, index) {
			this[index] = el;
			this.length++;
		}, this);
	}

});

// all Element methods should be available on Elements as well
var implementOnElements = function(key, fn) {
	if (!Elements.prototype[key]) Elements.prototype[key] = function(){
		var elements = new Elements, results = [];
		for (var i = 0; i < this.length; i++){
			var node = this[i], result = node[key].apply(node, arguments);
			if (elements && !(result instanceof Element)) elements = false;
			results[i] = result;
		}

		if (elements){
			elements.push.apply(elements, results);
			return elements;
		}
		
		return results;
	};
};


// suck in all current methods
var dontEnum = {};
['toString', 'initialize', 'appendChild', 'match'].forEach(function(val) { dontEnum[val] = 1; });
for (var k in Element.prototype) {
	var prop = Element.prototype[k];
	if (!dontEnum[k] && !Elements.prototype[k] && (typeof prop == 'function')) {
		implementOnElements(k, Element.prototype[k]);
	}

}

// grab all future methods
var elementImplement = Element.implement;

Element.implement = function(key, fn){
	if (typeof key != 'string') for (var k in key) this.implement(k, key[k]); else {
		implementOnElements(key, fn);
		elementImplement.call(Element, key, fn);
	}
};


module.exports = Elements;
