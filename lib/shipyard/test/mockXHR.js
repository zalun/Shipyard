var Request = require('../http/Request'),
    typeOf = require('../utils/type').typeOf,
    string = require('../utils/string'),
    Spy = require('./Spy');

var oldXHR = new Request().xhr.constructor;

var xhrStack = [];

function fifoXHR(method, url, async) {
    var xhr = xhrStack.shift() || oldXHR;
    return new xhr(method, url, async);
}
fifoXHR.DONE = 4;

Request.setXHR(fifoXHR);

module.exports = function mockXHR(response, status) {
    var handler;
    if (typeOf(response) === 'function') {
        handler = response;
        response = '';
    }
    if (typeOf(response) !== 'string') {
        response = JSON.stringify(response);
    }
    
    function XHR() {}
    XHR.prototype = {
        open: new Spy(),
        send: new Spy(function(data) {
            if (handler) {
                if (typeOf(data) === 'string') {
                    data = string.parseQueryString(data);
                }
                this.responseText = handler.call(this, data);
            }
            this.onreadystatechange();
        }),
        abort: new Spy(),
        readyState: 4,
        status: status || 200,
        responseText: response,
        setRequestHeader: new Spy()
    };
    XHR.DONE=4;

    xhrStack.push(XHR);
};
