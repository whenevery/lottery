var express = require('express');
var router = express.Router();
router.get('/view', function(req, res, next) {
    res.useRender(req.query.view);
});
exports.router = router;

exports.__path = '/common';