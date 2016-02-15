var app = require("../app");
var request = require("supertest");
var stubReq = require("../req").stubForValidation;
var stubForValidation = require("../stubForValidation");

describe("Server Test Suite", function() {
	describe("GET /", function() {
		it("Returns Status Code 200", function(done) {
			request(app)
			.get('/')
			.expect(200,done);
		});

	});

	describe("Validation Codes for Form", function() {

		beforeEach(function(done) {
			return stubReq(function(r) {
				req = r;
                return done();
			});
		});

		it("Should return 400 with empty req", function(done) {
			req = {};
			request(app)
			.post('/application')
			.send(req)
			.expect(400, done);
		});

		it("Should return 201 with successful post", function(done) {
			request(app)
			.post('/application')
			.send({
                "first-name":"grant",
                "last-name":"allor",
                "address":"111 main",
                "email":"foo@bar.com",
                "email-confirmation":"foo@bar.com",
                "ssn":"123123123"
            })
			.expect(201)
			.end(function(err) {
				if(err) return done(err);
				done();
			});
		});
	});
});
