var http    = require("http");
var express	= require("express");
var mysql	= require("mysql");
var bodyParser	= require("body-parser");
var multer = require("multer");
var path = require("path");
var crypto = require("crypto");
var exif = require("exif").ExifImage;
var fs = require("fs");
var toGeoJson = require("togeojson");
var DOMParser = require('xmldom').DOMParser;

// Connect to mysql
var connection = mysql.createConnection({
    host:	"localhost",
    user:	"trails_db",
    password:	"trails_db_123",
    database:	"trails_db"
});

connection.connect(function(err){
    if(!err){
        console.log("Connected to mysql");
    } else {
        console.log("Error connecting to mysql: " + err);
    }
});

// Set up express
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("port", process.env.PORT || 80);

app.use(express.static('public'));

// Routes for API
var router = express.Router();

// Register routes
app.use("/api", router);

// Pretty print JSON for debugging purposes
app.locals.pretty = true;
app.set("json spaces", 2);

// Get trails
router.route("/trails")
.get(function(req, res) {
	console.log(req.query.name)
    var response = [];
	
	// If admin is searching
	if (req.query.user_type == 'admin'){
		console.log("user type: " + req.query.user_type)
		console.log("boundaries: " + req.query.boundaries)
		if (req.query.name != '' && typeof req.query.trail_type == 'undefined') {
			mysqlStatement = "SELECT * FROM Trails WHERE name LIKE '" + req.query.name + "'";
		} else if (typeof req.query.trail_type != 'undefined' && req.query.name == '') {
			mysqlStatement = "SELECT * FROM Trails WHERE trail_type = '" + req.query.trail_type + "'";
		} else if (req.query.name != '' && typeof req.query.trail_type != 'undefined') {
			mysqlStatement = "SELECT * FROM Trails WHERE name LIKE '" + req.query.name + 
			"' AND trail_type = '" + req.query.trail_type + "'";
		} else if (req.query.name == '' && typeof req.query.trail_type == 'undefined') {
			mysqlStatement = "SELECT * FROM Trails";
		}
	}
	// If regular user is searching
	else if (req.query.user_type == 'user'){
		console.log(req.query.user_type)
		if (req.query.boundaries != '' && typeof req.query.trail_type == 'undefined'){
			console.log(req.query.boundaries)
			numBoundaries = JSON.parse(req.query.boundaries)
			left = numBoundaries[0]
			bottom = numBoundaries[1]
			right = numBoundaries[2]
			top = numBoundaries[3]
			mysqlStatement = "SELECT * FROM Trails WHERE lat > " + bottom + " AND lat < " + top + " AND lng > " + left + " AND lng < " + right;
		} else if (req.query.boundaries != '' && typeof req.query.trail_type != 'undefined') {
			console.log(req.query.boundaries)
			numBoundaries = JSON.parse(req.query.boundaries)
			left = numBoundaries[0]
			bottom = numBoundaries[1]
			right = numBoundaries[2]
			top = numBoundaries[3]
			mysqlStatement = "SELECT * FROM Trails WHERE lat > " + bottom + " AND lat < " + top + " AND lng > " + left + " AND lng < " + right + " AND trail_type = '" + req.query.trail_type + "'";
		} else if (req.query.boundaries == '' && typeof req.query.trail_type == 'undefined') {
			mysqlStatement = "SELECT * FROM Trails";
		} else if (req.query.boundaries == '' && typeof req.query.trail_type != 'undefined') {
			mysqlStatement = "SELECT * FROM Trails WHERE trail_type = '" + req.query.trail_type + "'";
		}

	}
	console.log(mysqlStatement)
	
    connection.query(mysqlStatement, function(err, rows, fields) {
		console.log(mysqlStatement)
        if(!err && rows.length >0) {
            console.log(rows);
            response.push({ "result": "success" });
            response.push({ "rows": rows });
            res.json(response);
        } else {
            response.push({ "result": "failure" });
            response.push({ "error": err });
            res.json(response); //added this to get a response
        }
    });
})
.post(function(req, res) {
    // Create a trail
	var response = [];

    if (
        typeof req.body.trail_type == "undefined" &&
        typeof req.body.name == "undefined"
        ){
        response.push({ "result": "error", "msg": "Please fill out all fields" });
        res.json(response);
    }

    if (req.body.trail_type == 'LAND'){
        if (
        	typeof req.body.surface_type == 'undefined' &&
        	typeof req.body.elevation_change == 'undefined'
        	)
            response.push({ "result": "error", "msg": "Please fill out all fields" });
    } else if (req.body.trail_type == 'WATER') {
        if (
        	typeof req.body.waterbody_type == 'undefined' &&
        	typeof req.body.depth == 'undefined'
        	)
            response.push({ "result": "error", "msg": "Please fill out all fields" });
    }

    const trail = {
    	trail_type: req.body.trail_type,
    	name: req.body.name,
    	surface_type: req.body.surface_type,
    	depth: req.body.depth,
    	waterbody_type: req.body.waterbody_type
    };

    connection.query("INSERT INTO Trails SET ?",
            trail,
            function(err, result) {
                if (!err) {
                    if (result.affectedRows != 0){ 
                        console.log(result);
                        response.push({ "result": "successs" });
                    } else{
                        response.push({ "result": "failure" });
                    }
                    res.json(response);
                } else {
                    res.status(400).send(err);
                }
            });
});

