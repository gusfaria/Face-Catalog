var canvasApp, webcamApp; 
var ctracker;
function saveImageInCanvas(canvas){
	var img = canvas.toDataURL();

	$.ajax({
    	url: 'http://localhost:8080/uploadImage',
    	type: 'post',
    	contentType: 'application/json',
    	data: JSON.stringify({image: img}),		
    	dataType: 'json',
    	success: function(response) {
        	if(response.success) {
            	window.location = response.data.link;
        	}
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

function initWebcam(webcam){
	navigator.webkitGetUserMedia({video:true, audio:false},
	  function(stream) {
	    webcam.src = window.webkitURL.createObjectURL(stream);
	    webcam.play();
	    trackingFace(canvasApp);

	  }
	);
};

function initApp(webcam, canvas){
	
	canvasApp = canvas;
	webcamApp = webcam;
	initWebcam(webcam);
	applicationLoop();
	
}