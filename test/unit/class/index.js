var namespace = 'Class';

var tests = [require('./class'), require('./events'), require('./options')];

tests.forEach(function(test) {
	for (var kase in test) {
		exports[namespace + ": " + kase] = test[kase];
	}
});