router.route("/trails/:tid")
.get(function(req, res) {
    // Get a trail with that ID
	//res.sendFile(path.join(__dirname + '/public/details.html'));
    var response = [];

    connection.query("SELECT * FROM Trails WHERE tid = " + req.params.tid, function(err, rows, fields) {
        if (!err && rows.length > 0) {
            console.log(rows);
            response.push({ "result": "success" });
            response.push({ "rows": rows });
            res.json(response);
        } else {
            response.push({ "result": "failure" });
            response.push({ "error": err });
            res.json(response);
        }
    });
})
.put(function(req, res) {
	// Update a trail with that ID
	response = [];

    if (req.body.trail_type == 'LAND'){
        if (
        	typeof req.body.surface_type == 'undefined' &&
        	typeof req.body.elevation_change == 'undefined'
        	) {
        	response.push({ "result": "error", "msg": "Please fill out all fields" });
        	res.json(response);
        }
    } else if (req.body.trail_type == 'WATER') {
        if (
        	typeof req.body.waterbody_type == 'undefined' &&
        	typeof req.body.depth == 'undefined'
        	) {
        	response.push({ "result": "error", "msg": "Please fill out all fields" });
        	res.json(response);
        }
    }

    console.log(req.body.name);
    console.log(req.body.lat);
    console.log(req.body.lng);

    const trail = {
    	name: req.body.name,
    	surface_type: req.body.surface_type,
    	depth: req.body.depth,
    	waterbody_type: req.body.waterbody_type
    };

    connection.query("UPDATE Trails SET ? WHERE tid = ?", [trail, req.params.tid], function (err, result) {
    	if (err) {
    		response.push({ "result": "failure" });
    		response.push({ "err": err });
    		res.json(response);
    	} else {
    		if (result.affectedRows != 0){
    			response.push({ "result": "success" });
    			res.json(response);
    		} else {
    			response.push({ "result": "failure" });
    			res.json(response);
    		}
    	}
    });
})
.delete(function(req, res) {
    // Delete a trail with that ID
    connection.query("DELETE FROM Trails WHERE tid = " + req.params.tid, function(err, rows, fields) {
        if (!err)
            res.json({ "message": "Deleted trail " + req.params.tid });
        else
            res.json({ "message": "Error deleting trail " + req.params.tid + ": " + err });
    });
});

