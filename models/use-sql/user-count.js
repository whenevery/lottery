module.exports = function(sql){
    sql.userCount = {
        member:function(data){
            return 'select count(1) user_count,sum(score) score from merchant_member where' + sql.sqlQuery(data);
        },
        bet:function(data){
            var sql = 'select count(DISTINCT(b.user_id)) user_count ' +
                'from merchant_member mm ' +
                'RIGHT  JOIN bet b on b.merchant_id=mm.merchant_id  and b.user_id=mm.user_id ' +
                'where mm.merchant_id='+data.merchantId;
            if(data.agentId){
                sql += ' and mm.agent_id=' + data.agentId;
            }
            return sql;
        },
        operator:function(data){
            var sql = 'select count(DISTINCT(so.user_id)) user_count,type ' +
                'from merchant_member mm ' +
                'RIGHT JOIN score_operator so on so.merchant_id=mm.merchant_id and so.user_id=mm.user_id ' +
                ' where mm.merchant_id='+data.merchantId;
            if(data.agentId){
                sql += ' and mm.agent_id=' + data.agentId;
            }
            sql+=' group by so.type';
            return sql;
        }
    };
};