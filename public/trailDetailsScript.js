//
// Raster
//
var raster = new ol.layer.Tile({
	source: new ol.source.OSM()
});

//
// Style the trail path stroke
//
var style = {
	'Point': new ol.style.Style({
	  image: new ol.style.Circle({
		fill: new ol.style.Fill({
		  color: 'rgba(255,255,0,0.4)'
		}),
		radius: 5,
		stroke: new ol.style.Stroke({
		  color: '#ef0000',
		  width: 1
		})
	  })
	}),
	'LineString': new ol.style.Style({
	  stroke: new ol.style.Stroke({
		color: '#ef0000',
		width: 3
	  })
	}),
	'MultiLineString': new ol.style.Style({
	  stroke: new ol.style.Stroke({
		color: '#ef0000',
		width: 3
	  })
	})
};

//
// Vector object from gpx file
//
var vector = new ol.layer.Vector({
	source: new ol.source.Vector({
	  url: 'Test.gpx',
	  format: new ol.format.GPX()
	}),
	style: function(feature) {
	  return style[feature.getGeometry().getType()];
	}
});

// 
// Create map object
//
var map = new ol.Map({
        layers: [raster, vector],
        target: '#map',
        controls: ol.control.defaults({
          attributionOptions:({
            collapsible: false
          })
        }),
        view: new ol.View({
		  center: ol.proj.fromLonLat([-83.96, 27.95]),
		  zoom: 7
        })
      });
	  
//
// Post request
//
$('#leaveComment').submit(function(e){
	console.log("form has been submitted")
	var tid = getParameterByName("tid");
	console.log("tid is " + tid)
	$.ajax({
		type: "POST",
		url: "api/comments",
		data: $('#leaveComment').serialize() + "&tid=" + tid,
		success: function(res){
			console.log(res)
			alert("Your comment has been submitted");
			$('#user').val('');
			$('#comment').val('');
		}
	})
	e.preventDefault();
});

//
// Get request
//
/*
$('#commentContainer').on('load', function(){
	console.log("comment container loaded")
	$.ajax({
		type: "GET",
		url: "api/comments",// + tid,
		data: //tid
		success: function(res){
			console.log(res)
			searchResults(res)
		}
	})
	e.preventDefault();
});
*/

// 
// Get a parameter from the url
//
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//
// Populate trail data on page load
//
$(document).ready(function() {
	var tid = getParameterByName("tid");
	
	$.get("/api/trails/" + tid, function(data) {
		console.log(data);
		var trail = data[1].rows[0];
		var name = trail.name;
		var trail_type = trail.trail_type;
		var surface_type = trail.surface_type;
		var elevation_change = trail.elevation_change;
		var depth = trail.depth;
		var waterbody_type = trail.waterbody_type;
		
		$("#trailDetails h2").text(name);
		$("#splash div p").text(name);
		$("#imageContainer h3").text("Images from " + name);
		$("label[for='user']").text("Leave a comment about " + name);

		var trail_details = "";
		trail_details += "<ul>";
		trail_details += "<li>" + "Trail type: " + trail_type + "</li>";
		if (elevation_change !== null)
			trail_details += "<li>" + "Elevation Change: " + elevation_change + " meters" + "</li>";
		if (surface_type !== null)
			trail_details += "<li>" + "Surface Type: " + surface_type + "</li>";
		if (depth !== null)
			trail_details += "<li>" + "Depth: " + depth + " feet" + "</li>";
		if (waterbody_type !== null)
			trail_details += "<li>" + "Waterbody type: " + waterbody_type + "</li>";
		trail_details += "</ul>";

		$("#trailDetails h3").html(trail_details);
	});

	$.get("/api/photos/" + tid, function(data) {
		console.log(data);
		var photos = data[1].rows;

		photos.forEach(function(photo) {
			console.log(photo.file_path);
			$("#imageContainer").append("<div class=\"trailImage\" style=\"background-image:url('" + "photos/" + photo.file_path + "');\"></div>");
		});
	});
});