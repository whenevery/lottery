var express = require('express');
var router = express.Router();
router.get('/:game/:merchantId/:agentId',useValidate.wechatLogin,useWechat.userInfo.flush,useGame.able, function(req, res, next) {
    useData.getMerchantInfo(req.params.merchantId , function(err , merchantInfo){
        if(err || !merchantInfo || merchantInfo.type !== 1){
            return res.send('无效的链接');
        }
        if(!merchantInfo.validTime || new Date(merchantInfo.validTime) < Date.now()){
            return res.send('该链接已经过期 请让商户续期！');
        }
        merchantInfo.agentId = req.params.agentId;
        useGame.lottery.userJoin(merchantInfo , req.session.userInfo,function(){
            res.useRender('game/'+req.params.game+'/index',{
                resJson:{
                    merchantInfo:merchantInfo
                }
            });
        });
    });
});

exports.router = router;
exports.__path = '/agent';