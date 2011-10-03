var fs = require('fs'),
    path = require('path'),
    ShipyardError = require('./lib/shipyard/error/Error');

function loadPackage(dir) {
    var package = path.join(dir, './package.json');
    if (!path.existsSync(package)) {
        throw new ShipyardError('Package.json does not exist: ' + package);
    }
    try {
        return JSON.parse(fs.readFileSync(package));
    } catch (ex) {
        throw new ShipyardError('Error parsing '+ package + '\n' + ex);
    }
}

var shipyard = loadPackage(__dirname);
shipyard.loadPackage = loadPackage;

module.exports = shipyard;
