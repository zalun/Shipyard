var Class = require('../../class/Class');

module.exports = new Class({

    initialize: function Transition(fn) {
        this.transition = fn;
    },
    
    easeIn: function easeIn(pos) {
        return this.transition(pos);
    },

    easeOut: function(pos) {
        return 1 - this.transition(1 - pos);
    },

    easeInOut: function(pos) {
        return (pos <= 0.5 ? this.transition(2 * pos) : (2 - this.transition(2 * (1 - pos)))) / 2;
    }

});
