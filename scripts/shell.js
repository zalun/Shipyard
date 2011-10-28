var shipyard = require('../'),
    path = require('path');

exports.shell = function shell(req) {

    var evalContext = {};

    for (p in global) {
        evalContext[p] = global[p];
    }

    evalContext.require = req || require;
    var syPath = path.join(shipyard.dirname, shipyard.directories.lib);
    require.paths.unshift(syPath);

    var Script = process.binding('evals').Script

    var stdin = process.openStdin();

    stdin.setEncoding('utf8');

    var shellWrite = function (data) {
        process.stdout.write(data);
    };

    var shellRead = function () {
        shellWrite('>>> ');
    };

    var shellProcess = function (data) {
        data = data.replace('\n', '');
        if (data == 'exit') {
            shellExit();
            process.exit(0);
        }
        
        
        
        var code = 'try { ' + data + ' } catch (ex) { console.log(ex.stack); }';
        try {
            var ret = Script.runInNewContext(code, evalContext, '<inode>');
            if (typeof ret !== 'undefined') console.log(ret);
        } catch (ex) {
            console.log(ex.stack);
        }
            
            
        shellRead();
        
    };

    var shellExit = function() {
        console.log('');
        console.log('Bye.');
    };

    var temp = [];

    stdin.on('data', function (data) {
        shellProcess(data);
    });

    stdin.on('end', function () {
        shellExit();
    });

    process.on('SIGINT', function () {
        console.log('');
        temp = [];
        shellRead();
    });

    shellWrite('Shipyard ' + shipyard.version +'\n');
    shellRead();
};

if (require.main == module)
    exports.shell();
