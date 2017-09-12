var express = require('express');
var router = express.Router();

router.get('/mysql', function(req, res, next) {
    useMysql.query('select * from user',function(err , rows , fields){
        res.send({
            err:err , rows:rows , fields:fields
        });
    })
});
router.get('/count', function(req, res, next) {
    useMysql.query('select count(open_id) from user',function(err , rows , fields){
        res.send({
            err:err , rows:rows , fields:fields
        });
    })
});
exports.router = router;
exports.__path = '/test';