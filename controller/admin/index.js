var express = require('express');
var router = express.Router();


router.get('/admin',useValidate.wechatLogin,useWechat.userInfo.flush,useValidate.checkType('99'), function(req, res, next) {
    res.useRender('admin/admin');
});
router.get('/merchant',useValidate.wechatLogin,useWechat.userInfo.flush,useValidate.checkType('98'), function(req, res, next) {
    res.useRender('admin/merchant');
});
router.post('/examine/admin',useValidate.checkType('99'), function(req, res, next) {
    useMysql.update(useSql.common.update('user',{
        status:0,
        updateTime:Date
    } , 'user_id="'+req.body.userId+'"') , function(err , data){
        res.sendSqlData(err , data);
    });
});
router.post('/examine/merchant',useValidate.checkType('98'), function(req, res, next) {
    useMysql.update(useSql.common.update('user',{
        status:0,
    } , 'user_id="'+req.body.userId+'"') , function(err , data){
        if(err)return req.sendSqlData(err , data);
        useMysql.add(useSql.common.add('merchant_info',{
            userId:req.body.userId,
            lv:1,
            validTime:useCommon.parseDate(new Date(Date.now() + 24 * 60 * 60 * 1000))
        }),function(err , data){
            res.sendSqlData(err,data);
        });
    });
});
exports.router = router;
exports.__path = '/admin';