var Transition = require('./Transition');

module.exports = new Transition(function(p) {
    return 1 - Math.sin(Math.acos(p));
});
