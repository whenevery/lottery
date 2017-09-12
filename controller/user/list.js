var express = require('express');
var router = express.Router();

router.get('/admin',useValidate.hasLogin,function(req, res, next) {
    useMysql.search(useSql.user.search(' u.type>90 ') , function(err , data){
        res.sendSqlData(err , data);
    });
});
router.get('/merchant',useValidate.hasLogin,function(req, res, next) {
    useMysql.searchAll({
        page:req.query.page,
        sql:useSql.merchant.search(req.query),
        count:useSql.merchant.count(req.query),
    } , function(data){
        res.useSend(data);
    });
});
exports.router = router;
exports.__path = '/user/list';