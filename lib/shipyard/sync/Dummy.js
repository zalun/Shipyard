var Class = require('../class/Class'),
    Sync = require('./Sync');

var FUNCTION = 'function';

module.exports = new Class({
    
    create: function create(data, callback) {
        if (typeof callback == FUNCTION) callback(data);
    },

    update: function update(id, data, callback) {
        if (typeof callback == FUNCTION) callback(data);
    },

    read: function read(params, callback) {
        if (typeof callback == FUNCTION) callback(rows);
    },

    destroy: function destroy(id, callback) {
        if (typeof callback == FUNCTION) callback(id);
    }

});
