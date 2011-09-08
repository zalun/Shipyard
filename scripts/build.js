var path = require('path'),
    shipyard = require('../'),
	copy = require('dryice').copy;

exports.compile = function(appDir, dest) {
    var pack = shipyard.loadPackage(appDir);
        meta = pack.shipyard;
    
    console.log('Starting build of %s...', pack.name);

    var dir = path.join(appDir, '../'),
        app = path.join(pack.name, meta.app),
        shipyardDir = path.join(__dirname, '../lib');

    console.log(dir, app);
    var project = copy.createCommonJsProject({
        roots: [dir, shipyardDir]
    });

    var build = copy.createDataObject();

    // mini_require defaults to false, for now
    if (meta.mini_require) {
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
    
    dest = dest || path.join(appDir, meta.min);
    console.log('Copying to %s...', dest);
    copy({
        source: build,
        dest: dest,
        filter: []//[copy.filter.uglifyjs]
    });

    console.log('Done.');
};

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

if (require.main == module) {
    var src = path.join(process.cwd(), process.argv[2])
        dest = path.join(process.cwd(), process.argv[3])
    exports.compile(src, dest);
}
