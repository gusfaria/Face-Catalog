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


var fortune_generator = function(){
    console.log(person);
    var html = '';
    $.each( person, function( key, value ) {
      html+='<li id="'+ key +'">' + key + " - " + value + '</li>';
    });
    
    $("#output").html(html);

    var age = [
      "I can see you will live long. You\'re still around your " + Math.round(person['age']/10)*10 + "s.",
      "Now that you are " + person['age'] + " years old everything will come your way.",
      "You are " + person['age'] + " years old, now is the time to try something new.",
      "You are never too old to learn, you\'re only " + person['age'] + " years old.",
      "You are on the peak of your " + person['age'] +" years old, take advantage of that."
    ];

    var young = [
      "You are young, " + person['age'] + " is a golden age. Fame, riches and romance are yours for the asking."
    ];

    //gender fortunes
    var gender = [
      "Your "+ person['gender'] + " emotional nature is strong and sensitive.",
      "On this right moment, "+ person['sex'] + " like you are changing the world."
    ];

    //female fortunes
    var female_fortune = [
      "Your " + person['sex'] + " simplicity should be your theme in dress."
    ];

    // age and gender fortunes
    var gender_age = [
      "As an alpha "+ person['gender'] +" with age "+ person['age'] +", you display the wonderful traits of charm and courtesy.",
      "For success today, look first to yourself, a "+ person['age'] +" years old "+ person['gender'] +".",
      "You are a strong "+ person['sex'] +" with age "+ person['age'] +" the only person that can hold you back is yourself."
    ];

    var generic = [
      "Life is beautiful!"
    ];  

    //profession fortunes
    var profession = [
      "As a "+ person['profession'] + " your ventures will be a success.",
      "You will soon reach the height of success in your "+ person['profession'] +" career.",
      "Your ability to juggle many tasks will take you far in your challenges as a "+ person['profession'] +".",
      "Is hard being a "+ person['profession'] +", but it always pays off."
    ];

    // POPULATING THE ARRAY WITH CATEGORIES
    if(person['age'] !== undefined){
      categoriesArr.push(age);
      if(person['age_confidence'] > 0.01){
        categoriesArr.push(gender_age);
      }
      if(person['age'] < 35){
        categoriesArr.push(young);
      }
    }
    if(person['profession'] !== undefined){
       categoriesArr.push(profession); 
        if(person['profession_confidence'] > 0.1){
            categoriesArr.push(profession); 
        }
    }
    if(person['gender'] === "female") {
        categoriesArr.push(female_fortune);
    }
    if(person["profession"] === undefined && person["age"] === undefined && person["gender"] === undefined){
        categoriesArr.push(generic);   
    }

    var randomNumber = function(min, max) {
      var value = Math.floor(Math.random() * (max - min + 1)) + min;
      return value;
    };

    var getCategory = function(){
     /* console.log('category :: ', categoriesArr[randCategory]);*/
    /*  console.log('msg', categoriesArr[randomNumber(0, categoriesArr.length)]);  */
      var tmpRandomNumber = randomNumber(0, categoriesArr.length-1),
          tmpArr = categoriesArr[tmpRandomNumber];
    /*  console.log('randomNumber', tmpRandomNumber);*/
    /*  console.log('category', tmpArr);*/

      return tmpArr;
    };

    var getFortune = function(category){
        var randArr = category,
            tmpRandomNumber = randomNumber(0, randArr.length-1),
            msg = randArr[tmpRandomNumber];
    /*  console.log('getFortune random number: ', tmpRandomNumber);    
        console.log('getFortune msg: ', randArr[tmpRandomNumber]);*/
        state4();
        $('#audio_process').get(0).play();
        console.log(msg); 
        $("#output").prepend("<li class='fortune' style='font-weight: bold; font-size:14px;'>"+ msg +"</li>");

        return msg;
    };

    getFortune(getCategory());
    /*console.log('array size:', categoriesArr.length);*/
    /*getCategory(randomNum(0, categoriesArr.length));*/
};
