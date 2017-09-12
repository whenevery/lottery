module.exports = function(type){
    return function(req , res , next){
        console.log('wechatLogin')
        console.log(req.session.userInfo)
        useValidate.wechatLogin(req , res , function(){
            if(req.session.userInfo.type >= type)return next();
            res.status(useCodeEnum.HTTP_CODE_406[0]);
            res.useSend({message:'权限不足',code:useCodeEnum.HTTP_CODE_406[0]});
        });

    }
};