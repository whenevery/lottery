var express = require('express');
var router = express.Router();

router.get('/',useValidate.wechatLogin,useWechat.userInfo.flush, function(req, res, next) {
    var userInfo = req.session.userInfo;
    if(userInfo.status == 0){
        if(userInfo.type == 1 || userInfo.score){
            return res.send('玩家或者商户不能成为管理员');
        }
        if(userInfo.type > 90){
            res.useRedirect('/admin/merchant');
        }else{
            useMysql.update(useSql.user.update({
                type:98,
                status:1
            } , ' unionid="'+req.session.unionid+'"') , function(err , data){
                if(err){
                    res.send('申请异常');
                }else{
                    res.send('申请成功');
                }
            });
        }
    }else{
        if(userInfo.type > 90){
            res.send('账号审核中');
        }else{
            res.send('访问权限不足');
        }

    }
});
router.post('/time',useValidate.checkType('98'), function(req, res, next) {
    useData.getMerchantInfo(req.body.userId , function(e , userInfo){
        if(e){
            res.sendErrorMessage();
        }else{
            if(!userInfo){
                res.sendErrorMessage(0,'用户不存在');
            }
            else{
                if(userInfo.status !== 0){
                    res.sendErrorMessage(0,'用户状态不正常');
                }else{
                    console.log(userInfo);
                    var times = req.body.time * 30 * 24 * 3600 * 1000;
                    var validTime = useCommon.parseDate(Date.now() + times),isAdd;
                    if(userInfo.validTime){
                        if(new Date(userInfo.validTime)>Date.now()){
                            validTime = useCommon.parseDate(new Date(userInfo.validTime) - 0 + times);
                        }
                    }
                    useMysql.update(useSql.common.update('merchant_info',{
                        validTime:validTime
                    },{
                        userId:req.body.userId
                    }),function(err , data){
                        res.sendSqlData(err,data);
                    })
                }
            }
        }
    });
});
exports.router = router;
exports.__path = '/admin/add';