const gpxStorage = multer.diskStorage({
    destination: "./tmp/gpx",
    filename: function (req, file, cb){
        crypto.pseudoRandomBytes(16, function(err, raw) {
            if (err) return cb(err);

            cb(null, raw.toString("hex") + path.extname(file.originalname));
        });
    }
});

var gpxUpload = multer({ storage: gpxStorage });

// Upload GPX data. Must have URL parameter tid to specify which trail to associate it with
app.post("/api/gpx", gpxUpload.single("gpx"), function (req, res) {
    var response = [];

    if (req.query.tid === undefined){
        response.push({ "result": "failure" });
        response.push({ "err": "Must specify a trail id as a URL parameter" });
        res.json(response);
    }

    if (!req.file) {
        console.log("No file received");
        response.push({ "result": "failure" });
        response.push({ "err": "No file recieved" });
        res.json(response);
    } else {
        console.log("File received");
        console.log(req.file);

        fs.readFile(req.file.path, "utf8", function(err, data) {
            var gpx = new DOMParser().parseFromString(data);

            var converted = toGeoJson.gpx(gpx);
            var coordinates = converted.features[0].geometry.coordinates;
            var lat = coordinates[0][0];
            var lng = coordinates[0][1];
            var start_elevation = coordinates[0][2];
            var end_elevation = coordinates[coordinates.length - 1][2];
            var elevation_change = end_elevation - start_elevation;

            console.log("GPX: " + gpx);
            console.log("Lat: " + lat);
            console.log("Lng: " + lng);
            console.log("Elevation change: " + elevation_change);

            const trail = {
                lat: lat,
                lng: lng,
                elevation_change: elevation_change,
                gps_data: gpx
            }

            connection.query("UPDATE Trails SET ? WHERE tid = ?", [trail, req.query.tid], function(err, result){
                if (err) {
                    response.push({ "result": "failure" });
                    response.push({ "err": err });
                    res.json(response);
                } else {
                    if (result.affectedRows != 0){
                        response.push({ "result": "success" });
                        res.json(response);
                    } else {
                        response.push({ "result": "failure" });
                        res.json(response);
                    }
                }
            });

            fs.unlink(req.file.path, function (err) {
                if(err) throw err;
                console.log("Deleted " + req.file.path);
            });
        });
    }

});

const storage = multer.diskStorage({
	destination: "./public/photos",
	filename: function (req, file, cb){
		crypto.pseudoRandomBytes(16, function(err, raw) {
			if (err) return cb(err);

			cb(null, raw.toString("hex") + path.extname(file.originalname));
		});
	}
});

var upload = multer({ storage: storage });

// Create a photograph. Must have URL parameter tid to specify which trail to associate it with
app.post("/api/photos", upload.array("photos", 100), function (req, res) {
	var response = [];

	if (req.query.tid === undefined){
		response.push({ "result": "failure" });
		response.push({ "err": "Must specify a trail id as a URL parameter" });
        res.json(response);
	}

    if (!req.files) {
        if (!req.file) {
            console.log("No files received");
            response.push({ "result": "failure" });
            response.push({ "err": "No file recieved" });
            res.json(response);
        }
    } else {
        req.files.forEach(function(photo) {
            console.log("Files received");
            try {
                new exif({ image: photo.path }, function (err, exifData) {
                    if (err) {
                        console.log("Error" + err.message);
                        response.push({ "result": "failure" });
                        response.push({ "err" : err.message });
                        res.json(response);
                    }
                    else {
                        var lat_arr = exifData.gps.GPSLatitude;
                        var lng_arr = exifData.gps.GPSLongitude;
                        var lat = lat_arr[0] + lat_arr[1]/60.0 + lat_arr[2]/3600.0;
                        var lng = lng_arr[0] + lng_arr[1]/60.0 + lng_arr[2]/3600.0;
                        var datetime = exifData.exif.DateTimeOriginal;
                        var date = datetime.slice(0,10).split(":").join("-")
                        console.log("Exif data - " + "Lat: " + lat + ", Lng: " + lng + " Date: " + date);

                        const photograph = {
                            "file_path": photo.filename,
                            "lat": lat,
                            "lng": lng,
                            "date": date,
                            "tid": req.query.tid
                        };

                        connection.query("INSERT INTO Photographs SET ?", photograph, function (err, rows) {
                            if (err) {
                                response.push({ "result": "failure" });
                                response.push({ "err": err });
                                res.json(response);
                            } else {
                                response.push({ "result": "success" });
                            }
                        });

                    }
                });
            } catch (error) {
                console.log("Error: " + error.message);
                response.push({ "result": "failure" });
                response.push({ "err": error.message });
            }
        });
        res.json(response);
    }
});

