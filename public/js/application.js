// MAKE THE FORTUNE GENERATOR + generic fortune
// EXHIBITION PROOF = if the pictures is not detected... dont crash! 
// ajax error / allow camera 

var person = {};

var canvasApp,
    webcamApp,
    ctracker,
    videoSelect,
    sourceVideo;

var user_firstName,
    user_lastName,
    user_age,
    user_gender,
    user_profession,
    user_picture,
    fortune;

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
            var html='';
            for(var att in tags){
                console.log(att, tags[att]); // DEBUG ATTRIBUTES FACE ANALYSIS
                html+='<li id="'+ tags[att].name +'">' +tags[att].confidence + " - " + tags[att].name + ' - ' + tags[att].value + '</li>';
            }
        	 $("#output").html(html);

	         var make_fortune = function(){
	        	var fortune = "";
            foo = Math.round(tags[0].value);
				    $("#output").prepend("<li class='fortune'></li>");		
          
    			if(foo < 25){
    				fortune = 'Now that you are '+ foo +' old, everything will now come your way.';
    			} else if(foo > 25 && foo < 30)	{
    				fortune = 'I can see you will live long. You\'re still '+ foo +'.';
    			} else if(foo >= 30 && foo < 40){
    				fortune = 'Now that you are '+ foo +' old, everything will now come your way.';
    			} else if(foo >= 40){
    				fortune = 'You are '+ foo +'now is the time to try something new.';
  				} else {
  					fortune = 'NO DATA BRO. But you are ' + foo + 'years old';
    			}    

          $('li.fortune').text(fortune);
          sb.send("fortune", "string", fortune);
          
          state4(); // 

          }; //make fortune end
	        
          make_fortune();

          // person['age'] = tag[0].value;
          // person['age_confidence'] = tag[0].confidence;
          // person['gender'] = tag[2].value;
          // person['gender_confidence'] = tag[2].confidence;

          person = {
              "age" : tags[0].value,
              "gender" : tags[2].value
          };

          return person;
    	}, error: function(request, error){ 
          // console.log('response: ', request);
          // console.log('error: ', error);


          // person = {
          //     "age" : null,
          //     "gender" : null
          // };        
          
          // return false;
      }
	});
  
  return person;

},

renderCanvas = function (webcam, canvas){
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, webcam.width, webcam.height);
	ctx.drawImage(webcam, 0, 0, webcam.width, webcam.height);
  if(ctracker) ctracker.draw(canvas);
},

trackingFace = function(canvas){
	ctracker = new clm.tracker({stopOnConvergence : false});
	ctracker.init(pModel);
	// ctracker.start(webcam, [0, 0, canvas.width, canvas.height]);
	ctracker.start(webcam);
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
	    // trackingFace(canvasApp);
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

var positionLoop = function() {
  requestAnimationFrame(positionLoop);
  setInterval(function(){
 	var positions = ctracker.getCurrentPosition();
 	if(positions){
 		console.log(positions[0][0].toFixed(2));
 	} 	  
  }, 1000);

  // var positions = ctracker.getCurrentPosition();
  // do something with the positions ...
  // print the positions
  // var positionString = "";
  // if (positions) {
  // console.log(positions[0][0].toFixed(2));
  // $('#debug').html($('<div>', {class: 'spinner'}));
  //   for (var p = 0;p < 10;p++) {
  //     positionString += "featurepoint "+p+" : ["+positions[p][0].toFixed(2)+","+positions[p][1].toFixed(2)+"]<br/>";
  //   }
  //   document.getElementById('positions').innerHTML = positionString;
  // }
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
	canvasApp = canvas;
	webcamApp = webcam;
	if (typeof MediaStreamTrack === 'undefined'){
	  alert('This browser does not support MediaStreamTrack.\n\nTry Chrome Canary.');
	} else {
	  MediaStreamTrack.getSources(gotSources);
	}
	applicationLoop();	
};