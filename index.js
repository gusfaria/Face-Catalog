var express = require('express');
var app  = express();
var http = require('http');
var fs = require('fs');
var connect = require('connect');
var Spacebrew = require('./public/js/spacebrew.js').Spacebrew;

var server = app.listen(8080);
var io = require('socket.io').listen(server);

var sb = new Spacebrew.Client();
io.set('log level', 2);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());
app.use(app.router);
app.use('/public', express.static(__dirname + '/public'));

var imgArray = [];

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

  io.sockets.on('connection', function(socket) {
    console.log('socket connected!');
    connectedSocket = socket;
    ConnectSpacebrew();
  });

});

function parseDataURL(body) {
  var match = /data:([^;]+);base64,(.*)/.exec(body);
  if(!match)
    return null;

  return {
    contentType: match[1],
    data: new Buffer(match[2], 'base64')
  };
}

app.post("/uploadImage", function(req, res, next){

    var data= parseDataURL(req.body.image);
    var random_id = "0000" + Math.floor(Math.random() * 10000);
  	fs.writeFile("public/loaded_imgs/test"+ random_id +".png", data.data, function(err) {
  		console.log("error", err);
  	});
});


function onStringMessage(name, value) {
  console.log("Receiving Spacebrew string message");
  console.log("Value is ", value);
  connectedSocket.emit('from spacebrew with love', value);
  console.log('sent value via websockets to browser');
};

function ConnectSpacebrew() {
  console.log('Connect Spacebrew!');
  sb.name("Face catalog");
  sb.description("This app ..."); // set the app description

  // create the spacebrew subscription channels
  sb.addPublish("coin", "boolean", "true");  // create the publication feed
  sb.addSubscribe("coin", "boolean");    // create the subscription feed

  sb.onStringMessage = onStringMessage;
  sb.onOpen = function () { console.log("Spacebrew is open") };
  sb.connect();  
}; 



