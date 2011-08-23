var Class = require('../../../lib/shipyard/class'),
	Options = require('../../../lib/shipyard/class/Options');

module.exports = {
	
	'Class Options': function(it, setup) {
		
		setup('before', function() {
			this.Example = new Class({
				Implements: Options,
				options: {
					a: 'ex',
					b: true,
					c: { d: 'derp' }
				},
				initialize: function(opts) {
					this.setOptions(opts);
				}
			});
		});
		
		it('should allow for default options', function(expect) {
			
			var ex = new this.Example(),
				protoOpts = this.Example.prototype.options;
			expect(ex.options.a).toBe(protoOpts.a);
			expect(ex.options.b).toBe(protoOpts.b);
			expect(ex.options.c.d).toBe(protoOpts.c.d);
			
		});
		
		it('should override the defaults', function(expect) {
			
			var ex = new this.Example({ a: 'bah', b: false }),
				protoOpts = this.Example.prototype.options;
			expect(ex.options.a).toBe('bah');
			expect(ex.options.b).toBeFalsy();
			expect(ex.options.c.d).toBe(protoOpts.c.d);
			
		});
		
		it('should be extendable', function(expect) {
			
			var BetterExample = new Class({
				Extends: this.Example,
				options: {
					a: 'better',
					q: 'QQ'
				}
			});
			
			var ex = new BetterExample();
			expect(ex.options.a).toBe('better');
			expect(ex.options.b).toBe(true);
			expect(ex.options.q).toBe('QQ');
			
		});

		it('should have getter and setter', function(expect) {
			var o = new Options;
			o.setOptions({ a: 1, b: 2 });
			o.setOption('c', 5);
			
			expect(o.getOption('a')).toBe(1);
			expect(o.getOption('c')).toBe(5);
		});
	}
	
};
