var express = require('express');
var router = express.Router();

router.get('/',useValidate.wechatLogin,useWechat.userInfo.flush, function(req, res, next) {
    var userInfo = req.session.userInfo;
    if(userInfo.type === 1){
        return res.useRedirect('/merchant');
    }
    if(userInfo.type === 0){
        res.useRender('user/index');
    }else{
        return res.useRender('/admin/merchant');
    }
});
exports.router = router;
exports.__path = '/user';