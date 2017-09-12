module.exports = function(sql){
    sql.userBet = {
        search:function(data){
            var sql = 'select b.*,mm.score user_score,u1.nick_name user_name,u2.nick_name agent_name from bet b ' +
                'LEFT JOIN merchant_member mm on mm.merchant_id=b.merchant_id ' +
                'LEFT JOIN `user` u1 on u1.user_id=mm.user_id ' +
                'LEFT JOIN `user` u2 on u2.user_id=mm.agent_id ';
            sql += ' where b.game_id='+data.gameId;
            sql += ' and b.merchant_id='+data.merchantId;
            if(data.memberId){
                sql += ' and mm.user_id='+data.memberId;
            }
            if(data.agentId){
                sql += ' and mm.agent_id='+data.agentId;
            }
            sql += ' order by b.create_time';
            return sql;
        },
        count:function(data){
            var sql = ' from bet b ' +
                'LEFT JOIN merchant_member mm on mm.merchant_id=b.merchant_id ';
            sql += ' where b.game_id='+data.gameId;
            sql += ' and b.merchant_id='+data.merchantId;
            if(data.memberId){
                sql += ' and mm.user_id='+data.memberId;
            }
            if(data.agentId){
                sql += ' and mm.agent_id='+data.agentId;
            }
            return sql;
        }
    };
};