module.exports = function(req , res , next){
    if(req.session.unionid)return next();
    //if(/MicroMessenger/i.test(req.headers['user-agent'])){
        req.session.wechat_callback = req.baseUrl + req.url;
        console.log('wechat_callback : ' + req.session.wechat_callback);
        useSession.save(req , res , function(){
            res.useRedirect(useConfig.wechatLoginUrl);
        });
    //}else next();
};