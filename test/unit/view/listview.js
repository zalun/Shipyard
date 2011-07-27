var ListView = require('../../../lib/view/ListView');

module.exports = {
	
	'ListView': function(it, setup) {
		it('should know when its empty', function(expect) {
			var v = new ListView;
			expect(v.isEmpty()).toBe(true);

			var v2 = new ListView({ data: [1] });
			expect(v2.isEmpty()).toBe(false);
		});
	}

};
