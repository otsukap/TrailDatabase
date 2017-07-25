//
// Form functions
//
$('#trailType li a').click(function(){
	$('#trailType .btn:first-child').html($(this).text() + " <span class='caret'></span>");
	$('#trailType .btn:first-child').val($(this).text());
	
	$('#surfaceForm').empty()
	
	if ($(this).text() == "Land Trail"){
		$('#surfaceForm').append("<label for='inputSurface' class='col-sm-2 control-label'>Surface type</label><div class='col-sm-6'>" + 
		"<div class='btn-group' id='surfaceType'><button type='button' class='btn btn-default dropdown-toggle'  data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Type <span class='caret'></span></button>" + 
		"<ul class='dropdown-menu'>" + 
		"<li><a href='#' value='dirt'>Dirt</a></li>" + 
		"<li><a href='#' value='gravel'>Gravel</a></li>" + 
		"<li><a href='#' value='asphalt'>Asphalt</a></li>" + 
		"<li><a href='#' value='various'>Various</a></li>" + 
		"</ul></div>")
	}
	else if ($(this).text() == "Water Trail"){
		$('#surfaceForm').append("<label for='inputSurface' class='col-sm-2 control-label'>Body type</label><div class='col-sm-6'>" + 
		"<div class='btn-group' id='bodyType'><button type='button' class='btn btn-default dropdown-toggle'  data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Type <span class='caret'></span></button>" + 
		"<ul class='dropdown-menu'>" + 
		"<li><a href='#' value='river'>River</a></li>" + 
		"<li><a href='#' value='shore'>Beach/shore</a></li>" + 
		"<li><a href='#' value='lake'>Lake</a></li>" + 
		"</ul></div>")
	}
	
	$('#surfaceType').ready(function(){
		$('#surfaceType li a').click(function(){
			$('#surfaceType .btn:first-child').html($(this).text() + " <span class='caret'></span>");
			$('#surfaceType .btn:first-child').val($(this).text());
		})
	})
	//
	$('#bodyType').ready(function(){
		$('#bodyType li a').click(function(){
			$('#bodyType .btn:first-child').html($(this).text() + " <span class='caret'></span>");
			$('#bodyType .btn:first-child').val($(this).text());
		})
	})
})

//
// Get request
//
$('#searchTrailAdmin').submit(function(e){
	console.log("form has been submitted")
	$.ajax({
		type: "GET",
		url: "api/trails",
		data: $('#searchTrailAdmin').serialize(),
		success: function(res){
			console.log(res)
		}
	})
	
	e.preventDefault();
});


//
// Put gpx file name in input box
//
$('#browseGPSData input').change(function(){
	$('#inputGPSData').val(this.files[0].name)
	console.log(this.files[0].name)
});

//
// Put image file name in input box
//
var pictures = [];
$('#browsePicture input').change(function(){
	s = this.files.length
	input = this
	
	for (i = 0; i < s; i++){
		$('.pictureFiles').prepend("<input class='form-control inputPicture' placeholder='Image File'>"
		)
		//$('#browsePicture').before("<label class='btn btn-link pictureButtons'> <span class='glyphicon glyphicon-remove-circle' aria-hidden='true'></span></label><br>")
	}
	$('.pictureFiles').ready(function(){
		for (i = 0; i < s; i++){
			c = i + 1
			$('.inputPicture:nth-child(' + c + ')').val(input.files[i].name)
		}
	})
	
});