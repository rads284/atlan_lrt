// required libraries
const express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
const app = express();
const router = express.Router();
const port = 3000

app.use(bodyParser.urlencoded({ extended: true ,limit:'50MB'}));
// parse application/json
app.use(bodyParser.json({limit:'50MB'}));
require('./app/routes/router.js')(app);

// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "password",
//     insecureAuth : true
//   });

//   con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//   });

app.listen(port, function(a) {
    console.log("Listening to port 3000");
});