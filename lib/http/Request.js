var Class = require('../class'),
	Events = require('../class/Events'),
	Options = require('../class/Options'),
	dom = require('../dom'),
	object = require('../utils/object');

var XHR;
function setXHR(xhr) {
	XHR = xhr;
}
setXHR(dom.window.get('XMLHttpRequest'));

var FormData = dom.window.get('FormData');

var Request = module.exports = exports = new Class({

	Implements: [Events, Options],

	options: {
		url: '',
		data: {},
		async: true,
		method: 'POST',
	},

	initialize: function initialize(options) {
		this.xhr = new XHR();
		this.setOptions(options);
	},

	send: function send(extraData) {
		if (this.running) return this;
		this.running = true;

		var url = this.getOption('url'),
			data = this.prepareData(extraData),
			method = this.getOption('method').toUpperCase(),
			headers = this.getOption('headers'),
			async = this.getOption('async');

		if (method == 'GET') {
			url += (~url.indexOf('?')) ? '&'+data : '?'+data;	
			data = null;
		}
		var xhr = this.xhr;
		xhr.open(method, url, async);
		xhr.onreadystatechange = this.onStateChange.bind(this);
		object.forEach(headers, function(value, key) {
			xhr.setRequestHeader(key, value);
		}, this);

		this.fireEvent('request');
		xhr.send(data);
		if (!async) this.onStateChage();

		return this;
	},

	cancel: function cancel() {
		if (!this.running) return this;
		this.running = false;
		this.xhr.abort();
		this.xhr = new XHR();
		this.fireEvent('cancel');
		return this;
	},

	isRunning: function isRunning() {
		return this.running;
	},

	prepareData: function(extra) {
		var obj = object.merge({}, this.getOption('data'), extra),
			method = this.getOption('method').toUpperCase();

		if (this.getOption('emulation') && ~['GET', 'POST'].indexOf(method)) {
			obj['_method'] = method;
			this.setOption('method', 'POST');
		}

		var data;
		if (method != 'GET' && FormData) {
			data = new FormData();
			object.forEach(obj, function(val, key) {
				data.append(key, val);
			});
		} else {
			data = object.toQueryString(obj);
		}

		return data
	},

	isSuccess: function isSuccess() {
		return (this.status >= 200) && (this.status < 300);
	},

	onStateChange: function onStateChange() {
		if (this.xhr.readyState != XHR.DONE || !this.running) return;
		this.running = false;
		this.status = 0;

		try {
			this.status = this.xhr.status;
		} catch(dontCare) {}

		if (this.isSuccess()) {
			this.response = {
				text: this.xhr.responseText, 
				xml: this.xhr.responseXML
			};
			this.fireEvent('success', this.response.text, this.response.xml);
		} else {
			this.response = { text: null, xml: null };
			this.fireEvent('failure', this.response.text, this.response.xml);
		}
		this.fireEvent('complete', this.response.text, this.response.xml);
	}

});

// expose setXHR to allow tests to inject a Mock XHR
exports.setXHR = setXHR;
