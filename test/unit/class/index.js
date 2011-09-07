var namespace = 'Class';

var tests = [require('./class'), require('./events'), require('./options'), require('./observable'), require('./binding')];

tests.forEach(function(test) {
	for (var kase in test) {
		exports[namespace + ": " + kase] = test[kase];
	}
});
