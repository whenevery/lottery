//验证图片验证码
module.exports = function (req , res , next){
    var imgCode = req.body.imgCode || req.query.imgCode;
    if(!imgCode || req.session.imgCode != imgCode){
        useLog.log(req.cookies);
        useLog.log('img code error');
        useLog.log(req.session.imgCode + '  ' +  imgCode);
        delete req.session.imgCode;
        useSession.save(req , res , function(){
            res.useSend({imgError:1,message:'图片验证码错误',reImgCode:1,code:useCodeEnum.IMG_CODE_FAIL});
        });
    }else{
        delete req.session.imgCode;
        next();
    }
};