var express = require('express');
var router = express.Router();
router.get('/list',useValidate.hasLogin,function(req, res, next) {
    useMysql.search(useSql.common.search('bet',{
        game_id:req.query.gameId,
        merchantId:req.session.userInfo.merchantId,
        userId:req.session.userInfo.userId,
        status:req.query.status,
    }),function(err, data){
        res.sendSqlData(err, data);
    })
});
router.get('/list/all',useValidate.hasLogin,function(req, res, next) {
    useMysql.searchAll({
        sql:useSql.common.search('bet',{
            merchantId:req.session.userInfo.merchantId,
            userId:req.session.userInfo.userId,
            status:req.query.status,
        }) + ' order by create_time desc',
        count:useSql.common.count('bet',{
            merchantId:req.session.userInfo.merchantId,
            userId:req.session.userInfo.userId,
            status:req.query.status,
        }),
        page:req.query.page,
        pageSize:req.query.pageSize,
    },function(data) {
        res.useSend(data);
    })
});
router.post('/down',useValidate.hasLogin,function(req, res, next) {
    var score = req.body.score - 0;
    var userInfo = req.session.userInfo;
    useGame.lottery.rule(userInfo.merchantId , function(ruleData){
        ruleData = ruleData.data;
        var withdrawRule = ruleData.withdrawRule;
        if(withdrawRule.max < score || withdrawRule.min > score){
            return res.useSend({message:'下分区间'+withdrawRule.min + '-' + withdrawRule.max});
        }
        useData.addScore(userInfo,{
            score:-score,
            merchantId:userInfo.merchantId,
            scoreType:'operator',
            type:'down',
            game:'lottery'
        },function(err , data){
            res.sendSqlData(err, data);
        },1);
    });

});

router.get('/count',useValidate.hasLogin,function(req, res, next) {
    var useType = req.query.useType;
    var countData = {
        merchantId:useType === 'merchant'?req.session.userInfo.userId:req.session.userInfo.merchantId,
        gameId:req.query.gameId,
    };
    if(req.query.searchType === 'my'){
        countData.memberId = req.session.userInfo.userId;
    }
    if(req.query.searchType === 'agent'){
        countData.agentId = req.session.userInfo.userId;
    }
    if(req.query.agentId && useType === 'merchant'){
        countData.agentId = req.query.agentId;
    }
    useMysql.query(useSql.agentCount.count(countData),function(err , data){
        res.sendSqlData(err,data);
    });
});
router.get('/list/user',useValidate.hasLogin,function(req, res, next) {
    var useType = req.query.useType;
    var countData = {
        merchantId:useType === 'merchant'?req.session.userInfo.userId:req.session.userInfo.merchantId,
        gameId:req.query.gameId,
    };
    if(req.query.searchType === 'my'){
        countData.memberId = req.session.userInfo.userId;
    }
    if(req.query.searchType === 'agent'){
        countData.agentId = req.session.userInfo.userId;
    }
    if(req.query.agentId && useType === 'merchant'){
        countData.agentId = req.query.agentId;
    }
    useMysql.searchAll({
        sql:useSql.userBet.search(countData),
        count:useSql.userBet.count(countData),
        page:req.query.page,
        pageSize:req.query.pageSize,
    },function(data){
        res.useSend(data);
    });
});
exports.router = router;
exports.__path = '/game/bet';