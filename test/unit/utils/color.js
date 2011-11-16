var Color = require('../../../lib/shipyard/utils/Color');

module.exports = {

    'Color.initialize': function(it, setup) {

		it('Should initialize a color from a hex value', function(expect) {
			expect(new Color('#000').toString()).toEqual('rgb(0, 0, 0)');
		});

		it('Should initialize a color from a RGB array', function(expect) {
			expect(new Color([255,0,255]).toString()).toEqual('rgb(255, 0, 255)');
		});

	},

	'Color methods': function(it, setup) {

		it('Should define the rgb value for a color', function(expect) {
			expect(new Color('#ff00ff').toRGB()).toEqual('rgb(255, 0, 255)');
		});

		it('Should define the hsb value for a color', function(expect) {
			expect(new Color('#ff00ff').toHSB()).toEqual('hsb(300, 100, 100)');
		});

		it('Should define the hex value for a color', function(expect) {
			expect(new Color([255, 0, 255]).toHEX()).toEqual('#ff00ff');
		});

	}

};
