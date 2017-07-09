var http    = require('http');
var express	= require('express');
var mysql	= require('mysql');
var bodyParser	= require('body-parser');

// Connect to mysql
var connection = mysql.createConnection({
    host:	'localhost',
    user:	'trails_db',
    password:	'trails_db_123',
    database:	'trails_db',
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
app.set('port', process.env.PORT || 80);

// Routes for API
var router = express.Router();

// Register routes
app.use('/api', router);

// Pretty print JSON for debugging purposes
app.locals.pretty = true;
app.set('json spaces', 2);

router.route('/trails/land')
.get(function(req, res) {
    // Get all land trails
})
.post(function(req, res) {
    // Create a land trail
});

router.route('/trails/land/:id')
.get(function(req, res) {
    // Get a land trail with that ID
})
.put(function(req, res) {
    // Update a land trail with that ID
})
.delete(function(req, res) {
    // Delete a land trail with that ID
});

router.route('/trails/water')
.post(function(req, res) {
    // Create a water trail 
})
.get(function(req, res) {
    // Get all water trails
});

router.route('/trails/water/:id')
.get(function(req, res) {
    // Get a water trail with that ID
})
.put(function(req, res) {
    // Update a water trail with that ID
})
.delete(function(req, res) {
    // Delete a water trail with that ID
});

router.route('/photos')
.post(function(req, res) {
    // Create a photograph
});

router.route('/photos/:id')
.get(function(req, res) {
    // Get a photo with that ID
})
.delete(function(req, res) {
    // Delete a photo with that ID
});

router.route('/photos/:tid')
.get(function(req, res) {
    // Get all photos associated with a trail
});

router.route('/comments')
.post(function(req, res) {
    // Create a comment
});

router.route('/comments/:id')
.delete(function(req, res) {
    // Delete a comment with that ID
});

router.route('/comments/:tid')
.get(function(req, res) {
    // Get all comments associated with a trail
});


http.createServer(app).listen(app.get('port'), function () {
    console.log('Listening on port' + app.get('port'));
});

module.exports = app;
