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