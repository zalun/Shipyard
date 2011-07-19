var View = require('../../lib/view/View'),
	Container = require('../../lib/view/Container'),
	ListView = require('../../lib/view/ListView');

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
			v.attributes['data-test'] = 'hello';

			expect(v.render()).toBe('<span data-test="hello"></span>');
		});

	},

	'Container': function(it, setup) {
		it('should render child views', function(expect) {
			var v = new Container;
				v2 = new View({ data: 'test' });

			delete v.attributes.id;
			delete v2.attributes.id;


			v.addView(v2);

			expect(v.render()).toBe('<div><span>test</span></div>');
		});

		it('should render child containers', function(expect) {
			var c = new Container,
				c2 = new Container({ data: 'contained' }),
				v = new View({ data: 'test' });

			delete c.attributes.id;
			delete c2.attributes.id;
			delete v.attributes.id;


			c2.addView(v);
			c.addView(c2);

			expect(c.render()).toBe('<div><div>contained<span>test</span></div></div>');
		});

	},

	'ListView': function(it, setup) {
		it('should know when its empty', function(expect) {
			var v = new ListView;
			expect(v.isEmpty()).toBe(true);

			var v2 = new ListView({ data: [1] });
			expect(v2.isEmpty()).toBe(false);
		});
	}

};
