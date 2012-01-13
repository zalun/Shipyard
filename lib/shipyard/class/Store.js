var Class = require('./Class'),
    string = require('../utils/string');

var KEY = '$store:' + string.uniqueID();

var storage = {};

function storageOf(obj) {
    // Storage gets kept in a separate object away from `obj`, and only
    // referenced by setting the `KEY` property on the object. Using the
    // unique value saved in `KEY`, we look up the storage for this
    // object.
    var uid = obj[KEY] || (obj[KEY] = string.uniqueID());
    return storage[uid] || (storage[uid] = {});
}

module.exports = new Class({

    store: function store(key, value) {
        storageOf(this)[key] = value;
        return this;
    },

    retrieve: function(key, defaultval) {
		var store = storageOf(this);
        return (key in store) ? store[key] : defaultval;
    },

    unstore: function unstore(key) {
        delete storageOf(this)[key];
        return this;
    }

});
