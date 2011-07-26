var Class = require('../../../lib/class'),
	Spy = require('../../testigo/lib/spy').Spy;

module.exports = {

	'Class instance': function(it, setup) {
		
		it('should be an instanceof its Class', function(expect) {
			var Example = new Class();
			var ex = new Example();
			expect(ex).toBeAnInstanceOf(Example);
			
			var Other = new Class(function constructor(){
				this.ex = 'example';
			});
			var ot = new Other();
			expect(ot).toBeAnInstanceOf(Other);
		});

		it('should be an instance Class', function(expect) {
			var Ex = new Class;
			var ex = new Ex;
			expect(ex).toBeAnInstanceOf(Class);

			var It = new Class({ Extends: Ex });
			var it = new It;
			expect(it).toBeAnInstanceOf(Class);
		});
		
		it('should use its prototype', function(expect) {
			var Example = new Class({
				derp: function() {}
			});
			var ex = new Example();
			
			expect(ex.derp).toBeType('function');
			expect(ex.derp).toBe(Example.prototype.derp);
		});

		it('should clone objects/arrays from prototype', function(expect) {
			var Example = new Class({
				list: []
			});
			
			var ex1 = new Example,
				ex2 = new Example;

			ex1.list.push('test');

			expect(ex1.list.length).toBe(1);
			expect(ex2.list.length).toBe(0);
		});
		
		it('should be able to extend other classes', function(expect) {
			var Example = new Class({
				derp: function() {}
			});
			var BetterExample = new Class({
				Extends: Example,
				herp: function() {}
			});
			
			var ex = new BetterExample();
			
			expect(ex).toBeAnInstanceOf(Example);
			expect(ex).toBeAnInstanceOf(BetterExample);
			expect(ex.derp).toBeType('function');
		});

		it('should not call extended class\' initialize method at Extends', function(expect) {
			var fn = new Spy;
			var Ex = new Class({
				initialize: fn
			});
			var Ex2 = new Class({
				Extends: Ex
			});

			expect(fn.getCallCount()).toBe(0);
		});
		
		it('should be able to call a parent method when extended', function(expect) {
			var Example = new Class({
				derp: function() {
					return 'rp';
				}
			});
			Example.blam = 'blam';
			var BetterExample = new Class({
				Extends: Example,
				derp: function() {
					return 'de' + this.parent();
				}
			});
			
			var ex = new BetterExample();
			expect(ex.derp()).toBe('derp');
		});
		
		it('should implement mixins', function(expect) {
			var Mixin = new Class({
				derp: function() {}
			});
			var Example = new Class({
				Implements: Mixin,
				herp: function() {}
			});
			var ex = new Example();
			
			expect(ex).not.toBeAnInstanceOf(Mixin);
			expect(ex.derp).toBeType('function');
		});

		it('should have an "implement" static method', function(expect) {
		
			var Example = new Class;
			expect(Example.implement).toBeType('function');

			Example.implement('a', function() {
				return 'arm';
			});

			Example.implement({
				'b': function() { return 'b'; },
				'c': function(d) { return this.b() + d; }
			});

			var ex = new Example;

			expect(ex.a()).toBe('arm');
			expect(ex.c('ad')).toBe('bad');
		
		});


		it('should extend static properties', function(expect) {
			var Example = new Class();
			Example.merp = '$merp';
			Example.derp = function() { return this.merp; };
			var BetterExample = new Class({
				Extends: Example
			});
			
			expect(BetterExample.derp).toBe(Example.derp);
			expect(BetterExample.derp()).toBe(Example.merp);
			
			BetterExample.merp = '$larp';
			expect(BetterExample.derp()).toBe(BetterExample.merp);
			expect(Example.derp()).toBe(Example.merp);
			
			var ex = new BetterExample();
		});

		it('should have local Mutators', function(expect) {
			var Interface = new Class;
			Interface.Mutators.Local = function(val) { 
				this.implement('isLocal', function() { 
					return !!val; 
				}); 
			};

			var Ex = new Class({
				Implements: Interface,
				Local: true
			});

			var ex = new Ex;
			expect(ex.isLocal).toBeTruthy();
			expect(ex.isLocal()).toBe(true);

			var Be = new Class({
				Local: false
			});
			var b = new Be;
			expect(b.isLocal).toBeUndefined();

		});
		
	}
	
};
