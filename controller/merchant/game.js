var express = require('express');
var router = express.Router();

router.get('/detail',useValidate.wechatLogin, function(req, res, next) {
    res.useRender('merchant/game-detail',{
        resJson:{
            useType:'merchant'
        }
    })
});

exports.router = router;
exports.__path = '/merchant/game';