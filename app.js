/////////////////////////////////////////////
// Servers needed:
//
// MongoDB - Our object database
//
//      mongodb/bin/mongod -dbpath data
// 
// Redis - Our session store
//
//      /usr/local/bin/redis-server
// 
// Node - Our web server
//
//      Node app.js
//
/////////////////////////////////////////////
// Module dependencies.
var express = require('express');
var WarbleProvider = require('./warbleprovider-mongodb').WarbleProvider;
var RedisStore = require('connect-redis')(express);

var app = module.exports = express.createServer();

/////////////////////////////////////////////
// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "keyboard cat", store: new RedisStore }));
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

/////////////////////////////////////////////
// Routes
var warbleProvider= new WarbleProvider('localhost', 27017);
var userProvider= new UserProvider('localhost', 27017);

// Handle a request to render the login page
app.get('/', function(req, res) {
    res.render('user_login.jade', { locals: {
        title: 'Login',
        userid: '',
        password: ''
    }
    });
});

// Handle the POST from the login page
app.post('/', function(req, res){
    userProvider.retrieveByUserId(req.param('userid'), function(error, user) {
        if (user != null)
        {
            // User found
            // TODO: validate password
            req.session.userid = req.param('userid');
            res.redirect('/Warble')
        }
        else
        {
            // Not valid, request retry
            res.render('user_login.jade', { locals: {
                title: 'Login failed, try again',
                userid: req.param('userid'),
                password: ''
            }
            });
        }
    });
});

// Handle a request to display current Warbles
app.get('/Warble', function(req, res){
    warbleProvider.retrieveAll( function(error,docs){
        res.render('index.jade', { locals: {
            title: 'Warble',
            warbles:docs
            }
        });
    })
});

// Handle a request to render the new Warble page
app.get('/Warble/new', function(req, res) {
    res.render('warble_new.jade', { locals: {
        title: 'New Warble',
        creator: req.session.userid
    }
    });
});

// Handle the POST of the new warble page
app.post('/Warble/new', function(req, res){
    warbleProvider.create({
        creator: req.session.userid,
        body: req.param('body')
    }, function( error, docs) {
        res.redirect('/Warble')
    });
});

// Handle REST delete requests
app.get('/Warble/delete/:id', function(req, res) {
    warbleProvider.delete(req.params.id, function(error, warble) {
        res.redirect('/Warble')
    });
});

// Handle a REST get request
app.get('/Warble/:id', function(req, res) {
    warbleProvider.retrieve(req.params.id, function(error, warble) {
        res.render('warble_show.jade',
        { locals: {
            creator: warble.creator,
            warble:warble
        }
        });
    });
});

/////////////////////////////////////////////
// Handle a request to render the new user page
app.get('/Warble/user/new', function(req, res) {
    res.render('user_new.jade', { locals: {
        title: 'New User'
    }
    });
});

// Handle the POST of a REST new user request
app.post('/Warble/user/new', function(req, res){
    // TODO: Validate that passwords match
    // TODO: Make sure userid chosen is unique
    userProvider.create({
        firstname: req.param('firstname'),
        lastname: req.param('lastname'),
        email: req.param('email'),
        userid: req.param('userid'),
        password: req.param('password')
    }, function( error, docs) {
        res.redirect('/Warble')
    });
});

// Handle a request to render the update user page
app.get('/Warble/user/update', function(req, res) {
    userProvider.retrieveByUserId(req.session.userid, function(error, user) {
        res.render('user_update.jade', { locals: {
            title: 'Update User',
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            userid: user.userid,
            password: user.password
        }
        });
    });
});

// Handle the POST of a REST new user request
app.post('/Warble/user/update', function(req, res){
    // TODO: Validate that passwords match
    userProvider.create({
        firstname: req.param('firstname'),
        lastname: req.param('lastname'),
        email: req.param('email'),
        userid: req.param('userid'),
        password: req.param('password')
    }, function( error, docs) {
        res.redirect('/Warble')
    });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
