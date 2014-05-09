// MAKE THE FORTUNE GENERATOR + generic fortune
// allow camera 

var person = {},
    categoriesArr = [];

var user_firstName,
    user_lastName;

var hasLinkedin,
    hasBetaface;

var canvasApp,
    webcamApp,
    ctracker,
    videoSelect,
    sourceVideo;
    

videoSelect = document.querySelector("select#videoSource");
navigator.getUserMedia = navigator.getUserMedia ||  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var saveImageInCanvas = function (canvas){
	var img = canvas.toDataURL();
	$.ajax({
    	url: 'http://localhost:8080/uploadImage',
    	type: 'post',
    	contentType: 'application/json',
    	data: JSON.stringify({image: img}),		
    	dataType: 'json',
    	success: function(response) {
            var tags = response.BetafaceImageInfoResponse.faces.FaceInfo.tags.TagInfo;
            
          //   var html='';
          //   for(var att in tags){
          //       // console.log(att, tags[att]); // DEBUG ATTRIBUTES FACE ANALYSIS
          //       html+='<li id="'+ tags[att].name +'">' +tags[att].confidence + " - " + tags[att].name + ' - ' + tags[att].value + '</li>';
          //   }
        	 // $("#output").html(html);

	        // var make_fortune = function(){ 
         //    //generate fortune here
         //    var fortune = "";
         //    foo = Math.round(tags[0].value);
         //    $("#output").prepend("<li class='fortune'></li>");    
          
         //    if(foo < 25){
         //      fortune = 'Now that you are '+ foo +' old, everything will now come your way.';
         //    } else if(foo > 25 && foo < 30) {
         //      fortune = 'I can see you will live long. You\'re still '+ foo +'.';
         //    } else if(foo >= 30 && foo < 40){
         //      fortune = 'Now that you are '+ foo +' old, everything will now come your way.';
         //    } else if(foo >= 40){
         //      fortune = 'You are '+ foo +'now is the time to try something new.';
         //    } else {
         //      fortune = 'NO DATA BRO. But you are ' + foo + 'years old';
         //    }  

         //    $('li.fortune').text(fortune);
         //    sb.send("fortune", "string", fortune);
         //    state4(); 
         //  };
	        
         //  make_fortune();

          // person['age'] = tag[0].value;
          // person['age_confidence'] = tag[0].confidence;
          // person['gender'] = tag[2].value;
          // person['gender_confidence'] = tag[2].confidence;
          var sex;
          if(tags[2].value === "male") sex = "men";
          else if(tags[2].value === "female") sex = "women";

          person = {
              "age" : tags[0].value,
              "age_confidence" : tags[0].confidence,
              "gender" : tags[2].value,
              "gender_confidence" : tags[2].confidence,
              "sex" :  sex
          };

          hasBetaface = true;
          console.log('hasBetaface: ', hasBetaface); 

          if(hasBetaface === true && hasLinkedin === true){
            fortune_generator();            
          }

          return person;
    	}, error: function(request, error){ 
          // console.log('error: ', error);
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
      linkedin_app.searchClick(user_firstName, user_lastName);
    }
    //else if the value received is from the subscriber state....
    else if(name === "state"){
      if(value === "START"){ //user to psychic, start app
        state1();
      }
    }        
};
//SPACEBREW ENDS


var initApp = function(webcam, canvas){
	hasLinkedin = false;
  hasBetaface = false;
  
  canvasApp = canvas;
	webcamApp = webcam;
	if (typeof MediaStreamTrack === 'undefined'){
	  alert('This browser does not support MediaStreamTrack.\n\nTry Chrome Canary.');
	} else {
	  MediaStreamTrack.getSources(gotSources);
	}
	applicationLoop();	
};