var express = require('express');
var router = express.Router();
router.get('/bet',useValidate.hasLogin,function(req, res, next) {
    var startTime = req.query.startTime;
    if(startTime){
        startTime = useCommon.concatDateString(startTime , req.query.startTimeM || '00','00','00');
    }
    var endTime = req.query.endTime;
    if(endTime){
        endTime = useCommon.concatDateString(endTime , req.query.endTimeM || '23','59','59');
    }
    //下注数据
    useMysql.query(useSql.count.count({
        merchantId:req.session.userInfo.userId,
        memberId:req.query.userId,
        agentId:req.query.agentId,
        startTime:startTime,
        endTime:endTime,
    }),function(err , data){
        res.sendSqlData(err,data);
    });
});
router.get('/game',useValidate.hasLogin,function(req, res, next) {
    //游戏统计数据
    useMysql.query(useSql.count.gameCount({
        merchantId:req.session.userInfo.userId,
    }),function(err , data){
        res.sendSqlData(err,data);
    });
});
router.get('/score',useValidate.hasLogin,function(req, res, next) {
    var startTime = req.query.startTime;
    if(startTime){
        startTime = useCommon.concatDateString(startTime , req.query.startTimeM || '00','00','00');
    }
    var endTime = req.query.endTime;
    if(endTime){
        endTime = useCommon.concatDateString(endTime , req.query.endTimeM || '23','59','59');
    }
    //上下分数据
    useMysql.query(useSql.count.scoreCount({
        merchantId:req.session.userInfo.userId,
        agentId:req.query.agentId,
        memberId:req.query.userId,
        startTime:startTime,
        endTime:endTime,
    }),function(err , data){
        res.sendSqlData(err,data);
    });
});
router.get('/rebate',useValidate.hasLogin,function(req, res, next) {
    var startTime = req.query.startTime;
    if(startTime){
        startTime = useCommon.concatDateString(startTime , req.query.startTimeM || '00','00','00');
    }
    var endTime = req.query.endTime;
    if(endTime){
        endTime = useCommon.concatDateString(endTime , req.query.endTimeM || '23','59','59');
    }
    //回水数据
    useMysql.query(useSql.count.rebateCount({
        merchantId:req.session.userInfo.userId,
        agentId:req.query.agentId,
        startTime:startTime,
        endTime:endTime,
        memberId:req.query.userId
    }),function(err , data){
        res.sendSqlData(err,data);
    });
});
router.get('/member',useValidate.hasLogin,function(req, res, next) {
    //会员数据
    var all = [];
    all.push(new Promise(function(rev){
        useMysql.query(useSql.userCount.member({
            merchantId:req.session.userInfo.userId,
            agentId:req.query.agentId,
        }),function(err,data){
            rev(data[0]);
        });
    }));
    all.push(new Promise(function(rev){
        useMysql.query(useSql.userCount.bet({
            merchantId:req.session.userInfo.userId,
            agentId:req.query.agentId,
        }),function(err,data){
            rev(data[0]);
        });
    }));
    all.push(new Promise(function(rev){
        useMysql.query(useSql.userCount.operator({
            merchantId:req.session.userInfo.userId,
            agentId:req.query.agentId,
        }),function(err,data){
            rev(data);
        });
    }));
    Promise.all(all).then(function(v){
        res.sendSuccess(v);
    })
});
exports.router = router;
exports.__path = '/merchant/count';