/*global process,__dirname,console*/
var fs = require('fs'),
	path = require('path'),
	assert = require('../lib/shipyard/error/assert'),
	string = require('../lib/shipyard/utils/string');

function formatName(name) {
	return name.trim().replace(/\s+/g, '-');
}

function modelName(name) {
	name = string.capitalize(string.camelCase(name));
	if (name[name.length -1] === 's') {
		name = name.substring(0, name.length - 1);
	}
	return name;
}

var model = exports.model = function(name, dir) {
	assert(name, 'generate.model requires a String argument `name`.');
	name = modelName(name);
	dir = path.join(dir || process.cwd, 'models');

	if (!path.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

	var modelTemplate = fs.readFileSync(path.join(__dirname, './generate/model.template'));
	var contents = string.substitute(modelTemplate, { name: name });
	fs.writeFileSync(path.join(dir, name+'.js'), contents);
};

var app = exports.app = function(name, dir) {
	assert(name, 'generate.app requires a String argument `name`.');
	name = formatName(name);
	dir = path.join(dir || process.cwd(), name);

	console.log('Creating app "%s"...', name);

	//1. Make directory
	console.log('Creating directory...');
	assert(!path.existsSync(dir), 'App directory already exists:', dir);
	fs.mkdirSync(name);

	//2. Make package.json
	console.log("Creating package.json...");
	var json_template = fs.readFileSync(path.join(__dirname, './generate/package.json.template'));
	var package_json = string.substitute(json_template, {
		name: name
	});
	fs.writeFileSync(path.join(dir, 'package.json'), package_json);
	
	//3. Make models/
	console.log('Creating models...');
	model(name, dir);


	//4. Make views/
	console.log('Creating views...');
	fs.mkdirSync(path.join(dir, 'views'));

	//5. Make tests/
	console.log('Creating tests...');
	fs.mkdirSync(path.join(dir, 'tests'));
	fs.mkdirSync(path.join(dir, 'tests', 'models'));
	var testTemplate = fs.readFileSync(path.join(__dirname, './generate/test.template'));
	var testContent = string.substitute(testTemplate, {
		model: modelName(name)
	});
	fs.writeFileSync(path.join(dir, 'tests', 'models', modelName(name)+'.js'), testContent);


	//6. Make index.html
	console.log('Creating index.js...');
	var htmlTemplate = fs.readFileSync(path.join(__dirname, './generate/html.template'));
	var htmlContent = string.substitute(htmlTemplate, {
		name: name
	});
	fs.writeFileSync(path.join(dir, 'index.html'), htmlContent);

	var indexTemplate = fs.readFileSync(path.join(__dirname('./generate/index.template')));
	var indexContent = string.substitute(indexTemplate, {
		model: modelName(name)
	});
	fs.writeFileSync(path.join(dir, 'index.js'), indexContent);


	console.log('Done.');
};

if (require.main === module) {
	app(process.argv[2]);
}
