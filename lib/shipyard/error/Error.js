function ShipyardError(msg) {
    this.name = 'ShipyardError';
    this.message = msg;
    try {
        throw new Error;
    } catch(ex) {
        this.stack = ex.stack;
    }
}

ShipyardError.prototype = new Error;
ShipyardError.prototype.constructor = ShipyardError;

module.exports = ShipyardError;
