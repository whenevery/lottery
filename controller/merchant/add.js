var express = require('express');
var router = express.Router();

router.get('/',useValidate.wechatLogin,useWechat.merchantInfo.flush, function(req, res, next) {
    var userInfo = req.session.userInfo;
    if(userInfo.type > 1){
        return res.sendErrorHtml('身份不符');
    }
    if(userInfo.status == 1){
        return res.send('你已经有身份在审核中');
    }
    if(userInfo.status == 0){
        if(userInfo.type == 1){
            return res.useRedirect('/merchant');
        }
        res.useRender('merchant/add');
    }
});
router.post('/',useValidate.hasLogin,function(req, res, next) {
    var userInfo = req.session.userInfo;
    if(userInfo.status == 1){
        return res.sendErrorMessage('','你已经有身份在审核中');
    }
    if(userInfo.status == 0){
        if(userInfo.type != 0 || userInfo.score){
            return res.sendErrorMessage('','你已经有身份了，不能成为商户');
        }
        useMysql.update(useSql.common.update('user',{
            type:1,
            status:1,
            phone:req.body.phone,
            updateTime:Date
        },'user_id="'+req.session.userInfo.userId+'"') , function(err , data){
            if(err){
                return res.sendErrorMessage();
            }
            useMysql.add(useSql.common.add('merchant',{
                userId:req.session.userInfo.userId,
                wechatNumber:req.body.wechatNumber,
                spreadName:'时时彩',
            }) , function(err , data){
                if(err){
                    return res.sendErrorMessage();
                }
                res.sendSuccess();
            })
        })
    }
});
exports.router = router;
exports.__path = '/merchant/add';