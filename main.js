//This is just a testing file
//TODO: Write better tests


var http = require('http');
var fs = require("fs");
var express = require("express");

var FILE = "config.sample.json";


var config = JSON.parse(fs.readFileSync(FILE));

var router = new require("./jig.js").Parse(config);


//Create fake app
config.routes.forEach(function(route) {
	
	console.log("Creating app for route ", JSON.stringify(route));
	var app = express();
	app.all("*", function(req,res) { 
		res.end("This is the application named " + route.domain  + " running on port " + route.port);
	});

	http.createServer(app).listen(route.port);
});

var mainApp = express();
mainApp.use(router.middleware);
mainApp.get("*", function(req,res) {
	res.end("NO PROXY MATCH");
});
mainApp.listen(8080);
console.log("Done and listening on ", 8080)




