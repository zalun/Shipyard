var logger = (typeof console !== 'undefined') && console;
function log(level, args) {
    if (logger && logger[level]) {
        logger[level].apply(logger, args);
    }
}
function logger_apply(level) {
    return function() {
        log(level, arguments);
    };
}

module.exports = exports = logger_apply('log');

exports.setLogger = function setLogger(_logger) {
    logger = _logger;
};

exports.getLogger = function getLogger(name) {
    return exports;
};

exports.debug = exports.log = logger_apply('log');
exports.info = logger_apply('info');
exports.warn = exports.warning = logger_apply('warn');
exports.error = exports.critical = logger_apply('error');
