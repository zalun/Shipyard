var Transition = require('./Transition');

module.exports = new Transition(function(p) {
    return Math.pow(2, 10 * --p) * Math.cos(20 * p * Math.PI / 3);
});
