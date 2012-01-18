var dom = require('../../../lib/shipyard/dom'),
    string = require('../../../lib/shipyard/utils/string'),
    Spy = require('../../testigo/lib/spy').Spy;

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

        it('should be able to set and get attributes', function(expect) {
            var el = new dom.Element('div');
            el.set('title', 'derp');


            expect(el.getNode().title).toBe('derp');
            expect(el.get('title')).toBe('derp');
        });

        it('should have have a setter/getter for "text"', function(expect) {
            var el = new dom.Element('div');
            el.set('text', 'hello');

            expect(el.getNode().textContent).toBe('hello');
        });

        it('should have a setter/getter for "html"', function(expect) {
            var el = new dom.Element('div');
            el.set('html', '<span>derp</span>');

            expect(el.getElement('span').get('text')).toBe('derp');
        });

        it('should be able to listen to events', function(expect) {
            var el = new dom.Element('div');
            var fn = new Spy(function() {
                expect(this).toBe(el);
            });

            el.addEvent('click', fn);

            el.fireEvent('click');

            expect(fn.getCallCount()).toBe(1);

        });

		it('should be cloneable', function(expect) {
			var el = new dom.Element('div', { 'class': 'me' });
			var clone = el.clone();

			expect(el).not.toBe(clone);
			expect(clone.hasClass('me')).toBe(true);
		});

	},

    'Element.Traversal': function(it, setup) {
        
        setup('beforeEach', function() {
            dom.$$('body *').dispose();
        });

        it('should be able to getPrevious by selector', function(expect) {
            var el1 = new dom.Element('div');
            var el2 = new dom.Element('span');
            var el3 = new dom.Element('p');

            dom.document.body.appendChild(el1).appendChild(el2).appendChild(el3);

            expect(el3.getPrevious()).toBe(el2);
            expect(el3.getPrevious('div')).toBe(el1);
        });

        it('should be able to getNext by selector', function(expect) {
            var el1 = new dom.Element('div', { 'class': 'derp' });
            var el2 = new dom.Element('div', { 'class': 'herp' });
            var el3 = new dom.Element('div', { id: 'merp' });

            dom.document.body.appendChild(el1).appendChild(el2).appendChild(el3);

            expect(el1.getNext()).toBe(el2);
            expect(el1.getNext('div#merp')).toBe(el3);
        });
    },

    'Element.Styles': function(it, setup) {
        it('should be able to setStyle', function(expect) {
            var el = new dom.Element('div');
            el.setStyle('display', 'none');

            expect(el.getStyle('display')).toBe('none');
        });

        it('should accept styles in the constructor', function(expect) {
            var el = new dom.Element('div', {
                styles: {
                    display: 'inline',
                    color: 'red'
                }
            });

            expect(el.getStyle('color')).toBe('red');
        });

        it('should be able to set position styles', function(expect) {
            var el = new dom.Element('div');
            el.setStyle('left', 10);

            expect(el.getStyle('left')).toBe('10px');
        });

        it('should set numeric styles with strings', function(expect) {
            var el = new dom.Element('div');
            el.setStyle('z-index', 100);

            expect(el.getStyle('z-index')).toBe('100');

            el.setStyle('z-index', '200');
            expect(el.getStyle('z-index')).toBe('200');
        });

        it('should set opacity', function(expect) {
            var el = new dom.Element('div');
            el.setStyle('opacity', 0.5);

            expect(el.getStyle('opacity')).toBe(0.5);
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

			el.dispose();
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

        it('should be removable via dispose', function(expect) {
            var id = string.uniqueID();
            dom.document.body.grab(new dom.Element('div', { id: id }));

            var el = dom.$(id);
            expect(el).toBeTruthy();

            el.dispose();
            el = dom.$(id);
            expect(el).toBeFalsy();
        })

	},
	
	'$$': function(it, setup) {
		
		setup('beforeEach', function() {
			dom.document.body.empty();
		});

		it('should return Elements', function(expect) {
			var els = dom.$$('body');
			expect(els).toBeAnInstanceOf(dom.Elements);
			expect(els.length).toBe(1);
		});

        it('should have methods from Element', function(expect) {
            var num = 3,
                className = string.uniqueID();
            for (var i = 0; i < num; i++) {
                dom.document.body.grab(new dom.Element('div', { 'class': className }));
            }

            var els = dom.$$('.'+className);
            expect(els.length).toBe(num);

            els.dispose();

            expect(dom.$$('.'+className).length).toBe(0);
        });

		it('should accept multiple arguments', function(expect) {
			dom.document.body.appendChild(new dom.Element('div'));
			dom.document.body.appendChild(new dom.Element('p'));

			expect(dom.$$('div', 'p').length).toBe(2);
		});

		it('should accept an array as an argument', function(expect) {
			dom.document.body.appendChild(new dom.Element('div'));
			dom.document.body.appendChild(new dom.Element('p'));

			expect(dom.$$(['div', 'p']).length).toBe(2);
		});

		it('should accept an Elements object as an argument', function(expect) {
			dom.document.body.appendChild(new dom.Element('div'));
			dom.document.body.appendChild(new dom.Element('p'));
			dom.document.body.appendChild(new dom.Element('h1'));

			var els = dom.$$('div', 'p');

			expect(dom.$$(els, 'h1').length).toBe(3);
		});

	}

};
