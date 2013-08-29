// service side
// method 1
function allowOrigin(req, res){
    console.log('allowingCrossDomain');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,HEADER');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization, X-Molt-SessionID');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Content-Type', 'application/json;charset=UTF-8');

    if ('OPTIONS' == req.method) {
      res.send(200);
    }
}

// method 2
var allowCrossDomain = function(req, res, next) {
    console.log('allowingCrossDomain');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,HEADER');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization, X-Molt-SessionID');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Content-Type', 'application/json;charset=UTF-8');
      
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    } else {
      next();
    }
};

// method3
app.configure(function() {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(allowCrossDomain);
});

app.all('/*', function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS,DELETE,HEAD');
    res.header('Access-Control-Allow-Headers', 'Origin,Content-Type,Accept');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Content-Type', 'application/json;charset=UTF-8');
    next();
});

//client side
app.config(['$httpProvider', function($httpProvider) {
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
            $httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            $httpProvider.defaults.headers['options'] = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
            $httpProvider.defaults.headers['delete'] = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
            $httpProvider.defaults.transformRequest = function(data){
                if(data === undefined){return data;}
                return paramForms(data);
            };
        }]);

// json convert to formEncode
function paramForms(obj){
            var result = '';
            for(var i in obj){
                result += encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]) + "&";
            }
            return result.substr(0,result.length-1).replace(/%20/g, '+');
}
