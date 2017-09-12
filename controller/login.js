var express = require('express');
var router = express.Router();
var mongo = useMongo.create('user');
var md5 = require('md5');
router.get('/', function(req, res, next) {
    delete req.session.userInfo;
    res.useRender('login');
});
exports.router = router;

exports.__path = '/login';