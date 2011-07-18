var dom = require('../../lib/dom');

module.exports = {
	
	'Element': function(it, setup) {
		it('should take a tagName in the constructor', function(expect) {
			var el = new dom.Element('p');
			expect(el).toBeAnInstanceOf(dom.Element);
			expect(el.get('tag')).toBe('p');
		});
	},
	
	'$': function(it, setup) {
		
		it('should find an Element by id', function(expect) {
			var el = dom.document.createElement('p');
			el.setAttribute('id', 'derp');
			var body = dom.$$('body')[0];
			body.appendChild(el);
			
			expect(dom.$('derp')).toBe(el);

			//el.destroy();
		});

		it('should call toElement if passed an object', function(expect) {
			var el = new dom.Element('p');
			var obj = {
				toElement: function() {
					return el;
				}
			};

			expect(dom.$(obj)).toBe(el);			
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
