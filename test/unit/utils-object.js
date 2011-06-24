var object = require('../../lib/utils/object');

module.exports = {
	
	'merge': function(it, setup) {
		
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
		})
	},
	
	'clone': function(it, setup) {
		it('should recursively clone and dereference arrays and objects', function(expect){
			var a = {a:[1,2,3, [1,2,3, {a: [1,2,3]}]]};
			var b = object.clone(a);
			expect(a === b).toBeFalsy();
			expect(a.a[3] === b.a[3]).toBeFalsy();
			expect(a.a[3][3] === b.a[3][3]).toBeFalsy();
			expect(a.a[3][3].a === b.a[3][3].a).toBeFalsy();
	
			expect(a).toBeLike(b);
		});
	}
	
};