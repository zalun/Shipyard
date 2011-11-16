var Transition = require('./Transition');

module.exports = new Transition(function(p) {
    return 1 - Math.cos(p * Math.PI / 2);
});
