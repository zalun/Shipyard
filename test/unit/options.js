var Class = require('../../lib/class'),
	Options = require('../../lib/class/options');

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
	}
	
};