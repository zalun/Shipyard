var View = require('../../../lib/shipyard/view/View'),
    Class = require('../../../lib/shipyard/class/Class');

module.exports = {
	
	'View': function(it, setup) {
		
        var MockView;
        setup('beforeEach', function() {
            MockView = new Class({
            
                Extends: View,

                attributes: {
                    'data-test': null
                }

            });
        })
        
        it('should be able to render', function(expect) {
			var v = new View({ data: 'test' });
			delete v.attributes.id;
            var el = v.toElement();
			expect(el.get('tag')).toBe('span');
            expect(el.get('text').trim()).toBe('test');
		});

        it('should be able to "set" attributes', function(expect) {
            var v = new MockView;
            v.set('data-test', 'hey "dude"');
            
            var el = v.toElement();
            expect(el.get('data-test')).toBe('hey "dude"');
        });

        it('should set attributes after rendered', function(expect) {
            var v = new MockView,
                el = v.toElement();
            
            v.set('data-test', 'derp');
            expect(el.get('data-test')).toBe('derp');
        });

	}

};
