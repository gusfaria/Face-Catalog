// allow camera 
// fix ajax error

var person = {},
    categoriesArr = [];

var user_firstName,
    user_lastName,
    fortune_msg;

var hasLinkedin,
    hasBetaface,
    hasFortune;

var canvasApp,
    webcamApp,
    ctracker,
    videoSelect,
    sourceVideo;
    

videoSelect = document.querySelector("select#videoSource");
navigator.getUserMedia = navigator.getUserMedia ||  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var tentativas = 0;
var saveImageInCanvas = function (canvas){
  var img = canvas.toDataURL();
	$.ajax({
    	url: 'https://localhost:8080/uploadImage',
    	type: 'post',
    	contentType: 'application/json',
    	data: JSON.stringify({image: img}),		
    	dataType: 'json',
    	success: function(response) {
            var faces = response.BetafaceImageInfoResponse.faces,
                tags;
            if(faces.hasOwnProperty('FaceInfo')) {
              tags = faces.FaceInfo.tags.TagInfo;  
              
              var sex;
              // if(tags[2].value === "male") sex = "men";
              // else if(tags[2].value === "female") sex = "women";
              sex = tags[2].value === "male" ? 'men' : 'women';

              person = {
                "age" : tags[0].value,
                "age_confidence" : tags[0].confidence,
                "gender" : tags[2].value,
                "gender_confidence" : tags[2].confidence,
                "sex" :  sex
              };

              hasBetaface = true;
              console.log('hasBetaface: ', hasBetaface); 

              checkData();

              return person;

            } else {
                saveImageInCanvas(canvas);
                tentativas ++;
                console.log('oh no.', tentativas);
                if(tentativas >= 5){
                  hasBetaface = true;
                  checkData();
                  return false;
                }
            }

    	}, error: function(request, error){ 
          console.log('ajax error: ', request, error);
      }
	});
  
  return person;

},

renderCanvas = function (webcam, canvas){
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, webcam.width, webcam.height);
	ctx.drawImage(webcam, 0, 0, webcam.width, webcam.height);
},

start_facePos = function(){
  positionLoop();
},

applicationLoop = function(){
	renderCanvas(webcamApp, canvasApp);
	window.requestAnimFrame(applicationLoop);
},

initWebcam = function (sourceInfo){
	navigator.webkitGetUserMedia({video:{optional:[{sourceId: sourceInfo.id}]}, audio:false},
	  function(stream) {
	    webcam.src = window.webkitURL.createObjectURL(stream);
	    webcam.play();
	  }
	);
},
	
gotSources = function(sourceInfos) {
  	for (var i = sourceInfos.length; i--;) {
    var sourceInfo = sourceInfos[i];
    console.log('camera source info: ', sourceInfo);
    if (sourceInfo.kind === 'video') {
      initWebcam(sourceInfo);
      return;
    }
  }
};


//SPACEBREW STARTS
var sb,
	  app_name = "psychic";
	
var spacebrew = function(){
    app_name = app_name;
    sb = new Spacebrew.Client();
    sb.name(app_name);
    sb.description("This app sends text from an HTML form.");

  	sb.addPublish("state", "string", "");
    sb.addPublish("fortune", "string", "");

    sb.addSubscribe("name", "string");
    sb.addSubscribe("state", "string");
  
    sb.onStringMessage = onStringMessage;     
    sb.connect();  
};

var onStringMessage = function( name, value ){
    console.log("[onBooleanMessage] boolean message received ", value);
    
    //if the value received is from the subscriber name....
    if(name === "name"){
      state3(); 
    	var tmp_name = value;
      var arr_name = tmp_name.split(" ");
      user_firstName = arr_name[0];
      user_lastName = arr_name[1];
      console.log('name :: ', user_firstName + " " + user_lastName);
      $("#output").prepend("<li class='username' style='font-weight: bold;'>"+ user_firstName + " " + user_lastName +"</li>");
      if(user_firstName != undefined){
        linkedin_app.searchClick(user_firstName, user_lastName);  
      }
      
    }
    //else if the value received is from the subscriber state....
    else if(name === "state"){
      if(value === "START"){ //user to psychic, start app
        state1();
      } else if( value === 'processing'){
        state5();
      }
    }        
};
//SPACEBREW ENDS


var initApp = function(webcam, canvas){
	hasLinkedin = false;
  hasBetaface = false;
  hasFortune = false;
  
  canvasApp = canvas;
	webcamApp = webcam;
	if (typeof MediaStreamTrack === 'undefined'){
	  alert('This browser does not support MediaStreamTrack.\n\nTry Chrome Canary.');
	} else {
	  MediaStreamTrack.getSources(gotSources);
	}
	applicationLoop();	
};