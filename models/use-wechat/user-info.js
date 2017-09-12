function user_info(req , res , next){
    if(req.session.userInfo)return next();
    user_info.flush(req , res , next);
}
user_info.add = function(wechatInfo , call , sts){
    if(sts){
        add();
    }
    else useMysql.search(useSql.common.search('user',{
        unionid:wechatInfo.unionid
    }) , function(err , data){
        if(!err){
            if(!data.length){
                add();
            }else call && call({code:0,data:data[0]});
        }else{
            call && call({
                message:'查询失败',
                err:err
            })
        }
    });
    function add(){
        useMysql.add(useSql.user.add(wechatInfo ), function(err , data){
            if(err){
                call && call({
                    message:'账号同步失败',
                    err:err
                })
            }else user_info.add(wechatInfo , call);
        });
    }
};
user_info.flush = function(req , res , next){
    var userInfo = req.session.userInfo;
    var merchantId = req.params.userId || (userInfo && userInfo.merchantId) ||  req.params.merchantId
     || req.query.merchantId || req.body.merchantId;
    user_info.add(req.session.wechat_info , function(d){
        var userInfo = d.data;
        if(d.code == 0 ){
            if(merchantId && userInfo.type === 0){
                useMysql.search(useSql.user.search({
                    unionid:req.session.unionid,
                    merchantId:merchantId
                }), function(err , data){
                    if(!err){
                        if(data.length){
                            userInfo = data[0];
                        }
                        req.session.userInfo = userInfo;
                        useSession.save(req , res , next);
                    }else{
                        next(err);
                    }
                })
            }else{
                req.session.userInfo = userInfo;
                useSession.save(req , res , next);
            }
        }else{
            res.send('账户异常');
        }
    });

};
module.exports = user_info;