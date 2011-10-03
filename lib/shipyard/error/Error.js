function ShipyardError(msg) {
    this.name = 'ShipyardError';
    this.message = msg;
    this.stack = new Error().stack
}

ShipyardError.prototype = new Error;
ShipyardError.prototype.constructor = ShipyardError;

module.exports = ShipyardError;
