var Class = require('shipyard/class/Class'),
    Model = require('shipyard/model/Model'),
    fields = require('shipyard/model/fields');

module.exports = new Class({

    Extends: Model,

    fields: {
        name: fields.TextField()
    }

});
