var shipyard = 'shipyard',
	counter = (new Date()).getTime();
exports.uniqueID = function() {
	return shipyard + '-' + counter++;
};
