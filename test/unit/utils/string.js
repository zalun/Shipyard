var string = require('../../../lib/shipyard/utils/string');

module.exports = {

    'string.uniqueID': function(it, setup) {
        it('should create a unique string', function(expect) {
            expect(string.uniqueID()).not.toBe(string.uniqueID());
        });
    },

    'string.capitalize': function(it, setup) {
        it('should capitalize the first letter', function(expect) {
            expect(string.capitalize('hello')).toBe('Hello');
        });
    },

    'string.camelCase': function(it, setup) {
        it('should camelcase dashified strings', function(expect) {
            expect(string.camelCase('ab-cd-ef')).toBe('abCdEf');
        });
    },

    'string.parseQueryString': function(it, setup) {
        it('should parse query strings', function(expect) {
            expect(string.parseQueryString('a=1&b=qwer')).toBeLike({
                a: '1',
                b: 'qwer'
            });
        });

        it('should parse complicated query strings', function(expect) {
            expect(string.parseQueryString('a[b][c]=3')).toBeLike({
                a: {
                    b: {
                        c: '3'
                    }
                }
            });
        });
    }

};
