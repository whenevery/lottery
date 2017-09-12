var express = require('express');
var router = express.Router();
router.post('/upload',function(req, res, next) {
    req.pipe(useRequest.request(useUrl.file.upload)).pipe(res);
});
router.post('/test',useMulter.file({
    filename:'xx.png'
}),function(req, res, next) {
    res.useSend(req.file);
});
exports.router = router;
exports.__path = '/file';