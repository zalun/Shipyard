(function() {

function define(module, deps, payload) {
	define.modules[module] = payload;
}

define.modules = {};

if (window.define) define.original = window.define;
window.define = define;

function require(module, callback) {
	var payload = lookup(module);
	if (!payload && require.original)
		return require.original.apply(window, arguments);
	
	if (callback) callback();

	return payload;
}

if (window.require) require.original = require;
window.require = require;

function lookup(id) {
	var payload = define.modules[id];
	if (!module) return null;

	if (typeof payload === 'function') {
		var module = {
			exports: {},
			id: id
		}
		var relativeRequire = function(name) {
			if (name.charAt(0) == '.') name = normalize(id, name);
			return require.apply(window, arguments);
		}
		payload(relativeRequire, module.exports, module);
		return define.modules[id] = module.exports;
	}

	return payload;
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

})();
