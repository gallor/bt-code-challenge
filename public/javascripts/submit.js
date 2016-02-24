"use strict";

// Global Variables
var isSubmitActive = true;
var form = document["credit-application"];
var data = {};



/* Message text factory for creating a message fragment then either inserting error,
 * removing error or inserting success
 */

// Message text factory to insert into DOM
var msgFactory = function(className, text, id) {
    var docFragment = document.createDocumentFragment();

    var errorEl = document.createElement('span');
    errorEl.className = className;
    errorEl.textContent = text;
    errorEl.id = id;
    docFragment.appendChild(errorEl);
    return [docFragment, errorEl];
};

// Inserting an error message to DOM
var insertErrorEl = function(el, errText) {
    var docFragment = msgFactory("form_error", errText, "error");

    el.appendChild(docFragment[0]);
    setTimeout(function() {
        docFragment[1].classList.add('active');
    }, 100);
};

// Removing error message from DOM
var removeEl = function(parentEl, childEl) {
    childEl.classList.remove('active');
    setTimeout(function() {
        parentEl.removeChild(childEl);
    }, 100);
};

// Inserting success message to DOM
var insertSuccessEl = function(el, successText, successId) {
    var docFragment = msgFactory("form_success", successText, successId);

    el.appendChild(docFragment[0]);
    setTimeout(function() {
        docFragment[1].classList.add('active');
    }, 100);
};


/* Validations
 * Suite of validation methods to be called when validating form input value
 */
var isNotEmpty = function(value) {
    return !!value === true;
};

var isEmail = function(value) {
    var regexMatch = value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    return !!regexMatch;
};

var doEmailsMatch = function(value1, value2) {
    return value1 === value2;
};

var isPoBox = function(value) {
    var pattern = new RegExp('\\b[p]*(ost)*\\.*\\s*[o|0]*(ffice)*\\.*\\s*b[o|0]x\\b', 'i');
    return !!value.match(pattern);
};

var isSSNBlackListed = function(value) {
    return value === "123456789" || value === "987654321";
};

var isSSNSameNumber = function(value) {
    if(Number.isInteger(value)) {
        value = value.toString();
    }
    var test = true;
    try {
        for(var i = 0; i < value.length - 1; i++) {
            if(value[i] !== value[i+1]) {
                test = false;
            }
        }
    } finally {
        return test;
    }
};

var isSSNNineDigits = function(value) {
    return value.length !== 9;
};



/* Live Validation
 * Validation occurs input field's blur events. This event allows capturing the input's
 * id to control what validations are used
 *
 * The validation switch statement validates the input and if fails either inserts an error
 * msg if not already there, or if there, removes it and replaces it with a new one if the
 * input fails again. This allows for multiple error messages for the same input field.
 *
 * If validation of the input field passes, the value is passed to the data object. If it
 * fails, the data is cleared to ensure no bad data is passed to the server.
 */

