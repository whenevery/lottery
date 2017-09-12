//倒计时
WY.bind('date-time-count',function(time , $content){
    function setTime(){
        var str;
        if(time <= 0){
            str = '00:00';
        }else{
            var dateData = useCommon.sumDate(time);
            str = ('00'+dateData.i).slice(-2) + ':' +
            ('00'+dateData.s).slice(-2);
            time -= 1000;
            setTimeout(setTime,1000);
        }
        $content.html(str)
    }
    setTime();
});