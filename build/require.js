(function() {

function _define(module, deps, payload) {
	define.modules[module] = payload;
}

_define.modules = {};
if (window.define) {
	_define.original = window.define;
	_define.modules = _define.original.modules;
}
window.define = _define;


function require(module, callback) {
	var payload = lookup(module) || lookup(normalize(module, 'index'));
	if (!payload && require.original)
		return require.original.apply(window, arguments);
	
	if (callback) callback();

	return payload;
}

require.paths = [];
if (window.require) require.original = window.require;
window.require = require;

function lookup(id) {
	var payload = define.modules[id];
	if (!payload) return null;

	if (typeof payload === 'function') {
		var module = {
			exports: {},
			id: id
		}
		var relativeRequire = function(name) {
			if (name.charAt(0) == '.') name = normalize(dirname(id), name);
			return require.apply(window, arguments);
		};
		relativeRequire.paths = require.paths;
		payload(relativeRequire, module.exports, module);
		define.modules[id] = module;
		return module.exports;
	} else {
		return payload.exports || payload;
	}
}

function normalize(base, path){
	if (path[0] == '/') base = '';
	path = path.split('/').reverse();
	base = base.split('/');
	var last = base.pop();
	if (last && !(/\.[A-Za-z0-9_-]+$/).test(last)) base.push(last);
	var i = path.length;
	while (i--){
		var current = path[i];
		switch (current){
			case '.': break;
			case '..': base.pop(); break;
			default: base.push(current);
		}
	}
	return base.join('/');
};

function dirname(filename) {
    var parts = filename.split('/');
    parts.pop(); //bye filename
    return parts.join('/');
};

})();
