WY.bind('user-info-flush',function(){
    $.get('/user/info',function(data){
        WY.ready('user-info',data.data);
    });
});WY.bind('merchant-info-flush',function(){
    $.get('/user/info/merchant',function(data){
        WY.ready('user-info',data.data);
    });
});
WY.ready('user-info',function(userInfo){
    console.log(userInfo);
    if(userInfo.validTime){
        userInfo.validTime = useCommon.parseDate(userInfo.validTime);
    }
    if(userInfo.upScoreImg){
        userInfo.upScoreImg = useCommon.concatImgUrl(userInfo.upScoreImg);
    }
    if(userInfo.connectImg){
        userInfo.connectImg = useCommon.concatImgUrl(userInfo.connectImg);
    }
    if(userInfo.headImg){
        userInfo.headImg = useCommon.concatImgUrl(userInfo.headImg);
    }
    sessionJson.userInfo = userInfo;
});
console.log(sessionJson.userInfo);
WY.ready('user-info',sessionJson.userInfo);