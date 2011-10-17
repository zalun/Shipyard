var Request = require('../http/Request'),
    typeOf = require('../utils/type').typeOf,
    Spy = require('./Spy');

var oldXHR = new Request().xhr.constructor;

var xhrStack = [];

function fifoXHR(method, url, async) {
    var xhr = xhrStack.shift() || oldXHR;
    return new xhr(method, url, async);
}

Request.setXHR(fifoXHR);

module.exports = function mockXHR(response, status) {
    if (typeOf(response) !== 'string') response = JSON.stringify(response);
    
    function XHR() {}
    XHR.prototype = {
        open: new Spy,
        send: new Spy(function() {
            this.onreadystatechange();
        }),
        abort: new Spy,
        readyState: 4,
        status: status || 200,
        responseText: response
    }
    XHR.DONE=4;

    xhrStack.push(XHR);
};
