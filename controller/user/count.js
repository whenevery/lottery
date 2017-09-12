var express = require('express');
var router = express.Router();
router.get('/bet',useValidate.hasLogin,function(req, res, next) {
    //下注数据
    useMysql.query(useSql.agentCount.count({
        merchantId:req.session.userInfo.merchantId,
        memberId:req.session.userInfo.userId
    }),function(err , data){
        res.sendSqlData(err,data);
    });
});
router.get('/score',useValidate.hasLogin,function(req, res, next) {
    //上下分数据
    useMysql.query(useSql.agentCount.scoreCount({
        merchantId:req.session.userInfo.merchantId,
        memberId:req.session.userInfo.userId
    }),function(err , data){
        res.sendSqlData(err,data);
    });
});
router.get('/rebate',useValidate.hasLogin,function(req, res, next) {
    //回水数据
    useMysql.query(useSql.agentCount.rebateCount({
        merchantId:req.session.userInfo.merchantId,
        memberId:req.session.userInfo.userId
    }),function(err , data){
        res.sendSqlData(err,data);
    });
});
exports.router = router;
exports.__path = '/user/count';