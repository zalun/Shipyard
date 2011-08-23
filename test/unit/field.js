var Class = require('../../lib/shipyard/class'),
    fields = require('../../lib/shipyard/model/fields');
	Field = fields.Field,
    BooleanField = fields.BooleanField,
    DateField = fields.DateField,
    NumberField = fields.NumberField,
    TextField = fields.TextField;

module.exports = {
	'Field': function(it, setup) {
		
		it('should get default values', function(expect) {
			var field = new Field({ 'default': 'test' });

			expect(field.serialize()).toBe('test');
			expect(field.serialize('derp')).toBe('derp');
		
		});
		
	},

    'BooleanField': function(it, setup) {
        var field;
        setup('beforeEach', function() {
            field = new BooleanField;
        })
        
        it('should accept boolean values', function(expect) {
            expect(field.from(true)).toBe(true);
            expect(field.from(false)).toBe(false);
        
        });
        
        it('should convert 1 and 0 to boolean types', function(expect) {
            expect(field.from(0)).toBe(false);
            expect(field.from(1)).toBe(true);
        });

        it('should convert "true" and "false" strings', function(expect) {
            expect(field.from('true')).toBe(true);
            expect(field.from('false')).toBe(false);
        });

        it('should not convert null', function(expect) {
            expect(field.from(null)).toBe(null);
        });
    },

	'DateField': function(it, setup) {
        var field;
        setup('beforeEach', function() {
            field = new DateField;
        });
        
        it('should accept Date objects', function(expect) {
            var d = new Date();
            expect(field.from(d)).toBe(d);
        });

        it('should accept Unix timestamps', function(expect) {
            var d = new Date();
            // new Date's cant be ==, so test value is date, and same
            // getTime()
            var val = field.from(d.getTime());
            expect(val).toBeAnInstanceOf(Date);
            expect(val.getTime()).toBe(d.getTime());
        });

        it('should not convert null', function(expect) {
            expect(field.from(null)).toBe(null);
        });
	
	},

    'NumberField': function(it, setup) {
        var field;
        setup('beforeEach', function() {
            field = new NumberField;
        })
        
        it('should accept number values', function(expect) {
            expect(field.from(3)).toBe(3);
        });
        
        it('should parse numbers from strings', function(expect) {
            expect(field.from('21')).toBe(21);
            expect(field.from(' 12')).toBe(12);
        });

        it('should not convert null', function(expect) {
            expect(field.from(null)).toBe(null);
        });
    },

    'TextField': function(it, setup) {
        var field;
        setup('beforeEach', function() {
            field = new TextField;
        });
        
        it('should accept string values', function(expect) {
            expect(field.from('a test')).toBe('a test');
        });

        it('should convert numbers', function(expect) {
            expect(field.from(13)).toBe('13');
            expect(field.from(0)).toBe('0');
        });

        it('should convert booleans', function(expect) {
            expect(field.from(true)).toBe('true')
            expect(field.from(false)).toBe('false');
        });

        it('shouldn\'t convert null', function(expect) {
            expect(field.from(null)).toBe(null);
        });
    
    }
};
