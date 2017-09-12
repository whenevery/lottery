var express = require('express');
var router = express.Router();

router.get('/',useValidate.wechatLogin,useWechat.merchantInfo.flush, function(req, res, next) {
    var userInfo = req.session.userInfo;
    if(userInfo.type > 1){
        return res.sendErrorHtml('身份不符');
    }
    if(userInfo.type != 1){
        return res.useRedirect('/merchant/add');
    }
    if(userInfo.status == 0){
        if(!userInfo.validTime || new Date(userInfo.validTime) < Date.now()){
            return res.sendErrorHtml('你的使用时间不足 请联系管理员加时间');
        }
        res.useRender('merchant/index');
    }else{
        return res.sendErrorHtml('你的商户正在审核中');
    }
});
router.get('/info',useValidate.hasLogin,function(req, res, next) {
    useMysql.search(
        useSql.merchant.search({
            userId:req.query.userId
        }),function(err , data){
            res.sendSqlData(err, data[0]);
        }
    )
});
router.post('/update',useValidate.hasLogin,function(req, res, next) {
    useMysql.update(
        useSql.common.update('merchant',{
            wechatNumber:req.body.wechatNumber,
            upScoreImg:req.body.upScoreImg,
            connectImg:req.body.connectImg,
            spreadName:req.body.spreadName,
        },{
            userId:req.session.userInfo.userId
        }),function(err , data){
            res.sendSqlData(err , data);
        }

    )
});
exports.router = router;
exports.__path = '/merchant';