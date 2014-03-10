var express = require('express');
var app  = express();
var fs = require('fs');


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());
app.use(app.router);
app.use('/public', express.static(__dirname + '/public'));

app.get("/", function(req, res){
	res.render("index");
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
  	fs.writeFile("test.png", data.data, function(err) {
  		console.log("error", err);
  	});

});
app.listen(8080);