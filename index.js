var express = require('express');
var app  = express();
var fs = require('fs');
var uuid = require('node-uuid');
var request = require('request');
var parser = require('xml2json');
var database = require(__dirname +"/database");
console.log(database);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());
app.use(app.router);
app.use('/public', express.static(__dirname + '/public'));

var imgArray = [];
database.init();
app.get("/user/:uuid", function(req, res){
  
  database.getUser(req.params.uuid, function(err, data){
    if(!err){
      res.render('user', data);
    }else{
      res.end(err);
    }
  })
});
app.get("/", function(req, res){
  var path = 'public/loaded_imgs/';
  fs.readdir(path, function (err, files) {
    if(err) {
      console.log('error: '+err);
      throw err;
    }
    files.forEach(function(file) {
      var ext = file.substring(file.lastIndexOf('.')+1);
      if(ext === 'png'){
        imgArray.push(path+file);  
      }
    });
    res.render('index',{
      img: imgArray
    });
  });
});

function parseDataURL(body) {
  var match = /data:([^;]+);base64,(.*)/.exec(body);
  if(!match)
    return null;

  return {
    contentType: match[1],
    base64:match[2],
    data: new Buffer(match[2], 'base64')
  };
}

function getBetafaceapi(_uuid, imagePath, imageBase64, res){
  var api_key ="d45fd466-51e2-4701-8da8-04351c872236",
    api_secret =  "171e8465-f548-401d-b63b-caf0dc28df5f";

  var detectionFlags = 'cropface,recognition,propoints,classifiers,extended';
  var params = {
    url: 'http://www.betafaceapi.com/service.svc/UploadNewImage_File',
    json : {
      api_key:api_key,
      api_secret:api_secret,
      detection_flags: detectionFlags,
      original_filename: "t" + _uuid,
      imagefile_data: imageBase64
    }
  };
  
  var param2 = {
    url:"http://www.betafaceapi.com/service.svc/GetImageInfo",
    headers: {'Content-Type': 'application/json'},
    json:{api_key:api_key, api_secret:api_secret}
  }

  var getInfo = function(){
    setTimeout(function() {
      request.post(param2, function(_error, _response, _body){
            if (!_error && _response.statusCode == 200) {
              var json = parser.toJson(_body, {object:true});
              console.log(json.BetafaceImageInfoResponse.int_response);
              if(json.BetafaceImageInfoResponse.int_response === 1){
                console.log("Image in queue");
                return getInfo();
              }else {
                console.log("render metadata");
                if(json.BetafaceImageInfoResponse.faces && json.BetafaceImageInfoResponse.faces.FaceInfo 
                  && json.BetafaceImageInfoResponse.faces.FaceInfo.tags){
                  betaface = json.BetafaceImageInfoResponse.faces.FaceInfo;
                }
                database.insert({"uuid":_uuid, "imagePath":imagePath, betaface:betaface}, function(result){
                  res.end(JSON.stringify(json)); 
                });
                 
              }
              
            }else{
              res.end("error to obtain the information");
            }
        });
    },1000);
  };
  request.post(params, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var json = parser.toJson(body, {object: true});
      param2.json.img_uid = json["BetafaceImageResponse"]["img_uid"];
      getInfo();
    }else{
      console.log("ERROR", body);
      res.end(body);
      
    }
    
  });
}

app.post("/uploadImage", function(req, res, next){
    var data = parseDataURL(req.body.image);
    var _uuid = uuid.v1();
    var imageName  = _uuid + ".png";
    var imagePath = "public/loaded_imgs/"+imageName;
    
  	fs.writeFile(imagePath, data.data, function(err) {
  		getBetafaceapi(_uuid, imagePath, data.data, res);
  	});
});

app.listen(8080);