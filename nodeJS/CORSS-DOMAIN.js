// service side

function allowOrigin(req, res){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,HEAD');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With,Accept');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Content-Type', 'application/json;charset=UTF-8');
}

//client side
app.config(['$httpProvider', function($httpProvider) {
            $httpProvider.defaults.useXDomain = true;
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            $httpProvider.defaults.transformRequest = function(data){
                if(data === undefined){return data;}
                return paramForms(data);
            };
        }]);

function paramForms(obj){
            var result = '';
            for(var i in obj){
                result += encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]) + "&";
            }
            return result.substr(0,result.length-1).replace(/%20/g, '+');
}
