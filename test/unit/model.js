var Class = require('../../lib/class'),
	model = require('../../lib/model'),
    Model = model.Model,
	Field = model.Field;

module.exports = {
	
	'Model': function(it, setup) {
		
        setup('before', function() {
            this.User = new Class({
                Extends: Model,
                fields: {
                    id: new Field({type: Number}),
                    username: new Field({type: String}),
                    password: new Field({type: String})
                }
            });
        
        })


		it('should be able to set and get data', function(expect) {
            var u = new this.User(),
                name = 'johndoe';
            u.set('username', name);
            expect(u.get('username')).toBe(name);
        
        });

        it('should be able to take a hash to set data', function(expect) {
            
            var u = new this.User(),
                props = {
                    username: 'johndoe',
                    password: 'pass1'
                };
            
            u.set(props);

            expect(u.get('username')).toBe('johndoe');
            expect(u.get('password')).toBe('pass1');

        });

        it('should accept data in constructor', function(expect) {
            var name = 'janedoe';

            var u = new this.User({
                username: name,
                password: 'derp'
            });

            expect(u.get('username')).toBe(name);

        });
		
	},
	
	'Field': function(it, setup) {
		
		it('should convert values to its type', function(expect) {
			var field = new Field({ type: String });
			
			expect(field.get('hello')).toBe('hello');
			expect(field.get(33)).toBe('33');
			
		});
		
	}
	
};
