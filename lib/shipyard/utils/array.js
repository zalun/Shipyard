var typeOf = require('./type').typeOf;

var slice = Array.prototype.slice;

exports.from = function(item) {
    var type = typeOf(item);
    if (item != null && item.length && type !== 'function' && type !== 'string') {
        if (type === 'array') {
            return item;
        } else {
            return slice.call(item);
        }
    } else {
        return [item];
    }
};
