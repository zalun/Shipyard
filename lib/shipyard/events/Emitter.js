var Class = require('../class/Class'),
    Listener = require('./Listener');

module.exports = new Class({

    $listeners: [],

    addListener: function(callback) {
        return new Listener(this, callback).attach();
    },

    removeListener: function(callback) {
                    
    },

    emit: function() {
         this.$listeners.forEach(function(listener) {
            
         }); 
    }

});
