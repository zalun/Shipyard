var shipyard = 'shipyard',
	counter = (new Date()).getTime();

exports.uniqueID = function() {
	return shipyard + '-' + (counter++).toString(36);
};

exports.escapeRegExp = function escapeRegExp(str) {
    return String(str).replace(/([\-\.\*\+?\^\${}()|\[\]\/\\])/g, '\\$1');
};

var subRE = /\\?\{([^{}]+)\}/g;
exports.substitute = function substitute(str, obj, regexp) {
	return String(str).replace(regexp || subRE, function(match, name) {
		if (match.charAt(0) == '\\') return match.slice(1);
		if (obj[name] != null) {
			if (typeof obj[name] == 'function') return obj[name]();
			else return obj[name];
		} else {
			return '';
		}
	});
};
