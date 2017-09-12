var domain = require('domain');
module.exports = function(req , res , next){
    var d = domain.create();
    //监听domain的错误事件
    //测试环境下 res无法正常返回信息 send和render都不行
    d.on('error' , function (err) {
        useLog.log('domain error');
        useLog.log(req.url);
        useLog.log(err.stack || err);
        try{
            if(req.xhr || req.body.__isAjax){
                res.send({code : useCodeEnum.DOMAIN_ERROR_CODE , err : err.message || err ,stack:err.stack, messag : '服务异常'});
            }else{
                res.send('error',({err:err.message || err.stack || err}));
            }
        }catch(e){

        }
        d.dispose();
    });

    d.add(req);
    d.add(res);
    d.run(next);
};

