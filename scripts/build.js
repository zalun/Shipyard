var path = require('path'),
	copy = require('../../dryice').copy;

var src = path.join(process.cwd(), process.argv[2]),
	dir = path.dirname(src),
	app = path.basename(src).replace(/\/$/, ''),
	shipyard = path.join(__dirname, '../lib');

var project = copy.createCommonJsProject({
	roots: [dir, shipyard]
});


var dest = path.join(process.cwd(), process.argv[3] || './'+app+'.js');

function filterNode(content, location) {
	if (typeof content !== 'string') content = content.toString();
	return content.replace(/<node>.*<\/node>/g, '');
}
filterNode.onRead = true;

function wrapDefines(content, location) {
	if (typeof content !== 'string') content = content.toString();
	if (location.base) {
		location = location.path;
	}
	location = location.replace(/(\.js|\/)$/, '');
	return "define('"+ location +"', [], function(require, exports, module){\n" + content +"\n});\n";
}
wrapDefines.onRead = true;

var build = copy.createDataObject();
copy({
	source: [path.join(__dirname, '../build/require.js')],
	dest: build
});

copy({
	source: copy.source.commonjs({
		project: project,
		require: [app]
	}),
	dest: build,
	filter: [filterNode, wrapDefines]
});

copy({
	source: [{
		value: 'document.addEventListener("DOMContentLoaded", function() {require("' + app +'");}, false);'
	}],
	dest: build
});

copy({
	source: build,
	dest: dest,
	filter: [copy.filter.uglifyjs]
});
