var canvasApp, webcamApp; 
var ctracker;
var videoSelect = document.querySelector("select#videoSource");
navigator.getUserMedia = navigator.getUserMedia ||  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var sourceVideo;
function saveImageInCanvas(canvas){
	var img = canvas.toDataURL();

	$.ajax({
    	url: 'http://localhost:8080/uploadImage',
    	type: 'post',
    	contentType: 'application/json',
    	data: JSON.stringify({image: img}),		
    	dataType: 'json',
    	success: function(response) {
            console.log(response.BetafaceImageInfoResponse);
            var tags = response.BetafaceImageInfoResponse.faces.FaceInfo.tags.TagInfo;
            var html='';
            for(var att in tags){
                console.log(att, tags[att]);
                html+='<li>' +tags[att].confidence + " - " + tags[att].name + ' - ' + tags[att].value + '</li>';
            }
        	$("#output").html(html);    
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
	ctracker.start(canvas, [0, 0, canvas.width, canvas.height]);
}

function applicationLoop(){
	renderCanvas(webcamApp, canvasApp);
	window.requestAnimFrame(applicationLoop);
}

function initWebcam(sourceInfo){
	navigator.webkitGetUserMedia({video:{optional:[{sourceId: sourceInfo.id}]}, audio:false},
	  function(stream) {
	    webcam.src = window.webkitURL.createObjectURL(stream);
	    webcam.play();
	    //trackingFace(canvasApp);
	  }
	);
};

	
function gotSources(sourceInfos) {
  for (var i = sourceInfos.length; i--;) {
    var sourceInfo = sourceInfos[i];
    // console.log(sourceInfo);
    if (sourceInfo.kind === 'video') {
      initWebcam(sourceInfo);
      return;
    }
  }
}

function initApp(webcam, canvas){
	
	canvasApp = canvas;
	webcamApp = webcam;
	if (typeof MediaStreamTrack === 'undefined'){
	  alert('This browser does not support MediaStreamTrack.\n\nTry Chrome Canary.');
	} else {
	  MediaStreamTrack.getSources(gotSources);
	}
	applicationLoop();	
}