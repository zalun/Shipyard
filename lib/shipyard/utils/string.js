var typeOf = require('./type').typeOf,

    shipyard = 'shipyard',
	counter = (new Date()).getTime();

exports.uniqueID = function() {
	return shipyard + '-' + (counter++).toString(36);
};

exports.capitalize = function(str) {
    str = String(str);
    var first = str.charAt(0);
    return first.toUpperCase() + str.substring(1);
};

exports.camelCase = function(str) {
    return String(str).replace(/-\D/g, function(match){
        return match.charAt(1).toUpperCase();
    });
};

exports.escapeRegExp = function escapeRegExp(str) {
    return String(str).replace(/([\-\.\*\+?\^\${}()|\[\]\/\\])/g, '\\$1');
};

exports.parseQueryString = function parseQuerystring(str) {
    var object_ = {};
    String(str).split('&').forEach(function(val) {
        var index = val.indexOf('=') + 1,
            value = index ? val.substr(index) : '',
            keys = index ? val.substr(0, index - 1).match(/([^\]\[]+|(\B)(?=\]))/g) : [val],
            obj = object_;

        if (!keys) {
            return;
        }
        value = decodeURIComponent(value);
        keys.forEach(function(key, i){
            key = decodeURIComponent(key);
            var current = obj[key];

            if (i < keys.length - 1) {
                obj = obj[key] = current || {};
            } else if (typeOf(current) === 'array') {
                current.push(value);
            } else {
                obj[key] = current != null ? [current, value] : value;
            }
        });
    });
    return object_;
};

var subRE = /\\?\{([^{}]+)\}/g;
exports.substitute = function substitute(str, obj, regexp) {
	return String(str).replace(regexp || subRE, function(match, name) {
		if (match.charAt(0) === '\\') {
            return match.slice(1);
        }
		if (obj[name] != null) {
			if (typeof obj[name] === 'function') {
                return obj[name]();
            } else {
                return obj[name];
            }
		} else {
			return '';
		}
	});
};