router.route("/photos/:pid")
.get(function(req, res) {
    // Get a photo with that ID
    var response = [];

    connection.query("SELECT * FROM Photographs WHERE pid = " + req.params.pid, function(err, rows, fields) {
        if (!err && rows.length > 0) {
            console.log(rows);
            response.push({ "result": "success" });
            response.push({ "rows": rows });
            res.json(response);
        } else {
            response.push({ "result": "failure" });
            response.push({ "error": err });
            res.json(response);
        }
    });
})
.delete(function(req, res) {
    // Delete a photo with that ID
    connection.query("DELETE FROM Photographs WHERE pid = " + req.params.pid, function(err, rows, fields) {
        if (!err)
            res.json({ "message": "Deleted photo: " + req.params.pid });
        else
            res.json({ "message": "Error deleting photo: " + req.params.pid + ": " + err });
    });
});

router.route("/photos/:tid")
.get(function(req, res) {
    // Get all photos associated with a trail
    var response = [];

    connection.query("SELECT * FROM Photographs WHERE tid = " + req.params.tid, function(err, rows, fields) {
        if (!err && rows.length > 0) {
            console.log(rows);
            response.push({ "result": "success" });
            response.push({ "rows": rows });
            res.json(response);
        } else {
            response.push({ "result": "failure" });
            response.push({ "error": err });
        }
    });
});

router.route("/comments")
.post(function(req, res) {
    // Create a comment
    var response = [];

    if (
            typeof req.body.user !== "undefined" &&
            typeof req.body.rating !== "undefined" &&
            typeof req.params.comment !== "undefined" &&
            typeof req.params.tid !== "undefined"
       ) {
        connection.query("INSERT INTO Comments (user, rating, tid, comment) VALUES (?, ?, ?, ?)",
                    [req.body.user, req.body.rating, req.body.tid, req.body.comment],
                    function(err, result) {
                        if (!err) {
                            if (result.affectedRows != 0)
                                response.push({ "result": "success" });
                            else
                                response.push({ "result": "failure" });

                            res.json(response);
                        } else {
                            res.status(400).send(err);
                        }
                    });
    } else {
        response.push({ "result": "error", "msg": "Please fill out all fields" });
        res.json(response);
    }
});

router.route("/comments/:cid")
.delete(function(req, res) {
    // Delete a comment with that ID
    connection.query("DELETE FROM Comments WHERE cid = " + req.params.cid, function(err, rows, fields) {
        if (!err)
            res.json({ "message": "Deleted comment: " + req.params.cid });
        else
            res.json({ "message": "Error deleting: " + req.params.cid + ": " + err });
    });
});

router.route("/comments/:tid")
.get(function(req, res) {
    // Get all comments associated with a trail
    var response = [];

    connection.query("SELECT * FROM Comments WHERE tid = " + req.params.tid, function(err, rows, fields) {
        if (!err && rows.length > 0) {
            console.log(rows);
            response.push({ "result": "success" });
            response.push({ "rows": rows });
            res.json(response);
        } else {
            response.push({ "result": "failure" });
            response.push({ "error": err });
        }
    });
});

http.createServer(app).listen(app.get("port"), function () {
    console.log("Listening on port " + app.get("port"));
});

module.exports = app;
