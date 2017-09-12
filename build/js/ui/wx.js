WY.bind('wx-jssdk',function(){
    $.post('/wechat/jssdk',{
        url:location.href
    } , function(a){
        if(a.code == 0){
            var data = a.data;
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appId, // 必填，公众号的唯一标识
                timestamp:data.timestamp , // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature,// 必填，签名，见附录1
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        }
    });
});
wx.error(function(){

});
wx.ready(function(){
    wx.onMenuShareTimeline({
        title:'广西电信',
        link:location.href,
        imgUrl:'http://h5.yqsapp.com/images/share/share.jpg'
    });
    wx.onMenuShareAppMessage({
        title:'广西电信',
        link:location.href,
        desc:'每天摇一摇，奖品随时兑！',
        imgUrl:'http://h5.yqsapp.com/images/share/share.jpg'
    });
});

