var request =require('request');
var http =require('http');
module.exports = {
    send:function(req, res , options ){
        var sendData = options.data || {};
        var method = options.method || 'GET';
        var headers = options.headers || {};
        var __ = {
            url:options.url,
            method:method.toUpperCase(),
            headers:headers
        };
        if(method.toUpperCase() == 'POST' && !options.notBody){
            __.body = useCommon.stringify(sendData);
            __.headers["content-type"] = "application/json";
        }else{
            __.url = useCommon.addUrlParam(__.url , sendData);
        }
        useLog.log('request start : ');
        useLog.log(__);
        request(__ , function(err , response , body){
            try{
                body = useCommon.parse(body);
                if('code' in body){
                    if(body.code == 'SUCCESS'){
                        body.code = 0;
                        body.data = body.result;
                        delete body.result;
                    }
                }else{
                    body = {
                        data:body
                    }
                }

            }catch(e){
            }
            useLog.log('request end url: ' + __.url);
            useLog.log(body);
            options.done(body || {code:1,msg:'系统异常'});
        });
    },
    auto:function(req , res , options){
        var sendData = options.data;
        var method = options.method || 'GET';
        var headers = options.headers || {};
        var __ = {
            hostname:options.url.match(/\w+(\.\w+)+/)[0],
            port: 80,
            path:options.url.match(/\/(\w+)?(\/\w+)*$/)[0],
            method:method.toUpperCase(),
            headers:headers
        };
        var portMatch = options.url.match(/\:\d{4,5}/);
        if(portMatch)__.port = portMatch[0].slice(1);
        headers['Cookie'] = req && ('SESSION='+(req.session.apiSessionId || '')) || '';
        if(method.toUpperCase() == 'POST' && !options.notBody){
            headers['Content-Type']  = 'application/json; charset=UTF-8';
        }
        __.callback = function(_res){
            var resData = '';
            var statusCode = _res.statusCode;
            console.log(statusCode);
            console.log(_res.headers);
            var all = [];
            if(req){
                var apiSessionData = useCommon.getCookieData(_res.headers['set-cookie']
                &&_res.headers['set-cookie'].map(function(a){return a.split(';')[0]}).join('; ') || '');
                if(apiSessionData.SESSION && req.session.apiSessionId != apiSessionData.SESSION){
                    req.session.apiSessionId = apiSessionData.SESSION;
                    all.push(new Promise(function(rev , rej){
                        useSession.save(req , res , function(){
                            rev();
                        })
                    }));
                }
            }
            _res.setEncoding('utf8');
            all.push(new Promise(function(rev , rej){
                _res.on('data' , function(chuck){
                    resData+=chuck;
                });
                _res.on('end' , function(){
                    resData = useCommon.parse(resData);
                    if(typeof resData == 'string')resData = {code:7,baseCode:statusCode};
                    useLog.log('request end url: ' + (__.path.split('?')[0]));
                    useLog.log(resData);
                    if(resData)resData.statusCode = statusCode;
                    rev();
                })
            }));
            Promise.all(all).then(function(){
                if(resData)resData.baseCode = resData.code;
                if(resData && (resData.code == 'SUCCESS' || resData.code == 0)){
                    resData.code = 0;
                    resData.data = resData.result;
                    delete resData.result;
                }
                options.done(resData || {code:1,statusCode:statusCode,msg:'系统异常',data:{}});
            });
        };
        if(method.toUpperCase() == 'POST' && !options.notBody){
        }else{
            __.path = useCommon.addUrlParam(__.path , sendData);
        }
        console.log('request start');
        console.log(__);
        console.log(sendData);
        var _req = http.request(__ , __.callback);
        if(method.toUpperCase() == 'POST' && !options.notBody){
            _req.write(useCommon.stringify(sendData) + '\n' );
        }else{
        }
        _req.end();
    },
    request : request
};