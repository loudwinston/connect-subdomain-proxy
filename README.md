#jig

Easily proxy/route HTTP requests according to the subdomain of their URL.

Implemented as express/connect middleware.

This project uses the excellent [node-http-proxy](https://github.com/nodejitsu/node-http-proxy) library.



###Features

1. Simple configuration via JSON
2. Supports websockets
1. Non-matching requests sent to a default route, or handled by express application (pass-through)



###Simple Configuration Example
	{
		"routes": [
			
			{ "domain": "dev",  "port": 3000 },
			
			//host property is optional and defaults to localhost
			{ "domain": "test", "host": "internal.server", port": 4000 },
			
			//Subdomains can go as deep as you'd like
			{ "domain": "foo.bar", port": 6000 },
			
			//If no "default" route is specified, unmatched requests will be passed to your app 
			{ "domain": "prod", "port": 5000, "default": true }
		]
	}
	
* *http://dev.yourdomain* will proxy traffic to *http://localhost:3000*  
* *http://foo.bar.yourdomain* will proxy traffic to *http://localhost:6000*  
* *http://test will proxy* traffic to *http://internal.server:4000*
* *http://prod.yourdomain* will proxy traffic to *http://localhost:5000*
* Any requests with unknown subdomains will be proxied to *http://localhost:5000*


###Usage Example

	var express = require("express");
	var jig = require("jig");
	
	
	var config = {
		"routes": [
			{ "domain": "dev",  "port": 3000 },
			{ "domain": "test", "port": 4000 },
			{ "domain": "prod", "port": 5000 }
		]
	}
	
	//config argument is optional
	var proxy = new jig(config);
	
	//you can manually add routes
	proxy.add({ "domain": "foo", "port" : 7000})
	
	
	var app = express();
	app.use(proxy.middleware);
	
	//Your application routes go here.  This is just an example
	app.get("*", function(req,res) {
		res.end("NO PROXY MATCH");
	});

	app.listen(8080);
	
###TODO:
* Regex matching of route domains
* Support for paths (/dev, /test, etc) in addition to subdomains











