var Container = require('../../../lib/shipyard/view/Container'),
	View = require('../../../lib/shipyard/view/View');

module.exports = {

	'Container': function(it, setup) {
		it('should render child views', function(expect) {
			var v = new Container(),
				v2 = new View({ data: 'test' });

			delete v.attributes.id;
			delete v2.attributes.id;


			v.addView(v2);

            var el = v.toElement();
			expect(el.get('tag')).toBe('div');
            expect(el.getFirst().get('tag')).toBe('span');
            expect(el.getFirst().get('text').trim()).toBe('test');
		});

		it('should render child containers', function(expect) {
			var c = new Container(),
				c2 = new Container({ data: 'contained' }),
				v = new View({ data: 'test' });

			delete c.attributes.id;
			delete c2.attributes.id;
			delete v.attributes.id;


			c2.addView(v);
			c.addView(c2);

            var el = c.toElement();
            expect(el.getElements().get('tag')).toBeLike(['div', 'span']);

		});
	}

};
