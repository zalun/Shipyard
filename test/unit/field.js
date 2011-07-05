var Class = require('../../lib/class'),
	Field = require('../../lib/model/fields/Field');

module.exports = {
	'Field': function(it, setup) {
		
		it('should convert values to its type', function(expect) {
			var field = new Field({ type: String });
			
			expect(field.from('hello')).toBe('hello');
			expect(field.from(33)).toBe('33');
			
		});

		it('should get default values', function(expect) {
			var field = new Field({ 'default': 'test' });

			expect(field.serialize()).toBe('test');
			expect(field.serialize('derp')).toBe('derp');
		
		});
		
	},

	'DateField': function(it, setup) {
	
	
	}
};
