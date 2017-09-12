module.exports = function(status){
    return function(req , res , next){
        useValidate.wechatLogin(req , res , function(){
            if(req.session.userInfo.status >= status)return next();
            res.status(useCodeEnum.HTTP_CODE_408);
            res.useSend({message:'状态异常',code:useCodeEnum.HTTP_CODE_408});
        });

    }
};