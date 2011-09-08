var fs = require('fs'),
	path = require('path');
	Testigo = require('../test/testigo').Testigo;

exports.load = function(dir, casesArgs) {
    var cases = [];
    console.log(casesArgs);
    if (!casesArgs || !casesArgs.length) {
        casesArgs = fs.readdirSync(dir);
    }
    casesArgs.forEach(function(val) {
        cases.push(require(path.join(dir, val)));
    });
    return cases;
};

exports.run = function(cases) {
    var Suite = new Testigo(),
        Runner = new Testigo.Runners.Simple('node', Suite);

    cases.forEach(function(testCase) {
        for (var description  in testCase) {
            Suite.describe(description, testCase[description]);
        }
    });

    Runner.run();
};

if (require.main == module) {
    var shipyardSuite = require('../test');
    var args = process.argv.slice(2);
    exports.run(exports.load(shipyardSuite, args))
} 
