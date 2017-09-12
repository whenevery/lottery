function merchantInfo(req , res , next){
    if(req.session.userInfo)return next();
    merchantInfo.flush(req , res , next);
}
merchantInfo.add = function(wechatInfo , call , sts){
    if(sts){
        add();
    }
    else useMysql.search(useSql.user.search({
        unionid:wechatInfo.unionid
    }) , function(err , data){
        if(!err){
            if(!data.length){
                add();
            }else call && call({code:2});
        }else{
            call && call({
                message:'查询失败',
                err:err
            })
        }
    });
    function add(){
        useMysql.add(useSql.user.add(wechatInfo ), function(err , data){
            call && call({code:err != null,data:data,err:err});
        });
    }
};
merchantInfo.flush = function(req , res , next){
    useMysql.search(useSql.merchant.search({
        unionid:req.session.unionid,
        type:'0'
    }), function(err , data){
        if(!err){
            if(!data.length){
                merchantInfo.add(req.session.wechat_info , function(data){
                    if(data.code === 2){
                        return next();
                    }
                    if(data.code == 0){
                        merchantInfo(req, res , next);
                    }else next(data);
                });
            }else{
                req.session.userInfo = data[0];
                useSession.save(req , res , next);
            }
        }else{
            next(err);
        }
    })
};
module.exports = merchantInfo;