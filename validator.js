module.exports = function(req) {
	req.checkBody('first-name', 'First name is required').notEmpty();

	return !req.validationErrors() || req.validationErrors().length === 0;

};
