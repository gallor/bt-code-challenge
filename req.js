var validator = require('express-validator')();

exports.stubForValidation = function(done) {
	var req = {
		query: {},
		body: {},
		params: {},
		param: function(name) {
			return this.params[name];
		}
	};
	return validator(req, {}, function() {
		return done(req);
	}); 
};
