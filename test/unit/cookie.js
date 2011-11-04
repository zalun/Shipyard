var Cookie = require('../../lib/shipyard/utils/Cookie');

module.exports = {

    'Cookie': function(it, setup) {
        it('should be able to write cookies', function(expect) {
            var c = Cookie.write('test', 'hello');
            expect(c.read()).toBe('hello');
        });
    }

};
