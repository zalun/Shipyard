var http = require('http'),
	fs = require('fs'),
	url = require('url'),
	path = require('path');

var object = require('../lib/utils/object');

var ROOT = path.join(__dirname, '../'),
	HEADERS = { 'Content-Type': 'text/plain' };

var server = http.createServer(function(req, res) {
	var uri = url.parse(req.url).pathname;
	if (!uri || uri[uri.length-1] == '/') {
		uri = path.join(uri, 'index.html');
	}

	var filename = path.join(ROOT, uri);
	path.exists(filename, function(exists) {
		if (exists) {
			fs.readFile(filename, 'binary', function(err, file) {
				if (err) {
					console.log("Error for file (%s): %s", file, err);
					res.writeHead(500, HEADERS);
					res.write(err + '\n');
					res.end();
					return
				}
				
				res.writeHead(200);
				res.write(file, 'binary');
				res.end();

			});
		} else {
			//404
			console.log("File not found: %s", filename);
			res.writeHead(404, HEADERS);
			res.write('404 Not Found\n');
			res.end();
		}
	});
});
server.listen(8000);
console.log('Server running at http://localhost:8000');
