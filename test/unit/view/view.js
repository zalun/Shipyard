var View = require('../../../lib/view/View');

module.exports = {
	
	'View': function(it, setup) {
		it('should be able to render', function(expect) {
			var v = new View({ data: 'test' });
			delete v.attributes.id;
			expect(v.render()).toBe('<span>test</span>');
		});

		it('should render attributes', function(expect) {
			var v = new View;
			delete v.attributes.id;
			v.attributes['data-test'] = 'hey "dude"';

			expect(v.render()).toBe('<span data-test="hey &quot;dude&quot;"></span>');
		});

	}

};
