var express = require('express');
var router = express.Router();
router.post('/send',useValidate.imgCodeValidate, function(req, res, next) {
    useRequest.auto(req , res , {
        url:useUrl.sms.send,
        data:{
            phone:req.body.username,
            sendType:req.body.sendType
        },
        notBody:1,
        method:'POST',
        done:function(a){
            res.useSend(a);
        }
    })
});
exports.router = router;

exports.__path = '/sms';