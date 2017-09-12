module.exports = function(game){
    var lastData,lastTerm;
    var nextData,nextTerm,nextDate;//currentPeriod 当期期数  secondsLeft剩余开奖时间
    var gameStatus;
    var thisGame,thisTerm;
    var timeLeft,maxTime;
    var datas;
    var resultTime = 15 * 1000;

    game.lottery = {
        doRequire:function(){
            require('./lottery-bet')(game.lottery);
            require('./lottery-settle')(game.lottery);
            require('./lottery-user')(game.lottery);
        },
        init:function(){
            var that = this;
            useData.getLotterySettle(function(data) {
                data = data.data;
                that.gameJoin(data.datas);
                datas = data.datas;
                if(datas){
                    lastData = datas[0];
                    lastTerm = lastData.issue.split('-')[1];
                }
                that.doNext();
            });
            this.moreSettle();
        },
        gameJoin:function(arr , call){
            if(arr){
                if(!Array.isArray(arr)){
                    arr = [arr];
                }else{
                    arr = arr.slice().reverse();
                    if(datas){
                        var terms = datas.map(function(a){return a.issue.split('-')[1];});
                        arr = arr.filter(function(a){
                            return terms.indexOf(a) === -1;
                        });
                    }
                }
                var that = this;
                arr.forEach(function(a){
                    var issue = (a.issue || a).split('-');
                    useData.getLotteryGameInfo(issue[0],issue[1],function(gameInfo){
                        if(gameInfo){
                            if(call){
                                thisGame = gameInfo;
                                thisTerm = thisGame.term;
                                call();
                            }
                            //当期不在此做结算
                            else if(gameInfo.status === 0 && gameInfo.term !== thisTerm){
                                console.log('补结开始');
                                if(!gameInfo.result){
                                    gameInfo.result = a.kjcode;
                                    useMysql.update(useSql.common.update('game',{
                                        result:a.kjcode,
                                        open_time:a.time,
                                    },{
                                        id:gameInfo.id
                                    }));
                                }
                                that.toSettle(gameInfo,{
                                    kjcode:a.kjcode
                                },function(){
                                    useMysql.update(useSql.common.update(
                                        'game',{status:1},{id:gameInfo.id}
                                    ));
                                    console.log('补结完成');
                                });
                            }
                        }else{
                            //新添加游戏记录
                            var gameAddData = {
                                date:issue[0],
                                term:issue[1],
                                game:'lottery',
                                result:a.kjcode || '',
                                status:a.kjcode?2:0
                            };
                            if(a.time)gameAddData.open_time = a.time;
                            useMysql.add(useSql.common.add('game',gameAddData),function(err , data){
                                if(call){
                                    that.gameJoin(arr[0],call);
                                }
                            })
                        }
                    });
                });
            }
        },
        //定时器
        setTime:function(){
            var that = this;
            setTimeout(function(){
                if(gameStatus === 'buy'){
                    console.log('wait gameStatus ' + useCommon.parseDate(new Date));
                    timeLeft = 60 * 1000;
                    maxTime = timeLeft + Date.now();
                    gameStatus = 'wait';
                    that.setTime();
                    return;
                }
                if(gameStatus === 'wait'){
                    gameStatus = 'result';
                    that.settleTime = Date.now();
                    that.settle();
                }
            },timeLeft);
        },//查询结果
        settle:function(call){
            var that = this;
            console.log('settle ' + useCommon.parseDate(new Date));
            useData.getLotterySettle(function(data) {
                data = data.data;
                var settleData = data && data.datas && data.datas[0];
                if(settleData){
                    var searchTerm = settleData.issue.split('-')[1];
                    //查询到开奖结果
                    if(searchTerm === thisTerm){
                        that.gameJoin(data.datas);
                        datas = data.datas;
                        lastData = settleData;
                        lastTerm = lastData.issue.split('-')[1];
                        gameStatus = 'settle';
                        console.log('settle gameStatus ' + useCommon.parseDate(new Date));
                        that.doSettle(settleData , function(){
                            lastData.isSettle = 1;
                            that.doNext();
                            call && call();
                        });
                        return ;
                    }
                    //查询到下期开奖结果、
                    if(searchTerm > thisTerm){
                        that.doNext(1);
                        return ;
                    }
                }
                setTimeout(function(){
                    //如果超过5分钟未查询到开奖结果 则不再查询
                    if(Date.time - that.settleTime > 5 * 60 * 1000){
                        that.doNext(1);
                        return ;
                    }
                    that.settle(call);
                },resultTime);
            });
        },//开始下一期
        //sts 为1时 强制开启下一期
        doNext:function(sts){
            var that = this;
            useData.getLotteryNext(function(data) {
                nextData = data.data;
                nextTerm = nextData.currentPeriod.slice(-3);
                nextDate = 20 + nextData.currentPeriod.slice(0,6);
                if(sts){
                    return createNew();
                }
                if(nextTerm - lastTerm === 2){
                    useData.getLotteryGameInfo(
                        nextDate,
                        ('0'+(nextTerm - 1)).slice(0,3),
                        function(gameData){
                        //上一期在结算中
                        if(gameData){
                            gameStatus = 'result';
                            thisGame = gameData;
                            thisTerm = thisGame.term;
                            that.settleTime = Date.now();
                            that.settle();
                        }else{
                            createNew();
                        }

                    });
                }else createNew();
                function createNew(){
                    that.gameJoin(nextDate + '-' + nextTerm ,  function(){
                        //新一期游戏开始时清除规则缓存
                        that.ruleFlush();
                        gameStatus = 'buy';
                        timeLeft = nextData.secondsLeft + 60 * 1000;
                        maxTime = timeLeft + Date.now();
                        that.setTime();
                    });
                }

            });
        },//查询是否出结果
        result:function(term , call){
            var rt = {
                code:1
            };
            rt.gameStatus = gameStatus;
            if(term !== lastTerm){
                if(term === thisTerm){
                    rt.timeLeft = resultTime;
                }
                call && call(rt);
                return rt;
            }
            if(!lastData || !lastData.isSettle){
                rt.timeLeft = resultTime;
                call && call(rt);
                return rt;
            }
            rt = {
                code:0,
                data:lastData
            };
            call && call(rt);
            return rt;
        },//获取下一期信息
        next:function(call){
            var d = {
                gameStatus:gameStatus,
                timeLeft:maxTime - Date.now(),
                nextTerm:nextTerm
            };
            if(gameStatus === 'result' || gameStatus === 'settle'){
                timeLeft = resultTime;
            }
            var r = {
                thisGame:this.game(),
                nextData:d,
            };
            call && call(r);
            return r;
        },//获取上一期信息
        last:function(call){
            call && call(lastData);
            return lastData;
        },//获取当期信息
        game:function(call){
            call && call(thisGame);
            return thisGame;
        },//获取游戏状态
        gameStatus:function(call){
            call && call(gameStatus);
            return gameStatus;
        },//获取投注信息
        bet:function(call){
            var d = this.next();
            d.lastData = this.last();
            call && call(d);
            return d;
        }
    };
};