module.exports = function(req , res , next){
    res.sendErrorMessage = function(errorCode , message){
        errorCode = errorCode || 'FAIL';
        var codeEnum = useCodeEnum[errorCode];
        if(!codeEnum)codeEnum = useCodeEnum.FAIL;
        var code = codeEnum[0];
        if(code < 1000 && code > 100){
            res.status(code);
        }
        var sendData = {
            code:code,
            message:codeEnum[1]
        };
        if(message){
            if(typeof message == 'string'){
                sendData.message = message;
            }else{
                useCommon.extendMore(sendData , message);
            }
        }
        if(req.__xhr){
            res.useSend(sendData);
        }else{
            res.sendErrorHtml(sendData.message);
        }
    };
    res.statusErrorCode = function(errorCode){
        res.status(useCodeEnum[errorCode][0]).end();
    };
    res.sendErrorHtml = function(message){
        res.useRender('error' , {message:message || '系统繁忙'});
    };
    res.sendSuccess = function(data , message){
        res.useSend({
            code:useCodeEnum.SUCCESS[0],
            message:message || '操作成功',
            data:data
        });
    };
    res.sendSqlData = function(err , data){
        res.useSend({
            code:err!==null,
            err:err,
            message:err?(err.message||'操作失败') : '操作成功',
            data:data
        });
    };
    res.useRender = function(path , data){
        // useSession.resave(req , res , function(){
            data = data || {};
            data.resJson = data.resJson || {};
            data.resJson.imgUrl = useConfig.imgUrl;
            data.modalInfo = data.modalInfo || {};
            //渠道默认都是msxf
            data.sessionJson = req.session || {};
            data.message = data.message || '系统繁忙 请稍后再试';
            data.__CSRF = req.session.__CSRF || '';

            //res.setHeader('X-Frame-Options','SAMEORIGIN');
            data.query = useCommon.extend({},req.query);
            data.body = useCommon.extend({},req.body);
            data.params = useCommon.extend({},req.params);
            res.render('page/' + path , data);
        // });
    };
    res.useSend = function(body){
        // useSession.resave(req , res , function(){
        body = body || {};
        body.message = (body.message || (body.code == 0?'操作成功':'操作失败'));
        res.send(body);
        // });
    };
    res.useRedirect = function(path){
        // useSession.resave(req , res , function(){
            res.redirect(path);
        // });
    };
    next();
};