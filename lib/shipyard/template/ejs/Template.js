var Class = require('../../class/Class'),
	Template = require('../Template');


//<node>
// For now, we need to define how to load EJS templates as modules.
require.extensions['.ejs'] = typeof window == "undefined" ?
	
	// used for node env
	function(module, filename) {
		var content = require('fs').readFileSync(filename, 'utf8');
		// ejs template will need to be wrapped in a string and set to
		// module.exports
		content = 'module.exports = ' + JSON.stringify(content.trim());

		module._compile(content, filename);
	}

	:
	// for dev in-browser env
	function(module, filename) {
		var content = require._load(filename);
		content = 'module.exports = ' + JSON.stringify(content.trim());
		require._compile(module, content);	
	};
//</node>


module.exports = new Class({

	Extends: Template,

	options: {
		fileExt: '.ejs'
	},

	compile: function compile() {
		this.parent();

		var head = 'var p=[],print=function(){p.push.apply(p,arguments);};',
			wrapper = ["with(obj){p.push(\'", "');}return p.join('');"];
		
		var inner = this.template
			.replace(/[\r\t\n]/g, " ")
			.split("<%").join("\t")
			.replace(/((^|%>)[^\t]*)'/g, "$1\r")
			
			//operators. like <%, <%=, <%-, <%?
			
			.replace(/\t=(.*?)%>/g, "',escape($1),'")
			.replace(/\t-(.*?)%>/g, "',$1,'")
			.replace(/\t\?(.*?)%>/g, "',(typeof $1 != 'undefined')?escape($1):'','")
	
			
			.split("\t").join("');")
			.split("%>").join("p.push('")
			.split("\r").join("\\'");
		
		try {
			this.compiled = new Function('obj', head + wrapper.join(inner));
		} catch(ex) {
			console.error(ex);
			throw new Error('Syntax error in template "' + this.getFileName() + '"');
		}
	}
});
