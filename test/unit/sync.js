var Class = require('../../lib/shipyard/class'),
	Sync = require('../../lib/shipyard/sync/Sync'),
	Syncable = require('../../lib/shipyard/sync/Syncable'),
	Spy = require('../testigo/lib/spy').Spy;

module.exports = {

	'Syncable': function(it, setup) {
		
		var MockSync, MockSyncable;

		setup('beforeEach', function() {
			MockSync = new Class({
				Extends: Sync,
				initialize: function(options) {
					this.parent(options);
					this.read = new Spy;
					this.create = new Spy;
					this.update = new Spy;
					this.destroy = new Spy;
				}
			});

			MockSyncable = new Class({
				Implements: Syncable
			});
		});
		
		it('should name Syncs and then use them with the "using" option', function(expect) {
			var foo = new MockSync;
			var bar = new MockSync;

			MockSyncable.addSync('foo', foo);
			MockSyncable.addSync('bar', bar);
			MockSyncable.addSync('baz', new MockSync);

			MockSyncable.find({using: 'bar'});

			expect(foo.read.getCallCount()).toBe(0);
			expect(bar.read.getCallCount()).toBe(1);
		});

		it('should use "default" sync if "using" is not provided', function(expect) {
			var foo = new MockSync;
			var bar = new MockSync;

			MockSyncable.addSync('default', foo);
			MockSyncable.addSync('bar', bar);

			MockSyncable.find();

			expect(foo.read.getCallCount()).toBe(1);
			expect(bar.read.getCallCount()).toBe(0);
		})

		it('should use the Sync mutator to add syncs', function(expect) {
			var foo = new MockSync,
				bar = new MockSync,
				getFoo = function() { return foo; },
				getBar = function() { return bar; };

			var S = new Class({
				Implements: Syncable,
				Sync: {
					'default': {
						'driver': getFoo
					},
					'bar': {
						'driver': getBar
					}
				}
			});

			S.find();
			S.find({using: 'bar'});

			expect(foo.read.getCallCount()).toBe(1);
			expect(bar.read.getCallCount()).toBe(1);

		});

		it('should fire Class events from instances', function(expect) {
			var classSpy = new Spy,
				instSpy = new Spy;
			MockSyncable.addEvent('foo', classSpy);

			var s = new MockSyncable;
			s.addEvent('foo', instSpy);

			s.fireEvent('foo');
			
			expect(instSpy.getCallCount()).toBe(1);
			expect(classSpy.getCallCount()).toBe(1);
		});
	}
};
