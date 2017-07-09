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

module.exports = app;
