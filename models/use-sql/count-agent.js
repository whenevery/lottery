module.exports = function(sql){
    sql.agentCount = {
        count:function(data){
            var sql = 'select sum(bet_count) bet_count,sum(b.score*bet_count) bet_score,sum(result_score) result_score,`status`  ' +
                ' from `bet` b ' +
                ' left join merchant_member mm on mm.merchant_id=b.merchant_id and b.user_id=mm.user_id ' +
                ' where b.merchant_id='+data.merchantId ;
            if(data.agentId){
                sql += ' and mm.agent_id='+data.agentId;
            }
            if(data.memberId){
                sql += ' and mm.user_id='+data.memberId;
            }
            if(data.gameId){
                sql += ' and b.game_id='+data.gameId;
            }
            sql += ' group by b.status';
            return sql;
        },
        scoreCount:function(data){
            var sql = 'select count(1) count,sum(b.score) score,b.type,b.status ' +
                'from score_operator b'+
            ' left join merchant_member mm on mm.merchant_id=b.merchant_id and b.user_id=mm.user_id ' +
            ' where b.merchant_id='+data.merchantId ;
            if(data.agentId){
                sql += ' and mm.agent_id='+data.agentId;
            }
            if(data.memberId){
                sql += ' and mm.user_id='+data.memberId;
            }
            sql += ' GROUP BY b.type,b.status';
            return sql;
        },
        gameCount:function(data){
            var sql = 'select count(1) count,sum(bet_number) bet_number,sum(bet_score) bet_score, sum(bet_count) bet_count, sum(res_count) res_count,  sum(res_score) res_score,  sum(res_number) res_number  ' +
                'from `merchant_game` b'+
                ' left join merchant_member mm on mm.merchant_id=b.merchant_id' +
                ' where b.merchant_id='+data.merchantId + ' and mm.agent_id='+data.agentId;
            return sql;
        },
        rebateCount:function(data){
            var sql = 'select count(1) count,sum(b.score) score,count(distinct(b.user_id)) number ' +
                'from `merchant_rebate` b'+
            ' left join merchant_member mm on mm.merchant_id=b.merchant_id and b.user_id=mm.user_id' +
            ' where b.merchant_id='+data.merchantId ;
            if(data.agentId){
                sql += ' and mm.agent_id='+data.agentId;
            }
            if(data.memberId){
                sql += ' and mm.user_id='+data.memberId;
            }
            return sql;
        },
    };
};