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
},
    welcome = function(){ // PSYCHIC APPEARS...
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

// should I store this in an ARRAY ???
//person_att is age, profession, or gender, age_gender
//is it this the right format?
//how i can give more relevance to one or another? 
// how I am going to pass 2 variables if necessary?
//there should be something before this, what it is? 
// how to change person_att(gender) to: MAN or WOMAN
//only for female? or only for youngers than a certain age.

// var fortune_generator = function(person_att){
//     var fortunes = {
//         "age" : {
//             "1" : "I can see you will live long. You'\re still on your " + Math.round(person_att) + "s.",
//             "2" : "Now that you are " + person_att + " years old everything will come your way.",
//             "3" : "You are young, " + person_att + " is a golden age. Fame, riches and romance are yours for the asking.",
//             "4" : "You are " + person_att + " years old, now is the time to try something new.",
//             "5" : "You are on the peak of your + person_att +, take advantage of that.",
//             "6" : "You are never too old to learn, you're only " + person_att + " years old."
            
//         },
//         "age_gender" : {
//             "1" : "As an alpha "+ person_att +" with age "+ person_att +" you display the wonderful traits of charm and courtesy.",
//             "2" : "For success today, look first to yourself, a "+ person_att +" years old "+ person_att +".",
//             "3" : "You are a strong "+ person_att +" with age "+ person_att +" the only person that can hold you back is yourself."
//         },
//         "gender" : {
//             "1" : person_att +(FEMALE)" emotional nature is strong and sensitive.",
//             "2" : "Your "+ person_att(FEMALE) +" simplicity should be your theme in dress.",
//             "3" : "On this right moment, "+ person_att +(MAN/WOMAN)" like you are changing the world."
//         },
//         "profession" : {
//             "1" : "As a "+ person_att +" your ventures will be a success."
//             "2" : "You will soon reach the height of success in your "+ person_att +" career.",
//             "3" : "Your ability to juggle many tasks will take you far in your challenges as a "+ person_att +".",
//             "4" : "Is hard being a "+ person_att +", but it always pays off."
//         };
//     };
// };





