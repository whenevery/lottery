var express = require('express');
var router = express.Router();
router.get('/list',useValidate.hasLogin,function(req, res, next) {
    var searchData = {
        merchant_id:req.session.userInfo.userId,nickName:req.query.nickName,agentId:req.query.agentId
    };
    useMysql.searchAll(
        {
            sql:useSql.merchant.memberSearch(searchData),
            count:useSql.merchant.memberCount(searchData),
            page:req.query.page,
            pageSize:req.query.pageSize,

        }
    ,function(data){
            res.useSend(data);
        })
});
router.get('/down/list',useValidate.hasLogin,function(req, res, next) {
    var searchData = {
        merchant_id:req.session.userInfo.userId,nickName:req.query.nickName
    };
    useMysql.searchAll(
        {
            sql:useSql.merchant.memberDownSearch(searchData),
            count:useSql.merchant.memberDownCount(searchData),
            page:req.query.page,
            pageSize:req.query.pageSize,

        }
    ,function(data){
            res.useSend(data);
        })
});
router.post('/down/confirm',useValidate.hasLogin,function(req, res, next) {
    var status =  req.body.status - 0;
    useMysql.search(useSql.merchant.memberDownSearch({
        id:req.body.id,
        merchant_id:req.session.userInfo.userId
    }) , function(err , data){
       if(err)res.sendErrorMessage();
       else{
           var downData = data[0];
           if(!downData)return res.useSend({message:'无效记录'});
           if(status === 1){
               useData.addScore(downData.userId,{
                   score:downData.downScore,
                   merchantId:req.session.userInfo.userId,
                   notAddOperator:1,
               },function(err , data){
                   if(err){
                       return res.sendSqlData(err,data);
                   }else doUpdate();
               })
           }else{
               doUpdate();
           }
       }
    });
    function doUpdate(){
        useMysql.update(
            useSql.common.update('score_operator',{
                status:status === 1?1:2
            },{id:req.body.id})
            ,function(err , data){
                res.sendSqlData(err , data);
            })
    }

});

router.get('/info',useValidate.hasLogin,function(req, res, next) {
    useData.getUserInfo(req.query.userId,req.session.userInfo.userId,function(err , memberInfo){
        res.useRender('merchant/member',{
            resJson:{
                memberInfo:memberInfo
            }

        })
    });
});
router.get('/count',useValidate.hasLogin,function(req, res, next) {
    var all = [];
    all.push(new Promise(function(rev){
        useMysql.query(useSql.userCount.member({
            merchantId:req.session.userInfo.userId
        }),function(err,data){
            rev(data[0]);
        });
    }));
    all.push(new Promise(function(rev){
        useMysql.query(useSql.userCount.bet({
            merchantId:req.session.userInfo.userId
        }),function(err,data){
            rev(data[0]);
        });
    }));
    all.push(new Promise(function(rev){
        useMysql.query(useSql.userCount.operator({
            merchantId:req.session.userInfo.userId
        }),function(err,data){
            rev(data[0]);
        });
    }));
    Promise.all(all).then(function(v){
        res.sendSuccess(v);
    })
});
exports.router = router;
exports.__path = '/merchant/member';