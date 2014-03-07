//httputils
exports.get = function(url, callback){
	url = require('url').parse(url);
	var hostname = url.hostname, port = url.port || 80;
	var path = url.pathname, query = url.query;
	path = !!query ? path + "?" + query : path;
	
	//简单实现的GET请求
	var client = require("http").createClient(port, hostname);
	var request = client.request("GET", path, {"Host": hostname});
	request.end();
	
	request.on("response", function(response){
		response.setEncoding("utf8");
		var body = "";
		response.on("end", function(){
			if(callback)
				callback(response.statusCode, response.headers, body);
		});
	});
};

exports.post = function(url, data, callback){
	url = require('url').parse(url);
	var hostname = url.hostname, port = url.port || 80;
	var path = url.pathname, query = url.query;
	path = !!query ? path + "?" + query : path;
	
	var type;
	if(data === null) data = "";
	if(data instanceof Buffer)
		type = "application/octet-stream";
	else if(typeof data === "string")
		type = "text/plain;charset=UTF-8";
	else if(typeof data === "object"){
		data = require("querystring").stringify(data);
		type = "application/x-www-form-urlencode";
	}
	
	var client = require('http').createClient(port, hostname);
	var request = client.request("POST", path, {
		"Host": hostname,
		"Content-Type": type
	});
	request.write(data);
	request.end();
	request.on("response", function(response){
		response.setEncoding("utf8");
		var body = "";
		response.on("data", function(chunk){
			body += chunk;
		});
		response.on("end", function(){
			if(callback)
				callback(response.statusCode, response.headers, body);
		});
	});
};
