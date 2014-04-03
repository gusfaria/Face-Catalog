var db;
module.exports = {
  init:function(){
    var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;
    
    MongoClient.connect('mongodb://127.0.0.1:27017/facecatalog', function(err, _db) {
    if(err) throw err;
       db = _db;
    
    });
  },
  insert:function(data, callback){
    var collection = db.collection('user');
    collection.insert(data, function(err, docs) {
      if(!err) callback(true);
    });
  },
  getUser:function(uuid, callback){
    var collection = db.collection('user');
    console.log("UUID", uuid);
    collection.findOne({uuid:uuid}, callback);
    
  }

}