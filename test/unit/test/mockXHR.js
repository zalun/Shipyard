var mockXHR = require('../../../lib/shipyard/test/mockXHR'),
    Request = require('../../../lib/shipyard/http/Request');

module.exports = {
    'mockXHR': function(it, setup) {
        it('should mock the next request', function(expect) {
            mockXHR('ok');
            new Request({
                onComplete: function(text) {
                    expect(text).toBe('ok');
                }
            }).send();
        });

        it('should keep order of mocks', function(expect) {
            mockXHR('one');
            mockXHR('two');

            new Request({
                onComplete: function(text) {
                    expect(text).toBe('one');
                }
            }).send();

            new Request({
                onComplete: function(text) {
                    expect(text).toBe('two');
                }
            }).send();
        });

        it('should be able to mock statuses', function(expect) {
            mockXHR('error', 500);
            var r = new Request({
                onFailure: function(text) {
                    expect(this.status).toBe(500);
                    expect(text).toBe('error');
                }
            });
            
            r.send();
        });

        it('should accept a handler', function(expect) {
            mockXHR(function(data) {
                expect(data.a).toBe('moo');
                return 'derp';
            });

            new Request({
                data: { a: 'moo' },
                onComplete: function(text) {
                    expect(text).toBe('derp');
                }
            }).send();
        });
    }
};
