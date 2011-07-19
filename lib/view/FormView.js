var Class = require('../class'),
	Container = require('./Container');

module.exports = new Class({
	
	Extends: Container,

	options: {
		tag: 'form'
	},

	events: {
		onElementCreated: function onElementCreated(el) {
			var view = this;
			el.addEvent('submit', function onSubmit(e) {
				e.preventDefault();
				view.fireEvent('submit', view.serialize());
				this.reset();
			});
		}
	},

	serialize: function serialize() {
		return this.element.serialize();
	}

});
