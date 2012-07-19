var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

WarbleProvider = function(host, port) {
  this.db= new Db('node-mongo-warble', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

// Get a Warble collection
WarbleProvider.prototype.getCollection= function(callback) {
  this.db.collection('warbles', function(error, warble_collection) {
    if( error ) callback(error);
    else callback(null, warble_collection);
  });
};

// Find all Warbles
WarbleProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, warble_collection) {
      if( error ) callback(error)
      else {
        warble_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

// Find a Warble by Id
WarbleProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, warble_collection) {
      if( error ) callback(error)
      else {
        warble_collection.findOne({_id: warble_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

// delete a Warble by Id
WarbleProvider.prototype.removeById = function(id, callback) {
    this.getCollection(function(error, warble_collection) {
      if( error ) callback(error)
      else {
        warble_collection.remove({_id: warble_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

// Save a Warble
WarbleProvider.prototype.save = function(warbles, callback) {
    this.getCollection(function(error, warble_collection) {
      if( error ) callback(error)
      else {
        if( typeof(warbles.length)=="undefined")
          warbles = [warbles];

        for( var i =0;i< warbles.length;i++ ) {
          warble = warbles[i];
          warble.created_at = new Date();
        }

        warble_collection.insert(warbles, function() {
          callback(null, warbles);
        });
      }
    });
};

exports.WarbleProvider = WarbleProvider;
