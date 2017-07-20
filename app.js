var http    = require("http");
var express	= require("express");
var mysql	= require("mysql");
var bodyParser	= require("body-parser");

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

router.route("/trails")
.get(function(req, res) {
    var response = [];

    connection.query("SELECT * FROM Trails", function(err, rows, fields) {
        if(!err && rows.length >0) {
            console.log(rows);
            response.push({ "result": "success" });
            response.push({ "rows": rows });
            res.json(response);
        } else {
            response.push({ "result": "failure" });
            response.push({ "error": err });
        }
    });
})
.post(function(req, res) {
    // Create a trail
	var response = [];

    if (req.body.trail_type == 'LAND'){
        if ( typeof req.body.surface_type == 'undefined' )
            response.push({ "result": "error", "msg": "Please fill out all fields" });
    } else if (req.body.trail_type == 'WATER') {
        if (typeof req.body.waterbody_type == 'undefined' )
            response.push({ "result": "error", "msg": "Please fill out all fields" });
    }

    if (
            typeof req.body.name !== 'undefined' &&
            typeof req.body.lat !== 'undefined' &&
            typeof req.body.lng !== 'undefined' &&
            typeof req.body.gps_data !== 'undefined' &&
            typeof req.body.trail_type !== 'undfined'
       ) {
        connection.query("INSERT INTO Trails (name, lat, lng, trail_type, gps_data, surface_type, elevation_change, depth, waterbody_type) VALUES (?,?,?,?,?,?,?,?,?)",
                [req.body.name, req.body.lat, req.body.lng, req.body.trail_type, req.body.gps_data, req.body.surface_type, req.body.elevation_change, req.body.depth, req.body.waterbody_type],
                function(err, result) {
                    if (!err) {
                        if (result.affectedRows != 0)
                            response.push({ "result": "successs" });
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

router.route("/trails/:tid")
.get(function(req, res) {
    // Get a trail with that ID
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
.delete(function(req, res) {
    // Delete a trail with that ID
    connection.query("DELETE FROM Trails WHERE tid = " + req.params.tid, function(err, rows, fields) {
        if (!err)
            res.json({ "message": "Deleted trail " + req.params.tid });
        else
            res.json({ "message": "Error deleting trail " + req.params.tid + ": " + err });
    });
});

router.route("/photos")
.post(function(req, res) {
    // Create a photograph
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
