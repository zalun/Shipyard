var Class = require('../class'),
	View = require('./View'),
	object = require('../utils/object');

module.exports = new Class({

	Extends: View,

	childViews: [],

	options: {
		tag: 'div',
		templateName: 'container.ejs'
	},

	addView: function addView(child) {
		if (child == this) {
			throw new Error('Cannot add view to itself!');
		}
		
		if (child.parentView) {
			child.parentView.removeView(child);
		}
		
		this.childViews.push(child);
		child.parentView = this;
		this.fireEvent('childAdded', child);
		//child.fireEvent('')
	},

	removeView: function removeView(child) {
		var index = this.childViews.indexOf(child);
		if (~index) {
			this.childViews.splice(index, 1);
			child.parentView = null;
			this.fireEvent('childRemoved', child);
			//child.fireEvent('?')
		}
	},

	getRenderOptions: function getRenderOptions() {
		var views = this.childViews;
		return object.merge(this.parent(), {
			//views: this.childViews,
			children: function children() {
				return views.map(function(child) {
					return child.render();
				}, this).join('');
			}
		});
	}


});
