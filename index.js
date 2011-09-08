var fs = require('fs'),
    path = require('path');

function loadPackage(dir) {
    return JSON.parse(fs.readFileSync(path.join(dir, './package.json')));
}

var shipyard = loadPackage(__dirname);
shipyard.loadPackage = loadPackage;

module.exports = shipyard;
