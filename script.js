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
		  color: '#ff0',
		  width: 1
		})
	  })
	}),
	'LineString': new ol.style.Style({
	  stroke: new ol.style.Stroke({
		color: '#f00',
		width: 3
	  })
	}),
	'MultiLineString': new ol.style.Style({
	  stroke: new ol.style.Stroke({
		color: '#0f0',
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
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }),
		  vector
        ],
        target: 'map',
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