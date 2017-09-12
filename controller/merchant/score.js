var express = require('express');
var router = express.Router();

router.post('/add',useValidate.hasLogin, function(req, res, next) {
    var userInfo = req.session.userInfo;
    useData.addScore(req.body.userId , {
        merchantId:userInfo.userId,
        score:req.body.score,
        type:'upload',
        operator:userInfo.userId,
        scoreType:'operator'
    },function(err , data){
        res.sendSqlData(err , data);
    });
});
exports.router = router;
exports.__path = '/merchant/score';