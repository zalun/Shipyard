var object = require('../../../lib/shipyard/utils/object');

module.exports = {
    
    'object.merge': function(it, setup) {
        
        it('should merge any object inside the passed in object', function(expect) {
            
            var a = {a:1, b:2, c: {a:1, b:2, c:3}};
            var b = {c: {d:4}, d:4};
            var c = {a: 5, c: {a:5}};
            
            var merger = object.merge(a, b);

            expect(merger).toBeLike({a:1, b:2, c:{a:1, b:2, c:3, d:4}, d:4});
            expect(merger === a).toBeTruthy();
            
            expect(object.merge(a, b, c)).toBeLike({a:5, b:2, c:{a:5, b:2, c:3, d:4}, d:4});
        });
        
        it('should recursively clone sub objects and sub-arrays', function(expect){
            var a = {a:1, b:2, c: {a:1, b:2, c:3}, d: [1,2,3]};
            var b = {e: {a:1}, f: [1,2,3]};
    
            var merger = object.merge(a, b);
    
            expect(a.e === b.e).toBeFalsy();
            expect(a.f === b.f).toBeFalsy();
        });
    },
    
    'object.clone': function(it, setup) {
        it('should recursively clone and dereference arrays and objects', function(expect){
            var a = {a:[1,2,3, [1,2,3, {a: [1,2,3]}]]};
            var b = object.clone(a);
            expect(a === b).toBeFalsy();
            expect(a.a[3] === b.a[3]).toBeFalsy();
            expect(a.a[3][3] === b.a[3][3]).toBeFalsy();
            expect(a.a[3][3].a === b.a[3][3].a).toBeFalsy();
    
            expect(a).toBeLike(b);
        });
    },

    'object.forEach': function(it, setup) {
        it('should call the function for each item in the object', function(expect){
            var daysObj = {};
            object.forEach({
                first: "Sunday",
                second: "Monday",
                third: "Tuesday"}, function(value, key){
                daysObj[key] = value;
            });

            expect(daysObj).toBeLike({
                first: 'Sunday',
                second: 'Monday',
                third: 'Tuesday'
            });
        });

        it('should ignore the prototype chain', function(expect){
            var fn = function(){};
            fn.prototype = {a: 1};

            var obj = new fn();
            obj.b = 2;

            var items = {};
            object.forEach(obj, function(value, key){
                items[key] = value;
            });

            expect(items).toBeLike({b: 2});
        });
                
    },

    'object.some': function(it, setup) {
        it('should return true if one condition is true', function(expect) {
            var obj = { 'a': false, 'b': true, 'c': false };
            
            var ret = object.some(obj, function(val) {
                return val;
            });
            expect(ret).toBe(true);
        });

        it('should return false if no conditions are true', function(expect) {
            var obj = { a: false, b: false };
            var ret = object.some(obj, function(val) {
                return val;
            });
            expect(ret).toBe(false);
        });
    },

    'object.every': function(it, setup) {
        it('should return true if all conditions are true', function(expect){
            var obj = { a: true, b: true };
            var ret = object.every(obj, function(val) { return val; });
            expect(ret).toBe(true);
        });

        it('should return false if one condition is false', function(expect) {
            var obj = { a: true, b: false, c: true, d: true };
            var ret = object.every(obj, function(val) { return val; });
            expect(ret).toBe(false);
        });
    },

	'object.toQueryString': function(it, setup) {
		it('should return a query string', function(expect) {
			var myObject = {apple: "red", lemon: "yellow"};
			expect(object.toQueryString(myObject)).toEqual('apple=red&lemon=yellow');

			var myObject2 = {apple: ['red', 'yellow'], lemon: ['green', 'yellow']};
			expect(object.toQueryString(myObject2))
				.toEqual('apple[0]=red&apple[1]=yellow&lemon[0]=green&lemon[1]=yellow');

			var myObject3 = {fruits: {apple: ['red', 'yellow'], lemon: ['green', 'yellow']}};
			expect(object.toQueryString(myObject3))
				.toEqual('fruits[apple][0]=red&fruits[apple][1]=yellow&fruits[lemon][0]=green&fruits[lemon][1]=yellow');
		});
	}
    
};
