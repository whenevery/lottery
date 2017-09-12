var express = require('express');
var router = express.Router();

router.get('/data',useValidate.hasLogin, function(req, res, next) {
    useData.getRuleData(req.session.userInfo.userId,'lottery',function(data){
        res.useSend(data);
    });
});
router.post('/add',useValidate.hasLogin, function(req, res, next) {
    useMysql.add(useSql.common.add('rule',{
        game:'lottery',
        code:req.body.code,
        content:req.body.content,
        userId:req.session.userInfo.userId
    }),function(err , data){
        res.sendSqlData(err, data);
    })
});
router.post('/update',useValidate.hasLogin, function(req, res, next) {
    useMysql.update(useSql.common.update('rule',{
        content:req.body.content
    },{id:req.body.id}),function(err , data){
        res.sendSqlData(err, data);
    });
});
exports.router = router;
exports.__path = '/rule/lottery';