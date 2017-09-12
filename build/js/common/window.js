;(function(){
    var $autoWindow;
    WY.bind('modal-load' , function(content , options){
        content.parent().find('[modal-handler]').each(function(){
            var handler = $(this).attr('modal-handler');
            var $content = $(this);
            handler.split(',').forEach(function(one){
                WY.trigger('modal-handler-'+one, $content , options);
            });

        });
    });
    WY.bind('modal' , function(options){
        if(!$autoWindow){
            $autoWindow = $('.auto-modal-window');
        }else{
            $autoWindow.showEasyWindow('hide');
        }
        var $content = $autoWindow.find('.main');
        $content.html(options.content);
        WY.trigger('modal-load',$content.children() , options);
        $autoWindow.showEasyWindow('',options.hideAble);
        options.done && options.done($content.children());
    });
    WY.bind('modal-view' , function(url , options){
        options = options || {};
        WY.trigger('load-view' , url , function(view){
            if(typeof options ==='function'){
                options = {
                    done:options
                }
            }
            options.content = view;
            WY.trigger('modal',options);
        });
    });
    WY.bind('load-view' , function(url , call){
        if(url[0] !== '/'){
            url = '/common/view?view='+url;
        }
        $.get(url , function(view){
            call && call(view);
        });
    });
    WY.bind('modal-hide' , function(){
        WY.trigger('message-hide');
        if($autoWindow){
            $autoWindow.showEasyWindow('hide');
        }
    });
    $(function(){
        var modalLoad;
        var options;
        var $this;
        function load(){
            WY.trigger('modal-view',modalLoad,options);
        }
        $('body').wyOn('click','[modal-load]' , function(){
            $this = $(this);
            modalLoad = $this.attr('modal-load');
            options = useCommon.parse($this.attr('modal-options'));
            load();
            return false;
        });
        $('body').wyOn('click','.modal-hide' , function(){
            WY.trigger('modal-hide');
        });
        WY.bind('modal-handler-modal-hide',function($content){
            $content.click(function(){
                WY.trigger('modal-hide');
            });
        })
    });
})();