
<!doctype html>

<html lang="en">
    <head>
        <meta charset="utf-8" />
        <script  src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
        <script src="/public/js/utils.js"></script>
		<script src="/public/js/model_pca_20_svm.js" ></script>
		<script src="/public/js/clmtrackr.js"></script>
		<script src="/public/js/application.js" ></script>

    </head>
    <body>
    	<canvas id="canvas" width="640" height="480"></canvas>
    	<video id="webcam" width="640" height="480" style="display:none" ></video>
    	<a id="button" href="#">take picture</a>
    	<script>
				var webcam = document.getElementById('webcam');
				var canvas = document.getElementById('canvas');
				$("#button").on("click", function(){
					saveImageInCanvas(canvas);
				});
			    $(function(){
			    	initApp(webcam, canvas);
			    });
    	</script>
    </body>
</html>