# Form Validation Coding Challenge 

The following files and folders constitute my submission for a coding challenge to
implement a form with live client side-validation and validating backend server that
returns 201 on successful submit and 400 on invalid submit:

- _spec/_ - Jasmine testing files for server
- _public/_ - public facing JS, HTML and CSS files served to the browser
- _bin/_ - Contains base www server 

Tools used for the code submission:

- _Jasmine_ - Testing
- _NodeJS_ - Base Server
- _Express_ - Server Framework
- _Compass_ - SCSS style compilation

### Installation

The app requires the global existance of node and npm. To install, extract zip file to
desired location and run the following from within the extracted folder

```sh
$ npm install
```

To start the server, run:

```sh
$ npm start
```

To test, run:

```sh
$ npm test
```

Once server is running please navigate to _localhost:3000_ on your browser to interact
with the form.