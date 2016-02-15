module.exports = function(req) {
req.checkBody('first-name', 'First name is required').notEmpty();
    req.checkBody('last-name', 'Last name is required').notEmpty();
    req.checkBody({
        'address': {
            notEmpty: true,
            isNotPoBox: {
                errorMessage: 'Address Cannot Be a PO Box'
            },
            errorMessage: 'Address Required'
        },
        'ssn': {
            notEmpty: true,
            isLength: {
                options: [{min: 9, max: 9}],
                errorMessage: 'SSN Must Be 9 Digits Long'
            },
            isNotSameDigit: {
                errorMessage: 'SSN Cannot Be All The Same Number'
            },
            isNotBlackListSSN: {
                errorMessage: 'SSN Cannot Equal 123456789 or 9876543321'
            },
            errorMessage: 'SSN Required'
        },
        'email': {
            notEmpty: true,
            isEmail: {
                errorMessage: 'Invalid Email'
            },
            errorMessage: 'Email Required'
        },
        'email-confirmation': {
            notEmpty: true,
            isEmail: {
                errorMessage: 'Invalid Email'
            },
            equals: {
                options: [req.body.email],
                errorMessage: 'Emails do not match'
            },
            errorMessage: 'Email Confirmation Required'
        }
    });

    return !req.validationErrors() || req.validationErrors().length === 0;
};
