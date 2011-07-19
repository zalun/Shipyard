var Class = require('../../lib/class'),
	Events = require('../../lib/class/Events'),
	Spy = require('../testigo/lib/spy').Spy;

module.exports = {
	'Events': function(it, setup) {
		
		setup('beforeEach', function() {
			this.E = new Events();
		})

		it('should be able to listen to events fired', function(expect) {
			var fn = new Spy();
			this.E.addEvent('tease', fn);
			this.E.fireEvent('tease');
			expect(fn.getCallCount()).toBe(1);
		});

		it('should be able to take an object map for addEvents', function(expect) {
			var fn = new Spy();
			this.E.addEvents({
				'a': fn,
				'b': fn
			});

			this.E.fireEvent('a');
			this.E.fireEvent('b');
			expect(fn.getCallCount()).toBe(2);
		});

		it('should be able to remove added event listeners', function(expect) {
		
			var fn = new Spy(),
				fn2 = new Spy();
			this.E.addEvent('a', fn);
			this.E.addEvent('a', fn2);

			this.E.fireEvent('a');

			this.E.removeEvent('a', fn);
			this.E.fireEvent('a');

			expect(fn.getCallCount()).toBe(1);
			expect(fn2.getCallCount()).toBe(2);
		});

		it('should work with "onEventName"', function(expect) {
			var fn = new Spy;
			this.E.addEvent('onSpy', fn);

			this.E.fireEvent('spy');

			expect(fn.getCallCount()).toBe(1);
		});

	}
};
