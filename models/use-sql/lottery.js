module.exports = function(sql){
    sql.lottery = {
        moreGame:function(){
            return useSql.common.search('game',{status:0}) + ' and date<' + useCommon.parseDate(new Date,'Ymd');
        }
    };
};