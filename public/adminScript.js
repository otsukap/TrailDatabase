//
// Put gpx file name in input box
//
$('#browseGPSData input').change(function(){
	$('#inputGPSData').val(this.files[0].name)
	console.log(this.files[0].name)
});