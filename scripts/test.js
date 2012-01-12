/*global process: true*/
var fs = require('fs'),
	path = require('path'),
	Testigo = require('../test/testigo').Testigo;

function namespace(prefix, module) {
    if (!prefix) {
        return module;
    }
    var obj = {};
    prefix += ': ';
    for (var k in module) {
        obj[prefix+k] = module[k];
    }
    return obj;
}

exports.load = function load(dir, casesArgs, prefix) {
    var cases = [];
    if (!casesArgs || !casesArgs.length) {
        casesArgs = fs.readdirSync(dir);
    } else {
        casesArgs = casesArgs.map(function(c) {
            c = String(c);
            if (!~c.indexOf('.js') && !path.existsSync(path.join(dir, c))) {
                return c + '.js';
            }
            return c;
        });
    }
    casesArgs.forEach(function(val) {
        var _p = path.join(dir, val);
        if (path.existsSync(_p) && fs.statSync(_p).isFile()) {
            cases.push(namespace(prefix, require(_p)));
        } else {
            var _prefix = (prefix ? prefix+': ' : '') + val;
            load(_p, null, _prefix).forEach(function(_d) {
                cases.push(_d);
            });
        }
    });
    return cases;
};

exports.run = function(cases) {
    var Suite = new Testigo(),
        Runner = new Testigo.Runners.CI(Suite, true);

    cases.forEach(function(testCase) {
        for (var description  in testCase) {
            Suite.describe(description, testCase[description]);
        }
    });

    Runner.run();
};

if (require.main === module) {
	var shipyard = require('../');
	var path = require('path');
	var syPath = path.join(__dirname, '../');
	var pack = shipyard.loadPackage(syPath);
    var shipyardSuite = path.join(syPath, pack.shipyard.test);
    var args = process.argv.slice(2);
    exports.run(exports.load(shipyardSuite, args));
}
