var express = require('express');
var router = express.Router();
router.get('/rule',useValidate.hasLogin,function(req, res, next) {
    useGame.lottery.rule(req.query.userId,function(data){
        res.useSend(data);
    })
});
router.get('/next',useValidate.hasLogin,function(req, res, next) {
    useGame.lottery.next(function(data){
        res.useSend(data);
    });
});
router.get('/last',useValidate.hasLogin,function(req, res, next) {
    useGame.lottery.last(function(data){
        res.useSend(data);
    })
});
router.get('/game',useValidate.hasLogin,function(req, res, next) {
    useGame.lottery.game(function(data){
        res.useSend(data);
    })
});
router.get('/bet',useValidate.hasLogin,function(req, res, next) {
    useGame.lottery.bet(function(data){
        res.useSend(data);
    })
});
router.post('/add',useValidate.hasLogin,function(req, res, next) {
    var data = req.body;
    data.userId = req.session.userInfo.userId;
    data.merchantId = req.session.userInfo.merchantId;
    if(req.session.userInfo.type > 0){
        return res.useSend({message:'你的身份不能下注'});
    }
    if(req.session.userInfo.score < data.score){
        return res.useSend({message:'积分不足'});
    }
    useGame.lottery.addBet(data,function(a){
        res.useSend(a);
    })
});
router.post('/del',useValidate.hasLogin,function(req, res, next) {
    useGame.lottery.delBet({
        userId:req.session.userInfo.userId,
        gameId:req.body.gameId,
        betId:req.body.betId,
    },function(a){
        res.useSend(a);
    })
});
router.get('/result',useValidate.hasLogin,function(req, res, next) {
    useGame.lottery.result(req.query.term,function(data){
        res.useSend(data);
    })
});
router.get('/win',useValidate.hasLogin,function(req, res, next) {
    useMysql.search(useSql.common.search('bet',{
        game_id:req.query.gameId,
        merchantId:req.session.userInfo.merchantId,
        userId:req.session.userInfo.userId,
        status:1,
    }),function(err, data){
        res.sendSqlData(err, data);
    })
});
router.post('/back',useValidate.hasLogin,function(req, res, next) {
    var ignoreId;
    useGame.lottery.game(function(gameInfo){
        if(gameInfo)ignoreId = gameInfo.id;
        var sql = useSql.common.search('game',{
            status:0
        });
        if(ignoreId){
            sql += ' and id <> ' + ignoreId;
        }
        useMysql.search(sql,function(err , data){
            if(err)return res.sendSqlData(err,  data);
            if(data && data.length){
                useGame.moreSettle(data,function(){
                    res.useSend({
                        code:0,
                        message:'成功退还' + data.length + '期下注'
                    })
                });
            }else{
                return res.useSend({message:'没有需要退还的记录'});
            }
        });
    })
});
router.get('/:userId',useValidate.wechatLogin,useWechat.userInfo.flush, function(req, res, next) {
    useData.getMerchantInfo(req.params.userId , function(err , merchantInfo){
        if(err || !merchantInfo || merchantInfo.type !== 1){
            return res.send('无效的链接');
        }
        if(!merchantInfo.validTime || new Date(merchantInfo.validTime) < Date.now()){
            return res.send('该链接已经过期 请让商户续期！');
        }
        useGame.lottery.userJoin(merchantInfo , req.session.userInfo,function(){
            res.useRender('game/lottery/index',{
                resJson:{
                    merchantInfo:merchantInfo
                }
            });
        });
    });
});

exports.router = router;
exports.__path = '/game/lottery';