// Add Error Text on blur events
form.addEventListener("blur", function(event) {
    var parentEl = event.srcElement.parentElement,
        value = event.srcElement.value,
        id = event.srcElement.id,
        isErrorPresent = false,
        replaceErr = false,
        pristine = true,
        isValid = true,
        errText = null,
        inputEl = parentEl.getElementsByTagName('input')[0];


    // abort if bluring from the submit button
    if(value === "Submit") {
        return;
    }

    // check whether input existed before, and if so, had it been cleared due to an error
    var setPristine = function() {
        if( !!data[id] !== true && value === "" ) {
            pristine = false;
        }
    };

    // First see if input field is valid, if not set isValid to false and set error text to display
    switch (id) {
        case "first-name":
            if(!isNotEmpty(value)) {
                isValid = false;
                errText = "First name required";
            }
            break;
        case "last-name":
            if(!isNotEmpty(value)) {
                isValid = false;
                errText = "Last name required";
            }
            break;
        case "address":
            if(!isNotEmpty(value)) {
                isValid = false;
                errText = "Address required";
            } else if(isPoBox(value)) {
                isValid = false;
                errText = "Post Office Boxes invalid";
                replaceErr = true;
            }
            break;
        case "ssn":
            if(!isNotEmpty(value)) {
                isValid = false;
                errText = "Social Security Number required";
                setPristine();
            } else if(isSSNBlackListed(value)) {
                isValid = false;
                errText = "Invalid Social Security Number";
                replaceErr = true;
            } else if(isSSNSameNumber(value)) {
                isValid = false;
                errText = "Social Security Number cannot be all the same number";
                replaceErr = true;
            } else if(isSSNNineDigits(value)) {
                isValid = false;
                errText = "Social Security Number must be 9 digits long";
                replaceErr = true;
            }
            break;
        case "email":
            if(!isNotEmpty(value)) {
                isValid = false;
                errText = "Email address required";
                setPristine();
            } else if(!isEmail(value)) {
                isValid = false;
                errText = "Valid Email address required";
                replaceErr = true;
            }
            break;
        case "email-confirmation":
            if(!isNotEmpty(value)) {
                isValid = false;
                errText = "Confirmation Email address required";
                setPristine();
            } else if(!isEmail(value)) {
                isValid = false;
                errText = "Valid Email address required";
                replaceErr = true;
            } else if(!doEmailsMatch(data["email"], value)) {
                isValid = false;
                errText = "Emails must match";
                replaceErr = true;
            }
            break;
    }

    // Next check to see if error element is present
    if(parentEl.lastChild.id === "error") isErrorPresent = true;


    //if no error and fails validation, add error, and if value is set previously from data model, remove it
    if(!(isValid || isErrorPresent)) {
        inputEl.classList.add('error');
        insertErrorEl(parentEl, errText);
        data[id] = "";
        pristine = false;
    } else if(!isValid && isErrorPresent && (replaceErr || !pristine)) { // if error, new value, fails validation, remove old error, add new error, ensure data is clean
        removeEl(parentEl, parentEl.lastChild);
        insertErrorEl(parentEl, errText);
        data[id] = "";
    } else if(isValid && isErrorPresent) { //if error, passes validation, remove error add add key value to data model
        inputEl.classList.remove('error');
        removeEl(parentEl, parentEl.lastChild);
        data[id] = value;
    } else if(isValid && !isErrorPresent) { // if no error and passes validation, add to data model
        data[id] = value;
    }

}, true);



/* Form Submission
 * Form uses the default "submit" event but prevents default and instead uses the AJAX
 * XMLHttpRequest object to instantiate an asynchronous call to the server.
 *
 * Prevention of multiple form submissions while the ajax call is being made is handled by
 * isSubmitAction variable. If true, any other submit is aborted.
 *
 * Errors are returned and printed to the client console.
 * Success msg is created and appended the client form if request is successful.
 *
 * If form is modified after successful submission and is in error, success message is removed.
 */
form.addEventListener("submit", function(event){

    //stop regular form submission
    event.preventDefault();

    //prevent additional submits while promise is executing
    if(!isSubmitActive) return;
    isSubmitActive = false;

    // add submission date to data
    data["submitted-at"] = new Date();

    var request = new XMLHttpRequest();

    request.open(form.method, form.action);
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function() {
        if(request.readyState === 4 && request.status === 201) {
            console.log(JSON.parse(this.response)["msg"]);
            isSubmitActive = true;
            insertSuccessEl(form, JSON.parse(this.response)["msg"], "success");
        } else if(request.readyState === 4 && request.status === 400 && request.responseText !== "{}") {
            var response = JSON.parse(request.responseText);
            for(var i = 0; i < response.length; i++) {
                console.log(response[i]["msg"]);
            }
            insertErrorEl(form, "Error submitting form, please try again");
            isSubmitActive = true;
        } else if(request.readyState === 4 && request.status === 400 && request.responseText === "{}") {
            insertErrorEl(form, "Error submitting form, please try again");
            console.log("Error submitting form");
            isSubmitActive = true;
        }
    };

    request.send(JSON.stringify(data));

}, false);

/*
 * Quick event listener to remove any success or error messaging at the bottom of the form
 */
form.addEventListener("focus", function() {
    if(form.lastChild.id === "success" || form.lastChild.id === "error") {
        removeEl(form, form.lastChild);
    }
}, true);
