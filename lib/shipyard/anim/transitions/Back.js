var Transition = require('./Transition');

module.exports = new Transition(function(p) {
    var x = 1.618;
    return Math.pow(p, 2) * ((x + 1) * p - x);
});
