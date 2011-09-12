var Class = require('../class/Class'),
	View = require('./View');

module.exports = new Class({

	Extends: View,

	options: {
		tag: 'input'
	},

    attributes: {
        type: 'text',
        placeholder: null,
        name: null,
        value: null
    },

    events: {
        onElementCreated: function onElementCreated(el) {
            var view = this;
            el.addEvent('blur', function onChange(e) {
                view.set('value', el.get('value'));
            });
        }
    }

});
