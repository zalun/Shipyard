var Class = require('../class');

module.exports = new Class({

	initialize: function(filename, pathsToTry) {
		var contents;
		
		for (var i = 0, length = pathsToTry.length; i < length; i++) {
			var p = pathsToTry[i].replace(/\/$/, '') + '/',
				id = p + filename;
			
			try {
				contents = require(id);
			} catch(ex) {
				console.log(ex);
				continue;
			}
			
			// we loaded the module
			break;
		}

		this.contents = contents;
	},

	get: function() {
		 return this.contents;
	}

});
