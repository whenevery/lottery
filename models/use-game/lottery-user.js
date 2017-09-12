module.exports = function(lottery){
    lottery.userJoin = function(merchantInfo,userInfo , call){
        if(userInfo.merchantId || userInfo.type !==0)return call && call();
        useMysql.search(useSql.common.search('merchant_member',{
            merchant_id:merchantInfo.userId,
            user_id:userInfo.userId
        }),function(err , data){
            if(err || data.length){
                call && call();
            }else{
                useMysql.add(useSql.common.add('merchant_member',{
                    merchant_id:merchantInfo.userId,
                    user_id:userInfo.userId,
                    agentId:merchantInfo.agentId || merchantInfo.userId,
                    score:0
                }),function(err , data){
                    call && call();
                })
            }
        })
    };
};