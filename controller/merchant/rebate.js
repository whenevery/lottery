var express = require('express');
var router = express.Router();

router.get('/list',useValidate.hasLogin, function(req, res, next) {
    var startTime = req.query.startTime;
    if(startTime){
        startTime = useCommon.concatDateString(startTime , req.query.startTimeM || '00','00','00');
    }
    var endTime = req.query.endTime;
    if(endTime){
        endTime = useCommon.concatDateString(endTime , req.query.endTimeM || '23','59','59');
    }
    useData.getRuleData(req.session.userInfo.userId,'lottery',function(data){
        var ruleData = data.data;
        var searchData = {
            merchantId:req.session.userInfo.userId,
            nickName:req.query.nickName,
            agentId:req.query.agentId,
            startTime:startTime,
            endTime:endTime,
            rebateRate:ruleData.betRule.rebateRate / 100,
        };
        useMysql.search(useSql.merchant.memberBetSearch(searchData),function(err , data){
            res.sendSqlData(err , data,{
                rebateRate:ruleData.betRule.rebateRate / 100
            });
        })
    });
});

router.get('/list/again',useValidate.hasLogin, function(req, res, next) {
    var startTime = req.query.startTime;
    if(startTime){
        startTime = useCommon.concatDateString(startTime , req.query.startTimeM || '00','00','00');
    }
    var endTime = req.query.endTime;
    if(endTime){
        endTime = useCommon.concatDateString(endTime , req.query.endTimeM || '23','59','59');
    }
    useData.getRuleData(req.session.userInfo.userId,'lottery',function(data){
        var ruleData = data.data;
        var searchData = {
            merchantId:req.session.userInfo.userId,
            nickName:req.query.nickName,
            startTime:startTime,
            endTime:endTime,
            rebateRate:ruleData.betRule.childRebateRate / 100,
        };
        useMysql.search(useSql.merchant.agentBetSearch(searchData),function(err , data){
            res.sendSqlData(err , data);
        })
    });
});

router.post('/do',useValidate.hasLogin, function(req, res, next) {
    var startTime = req.body.startTime;
    if(startTime){
        startTime = useCommon.concatDateString(startTime , req.body.startTimeM || '00','00','00');
    }
    var endTime = req.body.endTime;
    if(endTime){
        endTime = useCommon.concatDateString(endTime , req.body.endTimeM || '23','59','59');
    }
    //查询规则
    useData.getRuleData(req.session.userInfo.userId,'lottery',function(data){
        var ruleData = data.data;
        var searchData = {
            startTime:startTime,
            endTime:endTime,
            merchantId:req.session.userInfo.userId,
            rebateRate:ruleData.betRule.rebateRate / 100,
            isRebate:'0',
            userIds:req.body.userIds,
        };
        //查询回水记录
        useMysql.search(useSql.merchant.memberBetSearch(searchData),function(err , data){
            var memberAll = [];
            data.forEach(function(a){
                var rebateScore = a.rebateScore;//Math.min(a.rebateScore , ruleData.betRule.maxRebateScore);
                memberAll.push(new Promise(function(rev){
                    //查询具体的下注记录
                    useMysql.search(useSql.common.search('bet',{
                        userId:a.userId,
                        merchantId:a.merchantId,
                        startCreateTime:startTime,
                        endCreateTime:endTime,
                        isRebate:0,
                        status:1
                    }),function(err , betData){
                        if(betData.length){
                            var betIds = betData.map(function(a){return a.id}).join();
                            //更新下注记录状态
                            useMysql.update(useSql.common.update('bet',
                                {
                                    isRebate:1
                                },{
                                    in: ['id',betIds]
                                }),function(e){
                                if(!e){
                                    //增加积分
                                    useData.addScore(a.userId , {
                                        merchantId:a.merchantId,
                                        score:rebateScore,
                                        type:'rebate',
                                        itemType:0,
                                        operator:a.merchantId,
                                        scoreType:'operator'
                                    },function(err , data){
                                        if(!err){
                                            //添加回水记录
                                            useMysql.add(
                                                useSql.common.add('merchant_rebate',{
                                                    userId:a.userId,
                                                    type:0,
                                                    merchantId:a.merchantId,
                                                    score:rebateScore,
                                                    relation_ids:betIds
                                                }),function(err){
                                                    rev();
                                                }
                                            )
                                        }
                                        else rev();
                                    });
                                }else rev();
                            })
                        }else rev();
                    });
                }));

            });
            Promise.all(memberAll).then(function(){
                res.sendSuccess();
            }).catch(function(){
                res.sendErrorMessage();
            });
        })
    });
});
router.post('/do/again',useValidate.hasLogin, function(req, res, next) {
    var startTime = req.body.startTime;
    if(startTime){
        startTime = useCommon.concatDateString(startTime , req.body.startTimeM || '00','00','00');
    }
    var endTime = req.body.endTime;
    if(endTime){
        endTime = useCommon.concatDateString(endTime , req.body.endTimeM || '23','59','59');
    }
    //查询规则
    useData.getRuleData(req.session.userInfo.userId,'lottery',function(data){
        var ruleData = data.data;
        var searchData = {
            merchantId:req.session.userInfo.userId,
            startTime:startTime,
            endTime:endTime,
            rebateRate:ruleData.betRule.childRebateRate / 100,
            userIds:req.body.userIds,
        };
        //查询回水记录
        useMysql.search(useSql.merchant.agentBetSearch(searchData),function(err , data){
            var memberAll = [];
            data.forEach(function(a){
                var rebateScore = a.rebateScore;//Math.min(a.rebateScore , ruleData.betRule.childMaxRebateScore);
                memberAll.push(new Promise(function(rev){
                    //查询具体的下注记录
                    useMysql.search(useSql.bet.agentRebate({
                        agentId:a.userId,
                        startTime:startTime,
                        endTime:endTime,
                        merchantId:a.merchantId,
                    }),function(err , betData){
                        if(betData.length){
                            var betIds = betData.map(function(a){return a.id}).join();
                            //更新下注记录状态
                            useMysql.update(useSql.common.update('bet',
                                {
                                    userRebate:1
                                },{
                                    in: ['id',betIds]
                                }),function(e){
                                if(!e){
                                    //增加积分
                                    useData.addScore(a.userId , {
                                        merchantId:a.merchantId,
                                        score:rebateScore,
                                        type:'rebate',
                                        itemType:1,
                                        operator:a.merchantId,
                                        scoreType:'operator'
                                    },function(err , data){
                                        if(!err){
                                            //添加回水记录
                                            useMysql.add(
                                                useSql.common.add('merchant_rebate',{
                                                    userId:a.userId,
                                                    type:1,
                                                    merchantId:a.merchantId,
                                                    score:rebateScore,
                                                    relation_ids:betIds
                                                }),function(err){
                                                    rev();
                                                }
                                            )
                                        }
                                        else rev();
                                    });
                                }else rev();
                            })
                        }else rev();
                    });
                }));

            });
            Promise.all(memberAll).then(function(){
                res.sendSuccess();
            }).catch(function(){
                res.sendErrorMessage();
            });
        })
    });
});
exports.router = router;
exports.__path = '/merchant/rebate';