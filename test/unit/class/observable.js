var Observable = require('../../../lib/shipyard/class/Observable'),
    Spy = require('../../testigo/lib/spy').Spy;

module.exports = {
    'Observable': function(it, setup) {
        it('should be able to set and get properties', function(expect) {
            var o = new Observable;
            o.set('foo', 'bar');
            expect(o.get('foo')).toBe('bar');
        });

        it('should be able to take a hash to set data', function(expect) {
            var o = new Observable;
            o.set({ foo: 'bar', baz: 'bad' });
            expect(o.get('foo')).toBe('bar');
            expect(o.get('baz')).toBe('bad');
        });

        it('should fire a change event when data changes', function(expect) {
            var o = new Observable,
                spy = new Spy;
            o.addEvent('change', spy);
            o.set('bad', 'mad');
            o.set('bad', 'happy');
            o.set('bad', 'happy');

            expect(spy.getCallCount()).toBe(2);
            expect(spy.getLastArgs()).toBeLike(['bad', 'happy', 'mad']);
        });

        it('should be able to observe properties', function(expect) {
            var o = new Observable,
                spy = new Spy;
            o.observe('herp', spy);
            o.set('foo', 'bar');
            o.set('herp', 'derp');

            expect(spy.getCallCount()).toBe(1);
            expect(spy.getLastArgs()).toBeLike(['derp', undefined])
        });
    }
}
