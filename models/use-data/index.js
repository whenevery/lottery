var lastDate = {};
var caches = {};
module.exports = {
    getUserInfo:function(userId,merchantId,call){
        useMysql.search(useSql.user.search({
            'u.userId':userId,
            merchantId:merchantId,
        } ) , function(err , data){
            call && call(err , data[0]);
        });
    },
    getMerchantInfo:function(userId,call){
        useMysql.search(useSql.merchant.search({
            userId:userId,
        } ) , function(err , data){
            call && call(err , data[0]);
        });
    },
    getRuleData:function(userId,game,call){
        useMysql.search(useSql.common.search('rule',{
            game:game,
            userId:userId
        }),function(err , data){
            call && call({
                code:0,
                data:useGame.rule.reload({
                    data:data,
                    rule:useRule.lottery
                })
            });
        })
    },
    getLotterySettle:function(call){
        useRequest.send(this.req,this.res,{
            url:useUrl.lottery.settle,
            done:function(a){
                call && call(a);
            }
        })
    },
    getLotteryNext:function(call){
        useRequest.send(this.req,this.res,{
            url:useUrl.lottery.next+Date.now(),
            done:function(a){
                call && call(a);
            }
        })
    },
    getLotteryGameInfo:function(date , term , call){
        useMysql.search(useSql.common.search('game',{
            date:date,
            term:term
        }),function(errr , data){
            call(data && data[0]);
        })
    },
    getBetCount:function(data , call){
        useMysql.sum({
            sql:useSql.common.sum('bet',{
                game_id:data.gameId,
                user_id:data.userId,
                merchant_id:data.merchantId,
                status:0,
            }),
            sum:'bet_count'
        },function(err , data){
            call(data && data[0]);
        });
    },
    getBetScore:function(data , call){
        useMysql.sum({
            sql:useSql.common.sum('bet',{
                game_id:data.gameId,
                user_id:data.userId,
                merchant_id:data.merchantId,
                status:0,
            }),
            sum:'score'
        },function(err , data){
            call(data && data[0]);
        });
    },
    init:function(call){
        require('./add')(this);
        this.req = {session:{},body:{},query:{},headers:{'x-forwarded-for':'127.0.0.1'}};
        this.res = {};
        call && call();
    }
};


