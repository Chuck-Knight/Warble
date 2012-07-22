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

// Create a Warble
WarbleProvider.prototype.create = function(warbles, callback) {
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

// Retrieve all Warbles
WarbleProvider.prototype.retrieveAll = function(callback) {
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

// Retrieve a Warble by Id
WarbleProvider.prototype.retrieve = function(id, callback) {
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

// Update a Warble
// mongodb detects the prior existence of the object and does an update
WarbleProvider.prototype.update = function(warbles, callback) {
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

// Delete a Warble by Id
WarbleProvider.prototype.delete = function(id, callback) {
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

exports.WarbleProvider = WarbleProvider;

/////////////////////////////////////////////
// Create user provider
UserProvider = function(host, port) {
  this.db= new Db('node-mongo-user', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

// Get a user collection
UserProvider.prototype.getCollection= function(callback) {
  this.db.collection('users', function(error, user_collection) {
    if( error ) callback(error);
    else callback(null, user_collection);
  });
};

// Create a user
UserProvider.prototype.create = function(users, callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
        if( typeof(users.length)=="undefined")
          users = [users];

        for( var i =0;i< users.length;i++ ) {
          user = users[i];
          user.created_at = new Date();
        }

        user_collection.insert(users, function() {
          callback(null, users);
        });
      }
    });
};

// Retrieve a user by Id
UserProvider.prototype.retrieve = function(id, callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
        user_collection.findOne({_id: user_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

// Retrieve a user by userid
UserProvider.prototype.retrieveByUserId = function(userId, callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
        user_collection.findOne({'userid': userId}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

// Update a user
// mongodb detects the prior existence of the object and does an update
UserProvider.prototype.update = function(users, callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
        if( typeof(users.length)=="undefined")
          users = [users];

        for( var i =0;i< users.length;i++ ) {
          user = users[i];
          user.created_at = new Date();
        }

        user_collection.insert(users, function() {
          callback(null, users);
        });
      }
    });
};

// Delete a user by Id
UserProvider.prototype.delete = function(id, callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
        user_collection.remove({_id: user_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

exports.UserProvider = UserProvider;