var express = require('express');
var router = express.Router();
router.get('/entrance', function(req, res, next) {
    req.session.openId = req.query.openid;
    req.session.unionid = req.query.unionid || req.query.openid;
    var wechat_info= req.query;
    wechat_info.openId = wechat_info.openid;
    wechat_info.headImg = wechat_info.headimgurl;
    wechat_info.nickName = wechat_info.nickname;
    wechat_info.unionid = req.session.unionid;
    req.session.wechat_info = req.query;
    useSession.save(req , res , function(){
        res.useRedirect(req.session.wechat_callback);
    });
});
router.get('/login', function(req, res, next) {
    if(req.session.unionid){
        return res.useRedirect(req.session.wechat_callback);
    }
    res.redirect(useConfig.wechatLoginUrl);
});
router.post('/jssdk', function(req, res, next) {
    useRequest.send(req , res , {
        url:useConfig.wechatJssdkUrl,
        data:req.body,
        method:'POST',
        done:function(data){
            res.useSend(data);
        }
    });
});
exports.router = router;
exports.__path = '/wechat';
