var express = require('express');
var router = express.Router();
router.get('/list',useValidate.hasLogin,function(req, res, next) {
    var searchData = {
        merchant_id:req.session.userInfo.merchantId,nickName:req.query.nickName,agentId:req.query.agentId
    };
    useMysql.searchAll(
        {
            sql:useSql.merchant.memberSearch(searchData),
            count:useSql.merchant.memberCount(searchData),
            page:req.query.page,
            pageSize:req.query.pageSize,

        }
        ,function(data){
            res.useSend(data);
        })
});
router.get('/info',useValidate.hasLogin,function(req, res, next) {
    useData.getUserInfo(req.query.userId,req.session.userInfo.merchantId,function(err , memberInfo){
        res.useRender('merchant/member',{
            resJson:{
                memberInfo:memberInfo,
                memberType:'agent'
            }

        })
    });
});

exports.router = router;
exports.__path = '/agent/member';