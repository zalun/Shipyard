var sys = require('util'),
    print = sys.print;

var failures = [];
var failDivider = '\n====================================================\n';
var headerDivider = '\n----------------------------------------------------\n';

var callbacks = {

    before: function(){
        this.print('Starting Tests\n');
    },

    after: function(success, results){
        if (failures.length) {
            failures.forEach(function(fail) {
                var suite = fail.suite,
                    test = fail.test,
                    results = fail.results;

                this.setColor();
                this.print('\n');
                this.print(failDivider);
                this.print(suite + ': ' + test);
                this.print(headerDivider);
                for (var i = 0, y = results.results.length; i < y; i++){
                    var result = results.results[i];
                    if (result.passed) {
                        continue;
                    }
                    this.print(['     ', i + 1, ': '].join(''));
                    if (result.error){
                        this.print([
                            'Error thrown: "', result.error,'"\n'
                        ].join(''));
                        if (this.$stack) {
                            this.print('       --- Error Details ---\n');
                            this.print('         Name: ' + result.error.name + '\n');
                            if (result.error.stack) {
                                this.print('         Stack --- \n');
                                this.print('         ' + result.error.stack.split('\n').join('\n         ') + '\n');
                                this.print('         --------- \n');
                            } else if (result.error.fileName && result.error.lineNumber) {
                                this.print('         Message --- \n');
                                this.print(['         ', result.error.message, 'at', result.error.fileName, ':', result.error.lineNumber, '\n'].join(' '));
                                this.print('         --------- \n');
                            }
                            this.print('       ---------------------\n');
                        }
                    } else {
                        this.print('Expected ' + result.matcher + ' ');
                        this.setColor('yellow');
                        this.print(String(result.expected));
                        this.setColor();
                        this.print(', got ');
                        this.setColor('yellow');
                        this.print(String(result.received));
                        this.setColor();
                        this.print('\n');
                    }
                }
                this.print(failDivider);
            }, this);
        }
        this.print('\nTests Finished: ');
        if (success){
            this.setColor('green');
            this.print('Passed');
        } else {
            this.setColor('red');
            this.print('Failed');
        }
        this.setColor();
        this.print([
            ' (Passed: ', results.tests.passes, ', Failed: ', results.tests.failures, ')\n'
        ].join(''));
    },

    beforeSuite: function(suite, count){
    },

    suiteError: function(suite, count, error){
        this.setColor('red');
        this.print(' Cannot run tests because of error: \n');
        this.setColor();
        this.print(['    Error thrown: "', error,'"\n'].join(''));
        if (this.$stack) {
            this.print('       --- Error Details ---\n');
            this.print('         Name: ' + error.name + '\n');
            if (error.stack) {
                this.print('         Stack --- \n');
                this.print('         ' + error.stack.split('\n').join('\n         ') + '\n');
                this.print('         --------- \n');
            } else if (error.fileName && error.lineNumber) {
                this.print('         Message --- \n');
                this.print(['         ', error.message, 'at', error.fileName, ':', error.lineNumber, '\n'].join(' '));
                this.print('         --------- \n');
            }
            this.print('       ---------------------\n');
        }
        this.print(['End ', suite, ': '].join(''));
        this.setColor('red');
        this.print('Failed');
        this.setColor();
        this.print(' (Cannot run tests.)\n');
    },

    afterSuite: function(suite, success, results){
    },

    beforeTest: function(suite, test, count){
    },

    afterTest: function(suite, test, results){
        if (results.allPassed) {
            this.setColor();
            this.print('.');
        } else {
            this.setColor('red');
            this.print('F');
            failures.push({ suite: suite, test: test, results: results});
        }
    }
};

var CIRunner = module.exports = function(testigo, colors, stack) {
    this.$testigo = testigo;
    this.$buffer = [];
    this.$colors = colors;
    this.$stack = (stack !== undefined) ? stack : true;
    this.addCallbacks();
};


CIRunner.prototype = {
    setColor: function(color) {
        if (!this.$colors) {
            return this;
        }
        var colors = {
            black: '30',
            red: '31',
            green: '32',
            yellow: '33',
            blue: '34',
            magenta: '35',
            cyan: '36',
            white: '37'
        };
        if (color && colors[color]) {
            this.print("\u001B[" + colors[color] + "m");
        } else {
            this.print("\u001B[0m");
        }
        return this;

    },
    print: function(str) {
        this.$buffer.push(str);
        return this;
    },
    flush: function() {
        if (this.$buffer.length) {
            print(this.$buffer.join(''));
            this.$buffer = [];
        }
        return this;
    },
    addCallbacks: function() {
        var runner = this;
        for (var key in callbacks) {
            (function(type, fn){
                runner.$testigo.setCallback(type, function(){
                    var result = fn.apply(runner, Array.prototype.slice.call(arguments));
                    runner.flush();
                    return result;
                });
            })(key, callbacks[key]);
        }
    },
    run: function() {
        this.$testigo.run();
    }
};
