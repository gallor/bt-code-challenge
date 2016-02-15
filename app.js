// dependencies
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var validator = require('express-validator');

var app = express();


// middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/stylesheets', express.static(__dirname + '/public/stylesheets'));
app.use('/js', express.static(__dirname + '/public/javascripts'));
app.use(validator({
	customValidators: {
		isNotSameDigit: function(input) {
			if(Number.isInteger(input)) {
				input = input.toString();
			}
			var test = true;
			try {
				for(var i = 0; i < input.length; i++) {
					if(input[i] === input[i+1]) {
						test = false;
					}
				}
			} finally {
				return test;
			}
		},

		isNotBlackListSSN: function(input) {
            if(input === "123456789") {
                return false;
            } else if(input === "987654321") {
                return false;
            } else {
                return true;
            }
		},

        isNotPoBox: function(input) {
            var pattern = new RegExp('\\b[p]*(ost)*\\.*\\s*[o|0]*(ffice)*\\.*\\s*b[o|0]x\\b', 'i');
            return !input.match(pattern);
        }
	}
}));

// Validation
app.post('/application', function(req, res) {
	req.checkBody("first-name", "First Name Required").notEmpty();
	req.checkBody("last-name", "Last Name Required").notEmpty();
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

	var errors = req.validationErrors();
	if (errors) {
		res.status(400).json(errors);
		return;
	}
	res.status(201).json({msg: 'The Form Passed Validation'});

});


app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/form.html');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res, next) {
	res.status(400).json(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
