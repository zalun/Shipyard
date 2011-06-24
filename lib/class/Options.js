var Class = require('./'),
	merge = require('../utils/object').merge;

module.exports = new Class({
	
	setOptions: function() {
		var options = this.options = merge.apply(null, [{}, this.options].concat([].slice.call(arguments)));
		if (this.addEvent) for (var option in options){
			if (typeof options[option] != 'function' || !(/^on[A-Z]/).test(option)) continue;
			this.addEvent(option, options[option]);
			delete options[option];
		}
		return this;
	}
	
});