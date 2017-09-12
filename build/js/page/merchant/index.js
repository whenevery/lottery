;(function(){
    var merchantObj = {};
    var downScoreAudio = $('<audio src="/images/audio/xiafen.mp3"></audio>').css('opacity','0');
    downScoreAudio.appendTo('body');
    var gameErrorAudio = $('<audio src="/images/audio/error.mp3"></audio>').css('opacity','0');
    gameErrorAudio.appendTo('body');
    console.log('create-socket start');
    WY.trigger('create-socket',{
        downScore:function(){
            console.log('down score notice');
            downScoreAudio[0].play();
        },
        gameError:function(){
            console.log('game error');
            gameErrorAudio[0].play();
        }
    },function(socket){
        console.log('create-socket end');
        socket.send(JSON.stringify({
            type:'addMerchant',
            merchantId:sessionJson.userInfo.userId
        }));
    });
    WY.ready('user-member-obj',merchantObj);
    function doInit(index){
        merchantObj[['member','game','count','rule','my'][index]].init();
    }
    $(function(){
        var $activeItem = $('.page-footer .active-item');
        var thisSwiper = new Swiper('.swiper-container',{
            onSlideChangeEnd:function(swiper){
                var index = swiper.activeIndex;
                WY.trigger('change-active-item',$activeItem.eq(index));
                doInit(index);
            }
        });
        WY.bind('active-item',function($item){
            if($item[0].dataset.type == 'footer'){
                thisSwiper.slideTo($item.index());
            }
        });
        doInit(0);
    });
})();