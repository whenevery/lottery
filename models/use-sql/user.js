module.exports = function(sql){
    sql.user = {
        search:function(data){
            return 'select u.*,ui.score,ui.merchant_id,ui.user_id uuid,ui.agent_id,m.spread_name  ' +
                'from `user` u ' +
                'left join merchant_member ui on u.user_id=ui.user_id ' +
                'left join merchant m on ui.merchant_id=m.user_id ' +
                'where ' + sql.sqlQuery(data);
        },
        add:function(data){
            var keys = sql.addKey(['open_id','unionid','nick_name','sex','head_img','status','type','province','city','country','create_time','update_time']);
            var values = sql.addValue([data.openId,data.unionid,data.nickName,data.sex,data.headImg,0,0,data.province,data.city,data.country]);
            values+=',now(),now()';
            return 'insert `user` ('+keys+') values ('+values+')';
        },
        update:function(data , $where){
            var updateValue = sql.updateValue(data);
            updateValue+=',update_time=now()';
            return 'update `user` set '+updateValue+' where ' +  sql.sqlQuery($where);
        },
        count:function(data){
            return ' from `user` u left join merchant_member ui on u.user_id=ui.user_id where ' + sql.sqlQuery(data);
        }
    };
};