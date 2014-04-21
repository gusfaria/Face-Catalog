var canvasApp, webcamApp; 
var ctracker;
var videoSelect = document.querySelector("select#videoSource");
navigator.getUserMedia = navigator.getUserMedia ||  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var sourceVideo;

function saveImageInCanvas(canvas, name){
	var img = canvas.toDataURL();
	$.ajax({
    	url: 'http://localhost:8080/uploadImage',
    	type: 'post',
    	contentType: 'application/json',
    	data: JSON.stringify({image: img, name: name}),		
    	dataType: 'json',
    	success: function(response) {
            var tags = response.BetafaceImageInfoResponse.faces.FaceInfo.tags.TagInfo;
            var html='';
            for(var att in tags){
                // console.log(att, tags[att]);
                html+='<li class="'+ tags[att].name +'">' +tags[att].confidence + " - " + tags[att].name + ' - ' + tags[att].value + '</li>';
            }
        	$("#output").html(html);

        var make_fortune = function(){
        	foo = Math.round(tags[0].value);
			
			if(foo < 25){
				$('p#fortune_msg').text('Now that you are '+ foo +' old, everything will now come your way.');
			} else if(foo > 25 && foo < 30)	{
				$('p#fortune_msg').text('I can see you will live long. You\'re still '+ foo +'.');
			} else if(foo >= 30 && foo < 40){
				$('p#fortune_msg').text('You are on your 30s Bro.' + foo );
			} else if(foo >= 40){
				$('p#fortune_msg').text('You are '+ foo +'now is the time to try something new.');
			} else {
				$('p#fortune_msg').text('NO DATA BRO. ');
			}
			
			$('#fortune').css('display','flex');
        };

        make_fortune();

    	}
	});	
};

function renderCanvas(webcam, canvas){
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, webcam.width, webcam.height);
	ctx.drawImage(webcam, 0, 0, webcam.width, webcam.height);
    if(ctracker)ctracker.draw(canvas);
}

function trackingFace(canvas){
	ctracker = new clm.tracker({stopOnConvergence : true});
	ctracker.init(pModel);
	ctracker.start(webcam, [0, 0, canvas.width, canvas.height]);
}

function applicationLoop(){
	renderCanvas(webcamApp, canvasApp);
	window.requestAnimFrame(applicationLoop);
};

function initWebcam(sourceInfo){
	navigator.webkitGetUserMedia({video:{optional:[{sourceId: sourceInfo.id}]}, audio:false},
	  function(stream) {
	    webcam.src = window.webkitURL.createObjectURL(stream);
	    webcam.play();
	    // trackingFace(canvasApp);
	  }
	);
};
	
function gotSources(sourceInfos) {
  for (var i = sourceInfos.length; i--;) {
    var sourceInfo = sourceInfos[i];
    console.log('camera source info: ', sourceInfo);
    if (sourceInfo.kind === 'video') {
      initWebcam(sourceInfo);
      return;
    }
  }
}

//SPACEBREW STARTS
var sb,
	app_name = "psychic";
	
	$(window).on("load", setup);

var setup = function(){
    app_name = app_name;

    sb = new Spacebrew.Client();  // create spacebrew client object

    sb.name(app_name);
    sb.description("This app sends text from an HTML form."); // set the app description

    sb.addPublish("text", "string", "");    // create the publication feed
    sb.addSubscribe("text", "string");      // create the subscription feed

    sb.onStringMessage = onStringMessage;     
    sb.connect();  
};


var onStringMessage = function( name, value ){
    console.log("[onBooleanMessage] boolean message received ", value);
    $("#name").text("Hi " + value); // display the sent message in the browser 
   	state1();        
};
//SPACEBREW ENDS

function initApp(webcam, canvas){
	canvasApp = canvas;
	webcamApp = webcam;
	if (typeof MediaStreamTrack === 'undefined'){
	  alert('This browser does not support MediaStreamTrack.\n\nTry Chrome Canary.');
	} else {
	  MediaStreamTrack.getSources(gotSources);
	}
	applicationLoop();	
};