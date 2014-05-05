$(document).ready(function(){
	var area = $("#slide2");

	// mouse events
	area.bind("mousedown", function(e) {
	    dumpEvent(e);
	    var id = 1;
	    createDiv(id);
	    moveBox(id, e);
	})
	.bind("mousemove", function(e) {
	    dumpEvent(e);
	    moveBox(1, e);
	})
	.bind("mouseup", function(e) {
	    dumpEvent(e);
	    delDiv(1);
	})
	.bind("click", function(e) {
	    dumpEvent(e);
	});

	// touch events
	area.bind("touchstart", function(e) {
	    dumpEvent(e);
	    forEachChangedFinger(e, function(e2, id) {
	        createDiv(id);
	        moveBox(id, e2);
	    });
	})
	.bind("touchmove", function(e) {
	    dumpEvent(e);
	    e.preventDefault(); // prevent page scroll

	    forEachChangedFinger(e, function(e2, id) {
	        // moveBox(id, e2);
	    });
	})
	.bind("touchend", function(e) {
	    dumpEvent(e);

	    forEachChangedFinger(e, function(e2, id) {
	        delDiv(id);
	    });
	})
	.bind("touchcancel", function(e) {
	    dumpEvent(e);
	    $("#slide2").empty();
	});

	/* disabled because flood of events

	// gesture events
	area.bind("gesturestart", function(e) {
	    dumpEvent(e);
	});
	area.bind("gesturechange", function(e) {
	    dumpEvent(e);
	});
	area.bind("gestureend", function(e) {
	    dumpEvent(e);
	});
	*/

	// clear event name list
	$("#evlist").on("click", function(){
	    $(this).empty();
	});

	// extract each finger data from list, call callback
	function forEachChangedFinger(e, cb) {
	    e = e.originalEvent;

	    // e.changedTouches is a list of finger events that were changed
	    for (var i = 0; i < e.changedTouches.length; i++) {
	        var finger = e.changedTouches[i];
	        var id = finger.identifier;
	        cb(finger, id);
	    }
	}

	function createDiv(id) {
	    var colors = ["red","blue", "green", "orange", "gray"];
	    var area = $("#slide2");
	    var count = area.find("div").length;
	    var div = $("<div class='finger'>"+count+"</div>");
	    area.append(div);
	    div.css("background", colors[count%colors.length]);
	    div.attr("id", id);

	    console.log(count);

	    $("#count").text(count+1);
	    $("debug").text(count);
	}
	function delDiv(id) {
	    $("#"+id).remove();

	    var count = $("#area").find("div").length;
	    $("#count").text(count);
	}
	// move box on screen
	function moveBox(id, e) {
	    var div = $("#"+id);
	    var off = $("#slide2").offset();
	    // offset box a little so it can be seen under a finger!
	    // var x = e.pageX - off.left - 35;
	    // var y = e.pageY - off.top - 35;
	    // div.css({"left":x, "top":y});
	}

	// print properties of the event object
	function dumpEvent(e) {
	    // get hold of orig event in jQuery
	    if (e.originalEvent) {
	        e = e.originalEvent;
	    }

	    var txt = [];
	    for (var p in e) {
	        // ignore constants
	        if (p == p.toUpperCase())
	            continue;

	        var val = e[p];

	        // do not dump functions
	        if($.isFunction(val))
	            val = "func()";
	        txt.push(p+" = "+val);
	    }
	    var s = txt.join("<br/>");
	    $("#eprop").html(s);
	    $("#ename").html(e.type);

	    // print event name
	    if (lastevename != e.type) {
	        $("#evlist").append("<span>"+e.type+" </span>");
	        lastevecount = 1;
	    } else {
	        lastevecount += 1;
	        $("#evlist >span").last().replaceWith("<span>"+e.type+lastevecount+" </span>");
	    }
	    lastevename = e.type;
	}
	var lastevename = "";
	var lastevecount = 1;

});