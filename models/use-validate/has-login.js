module.exports = function(req , res , next){
    if(req.session.userInfo)return next();
    res.sendErrorMessage('HTTP_CODE_401');
};