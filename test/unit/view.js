var View = require('../../lib/view/View');

module.exports = {
	
	'View': function(it, setup) {
		it('should be able to render', function(expect) {
			var v = new View({ data: 'test' });
			expect(v.render()).toBe('<div>test</div>');
		});

		it('should render child views', function(expect) {
			var v = new View;
				v2 = new View({ data: 'test' });

			v.addView(v2);

			expect(v.render()).toBe('<div><div>test</div></div>');
		});
	}

};
