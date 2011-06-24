var typeOf = require('./type').typeOf;

exports.overloadSetter = function(fn) {
    return function(keyOrObj, value) {
        if (typeOf(keyOrObj) != 'string') {
            for (var key in keyOrObj) {
                fn.call(this, key, keyOrObj[key]);
            }
        } else {
            fn.call(this, keyOrObj, value);
        }
    };
};
