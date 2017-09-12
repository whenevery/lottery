module.exports = function(sql){
    sql.game = {
        list:function(data){
            return useSql.common.search('game',data) + ' and result is not null and result <> "" ORDER BY date desc,term desc ';
        },
        search:function(data){
            return useSql.common.search('game',data) + ' ORDER BY date desc,term desc ';
        },
    };
};