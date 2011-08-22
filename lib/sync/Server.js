var Class = require('../class'),
	Sync = require('./Sync'),
	Request = require('../http/Request'),
	object = require('../utils/object'),
	string = require('../utils/string');

module.exports = new Class({

	Extends: Sync,

	options: {
		emulation: false,
		route: '',
		// each method can overwrite the default options
		create: { fragment: '/' },
		update: { fragment: '/{id}'},
		read: { fragment: '/' },
		destroy: { fragment: '/{id}' }
	},

	create: function create(data, callback) {
		this._request({
			data: data,
			callback: callback,
			method: 'POST',
			url: this._url('create')
		});
	},

	update: function update(id, data, callback) {
		this._request({
			data: data,
			callback: callback,
			method: 'PUT',
			url: this._url('update', {id: id})
		});
	},

	read: function read(params, callback) {
		this._request({
			method: 'GET',
			url: this._url('read'),
			callback: callback,
			data: params
		});
	},

	destroy: function destroy(id, callback) {
		this._request({
			method: 'DELETE',
			url: this._url('destroy', {id: id}),
			callback: callback
		});
	},

	_url: function(name, params) {
		// this needs to be able to b')ld a url based on a number of
		// different options:
		// 1. Easiest should be to declare a standard base route, ie:
		//		route: '/api/0/tasks'
		// 2. Add a fragment based on the `name` provided, ie: 
		//		'update' => '/api/0/tasks/{id}'
		// 3. Optionally, each url for `name` could be completely
		//		different and described in `this.options`.
		var url,
			base = this.getOption('route'),
			opts = this.getOption(name);
		if (!opts) 
			throw new Error('No request options for Sync action "' + name + '"');

		if (opts.route) {
			// 3.
			url = opts.route;
		} else {
			// 1.
			url = (route + fragment);
		}

		return string.substitute(url, params);
	},

	_request: function(options) {
		var req = new Request({
			emulation: this.getOption('emulation'),
			url: options.url,
			method: options.method,
			data: options.data,
			onSuccess: function(text) {
				if (text && typeof options.callback == 'function') 
					options.callback(JSON.parse(text));
			}
		}).send();
	}

});
