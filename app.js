
/**
 * Module dependencies.
 */

var express = require('express');
var ArticleProvider = require('./warbleprovider-mongodb').WarbleProvider;


var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
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

app.me= "Chuck Knight";

// Routes

var warbleProvider= new WarbleProvider('localhost', 27017);

app.get('/', function(req, res){
    warbleProvider.findAll( function(error,docs){
        res.render('index.jade', { locals: {
            title: 'Warble',
            warbles:docs
            }
        });
    })
});

app.get('/Warble/new', function(req, res) {
    res.render('warble_new.jade', { locals: {
        title: 'New Warble'
    }
    });
});

app.post('/Warble/new', function(req, res){
    warbleProvider.save({
        creator: req.param('creator'),
        body: req.param('body')
    }, function( error, docs) {
        res.redirect('/')
    });
});

app.get('/Warble/delete/:id', function(req, res) {
    warbleProvider.removeById(req.params.id, function(error, warble) {
        res.redirect('/')
    });
});

app.get('/Warble/:id', function(req, res) {
    warbleProvider.findById(req.params.id, function(error, warble) {
        res.render('warble_show.jade',
        { locals: {
            creator: warble.creator,
            warble:warble
        }
        });
    });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
