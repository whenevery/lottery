module.exports = function(useData){
    var addHandler = [];
    var isAdding = {};
    function trigger(type){
        var handler = addHandler[type];
        handler = handler && handler.shift();
        if(handler)useData[type].apply(useData,handler);
    }
    useData.addScore = function(userInfo , scoreData , call , notAdd){
        if(isAdding.addScore){
            addHandler.addScore = addHandler.addScore || [];
            addHandler.addScore.push([userInfo , scoreData , call]);
        }
        else{
            isAdding.addScore  = true;
            var userId = userInfo.userId || userInfo;
            useData.getUserInfo(userId , scoreData.merchantId,function(err , userInfo){
                if(err || !userInfo){
                    isAdding.addScore = false;
                    trigger('addScore');
                    return call && call(1,null);
                }
                var allScore = (userInfo.score || 0) + (scoreData.score - 0);
                if(allScore < 0){
                    isAdding.addScore = false;
                    trigger('addScore');
                    return call && call({message:'积分不足做此操作'},null);
                }
                if(notAdd){
                    return doOperator(scoreData , userId,call);
                }
                useMysql.update(useSql.common.update('merchant_member',{
                    score:allScore
                },{
                    userId:userId,
                    merchantId:scoreData.merchantId
                }) , function(err , data){
                    if(err){
                        isAdding.addScore = false;
                        trigger('addScore');
                        call(err , data)
                    }else{
                        doOperator(scoreData ,userId,call);
                    }
                });
            });
        }
    };
    function doOperator(scoreData,userId,call){
        if(scoreData.notAddOperator){
            isAdding.addScore = false;
            trigger('addScore');
            return call(null);
        }
        var scoreAddData = {
            score:scoreData.score,
            relation_id:scoreData.scoreType==='game'?scoreData.gameId:scoreData.merchantId,
            merchant_id:scoreData.merchantId,
            user_id:userId,
            type:scoreData.type,
            remark:scoreData.remark || '',
        };
        if(scoreData.game)scoreAddData.game = scoreData.game;
        if(scoreData.scoreType === 'game'){

        }else{
            if(scoreData.type === 'down'){
                scoreAddData.status = scoreData.status || 0;
            }
        }
        useMysql.add(useSql.common.add('score_' + scoreData.scoreType,scoreAddData) , function(err , data){
            isAdding.addScore = false;
            trigger('addScore');
            call(err , data)
        });
    }
};