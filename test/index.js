var fs = require('fs'),
	path = require('path');
	Testigo = require('./testigo').Testigo;

var Suite = new Testigo(),
	Runner = new Testigo.Runners.Simple('node', Suite);

var casesArgs = process.argv.slice(2),
	cases = [];
if (!casesArgs.length) {
	casesArgs = fs.readdirSync(path.join(__dirname, 'unit'));
}

casesArgs.forEach(function(val) {
	//try {
		cases.push(require('./unit/'+val));
	/*} catch(e) {
		console.error('Unit Test %s not found.', val);
		process.exit(1);
	}*/
});

cases.forEach(function(testCase) {
	for (var description  in testCase) {
		Suite.describe(description, testCase[description]);
	}
});

Runner.run();