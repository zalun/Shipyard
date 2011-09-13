var ShipyardError = require('./Error');

module.exports = function assert(expression/*, ...message*/) {
    if (!expression) {
        var args = Array.prototype.slice.call(arguments, 1);
        var message = args.join();
        throw new ShipyardError(message);
    }
}
