var express = require('express');
var router = express.Router();

router.get('/',useValidate.wechatLogin, function(req, res, next) {
    var searchData = {
        game:req.query.game || 'lottery',
        date:req.query.date,
        status:req.query.status,
        term:req.query.term
    };
    useMysql.searchAll({
        sql:useSql.game.search(searchData),
        count:useSql.common.count('game',searchData),
        page:req.query.page,
        pageSize:req.query.pageSize
    },function(data){
        res.useSend(data);
    });
});

router.get('/last',useValidate.hasLogin,function(req, res, next) {
    useMysql.search(useSql.game.list({game:req.query.game || 'lottery'})+' limit 15',function(err ,data) {
        res.sendSqlData(err,data);
    });
});
exports.router = router;
exports.__path = '/game/list';