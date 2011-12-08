var Class = require('../../../lib/shipyard/class/Class'),
	Events = require('../../../lib/shipyard/class/Events'),
	Spy = require('../../testigo/lib/spy').Spy;

module.exports = {
	'Events': function(it, setup) {
		
		setup('beforeEach', function() {
			this.E = new Events();
		});

		it('should be able to listen to events fired', function(expect) {
			var fn = new Spy();
			this.E.addListener('tease', fn);
			this.E.emit('tease');
			expect(fn.getCallCount()).toBe(1);
		});

		it('should be able to take an object map for addEvents', function(expect) {
			var fn = new Spy();
			this.E.addEvents({
				'a': fn,
				'b': fn
			});

			this.E.emit('a');
			this.E.emit('b');
			expect(fn.getCallCount()).toBe(2);
		});

		it('should be able to remove added event listeners', function(expect) {
		
			var fn = new Spy(),
				fn2 = new Spy();
			this.E.addListener('a', fn);
			this.E.addListener('a', fn2);

			this.E.emit('a');

			this.E.removeEvent('a', fn);
			this.E.emit('a');

			expect(fn.getCallCount()).toBe(1);
			expect(fn2.getCallCount()).toBe(2);
		});

        it('should remove all listerners for a specific event', function(expect) {
            var fn = new Spy(),
                fn2 = new Spy();

            this.E.addListener('a', fn);
            this.E.addListener('b', fn2);

            this.E.removeEvents('a');
            this.E.emit('a');
            this.E.emit('b');

            expect(fn.getCallCount()).toBe(0);
            expect(fn2.getCallCount()).toBe(1);
        });

        it('should be able to remove all listeners', function(expect) {
            var fn = new Spy();
            this.E.addListener('x', fn);

            this.E.removeEvents();
            this.E.emit('x');

            expect(fn.getCallCount()).toBe(0);
        });

        it('should return a Listener when addEvent', function(expect) {
            var fn = new Spy();
            var ptr = this.E.addListener('a', fn);

            ptr.detach();

            this.E.emit('e');

            expect(fn.getCallCount()).toBe(0);
        });

		it('should work with "onEventName"', function(expect) {
			var fn = new Spy();
			this.E.addListener('onSpy', fn);

			this.E.emit('spy');

			expect(fn.getCallCount()).toBe(1);
		});

        it('should be able to attach an event `once`', function(expect) {
            var fn = new Spy();
            this.E.once('spy', fn);
            this.E.emit('spy');
            this.E.emit('spy');

            expect(fn.getCallCount()).toBe(1);
        });

        it('should not stack multiple times of the function', function(expect) {
            var fn = new Spy();
            this.E.addListener('spy', fn);
            this.E.addListener('spy', fn);

            this.E.emit('spy');
            expect(fn.getCallCount()).toBe(1);
        });

	}
};
