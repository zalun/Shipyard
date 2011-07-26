var caseNames = ['class', 'dom', 'field', 'model', 'template',
	'utils-object', 'view'];

var cases = caseNames.map(function(name) {
	return require('./unit/'+ name);
});

exports.setup = function(Tests) {
	cases.forEach(function(testCase) {
		for (var description in testCase) {
			Tests.describe(description, testCase[description]);
		}
	});
};
