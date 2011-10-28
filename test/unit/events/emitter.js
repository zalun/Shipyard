var Emitter = require('../../../lib/shipyard/events/Emitter'),
    Spy = require('../../testigo/lib/spy').Spy;

module.exports = {
    'Emitter': function(it, setup) {
        var E;
        setup('beforeEach', function() {
            E = new Emitter;
        });

        it('should be able to add listeners', function(expect) {
            var fn = new Spy;
            E.addListener(fn);

            E.emit();
            expect(fn.getCallCount()).toBe(1);
        });
    }
}
