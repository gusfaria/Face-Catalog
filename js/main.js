$( document ).ready(function() {
	//define array
	var arrNames = [];
	
	//define input value
	$( "#input_name" )
	  .keyup(function() {
	  var value = $( this ).val();
	}).keyup();

	  //button pressed
	$('#btn_send').click(function(event) {
		event.preventDefault();
		arrNames.push($('#input_name').val())
		console.log(arrNames);

		$('#input_name').val(''); //clear the input name 
	});

});