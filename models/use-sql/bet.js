module.exports = function(sql){
    sql.bet = {
        agentRebate:function(data){
            var sql = 'select b.* from bet b ' +
                'left join merchant_member mm on mm.user_id=b.user_id and mm.merchant_id=b.merchant_id ';
            sql += ' where b.user_rebate=0 and b.status=1 and mm.merchant_id='+data.merchantId;
            sql += ' and mm.agent_id='+data.agentId;
            if(data.startTime)sql += ' and b.create_time >= "'+data.startTime  + '" ';
            if(data.endTime)sql += ' and b.create_time <= "'+data.endTime  + '" ';
            return sql;
        }
    };
};