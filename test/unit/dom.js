var dom = require('../../lib/dom');

module.exports = {
	
	'$': function(it, setup) {
		
		it('should find an Element by id', function(expect) {
			var el = dom.Document.createElement('p');
			el.setAttribute('id', 'derp');
			var body = dom.$$('body')[0];
			body.appendChild(el);
			
			expect(dom.$('derp')).toBe(el);

			//el.destroy();
		});

	},
	
	'$$': function(it, setup) {
		
		it('should return Elements', function(expect) {
			var els = dom.$$('body');
			expect(els).toBeAnInstanceOf(dom.Elements);
			expect(els.length).toBe(1);
		});

	}

};
