var Class = require('./Class'),
    string = require('../utils/string');

var uid = '$store:' + string.uniqueID();

function storageOf(obj) {
    return obj[uid] || (obj[uid] = {});
}

module.exports = new Class({

    store: function store(key, value) {
        storageOf(this)[key] = value;
        return this;
    },

    retrieve: function(key, defaultval) {
        return storageOf(this)[key] || defaultval;
    },

    unstore: function unstore(key) {
        delete storageOf(this)[key];
        return this;
    }

});
