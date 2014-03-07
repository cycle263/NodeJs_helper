//http服务器，处理当前目录的文件
var http = require('http'),
	fs = require('fs'),
	server = new http.Server();
	
server.listen(8090);

//Node使用“on()”方法注册事件
server.on('request', function(request, response){
	var url = require('url').parse(request.url);
	console.log(url);
	
	//模拟缓慢网速的网络连接
	if(url.pathname === '/test/delay'){
		var delay = parseInt(url.query) || 2000;
		response.writeHead(200, {"Content-Type": "text/plain;charset=UTF-8"});
		response.write("Sleeping for " + delay + " milliseconds...");
		setTimeout(function(){
			response.write("Done.");
			response.end();
		}, delay);
	}else if(url.pathname === '/test/mirror'){
		response.writeHead(200, {"Content-Type": "text/plain;charset=UTF-8"});
		response.write(request.method + " " + request.url + " HTTP/" + request.httpVersion + "\r\n");
		for(var h in request.headers){
			response.write(h + ": " + request.headers[h] + "\r\n")
		}
		response.write("\r\n");
		request.on("data", function(chunk){
			response.write(chunk);
		});
		request.on("end", function(chunk){response.end();});
	}else{
		var filename = url.pathname.substring(1);
		var type;
		switch(filename.substring(filename.lastIndexOf(".")+1)){
			case "html":
			case "htm":
				type = "text/html; charset=UTF-8";
				break;
			case "js":
				type = "application/javascript;charset=UTF-8";
				break;
			case "css":
				type = "text/css;charset=UTF-8";
				break;
			case "txt":
				type = "text/plain;charset=UTF-8";
				break;
			case "manifest":
				type = "text/cache-manifest;charset=UTF-8";
				break;
			default:
				type = "application/octet-stream";
				break;
		}
		
		//异步读取文件
		fs.readFile(filename, function(err, content){
			if(err){
				response.writeHead(404, {"Content-Type": "text/plain;charset=UTF-8"});
				response.write(err.message);
				response.end();
			}else{
				response.writeHead(200, {"Content-Type": type});
				response.write(content);
				response.end();
			}
		});
	}
});
