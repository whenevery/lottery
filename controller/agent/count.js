var express = require('express');
var router = express.Router();
router.get('/bet',useValidate.hasLogin,function(req, res, next) {
    //下注数据
    useMysql.query(useSql.agentCount.count({
        merchantId:req.session.userInfo.merchantId,
        agentId:req.session.userInfo.userId,
        memberId:req.query.userId
    }),function(err , data){
        res.sendSqlData(err,data);
    });
});
router.get('/game',useValidate.hasLogin,function(req, res, next) {
    //游戏统计数据
    useMysql.query(useSql.agentCount.gameCount({
        merchantId:req.session.userInfo.merchantId,
        agentId:req.session.userInfo.userId,
    }),function(err , data){
        res.sendSqlData(err,data);
    });
});
router.get('/score',useValidate.hasLogin,function(req, res, next) {
    //上下分数据
    useMysql.query(useSql.agentCount.scoreCount({
        merchantId:req.session.userInfo.merchantId,
        agentId:req.session.userInfo.userId,
        memberId:req.query.userId
    }),function(err , data){
        res.sendSqlData(err,data);
    });
});
router.get('/rebate',useValidate.hasLogin,function(req, res, next) {
    //回水数据
    useMysql.query(useSql.agentCount.rebateCount({
        merchantId:req.session.userInfo.merchantId,
        agentId:req.session.userInfo.userId,
        memberId:req.query.userId
    }),function(err , data){
        res.sendSqlData(err,data);
    });
});

router.get('/member',useValidate.hasLogin,function(req, res, next) {
    var all = [];
    all.push(new Promise(function(rev){
        useMysql.query(useSql.userCount.member({
            merchantId:req.session.userInfo.merchantId,
            agentId:req.session.userInfo.userId,
        }),function(err,data){
            rev(data[0]);
        });
    }));
    all.push(new Promise(function(rev){
        useMysql.query(useSql.userCount.bet({
            merchantId:req.session.userInfo.merchantId,
            agentId:req.session.userInfo.userId,
        }),function(err,data){
            rev(data[0]);
        });
    }));
    all.push(new Promise(function(rev){
        useMysql.query(useSql.userCount.operator({
            merchantId:req.session.userInfo.merchantId,
            agentId:req.session.userInfo.userId,
        }),function(err,data){
            rev(data);
        });
    }));
    Promise.all(all).then(function(v){
        res.sendSuccess(v);
    })
});
exports.router = router;
exports.__path = '/agent/count';