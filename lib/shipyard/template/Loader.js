var Class = require('../class/Class');

module.exports = new Class({

	initialize: function(filename, pathsToTry) {
		var contents;
			errors = [];
		
		for (var i = 0, length = pathsToTry.length; i < length; i++) {
			var p = pathsToTry[i].replace(/\/$/, '') + '/',
				id = p + filename;
			
			try {
				contents = require(id);
			} catch(ex) {
				errors.push(ex);
				continue;
			}
			
			// we loaded the module
			break;
		}

		if (!contents) {
			errors.forEach(function(ex) { console.log(ex); });
		}

		this.contents = contents;
	},

	get: function() {
		 return this.contents;
	}

});
