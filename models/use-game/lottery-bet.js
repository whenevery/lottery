module.exports = function(lottery){
    var ruleCaches = {};
    lottery.ruleFlush = function(){
        ruleCaches = {};
    };
    lottery.rule = function(userId , call){
        if(ruleCaches[userId]){
            call && call({data:ruleCaches[userId]});
            return;
        }
        useData.getRuleData(userId,'lottery',function(data){
            ruleCaches[userId] = data.data;
            call && call(data);
        });
    };
    lottery.delBet = function(betData,call){
        var rt = {code:1};
        var gameStatus = this.gameStatus();
        if(gameStatus !== 'buy'){
            rt.message = '不在下注时间内';
            return call&&call(rt);
        }
        //查询下注详情
        useMysql.search(useSql.common.search('bet',{
           id:betData.betId,
           userId:betData.userId,
            status:0
        }),function(err , data){
            if(data && data.length){
                var betInfo = data[0];
                //归还积分
                useData.addScore(betData.userId,{
                    gameId:betData.betId,
                    merchantId:betInfo.merchantId,
                    score:betInfo.score * betInfo.betCount,
                    type:'del',
                    game:'lottery',
                    scoreType:'game',
                },function(err){
                    if(!err){
                        //变更状态
                        useMysql.update(useSql.common.update('bet',{
                            status:3
                        },{id:betData.betId}),function(err , data){
                            call({
                                code:err !== null
                            });
                        })
                    }else{
                        rt.message = err.message;
                        call && call(rt);
                    }
                });
            }else{
                rt.message = '无效数据';
                call && call(rt);
            }
        });
    };
    lottery.addBet = function(scoredata , call){
        var rt = {code:1};
        var thisGame = this.game();
        var gameStatus = this.gameStatus();
        //非当期下注
        if(scoredata.term !== thisGame.term){
            rt.reload = 1;
            return call && call(rt);
        }
        if(gameStatus !== 'buy'){
            rt.message = '不在下注时间内';
            return call&&call(rt);
        }
        var merchantId = scoredata.merchantId;
        var userId = scoredata.userId;
        var rule = ruleCaches[merchantId];
        if(!rule){
            useData.getRuleData(merchantId,'lottery',function(ruledata){
                rule = ruleCaches[userId] = ruledata.data;
                next()
            });
        }else next();
        function next(){
            if(scoredata.score - 0 > rule.betRule.betMaxScore
                || scoredata.score - 0 < rule.betRule.betMinScore){
                rt.message = '下注积分区间' + [rule.betRule.betMinScore,rule.betRule.betMaxScore].join('-');
                return call && call(rt);
            }
            var betData = useGame.lottery.checkBet(scoredata);
            console.log(betData);
            var thisRules = rule.resRule.filter(function(a){
                return a.code === betData.code && !a.disabled;
            });
            var betRule = thisRules.slice().pop();
            if(!betRule){
                rt.message = '不支持的下注规则';
                return call && call(rt);
            }
            betData.rate = betRule.rate;
            if(betData.code === 'group_1'){
                betData.rate = thisRules.sort(function(a,b){return a.count - b.count})
                    .map(function(a){return a.rate}).join();
            }
            useData.getBetCount(scoredata , function(countData){
                if(countData.sumNumber &&
                    (countData.sumNumber - 0 === rule.betRule.betMaxCount)){
                    rt.message = '超过下注注数限制';
                    return call && call(rt);
                }
                useData.getBetScore(scoredata , function(scoreSumData){
                    if(scoreSumData.sumNumber &&
                        (scoreSumData.sumNumber - 0 + (scoredata.score - 0) > rule.betRule.betAllMaxScore)){
                        rt.message = '超过下注总积分限制';
                        return call && call(rt);
                    }
                    lottery.addOne(scoredata,betData ,call);
                });
            });
        }


    };
    lottery.addOne = function(scoredata,betData,call){
        useMysql.search(useSql.common.search('bet',{
            gameId:scoredata.gameId,
            merchantId:scoredata.merchantId,
            userId:scoredata.userId,
            betType:betData.betType,
            betContent:betData.betContent,
            score:scoredata.score,
            status:0
        }),function(err , data){
            if(err)return call && call({err:err});
           if(data.length){
               var betInfo = data[0];
               useMysql.update(useSql.common.update('bet',{
                   bet_count:(betInfo.betCount || 1)+1,
               },{id:betInfo.id}),function(err , d){
                   useData.addScore(scoredata.userId,{
                       gameId:scoredata.gameId,
                       merchantId:scoredata.merchantId,
                       score:-scoredata.score,
                       type:'add',
                       game:'lottery',
                       scoreType:'game',
                   },function(){
                       call({
                           code:err !== null
                       })
                   });
               });
           }else{
               useMysql.add(useSql.common.add('bet',{
                   game:'lottery',
                   gameId:scoredata.gameId,
                   date:scoredata.date,
                   term:scoredata.term,
                   merchantId:scoredata.merchantId,
                   userId:scoredata.userId,
                   betType:betData.betType,
                   betTypeName:betData.betTypeName,
                   betContent:betData.betContent,
                   betRate:betData.rate,
                   score:scoredata.score,
                   betCount:1,
                   isRebate:0,
                   userRebate:0,
                   status:0
               }),function(err , data){
                   useData.addScore(scoredata.userId,{
                       gameId:data.insertId,
                       merchantId:scoredata.merchantId,
                       score: - scoredata.score,
                       type:'add',
                       game:'lottery',
                       scoreType:'game',
                   },function(){
                       call({
                           code:err !== null
                       })
                   });
               })
           }
        });

    }
};