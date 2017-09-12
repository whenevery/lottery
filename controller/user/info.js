var express = require('express');
var router = express.Router();

router.get('/',useValidate.hasLogin,useWechat.userInfo.flush,function(req, res, next) {
    res.sendSuccess(req.session.userInfo);
});

router.get('/merchant',useValidate.hasLogin,useWechat.merchantInfo.flush,function(req, res, next) {
    res.sendSuccess(req.session.userInfo);
});
router.get('/count',useValidate.hasLogin,useWechat.userInfo.flush,function(req, res, next) {
    useData.getUserInfo(req.session.userInfo.userId,req.session.userInfo.merchantId,function(err , memberInfo){
        res.useRender('merchant/member',{
            resJson:{
                memberInfo:memberInfo,
                memberType:'user'
            }
        })
    });
});

exports.router = router;
exports.__path = '/user/info';