
//SPACEBREW
$(window).on("load", spacebrew);

var webcam = document.getElementById('webcam'),
    canvas = document.getElementById('canvas');

// spacebar and sending name from user app triggers that!
var state1 = function(){
    //slide2 
    setTimeout(function(){
        $('#slide2').css({
            "zIndex" : 101,
            "opacity" : 1,
        });
        state2();
    },2000);
};

var video_tag = $('#video_welcome');  
var state2 = function(){ // PSYCHIC APPEARS...
    video_tag.get(0).play();
    // saveImageInCanvas(canvas);    
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
    if (e.keyCode === 68){ //PRESS D
        $("#debug").toggle();
    } 
    if(e.keyCode === 32){ // PRESS SPACEBAR // this is activated with the  
        sb.send("state", "string", "START IPAD");
        state1(); //selfie
    }
    if(e.keyCode === 81 ){ // PRESS Q //STARTS USER APPLICATION!
        var newString = "START IPAD";
        sb.send("state", "string", newString);   // send string to spacebrew
    }
});

$(function(){
	initApp(webcam, canvas);
});