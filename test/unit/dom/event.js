var Event = require('../../../lib/shipyard/dom/Event'),
    dom = require('../../../lib/shipyard/dom');

module.exports = {
    
    'Event': function(it, setup) {
        
        it('should set `key` on key events', function(expect) {
            var e = new Event({
                type: 'keypress',
                keyCode: 9
            }, dom.window.node);

            expect(e.key).toBe('tab');
        });

    }

};
