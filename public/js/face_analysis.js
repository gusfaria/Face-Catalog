var faceAnalysis = function(){
	var user_picture = document.querySelector('img');	
	user_picture.style.border = "3px solid red";
	console.log('user: ', user_picture.src);

    // var test = document.getElementById('testImg');   
    // test.style.border = "3px solid red";
    // console.log('user: ', test.src);

    var uploadImageUrl = function(image_url, detection_flags){
    	if (image_url != null && image_url != '') {
            var msg = '<?xml version="1.0" encoding="utf-8"?><ImageRequestUrl xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
                        '<api_key>d45fd466-51e2-4701-8da8-04351c872236</api_key><api_secret>171e8465-f548-401d-b63b-caf0dc28df5f</api_secret>' +
                        '<detection_flags>' + detection_flags + '</detection_flags>' +
                        '<image_url>' + image_url + '</image_url>' +
                        '</ImageRequestUrl>';
            console.log("msg: "+ msg +"image_url: "+ image_url);
            uploadImageImpl('http://www.betafaceapi.com/service.svc/UploadNewImage_Url', msg, image_url);
        }
    },

	uploadImageImpl = function(url, msg, image_filename, image) {
        $.support.cors = true;
        $.ajax({
            crossDomain: true,
            url: url,
            type: 'post',
            contentType: 'application/xml',
            processData: false,
            data: msg,
            dataType: 'xml',
            success: function (data, textStatus, jqXHR) {
                var xmlDocRoot = $.parseXML(jqXHR.responseText);
                var xmlDoc = $(xmlDocRoot).children("BetafaceImageResponse");
                var int_response = parseInt($(xmlDoc).children("int_response").text());
                var string_response = $(xmlDoc).children("string_response").text();
                if (int_response == 0) {
                    var image_uid = $(xmlDoc).children("img_uid").text();
                    console.log(image_uid);
                    getImageInfo(image_uid);
                }
                else {

                    console.info(int_response);
                    console.info(string_response);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
            }
        });
    },
    uploadImage = function (image_filename, image_data, detection_flags) {
        var msg = '<?xml version="1.0" encoding="utf-8"?><ImageRequestBinary xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
                  '<api_key>d45fd466-51e2-4701-8da8-04351c872236</api_key><api_secret>171e8465-f548-401d-b63b-caf0dc28df5f</api_secret>' +
                  '<detection_flags>' + detection_flags + '</detection_flags>' +
                  '<imagefile_data>' + image_data + '</imagefile_data>' +
                  '<original_filename>' + image_filename + '</original_filename>' +
                  '</ImageRequestBinary>';
        $.support.cors = true;
        $.ajax({
            crossDomain: true,
            url: 'http://www.betafaceapi.com/service.svc/UploadNewImage_File',
            type: 'post',
            contentType: 'application/xml',
            processData: false,
            data: msg,
            dataType: 'xml',
            success: function (data, textStatus, jqXHR) {
                var xmlDocRoot = $.parseXML(jqXHR.responseText);
                var xmlDoc = $(xmlDocRoot).children("BetafaceImageResponse");
                var int_response = parseInt($(xmlDoc).children("int_response").text());
                var string_response = $(xmlDoc).children("string_response").text();
                
                if (int_response == 0) {
                    var img_uid = $(xmlDoc).children("img_uid").text();
                    getImageInfo(img_uid);
                }
                else {
                    //error
                    console.info(int_response);
                    console.info(string_response);
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
            }
        });
    },
    getImageInfo = function(image_uid) {
    	var msg = '<?xml version="1.0" encoding="utf-8"?><ImageInfoRequestUid><api_key>d45fd466-51e2-4701-8da8-04351c872236</api_key><api_secret>171e8465-f548-401d-b63b-caf0dc28df5f</api_secret>' +
                '<img_uid>' + image_uid + '</img_uid></ImageInfoRequestUid>';

        $.support.cors = true;
        $.ajax({
            crossDomain: true,
            url: 'http://www.betafaceapi.com/service.svc/GetImageInfo',
            type: 'post',
            contentType: 'application/xml',
            processData: false,
            data: msg,
            dataType: 'xml',
            success: function (data, textStatus, jqXHR) {
                var xmlDocRoot = $.parseXML(jqXHR.responseText);
                var xmlDoc = $(xmlDocRoot).children("BetafaceImageInfoResponse");
                var int_response = parseInt($(xmlDoc).children("int_response").text());
                var string_response = $(xmlDoc).children("string_response").text();
                if (int_response == 1) {
                    //image is in the queue
                    setTimeout(function () { getImageInfo(image_uid);}, 500);
                }
                else if (int_response == 0) {
                    //image processed
                    parseImageInfo(image_uid, xmlDoc);
                    //TO RETURN DATA IS HERE!!!! 

                }
                else {
                    //error
                    console.info(int_response);
                    console.info(string_response);
                }
                console.log(string_response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
            }

        });
    },
    parseImageInfo = function (image_uid, xmlDocRoot) {
        var xmlDoc = $(xmlDocRoot).children("faces");
        if ($(xmlDoc).length > 0) {
            $(xmlDoc).children("FaceInfo").each(function () {
                var face_uid = $(this).children("uid").text();
                var image_uid = $(this).children("image_uid").text();
                //
                var score = parseFloat($(this).children("score").text());
                //
                var x = parseFloat($(this).children("x").text());
                var y = parseFloat($(this).children("y").text());
                var width = parseFloat($(this).children("width").text());
                var height = parseFloat($(this).children("height").text());
                var angle = parseFloat($(this).children("angle").text());
                //
                var points = $(this).children("points").children();
                var tags = $(this).children("tags").children();
                //
                var returned_tags = document.getElementById('returned_tags');

                // console.log($(this).children());
                for(var i=0;i<tags.length;i++){
                	var confidence = tags[i].getElementsByTagName("confidence")[0].childNodes[0].nodeValue;
                	var name = tags[i].getElementsByTagName("name")[0].childNodes[0].nodeValue;
                	var value = tags[i].getElementsByTagName("value")[0].childNodes[0].nodeValue;
                	var listitem = document.createElement('li');
                	listitem.className = name;

                    // console.log(i+": "+name+" "+value+" "+confidence);
                	
                    returned_tags.appendChild(listitem);
                	var listitemTxt = document.createTextNode( name+" "+value+" "+confidence);
					listitem.appendChild(listitemTxt);
					
                }
	            getFaceImage(face_uid);                
            });
        }
    },
    getFaceImage = function (face_uid) {
        var msg = '<?xml version="1.0" encoding="utf-8"?><FaceRequestId><api_key>d45fd466-51e2-4701-8da8-04351c872236</api_key><api_secret>171e8465-f548-401d-b63b-caf0dc28df5f</api_secret>' +
                '<face_uid>' + face_uid + '</face_uid></FaceRequestId>';

        $.support.cors = true;
        $.ajax({
            crossDomain: true,
            url: 'http://www.betafaceapi.com/service.svc/GetFaceImage',
            type: 'post',
            contentType: 'application/xml',
            processData: false,
            data: msg,
            dataType: 'xml',
            success: function (data, textStatus, jqXHR) {
                var xmlDocRoot = $.parseXML(jqXHR.responseText);
                var xmlDoc = $(xmlDocRoot).children("BetafaceFaceImageResponse");
                var int_response = parseInt($(xmlDoc).children("int_response").text());
                var string_response = $(xmlDoc).children("string_response").text();
                if (int_response == 0) {
                    var face_uid = $(xmlDoc).children("uid").text();
                    var face_image = $(xmlDoc).children("face_image").text();
                    var data_url = 'data:image/jpeg;base64,' + face_image;
                    // Render face image.
                    var span = document.createElement('span');
                    span.innerHTML = ['<img src="', data_url, '" title="', escape(face_uid), '"/>'].join('');
                    document.getElementById('output').insertBefore(span, null);
                }
                else {
                    //error
                    console.info(int_response);
                    console.info(string_response);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
            }
        });
    };

    uploadImageUrl(user_picture.src, 'cropface,recognition,propoints,classifiers,extended');

};