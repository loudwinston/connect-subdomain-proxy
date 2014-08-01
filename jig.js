var fs = require("fs");
var http = require('http');
var httpProxy = require('http-proxy');
var Q = require("q");


var router = function(config) {	
	var self = this;

	var domainMap = {};
	var pathMap = {};

	var defaultRoute = null;
	var routes = [];


	var getConfigForRequest = function(req) {
		var host = req.headers.host;

		for (var key in domainMap) {
			if (host.indexOf(key + ".") == 0) {
				return domainMap[key];
			}
		}

		return defaultRoute;
	}


	var proxy = httpProxy.createProxyServer({});
	proxy.on('upgrade', function (req, socket, head) {
	  proxy.ws(req, socket, head);
	});
	//TODO: better handling of errors
	proxy.on('error', function(err) {
		throw new Error(err);
	});

	//TODO: Check the configuration file before parsing
	if (config) {
		config.routes.forEach(function(route) {
		if (route.domain) {
				this.add(route);
			}
		});
	}

	
	
	
	
	this.middleware = function(req,res,next) {
		var config = getConfigForRequest(req);

		var host = config.host || "localhost";

		if (config) {
			var target ='http://'+host+':'+config.port;
			proxy.web(req, res, { target: target });	
		}
		else {
			next();
		}
	}


	this.add = function(route) {
		if (!!route.default) {
			defaultRoute = route;
		}
		
		if (route.domain) {
			domainMap[route.domain] = route;
		}
		if (route.path) {
			pathMap[route.path] = route;
		}	
	}
	
	return this;
}


module.exports = router;