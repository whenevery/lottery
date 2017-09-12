var express = require('express');
var router = express.Router();

router.get('/detail',useValidate.wechatLogin, function(req, res, next) {
    res.useRender('user/game-detail')
});

exports.router = router;
exports.__path = '/user/game';