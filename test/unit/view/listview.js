var ListView = require('../../../lib/shipyard/view/ListView');

module.exports = {
	
	'ListView': function(it, setup) {
		it('should know when its empty', function(expect) {
			var v = new ListView();
			expect(v.isEmpty()).toBe(true);

            v.addItem('test');
			expect(v.isEmpty()).toBe(false);
		});
	}

};
