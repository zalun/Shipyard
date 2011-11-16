var Transition = require('./Transition');

module.exports = new Transition(function(p) {
    return Math.pow(2, 8 * (p - 1));
});
