var namespace = 'View';

var tests = [require('./view'), require('./container'), require('./listview')];

tests.forEach(function(test) {
	for (var kase in test) {
		exports[namespace + ": " + kase] = test[kase];
	}
});
