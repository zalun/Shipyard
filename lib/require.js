(function(){

var XHR = function(){
	try { return new XMLHttpRequest(); } catch(e){}
	try { return new ActiveXObject('MSXML2.XMLHTTP'); } catch(e){}
	try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e){}
};

var extMatch = /\.js$/
var load = function(path){
	var result = false;
	if (!extMatch.test(path)) path = path + '.js';
	var xhr = XHR();
	xhr.open('GET', path + '?d=' + +new Date(), false);
	xhr.send(null);
	if (xhr.status >= 200 && xhr.status < 300) result = xhr.responseText;
	return result;
};

var compile = function(module, contents) {
	module.exports = {};
	var fn = new Function('exports, require, module, __filename, __dirname', contents)
	fn.call(window, module.exports, function(path) {
		return require(path, module.dirname);
	}, module, module.filename, module.dirname);
};

var normalize = function(path, base){
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

var dirname = function(filename) {
    var parts = filename.split('/');
    parts.pop(); //bye filename
    return parts.join('/');
}

var modules = {};

var require = function req(id, path){
	if (path) require.paths.unshift(path);
	var contents = false, base = '', module;
	for (var i = 0, y = require.paths.length; (i < y); i++) {
		base = normalize(id, require.paths[i]);
		module = modules[base];
		if(module)  break;
		contents = load(base);
        if (!contents) {
            base += '/index.js';
            contents = load(base);
        }
		if (contents !== false){
			module = { filename: base, dirname: dirname(base) };
			compile(module, contents);
            modules[base.replace('/index.js', '')] = module;
			break;
		}
	}
	if (!module) throw new Error('Cannot find module "' + id + '"');
	if (path) require.paths.shift();
	return module.exports;
};

require.paths = [window.location.pathname];

window.require = require;

})();
