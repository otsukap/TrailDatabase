//
// Form functions
//
$('#inputTrail').click(function(){
	
	$('#surfaceForm').empty()
	$('#depthForm').empty()
	
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
		$('#depthForm').append("<label for='inputDepth' class='col-sm-2 control-label'>Depth</label><div class='col-sm-6'>" + 
						  "<input class='form-control' id='inputDepth' name='depth', placeholder='Average depth in feet'</div>")
		
		
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
			"<div class='panel-heading' role='tab' id='heading" + i + "'>" + 
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
	// For each of the results from admin search, add an accordion and an edit form
	$('#editResults .panel-body').each(function(i, obj){
		nameInput = "<div class='form-group'>" + 
					"<label for='inputName" + i + "' class='col-sm-2 control-label'>Name</label>" + 
					"<div class='col-sm-6'>" + 
					  "<input class='form-control' id='inputName" + i + "' name='name' placeholder='Name'" + 
					  "value='" + results[1].rows[i].name + "'>" + 
					"</div></div>";
		trailTypeInput = "";
		surfaceTypeInput = "";
		waterbodyTypeInput = "";
		depthInput = "";
					
		// If the trail type is land or water, add the appropriate form
		if (results[1].rows[i].trail_type == "land"){
			dirtSelected = "";
			gravelSelected = "";
			asphaltSelected = "";
			variousSelected = "";
			
			if (results[1].rows[i].surface_type == "dirt"){
				dirtSelected = "selected='selected'";
			} else if (results[1].rows[i].surface_type == "gravel"){
				gravelSelected = "selected='selected'";
			} else if (results[1].rows[i].surface_type == "asphalt"){
				asphaltSelected = "selected='selected'";
			} else if (results[1].rows[i].surface_type == "various"){
				variousSelected = "selected='selected'";
			}
			
			trailTypeInput = "<div class='form-group'>" + 
						"<label for='inputTrail" + i + "' class='col-sm-2 control-label'>Trail Type</label>" + 
						"<div class='col-sm-6'>" + 
						  "<select class='form-control' id='inputTrail" + i + "' name='trail_type'>" + 
							"<option value='land' selected='selected'>Land Trail</option>" + 
							"<option value='water'>Water Trail</option>" + 
						  "</select>" + 
						"</div></div>";
			surfaceTypeInput = "<div class='form-group' id='surfaceForm'>" + 
				    "<label for='inputSurface" + i + "' class='col-sm-2 control-label'>Surface Type</label><div class='col-sm-6'>" + 
						  "<select class='form-control' id='inputSurface" + i + "' name='surface_type'>" + 
							"<option value='dirt' " + dirtSelected + ">Dirt</option>" + 
							"<option value='gravel' " + gravelSelected + ">Gravel</option>" + 
							"<option value='asphalt' " + asphaltSelected + ">Asphalt</option>" + 
							"<option value='various' " + variousSelected + ">Various</option>" + 
						  "</select></div></div>"		  
		} else if (results[1].rows[i].trail_type == "water"){
			riverSelected = "";
			shoreSelected = "";
			lakeSelected = "";
			
			if (results[1].rows[i].waterbody_type == "river"){
				riverSelected = "selected='selected'";
			} else if (results[1].rows[i].waterbody_type == "shore"){
				shoreSelected = "selected='selected'";
			} else if (results[1].rows[i].waterbody_type == "lake"){
				lakeSelected = "selected='selected'";
			}
			
			trailTypeInput = "<div class='form-group'>" + 
						"<label for='inputTrail" + i + "' class='col-sm-2 control-label'>Trail Type</label>" + 
						"<div class='col-sm-6'>" + 
						  "<select class='form-control' id='inputTrail" + i + "' name='trail_type'>" + 
							"<option value='land'>Land Trail</option>" + 
							"<option value='water' selected='selected'>Water Trail</option>" + 
						  "</select>" + 
						"</div></div>";
			waterbodyTypeInput = "<div class='form-group'>" + 
						"<label for='inputSurface" + i + "' class='col-sm-2 control-label'>Body Type</label><div class='col-sm-6'>" + 
						  "<select class='form-control' id='inputSurface" + i + "' name='waterbody_type'>" +
							"<option value='river'>River</option>" +
							"<option value='shore'>Shore</option>" +
							"<option value='lake'>Lake</option>" +
						  "</select></div></div>"
			depthInput = "<div class='form-group'>" + 
						"<label for='inputDepth" + i + "' class='col-sm-2 control-label'>Depth</label><div class='col-sm-6'>" + 
						"<input class='form-control' id='inputDepth" + i + "' name='depth', placeholder='Average depth in feet' value='" + results[1].rows[i].depth + "'></div></div>"
		}
		
		
		$(this).append("<div>" + 
		"<form class='form-horizontal' method='post' id='editTrailAdmin'>" + 
		nameInput + trailTypeInput + surfaceTypeInput + waterbodyTypeInput + depthInput + 
		"<div class='form-group'><div class='col-sm-offset-2 col-sm-6'>" + 
		"<button type='submit' class='btn btn-primary modify' value=" + results[1].rows[i].tid + ">Modify trail</button>" + 
		"<button type='button' class='btn btn-danger delete' value=" + results[1].rows[i].tid + ">Delete trail</button></div></div></form>")
	});
	
	//
	// Modify trail
	//
	$('#editTrailAdmin').submit(function(e){
		tid = $('#editTrailAdmin .modify').val();
		console.log($("#editTrailAdmin").serialize());
		$.ajax({
			type: "PUT",
			url: "api/trails/" + tid,
			data: $("#editTrailAdmin").serialize(),
			success: function(res){
				console.log(res)
			}
		});
		e.preventDefault();
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
				$('#editResults :button').filter(function(){
					return this.value == tid;
				}).parent().parent().parent().parent().remove();
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
			tid = res[1].id;
			console.log("tid in addtrailadmin is " + tid);
			
			var form = $("#addTrailAdmin")[0];
			data = new FormData(form)
			console.log("form: " + form)
			console.log("data: " + data)
			// If adding trail successfull get gpx data
			$.ajax({
				type: "POST",
				enctype: "multipart/form-data",
				processData: false,
				contentType: false,
				url: "api/gpx/" + tid,
				data: data,
				success: function(res){
					// Upload photos
					$.ajax({
						type: "POST",
						enctype: "multipart/form-data",
						processData: false,
						contentType: false,
						url: "api/photos/" + tid,
						data: data,
						success: function(res) {
							console.log(res);
						}
					});
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
	stringOfFiles = ''
	for (i = 0; i < input.files.length; i++){
		stringOfFiles = stringOfFiles + input.files[i].name + ", ";
	}
	$('.inputPicture').val(stringOfFiles)
	
	
	// for (i = 0; i < s; i++){
		// $('.pictureFiles').prepend("<input class='form-control inputPicture' placeholder='Image File'>"
		// )
		// //$('#browsePicture').before("<label class='btn btn-link pictureButtons'> <span class='glyphicon glyphicon-remove-circle' aria-hidden='true'></span></label><br>")
	// }
	// $('.pictureFiles').ready(function(){
		// for (i = 0; i < s; i++){
			// c = i + 1
			// $('.inputPicture:nth-child(' + c + ')').val(input.files[i].name)
		// }
	// })
});