//
// Form functions
//
$('#inputTrail').click(function(){
	
	$('#surfaceForm').empty()
	
	if ($(this).val() == "land"){
		$('#surfaceForm').append("<label for='inputSurface' class='col-sm-2 control-label'>Surface Type</label><div class='col-sm-6'>" + 
						  "<select class='form-control' id='inputSurface' name='surface_type'>" +
							"<option value='dirt'>Dirt</option>" +
							"<option value='gravel'>Gravel</option>" +
							"<option value='asphalt'>Asphalt</option>" +
							"<option value='various'>Various</option>" +
						  "</select></div>")
	}
	else if ($(this).val() == "water"){
		$('#surfaceForm').append("<label for='inputSurface' class='col-sm-2 control-label'>Body Type</label><div class='col-sm-6'>" + 
						  "<select class='form-control' id='inputSurface' name='waterbody_type'>" +
							"<option value='river'>River</option>" +
							"<option value='shore'>Shore</option>" +
							"<option value='lake'>Lake</option>" +
						  "</select></div>")
		
		
	}
	
	// $('#surfaceType').ready(function(){
		// $('#surfaceType li a').click(function(){
			// $('#surfaceType .btn:first-child').html($(this).text() + " <span class='caret'></span>");
			// $('#surfaceType .btn:first-child').val($(this).text());
		// })
	// })
	// //
	// $('#bodyType').ready(function(){
		// $('#bodyType li a').click(function(){
			// $('#bodyType .btn:first-child').html($(this).text() + " <span class='caret'></span>");
			// $('#bodyType .btn:first-child').val($(this).text());
		// })
	// })
});

//
// Get search results for edit
//
function searchResults(results){
		$('#editResults').empty()
	
	if (results[0].result == "failure"){
		$('#editResults').append("<h4>Search returned no results</h4>")
	}
	else if ( results[0].result == "success"){
		nResults = results[1].rows.length
		$('#editResults').append("<h4>Search returned " + nResults + " results</h4>")
		$('#editResults').append("<div class='panel-group' id='accordion' role='tablist' aria-multiselectable='true'></div>")
		
		
		var i = 0;
		name = results[1].rows[0].name
		$('#editResults .panel-group').append("<div class='panel panel-default'>" + 
		"<div class='panel-heading' role='tab' id='heading0'>" + 
		"<h4 class='panel-title'>" + 
		"<a role='button' data-toggle='collapse' data-parent='#accordion' href='#collapse0' aria-expanded='true' aria-controls='collapse0'>" + 
		name + "</a></h4></div>" + 
		"<div id='collapse0' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='heading0'>" + 
		"<div class='panel-body'></div></div></div>")
		for (i = 1; i < nResults; i++){
			name = results[1].rows[i].name
			$('#editResults .panel-group').append("<div class='panel panel-default'>" + 
			"<div class='panel-heading' role='tab' id='heading'" + i + ">" + 
			"<h4 class='panel-title'>" + 
			"<a class='collapsed' role='button' data-toggle='collapse' data-parent='#accordion' href='#collapse" + i + "' aria-expanded='false' aria-controls='collapse" + i + "'>" + 
			name + "</a></h4></div>" + 
			"<div id='collapse" + i + "' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading" + i + "'>" + 
			"<div class='panel-body'></div></div></div>")
		}
		
		editForms(results, nResults);
	}
}

function editForms(results, nResults){
	$('#editResults .panel-body').each(function(i, obj){
		$(this).append("<div>" + results[1].rows[i].name + ", " + results[1].rows[i].trail_type + ", " + results[1].rows[i].surface_type + "<br><br><button type='button' class='btn btn-danger delete' value=" + results[1].rows[i].tid + ">Delete trail</button></div>")
	});
	
	//
	// Delete trail
	//
	$('#editResults .delete').on('click', function(e){
		tid = $(this).val()
		$.ajax({
			type: "DELETE",
			url: "api/trails/" + tid,
			success: function(res){
				console.log(res)
			}
		})
		e.preventDefault();
	});
}

//
// Get request
//
$('#searchTrailAdmin').submit(function(e){
	console.log("form has been submitted")
	$.ajax({
		type: "GET",
		url: "api/trails",
		data: $('#searchTrailAdmin').serialize() + "&user_type=admin",
		success: function(res){
			console.log(res)
			searchResults(res)
		}
	});
	e.preventDefault();
});

//
// Post request (all three: data, gpx, photos)
//
$('#addTrailAdmin').submit(function(e){
	console.log("form has been submitted")
	console.log($('#addTrailAdmin').serialize())
	$.ajax({
		type: "POST",
		url: "api/trails",
		data: $('#addTrailAdmin').serialize(),
		success: function(res){
			console.log(res)
			searchResults(res)
			tid = res[0].id;
			console.log("tid in addtrailadmin is " + tid);
			// If adding trail successfull get gpx data
			$.ajax({
				type: "POST",
				url: "api/gpx",
				data: {"tid": tid},
				success: function(res){
					console.log(res)
					console.log("THIS FUCKING WORKED OMFG");
				}
			});
		}
	});
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