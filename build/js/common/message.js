;(function(){
    var $messageWindow,messageSubmit;
    WY.bind('message-submit',function(){
        messageSubmit && messageSubmit($messageWindow);
    });
    WY.bind('message-window',function(options){
        if($messageWindow){
            setOptions(options);
        }else{
            WY.trigger('load-view' , options.view || 'window/message', function(view){
                $messageWindow = $(view);
                $messageWindow.appendTo('body');
                $messageWindow.find('.submit-btn').click(function(){
                    WY.trigger('message-submit');
                });
                setOptions(options);
            });
        }
    });
    function setOptions(options){
        $messageWindow.find('.title').text(options.title||'温馨提示');
        $messageWindow.find('.text').html('').append(options.content);
        $messageWindow.find('.submit-btn').text(options.submitText||'确定');
        messageSubmit = options.submit;
        $messageWindow.showEasyWindow();
        options.done && options.done($messageWindow);
    }

    WY.bind('raffle-message-window',function(options){
        options.view = 'window/raffle/message';
        WY.trigger('message-window',options)
    });
    WY.bind('message-hide',function(){
        $messageWindow && $messageWindow.showEasyWindow('hide');
    });
})();