var Transition = require('./Transition');

module.exports = new Transition(function(p) {
    var value;
    for (var a = 0, b = 1; 1; a += b, b /= 2) {
        if (p >= (7 - 4 * a) / 11) {
            value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
            break;
        }
    }
    return value;
});
