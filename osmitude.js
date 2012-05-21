/*
 * Copyright 2012, Benjamin Knofe
 *
 * Some parts were stolen from the connect-auth example:
 * https://github.com/ciaranj/connect-auth/blob/master/examples/app.js
 */

var express = require('express')
   ,connect = require('connect')
   ,auth= require('connect-auth');

//load keys from extra file
try {
  var example_keys= require('./key_file.js');
  for(var key in example_keys) {
    global[key]= example_keys[key];
  }
}
catch(e) {
  console.log('Unable to locate the key_file.js file.');
  return;
}

//create express app
var app = express.createServer();

//app config
app.set('view engine', 'jade');
app.set('view options', {
  layout: false
});

//plug all middlewares in
app.use(connect.cookieParser('fsd54GD43gdG54Cdf9Olk'))
   .use(connect.session())
   .use(connect.bodyParser())
   .use(auth({strategies:
     [auth.Google2({appId : google2Id, appSecret: google2Secret, callback: google2CallbackAddress, scope: 'https://www.googleapis.com/auth/latitude.current.best'})],
     trace: true,
     logoutHandler: require('./node_modules/connect-auth/lib/events').redirectOnLogout("/")
   }));

//define actions in express style
app.get('/login', function(req, res) {
  req.authenticate(['google2'], function(error, authenticated) {
  if( error ) {
    // Something has gone awry, behave as you wish.
    console.log( error );
    res.end();
  } else {
    if( authenticated === undefined ) {
      // The authentication strategy requires some more browser interaction, suggest you do nothing here!
    }
    else {
      //no error and authenticated
      res.redirect('/');
    }
  }});
});

app.get('/logout', function(req, res, params) {
  req.logout(); // Using the 'event' model to do a redirect on logout.
});

app.get("/", function(req, res, params) {
  res.render('index', {isAuthenticated: req.isAuthenticated(), user: JSON.stringify( req.getAuthDetails().user)})
});

app.listen(3000);




















// var app = express.createServer();

// app.set('view engine', 'jade');
// app.set('view options', {
//   layout: false
// });


// // app.get('/', function(req, res){
// //     res.send('Hello World');
// // });

// app.get('/', function(req, res) {
//   res.render('index', {client_id: google2Id, isAuthenticated: req.isAuthenticated()});
// });

// app.use('/login', function(req, res, next) {
//   req.authenticate(['google2'], function(error, authenticated) {
//   if( error ) {
//     // Something has gone awry, behave as you wish.
//     console.log( error );
//     res.end();
//   }
//   else {
//     if( authenticated === undefined ) {
//     // The authentication strategy requires some more browser interaction, suggest you do nothing here!
//     }
//     else {
//     // We've either failed to authenticate, or succeeded (req.isAuthenticated() will confirm, as will the value of the received argument)
//     next();
//     }
//   }});
// });

// app.use('/logout', function(req, res, params) {
//      req.logout(); // Using the 'event' model to do a redirect on logout.
//    })

// // app.get('/oauth2callback', function(req, res) {
// //   logged_in = true;
// //   console.log(req.body);
// //   res.redirect('/');
// // });

// app.listen(3000);
