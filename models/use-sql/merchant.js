module.exports = function(sql){
    sql.merchant = {
        search:function(data){
            var sql = 'select ' +
                'u.*,ui.lv,ui.valid_time,' +
                'm.wechat_number,m.connect_img,m.up_score_img,m.spread_name,m.spread_img ' +
                ' from `user` u ' +
                'left join merchant_info ui on u.user_id=ui.user_id ' +
                'left join merchant m on u.user_id=m.user_id ' +
                'where u.type in (' + (data.type == null?1:data.type) + ',1)';
            if(data.status)sql += ' and `status`="'+data.status+'"';
            if(data.userId)sql += ' and u.user_id="'+data.userId+'"';
            if(data.unionid)sql += ' and u.unionid="'+data.unionid+'"';
            if(data.nickName)sql += ' and `nick_name` like "%'+data.nickName+'%"';
            return  sql;
        },
        count:function(data){
            var sql = ' from `user` u ' +
                'left join merchant_info ui on u.user_id=ui.user_id ' +
                'left join merchant m on u.user_id=m.user_id ' +
                'where u.type=1 ';
            if(data.status)sql += ' and `status`="'+data.status+'"';
            if(data.nickName)sql += ' and `nick_name` like "%'+data.nickName+'%"';
            return  sql;
        },
        memberSearch:function(data){
            var sql = 'select mm.*,u.* from `merchant_member` mm ' +
                'left join user u on u.user_id=mm.user_id ' +
                'where u.type=0 ';
            sql += ' and mm.merchant_id="'+data.merchant_id+'"';
            if(data.nickName)sql += ' and `nick_name` like "%'+data.nickName+'%"';
            if(data.agentId)sql += ' and mm.agent_id="'+data.agentId+'" ';
            return  sql;
        },
        memberCount:function(data){
            var sql = ' from `merchant_member` mm ' +
                'left join user u on u.user_id=mm.user_id ' +
                'where u.type=0 ';
            sql += ' and mm.merchant_id="'+data.merchant_id+'"';
            if(data.nickName)sql += ' and `nick_name` like "%'+data.nickName+'%"';
            if(data.agentId)sql += ' and mm.agent_id="'+data.agentId+'" ';
            return  sql;
        },
        memberDownSearch:function(data){
            var sql = 'select so.score down_score,so.id down_id,u.*,mm.score,mm.merchant_id,mm.agent_id  from `merchant_member` mm ' +
                'left join user u on u.user_id=mm.user_id ' +
                'right join score_operator so on so.merchant_id=mm.merchant_id and so.user_id=u.user_id ' +
                'where 1=1 ';
            sql += ' and so.type="down" and so.status=0 and mm.merchant_id="'+data.merchant_id+'"';
            if(data.nickName)sql += ' and `nick_name` like "%'+data.nickName+'%"';
            if(data.id)sql += ' and so.id="'+data.id+'"';
            return  sql;
        },
        memberDownCount:function(data){
            var sql = ' from `merchant_member` mm ' +
                'left join user u on u.user_id=mm.user_id ' +
                'right join score_operator so on so.merchant_id=mm.merchant_id and so.user_id=u.user_id ' +
                'where 1=1 ';
            sql += ' and so.type="down" and so.status=0 and mm.merchant_id="'+data.merchant_id+'"';
            if(data.nickName)sql += ' and `nick_name` like "%'+data.nickName+'%"';
            return  sql;
        },
        memberBetCommon:function(data){
            var sql = 'select u.user_id,u.nick_name,u.head_img,mm.merchant_id,mm.score,mm.agent_id,' +
                'sum(b.bet_count * b.score) bet_score,sum(b.bet_count * b.score * '+data.rebateRate+') rebate_score,sum(b.bet_count) bet_count,sum(b.result_score) result_score ' +
                'from merchant_member mm ' +
                'LEFT JOIN `user` u on u.user_id = mm.user_id ' +
                'RIGHT JOIN `bet` b on b.user_id = mm.user_id and mm.merchant_id = b.merchant_id ' +
                'where b.status =1 and b.is_rebate=0 ';
            sql += ' and mm.merchant_id="'+data.merchantId+'" ';
            if(data.nickName)sql += ' and `nick_name` like "%'+data.nickName+'%" ';
            if(data.userIds)sql += ' and mm.user_id in ('+data.userIds+') ';
            if(data.agentId)sql += ' and mm.agent_id="'+data.agentId+'" ';
            if(data.startTime)sql += ' and b.create_time >= "'+data.startTime+'" ';
            if(data.endTime)sql += ' and b.create_time <= "'+data.endTime+'" ';
            sql += ' GROUP BY u.user_id ';
            return  sql;
        },
        memberBetSearch:function(data){
            var sql = 'select * from ('+this.memberBetCommon(data)+') mbc ' +
                'where mbc.rebate_score > ' + data.minRebateScore + ' order by mbc.rebate_score desc';
            return  sql;
        },
        memberBetCount:function(data){
            var sql = ' from ('+this.memberBetCommon(data)+') mbc ' +
                'where mbc.rebate_score > ' + data.minRebateScore;
            return  sql;
        },
        agentBetCommon:function(data){
            var sql = 'select u.user_id,u.nick_name,u.head_img,mm.merchant_id,mm.score,mm.agent_id,mm.user_id member_id,' +
                'sum(b.bet_count * b.score) bet_score,sum(b.bet_count * b.score * '+data.rebateRate+') rebate_score,sum(b.bet_count) bet_count,sum(b.result_score) result_score ' +
                'from merchant_member mm ' +
                'LEFT JOIN `user` u on u.user_id = mm.agent_id ' +
                'RIGHT JOIN `bet` b on b.user_id = mm.user_id and mm.merchant_id = b.merchant_id ' +
                'where b.status =1 and b.user_rebate=0 ';
            sql += ' and mm.agent_id<>'+data.merchantId;
            sql += ' and mm.merchant_id="'+data.merchantId+'" ';
            if(data.nickName)sql += ' and `nick_name` like "%'+data.nickName+'%" ';
            if(data.userIds)sql += ' and mm.agent_id in ('+data.userIds+') ';
            if(data.startTime)sql += ' and b.create_time >= "'+data.startTime+'" ';
            if(data.endTime)sql += ' and b.create_time <= "'+data.endTime+'" ';
            sql += ' GROUP BY u.user_id ';
            return  sql;
        },
        agentBetSearch:function(data){
            var sql = 'select * from ('+this.agentBetCommon(data)+') mbc ' +
                'where mbc.rebate_score > ' + data.minRebateScore + ' order by mbc.rebate_score desc';
            return  sql;
        },
        agentBetCount:function(data){
            var sql = ' from ('+this.agentBetCommon(data)+') mbc ' +
                'where mbc.rebate_score > ' + data.minRebateScore;
            return  sql;
        },
    };
};