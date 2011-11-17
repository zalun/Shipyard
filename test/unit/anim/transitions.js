var transitions = require('../../../lib/shipyard/anim/transitions'),
    Timer = require('../../../lib/shipyard/anim/Timer'),
    timer = require('../../../lib/shipyard/test/timer'),
    Spy = require('../../testigo/lib/spy').Spy;

function transitionSuite(name, trans) {
     exports[name] = function(it, setup) {
        var clock;
        setup('beforeEach', function() {
            clock = timer.useFakeTimers();
        });

        setup('afterEach', function() {
            clock.restore();
        });

        it('should finish a Timer', function(expect) {
            var onStart = new Spy(),
                onComplete = new Spy();

            var t = new Timer({
                transition: trans.easeIn,
                onStart: onStart,
                onComplete: onComplete
            });

            expect(onStart.getCallCount()).toBe(0);

            t.start(0, 10);
            clock.tick(100);

            expect(onStart.getCallCount()).toBe(1);
            expect(onComplete.getCallCount()).toBe(0);

            clock.tick(600);

            expect(onComplete.getCallCount()).toBe(1);
        });
    };
}


for (var name in transitions) {
    transitionSuite(name, transitions[name]);
}
