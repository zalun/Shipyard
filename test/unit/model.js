var Class = require('../../lib/shipyard/class'),
	Model = require('../../lib/shipyard/model/Model'),
	Field = require('../../lib/shipyard/model/fields/Field');

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

		it('should throw an Error if getting a non-existing field', function(expect) {
			var u = new this.User();

			var err;

			try {
				u.get('asdfasfd');
			} catch (ex) {
				err = ex;	
			}

			expect(err).toBeAnInstanceOf(Error);
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

		it('should be serializable to JSON', function(expect) {
			var obj = {
				username: 'Sean',
				password: 'derp'
			};
			var u = new this.User(obj);
			
			expect(JSON.stringify(u)).toBe(JSON.stringify(obj));
		});

		it('should fire a propertyChange event when data changes', function(expect) {
		
			var u = new this.User();

			var nameChange = false;

			u.addEvent('propertyChange', function(key, newVal, oldVal) {
				if (key == 'username') nameChange = true;
			});

			u.set('username', 'jenn');
			expect(nameChange).toBe(true);

		});
		
	}	
	
};
