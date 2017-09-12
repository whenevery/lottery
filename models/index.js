module.exports = {
    data:require('./use-data'),
    mongoose:require('./use-mongoose'),
    mysql:require('./use-mysql'),
    game:require('./use-game'),
    multer:require('./use-multer'),
    init:function(app , call){
        //捕获异步产生的异常
        app.use(require('./use-domain'));
        //公用方法
        global.useCommon = require('./use-common');
        //加载配置
        global.useConfig = require('./use-config');
        global.useCaptcha = require('./captcha.js');
        global.useMulter = this.multer;
        //封装新的render
        app.use(require('./use-render'));

        //枚举
        global.useEnum = require('./use-enum/enum.js');
        //code枚举
        global.useCodeEnum = require('./use-enum/codeEnum.js');

        global.useMongo = this.mongoose;
        global.useMysql = this.mysql;
        //公用数据
        global.useData = this.data;
        //log
        global.useLog = require('./use-log');
        //validate
        global.useValidate = require('./use-validate');

        //request
        global.useRequest = require('./use-request');
        //加载session
        global.useSession = require('./session/mongo.js');
        app.use(useSession.init({session_key:'lottery'}));
        global.useWechat = require('./use-wechat');
        global.useSql = require('./use-sql');
        global.useRule = require('./use-rule');
        global.useGame = this.game;
        global.useJsCommon = require('./use-js-common');
        global.useWs = require('./use-ws');
        app.use(function(req , res , next){
            var method = req.method;
            if(method === 'POST'
                && (req.url.indexOf('file') === -1
                    && req.url.indexOf('test') === -1
                    && req.url.indexOf('wechat') === -1
                )){
                if(req.body.__CSRF !== req.session.__CSRF){
                    if(!req.session.__CSRF){
                        req.session.__CSRF = Date.now();
                    }
                    res.sendErrorMessage('HTTP_CODE_403');
                    return;
                }
            }
            next();
        });

        //URL对象管理
        global.useUrl = require('./url.js');

        useJsCommon.init();
        //初始化
        var all = [];
        for(var i in this){
          var obj = this[i];
            if(obj.init){
              all.push(new Promise(function(rev){
                  obj.init(function(){
                    rev();
                  });
              }));
            }
        }
        Promise.all(all).then(function(){
            require('./controller')(app  , function(){
                //路由已经绑定完

                //捕获错误的统一处理
                app.use(require('./error'));

                //404处理
                app.use(function(req, res){
                    res.sendErrorMessage('HTTP_CODE_404');
                });
                var port = process.env.PORT || useConfig.port || 3000;
                app.listen(port);
                useLog.log('start at http://127.0.0.1:' + port );
                if(call)call();
            });
        });
    }
}