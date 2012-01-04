/*global process,console,__dirname*/
var path = require('path'),
    shipyard = require('../'),
	object = require('../lib/shipyard/utils/object'),
	copy = require('dryice').copy;

exports.compile = function(appDir, dest, options) {
    var pack;
    try {
        pack = shipyard.loadPackage(appDir);
    } catch (ex) {
        console.error(ex.message);
        process.exit(1);
    }
    
    var meta = pack.shipyard;

    
    console.log('Starting build of %s...', pack.name);

	// Add the dependencies at `roots` to the project
	// `dir` contains the current app
	// `app` is what will get required() to start the file search
    var dir = path.join(appDir, '../'),
        app = path.join(pack.name, meta.app || './'),
        shipyardDir = path.join(__dirname, '../lib'),
		roots = [dir];
	
	if (meta.dependencies) {
		object.forEach(meta.dependencies, function(path, name) {
			roots.push(path.join(appDir, path));
		});
	}
	roots.push(shipyardDir);

console.log('Roots: ', roots);
    var project = copy.createCommonJsProject({
        roots: roots
    });

    var build = copy.createDataObject();

    // mini_require defaults to false, for now
    if (meta.mini_require || options.mini_require) {
        console.log('Including mini require...');
        copy({
            source: [path.join(__dirname, '../build/require.js')],
            dest: build
        });
    }
    
    console.log('Following all requires...');
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

    var finalFilters = [];
    if (options.force_minify || meta.min && !options.no_minify) {
        finalFilters.push(copy.filter.uglifyjs);
        console.log('Minifying...');
    }
    
    dest = dest || path.join(appDir, meta.target);
    console.log('Copying to %s...', dest);
    copy({
        source: build,
        dest: dest,
        filter: finalFilters
    });

    console.log('Done.');
};

function filterNode(content, location) {
    if (typeof content !== 'string') {
		content = content.toString();
	}
    return content.replace(/<node>.*<\/node>/g, '');
}
filterNode.onRead = true;

function wrapDefines(content, location) {
    if (typeof content !== 'string') {
		content = content.toString();
	}
    if (location.base) {
        location = location.path;
    }
    location = location.replace(/(\.js|\/)$/, '');
    return "define('"+ location +"', [], function(require, exports, module){\n" + content +"\n});\n";
}
wrapDefines.onRead = true;

if (require.main === module) {
    var src = path.join(process.cwd(), process.argv[2]),
        dest = path.join(process.cwd(), process.argv[3]);
    exports.compile(src, dest);
}
