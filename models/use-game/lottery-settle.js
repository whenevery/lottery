module.exports = function(lottery){
    lottery.doSettle = function(settleData , call){
        console.log('doSettle ' + useCommon.parseDate(new Date));
        var thisGame = this.game();
        useMysql.update(useSql.common.update('game',{
            result:settleData.kjcode,
            open_time:settleData.time,
        },{
            id:thisGame.id
        }));
        this.toSettle(thisGame,settleData,call);
    };
    //逾期过久的补结
    lottery.moreSettle = function(gameList , call){
        var that = this;
        if(gameList){
            doMore(gameList);
        }
        else useMysql.search(useSql.lottery.moreGame({
        }),function(err , data){
            doMore(data);
        });
        function doMore(data){
            data.forEach(function(a){
                console.log('逾期补结开始');
                that.toSettle({
                    id:a.id,
                    date:a.date,
                    term:a.term,
                },{
                    kjcode:a.result
                },function(){
                    if(call){
                        call();
                        call = null;
                    }
                    console.log('逾期补结结束');
                });
            });
        }
    };
    lottery.sumSettle = function(merchantSettle){
        for(var key in merchantSettle){
            var settle = merchantSettle[key];
            if(settle.betPerson){
                if(!settle.betNumber){
                    settle.betNumber = useCommon.arrayUnique(settle.betPerson).length;
                }
                delete settle.betPerson;
            }
            if(settle.resPerson){
                if(!settle.resNumber){
                    settle.resNumber = useCommon.arrayUnique(settle.resPerson).length;
                }
                delete settle.resPerson;
            }
            useMysql.search(useSql.common.search('merchant_game',{
                gameId:settle.gameId,
                merchantId:settle.merchantId,
            }),function(err , data){
                if(data && data.length){
                    data = data[0];
                    settle.betNumber += data.betNumber;
                    settle.betCount += data.betCount;
                    settle.betScore += data.betScore;

                    settle.resNumber += data.resNumber;
                    settle.resScore += data.resScore;
                    settle.resCount += data.resCount;
                    useMysql.update(useSql.common.update('merchant_game',settle,{
                        id:data.id
                    }),function(){});
                }else{
                    useMysql.add(useSql.common.add('merchant_game',settle),function(){});
                }
            })
        }

    };
    lottery.toSettle = function(gameData,settleData,call){
        console.log('toSettle ' + useCommon.parseDate(new Date));
        var allMerchantSettle = {};
        useMysql.search(useSql.common.search('bet',{
            gameId:gameData.id,
            status:0
        }),function(err , betAllData){
            if(err)return call && call();
            var all = [];
            betAllData.forEach(function(betData){
                //结算统计
                var merchantSettle = allMerchantSettle[betData.merchantId] = allMerchantSettle[betData.merchantId] || {
                    game:'lottery',
                    gameId:gameData.id,
                    date:gameData.date,
                    term:gameData.term,
                    merchantId:betData.merchantId,

                    betPerson:[],
                    betCount:0,
                    betScore:0,

                    resCode:settleData.kjcode,
                    resScore:0,
                    resCount:0,
                    resPerson:[],
                    status:settleData.kjcode?0:1
                };
                var thisBetScore = betData.score * betData.betCount;
                merchantSettle.betPerson.push(betData.userId);
                merchantSettle.betCount += betData.betCount || 1;
                merchantSettle.betScore += thisBetScore;
                //结算
                if(settleData.kjcode){
                    var isWin = useGame.lottery.checkWin(betData , settleData);
                    //赢了
                    if(isWin){
                        var betRate = betData.betRate;
                        if(betData.betType === 'group' && betData.betContent.length === 1){
                            betRate = betRate.split(',')[isWin-1];
                        }
                        var winScore = Math.round(betData.score * betData.betCount * betRate);
                        merchantSettle.resPerson.push(betData.userId);
                        merchantSettle.resCount += betData.betCount || 1;
                        merchantSettle.resScore += winScore;
                        all.push(new Promise(function(rev){
                            //变更积分
                            useData.addScore(betData.userId,{
                                gameId:betData.id,
                                merchantId:betData.merchantId,
                                score:winScore,
                                type:'win',
                                scoreType:'game',
                                game:'lottery'
                            },function(err , data){
                                if(err)rev();
                                else{
                                    //更新下注信息
                                    useMysql.update(useSql.common.update(
                                        'bet',{
                                            status:1,
                                            result_code:settleData.kjcode,
                                            result_score:winScore-thisBetScore,
                                            result_rate:betRate,
                                        },{
                                            id:betData.id
                                        }
                                    ),function(){});
                                    rev();
                                }
                            });
                        }));
                    }else{
                        //未中的处理
                        useMysql.update(useSql.common.update(
                            'bet',{
                                status:1,
                                result_code:settleData.kjcode,
                                result_score:-thisBetScore
                            },{
                                id:betData.id
                            }
                        ),function(){});
                    }
                }
                //对无结果的进行退还
                else{
                    all.push(new Promise(function(rev){
                            //变更积分
                            useData.addScore(betData.userId,{
                                gameId:betData.id,
                                merchantId:betData.merchantId,
                                score:thisBetScore,
                                type:'return',
                                scoreType:'game',
                                game:'lottery'
                            },function(err , data){
                                if(err)rev();
                                else{
                                    //更新下注信息
                                    useMysql.update(useSql.common.update(
                                        'bet',{
                                            status:2,
                                            result_code:'',
                                            result_score:0,
                                        },{
                                            id:betData.id
                                        }
                                    ),function(){});
                                    rev();
                                }
                            });
                    }));
                }
            });
            Promise.all(all).then(function(){
                end(call);
            }).catch(function(){
                end(call);
            })
        });
        function end(call){
            lottery.sumSettle(allMerchantSettle);
            useMysql.update(useSql.common.update('game',{
                status:1,
                settleTime:useCommon.parseDate(new Date)
            },{
                id:gameData.id
            }));
            call && call();
        }
    }
};