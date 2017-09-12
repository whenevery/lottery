var express = require('express');
var router = express.Router();
router.get('/log', function(req, res, next) {
    useLog.log('window error');
    useLog.log(req.query);
    res.status(204).end();
});
exports.router = router;

exports.__path = '/common';