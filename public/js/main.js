$(window).on("load", spacebrew);

var webcam = document.getElementById('webcam'),
    canvas = document.getElementById('canvas'),
    video_tag = $('#video_welcome');

// spacebar and sending name from user app triggers that!
var state1 = function(){
        $('#slide1').css({
            "zIndex" : 10,
            "opacity" : 0,
        });

        $('div#curtain').css({"display":"block"});
        $('div#curtain').delay(2000).fadeOut(1000);
        
        welcome();
};
  
var welcome = function(){ // PSYCHIC APPEARS...
    video_tag.get(0).play();
    setTimeout(function(){
        console.log("picture taken");
     saveImageInCanvas(canvas);    
    }, 2000);

    //when first video ends... loop this until user inputs the name
    $('#video_welcome').bind("ended", function() {
        console.log('ended');
        video_tag.attr('src', '/public/res/video/loop_01.mp4');
        video_tag.get(0).play();        
    });
};

var state3 = function(){
    video_tag.attr('src', '/public/res/video/hand.mp4');
    video_tag.get(0).play();        
    $('#video_welcome').bind("ended", function() {
        video_tag.attr('src', '/public/res/video/loop_02.mp4');
        video_tag.get(0).play();        
    });
};

var state4 = function() {
    video_tag.attr('src', '/public/res/video/fade_out.mp4');
    video_tag.get(0).play();        
};

$(document).keydown(function(e){
    if (e.keyCode === 68){ //PRESS D // for debug
        $("#debug").toggle();
    } 
    if(e.keyCode === 32){ // PRESS SPACEBAR // this is activated with the  
        sb.send("state", "string", "START IPAD");
        state1(); //selfie
    }
});

$(function(){
	initApp(webcam, canvas);
});




