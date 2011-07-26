var dom = require('../../lib/dom');

module.exports = {
	
	'Element': function(it, setup) {
		it('should take a tagName in the constructor', function(expect) {
			var el = new dom.Element('p');
			expect(el).toBeAnInstanceOf(dom.Element);
			expect(el.get('tag')).toBe('p');
		});

		it('should be able to getParent', function(expect) {
			var el = new dom.Element('p'),
				el2 = new dom.Element('span');

			el.grab(el2);
			expect(el2.getParent()).toBe(el);
		});
	},

	'Element.serialize': function(it, setup) {
		it('should serialize text inputs', function(expect) {
			var form = new dom.Element('form', { 
				html: '<fieldset><input type="text" name="first_name" value="Sean" /><input type="text" name="last_name" value="McArthur" /><input type="text" name="title" /></fieldset>' 
			});
		
			var data = form.serialize();

			expect(data.first_name).toBe('Sean');
			expect(data.last_name).toBe('McArthur');
			expect(data.title).toBeFalsy();
		});

		it('should serialize checkboxes', function(expect) {
			var form = new dom.Element('form', { html: '\
				<fieldset>\
					<input type="checkbox" name="topic" checked="checked" value="Javascript" />\
					<input type="checkbox" name="topic" value="PHP" />\
				</fieldset>\
				<fieldset>\
					<input type="checkbox" name="candy" checked="checked"  value="Twix" />\
					<input type="checkbox" name="candy" checked="checked"  value="Snickers" />\
				</fieldset>\
				<fieldset>\
					<input type="checkbox" name="sleepy" value="yes" checked="checked" />\
				</fieldset>\
			'});
		
			var data = form.serialize();
			expect(data.topic).toBe('Javascript');
			expect(data.sleepy).toBe('yes');
			expect(data.candy).toBeType('array');
			expect(data.candy.length).toBe(2);
		});

		it('should serialize radion buttons', function(expect) {
			var form = new dom.Element('form', { html: '\
				<fieldset>\
					<input type="radio" checked="checked" value="Programmer" name="job" />\
					<input type="radio" value="Designer" name="job" />\
				</fieldset>\
				<fieldset>\
					<input type="radio" value="carls" name="food" />\
					<input type="radio" value="tbell" name="food" />\
				</fieldset>\
			'});
			
			var data = form.serialize();

			expect(data.job).toBe('Programmer');
			expect(data.food).toBeFalsy();
			expect(data.carls).toBeUndefined();
		
		});

		it('should serialize textareas', function(expect) {
			var form = new dom.Element('form', { 
				html: '<fieldset><textarea name="t">La dee da.</textarea></fieldset>' 
			});
		
			var data = form.serialize();
			expect(data.t).toBe('La dee da.');
			expect(data.f).toBeUndefined();
		
		});

		it('should serialize select boxes', function(expect) {
			var form = new dom.Element('form', { html: '\
				<fieldset>\
					<select name="job">\
						<option selected="selected">Programmer</option>\
						<option>Designer</option>\
					</select>\
					<select name="food">\
						<option value="carls">Carls Jr</option>\
						<option value="tbell" selected="selected">Taco Bell</option>\
					</select>\
				</fieldset>\
			'});
		
			var data = form.serialize();
			expect(data.job).toBe('Programmer');
			expect(data.food).toBe('tbell');
		});

		it('should serialize multi selects', function(expect) {
			var form = new dom.Element('form', { html: '\
				<fieldset>\
					<select name="food" multiple="multiple">\
						<option value="carls">Carls Jr</option>\
						<option value="tbell" selected="selected">Taco Bell</option>\
						<option value="deltaco" selected="selected">Del Taco</option>\
					</select>\
				</fieldset>\
			'});
			
			var data = form.serialize();

			expect(data.food).toBeType('array');
			expect(data.food.length).toBe(2);
			expect(data.food[0]).toBe('tbell');
			
		});
	},
	
	'$': function(it, setup) {
		
		it('should find an Element by id', function(expect) {
			var el = dom.document.createElement('p');
			el.setAttribute('id', 'derp');
			var body = dom.document.body;
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
