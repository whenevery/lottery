module.exports = function(sql){
    sql.count = {
        count:function(data){
            var sql = 'select sum(b.bet_count) bet_count,sum(b.score*b.bet_count) bet_score,' +
                'sum(b.result_score) result_score,b.status status ' +
                ' from `bet` b ' +
                ' left join merchant_member mm on b.user_id=mm.user_id and b.merchant_id=mm.merchant_id' +
                ' where b.status=1 and b.merchant_id='+data.merchantId;
            if(data.memberId){
                sql += ' and b.user_id='+data.memberId;
            }
            if(data.agentId){
                sql += ' and mm.agent_id='+data.agentId;
            }
            if(data.startTime)sql += ' and b.create_time >= "'+data.startTime + '" ';
            if(data.endTime)sql += ' and b.create_time <= "'+data.endTime + '" ';
            sql += ' group by b.status';
            return sql;
        },
        scoreCount:function(data){
            var sql = 'select count(1) count,sum(b.score) score,b.type,b.status ' +
                'from score_operator b ' +
                ' left join merchant_member mm on b.user_id=mm.user_id and b.merchant_id=mm.merchant_id' +
                ' where b.merchant_id='+data.merchantId;
            if(data.memberId){
                sql += ' and b.user_id='+data.memberId;
            }
            if(data.agentId){
                sql += ' and mm.agent_id='+data.agentId;
            }
            if(data.startTime)sql += ' and b.create_time >= "'+data.startTime + '" ';
            if(data.endTime)sql += ' and b.create_time <= "'+data.endTime + '" ';
            sql += ' GROUP BY `type`,`status`';
            return sql;
        },
        gameCount:function(data){
            var sql = 'select count(1) count,sum(bet_number) bet_number,sum(bet_score) bet_score, sum(bet_count) bet_count, sum(res_count) res_count,  sum(res_score) res_score,  sum(res_number) res_number  ' +
                'from `merchant_game` where merchant_id='+data.merchantId;
            return sql;
        },
        rebateCount:function(data){
            var sql = 'select count(1) count,sum(b.score) score,count(distinct(b.user_id)) number ' +
                'from `merchant_rebate` b ' +
                ' left join merchant_member mm on b.user_id=mm.user_id and b.merchant_id=mm.merchant_id' +
                ' where b.merchant_id='+data.merchantId;
            if(data.memberId){
                sql += ' and b.user_id='+data.memberId;
            }
            if(data.agentId){
                sql += ' and mm.agent_id='+data.agentId;
            }
            if(data.startTime)sql += ' and b.create_time >= "'+data.startTime + '" ';
            if(data.endTime)sql += ' and b.create_time <= "'+data.endTime + '" ';
            return sql;
        },
    };
};