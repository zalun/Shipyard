var ShipyardError = require('./Error');

module.exports = function assert(expression, message) {
    if (!expression)
        throw new ShipyardError(message);
}
