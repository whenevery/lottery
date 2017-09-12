;(function(){
    var merchantObj = {};
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