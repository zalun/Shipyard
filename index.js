var fs = require('fs'),
    path = require('path'),
    assert = require('./lib/shipyard/error/assert'),
    ShipyardError = require('./lib/shipyard/error/Error');

function loadPackage(dir) {
    var package = path.join(dir, './package.json');
    assert(path.existsSync(package), 'Package.json does not exist: ', package);
    try {
        return JSON.parse(fs.readFileSync(package));
    } catch (ex) {
        throw new ShipyardError('Error parsing '+ package + '\n' + ex);
    }
}

var shipyard = loadPackage(__dirname);
shipyard.loadPackage = loadPackage;

module.exports = shipyard;
