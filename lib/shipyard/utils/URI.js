var Class = require('shipyard/class/Class'),
    Options = require('shipyard/class/Options'),
    object = require('shipyard/utils/object'),
    string = require('shipyard/utils/string');

var URI = module.exports = new Class({

	Implements: Options,

	options: {
		/*base: false*/
	},

	regex: /^(?:(\w+):)?(?:\/\/(?:(?:([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)?(\.\.?$|(?:[^?#\/]*\/)*)([^?#]*)(?:\?([^#]*))?(?:#(.*))?/,
	parts: ['scheme', 'user', 'password', 'host', 'port', 'directory', 'file', 'query', 'fragment'],
	schemes: {http: 80, https: 443, ftp: 21, rtsp: 554, mms: 1755, file: 0},

	initialize: function(uri, options){
		this.setOptions(options);
		var base = this.options.base;

		if (uri && uri.parsed) {
            this.parsed = object.clone(uri.parsed);
        } else {
            this.set('value', uri.href || String(uri), base ? new URI(base) : false);
        }
	},

	parse: function(value, base){
		var bits = value.match(this.regex);
		if (!bits) {
            return false;
        }
		bits.shift();
        var obj = {};
        for (var i = 0; i < this.parts.length; i++) {
            obj[this.parts[i]] = bits[i];
        }
		return this.merge(obj, base);
	},

	merge: function(bits, base){
		if ((!bits || !bits.scheme) && (!base || !base.scheme)) {
            return false;
        }
		if (base){
			this.parts.every(function(part){
				if (bits[part]) {
                    return false;
                }
				bits[part] = base[part] || '';
				return true;
			});
		}
		bits.port = bits.port || this.schemes[bits.scheme.toLowerCase()];
		bits.directory = bits.directory ? this.parseDirectory(bits.directory, base ? base.directory : '') : '/';
		return bits;
	},

	parseDirectory: function(directory, baseDirectory){
		directory = (directory.substr(0, 1) === '/' ? '' : (baseDirectory || '/')) + directory;
		if (!URI.regs.directoryDot.test(directory)) {
            return directory;
        }
		var result = [];
		directory.replace(URI.regs.endSlash, '').split('/').forEach(function(dir){
			if (dir === '..' && result.length > 0) {
                result.pop();
            } else if (dir !== '.') {
                result.push(dir);
            }
		});
		return result.join('/') + '/';
	},

	combine: function(bits){
		return bits.value || bits.scheme + '://' +
			(bits.user ? bits.user + (bits.password ? ':' + bits.password : '') + '@' : '') +
			(bits.host || '') + (bits.port && bits.port !== this.schemes[bits.scheme] ? ':' + bits.port : '') +
			(bits.directory || '/') + (bits.file || '') +
			(bits.query ? '?' + bits.query : '') +
			(bits.fragment ? '#' + bits.fragment : '');
	},

	set: function(part, value, base){
		if (part === 'value'){
			var scheme = value.match(URI.regs.scheme);
			if (scheme) {
                scheme = scheme[1];
            }
			if (scheme && this.schemes[scheme.toLowerCase()] == null) {
                this.parsed = { scheme: scheme, value: value };
            } else { this.parsed = this.parse(value, (base || this).parsed) || (scheme ? { scheme: scheme, value: value } : { value: value });
            }
		} else if (part === 'data'){
			this.setData(value);
		} else {
			this.parsed[part] = value;
		}
		return this;
	},

	get: function(part, base){
		switch (part){
			case 'value': return this.combine(this.parsed, base ? base.parsed : false);
			case 'data' : return this.getData();
		}
		return this.parsed[part] || '';
	},

	getData: function(key, part){
		var qs = this.get(part || 'query');
		if (!(qs || qs === 0)) {
            return key ? null : {};
        }
		var obj = string.parseQueryString(qs);
		return key ? obj[key] : obj;
	},

	setData: function(values, merge, part){
		if (typeof values === 'string'){
			var data = this.getData();
			data[arguments[0]] = arguments[1];
			values = data;
		} else if (merge){
			values = object.merge(this.getData(), values);
		}
		return this.set(part || 'query', object.toQueryString(values));
	},

	clearData: function(part){
		return this.set(part || 'query', '');
	},

	toString: function() {
        return this.get('value');
    },

	valueOf: function() {
        return this.toString();
    }

});

URI.regs = {
	endSlash: /\/$/,
	scheme: /^(\w+):/,
	directoryDot: /\.\/|\.$/
};
