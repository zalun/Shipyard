var Class = require('../../lib/class');

module.exports = {
	
	/*'a new Class': function(it, setup) {
		
		it('should be an instanceof Class', function(expect) {
			var Example = new Class();
			expect(Example).toBeAnInstanceOf(Class);
		});
		
	},*/
	
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
		
		it('should use its prototype', function(expect) {
			var Example = new Class({
				derp: function() {}
			});
			var ex = new Example();
			
			expect(ex.derp).toBeType('function');
			expect(ex.derp).toBe(Example.prototype.derp);
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
		
	}
	
};
