var express = require('express');
var http = require('http');
var fs = require('fs');

var app = express();
var server = app.listen(8080);
var io = require('socket.io').listen(server);

//configurations
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());
app.use(app.router);
app.use('/public', express.static(__dirname + '/public'));


var imgArray = [];
app.get("/", function(req, res){
	res.render("index");
  var path = 'loaded_imgs/';
  fs.readdir(path, function (err, files) {
    if(err) throw err;
    files.forEach(function(file) {
      imgArray.push(path+file);
      //DEBUG // console.log(path+file);
      // console.log('this is my array', imgArray);
    });
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
  	fs.writeFile("loaded_imgs/test"+ random_id +".png", data.data, function(err) {
  		console.log("error", err);
  	});
});

io.sockets.on('connection', function (socket) {
  socket.emit('filepaths', { imgPath: imgArray });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

