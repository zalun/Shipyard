var Binding = require('../../../lib/shipyard/class/Binding'),
    Observable = require('../../../lib/shipyard/class/Observable');

module.exports = {
    'Binding': function(it, setup) {
        it('should bind two Observables', function(expect) {
            var model = new Observable,
                view = new Observable;
            
            var b = new Binding(model, view, { name: 'id', age: 'content' });

            model.set('name', 'derp');
            expect(view.get('id')).toBe(model.get('name'));

            view.set('content', 3);
            expect(model.get('age')).toBe(view.get('content'));
        });

        it('should remove handlers when destroyed', function(expect) {
            var a = new Observable,
                b = new Observable;
            
            var binding = new Binding(a, b, { one: 'two' });

            binding.destroy();
            expect(binding.handlers.length).toBe(0);
            expect(binding.isDestroyed).toBe(true);

            expect(a.$events['change']).toBeLike([undefined]);
        });
    }
};
