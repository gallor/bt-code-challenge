var app = require("../app");
var request = require("supertest");
var stubReq = require("../req").stubForValidation;
var stubForValidation = require("../stubForValidation");

describe("Each Form Field Validation", function() {

    beforeEach(function(done) {
        return stubReq(function(r) {
            req = r;
            return done();
        });
    });

    var data = {
        "first-name":"grant",
        "last-name":"allor",
        "address":"111 main",
        "email":"foo@bar.com",
        "email-confirmation":"foo@bar.com",
        "ssn":"123123123"
    };

    it("First Name Missing Should Return Error", function(done) {
        data["first-name"] = "";
        request(app)
            .post('/application')
            .send(data)
            .expect(400, done);
    });


    it("Last Name Missing Should Return Error", function(done) {
        data["last-name"] = "";
        request(app)
            .post('/application')
            .send(data)
            .expect(400, done);
    });

    it("Address Missing Should Return Error", function(done) {
        data["address"] = "";
        request(app)
            .post('/application')
            .send(data)
            .expect(400, done);
    });

    it("Po Box as Address Should Return Error", function(done) {
        data["address"] = "PO Box 123";
        request(app)
            .post('/application')
            .send(data)
            .expect(400, done);
    });

    it("Email Missing Should Return Error", function(done) {
        data["email"] = "";
        request(app)
            .post('/application')
            .send(data)
            .expect(400, done);
    });

    it("Email Confirmation Missing Should Return Error", function(done) {
        data["email-confirmation"] = "";
        request(app)
            .post('/application')
            .send(data)
            .expect(400, done);
    });

    it("SSN Missing Should Return Error", function(done) {
        data["ssn"] = "";
        request(app)
            .post('/application')
            .send(data)
            .expect(400, done);
    });

    it("Should Fail if Emails are Not in Email Format", function(done) {
        data["email"] = "foo";
        request(app)
            .post('/application')
            .send(data)
            .expect(400, done);
    });

    it("Should Fail if Emails Don't Match", function(done) {
        data["email"] = "foo@bar.com";
        data["email-confirmation"] = "bar@foo.com";
        request(app)
            .post('/application')
            .send(data)
            .expect(400, done);
    });

    it("Should fail if SSN is 111111111", function(done) {
        data["ssn"] = "111111111";
        request(app)
            .post('/application')
            .send(data)
            .expect(400, done);
    });

    it("Should fail if SSN is 123456789", function(done) {
        data["ssn"] = "123456789";
        request(app)
            .post('/application')
            .send(data)
            .expect(400, done);
    });

    it("Should fail if SSN is 987654321", function(done) {
        data["ssn"] = "987654321";
        request(app)
            .post('/application')
            .send(data)
            .expect(400, done);
    });

    it("Should fail if SSN is not 9 digits long", function(done) {
        data["ssn"] = "123";
        request(app)
            .post('/application')
            .send(data)
            .expect(400, done);
    });
});
