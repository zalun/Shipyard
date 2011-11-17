function Transition(fn) {
    return {
        easeIn: function easeIn(pos) {
            return fn(pos);
        },

        easeOut: function(pos) {
            return 1 - fn(1 - pos);
        },

        easeInOut: function(pos) {
            return (pos <= 0.5 ? fn(2 * pos) : (2 - fn(2 * (1 - pos)))) / 2;
        }
    };
}

module.exports = Transition;
