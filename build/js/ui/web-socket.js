;(function(){
    var lastSocket;
    WY.bind('create-socket',function(handler,call){
        var socket = lastSocket = new WebSocket(resJson.wsHref);
        socket.onopen = function(event) {
            console.log('onopen');
            // 监听消息
            socket.onmessage = function(event) {
                var obj = useCommon.parse(event.data);
                console.log(obj);
                if(handler[obj.type]){
                    handler[obj.type](obj);
                }
            };
            // 监听Socket的关闭
            socket.onclose = function(event) {
                if(handler.onclose)handler.onclose(socket);
            };
            if(handler && handler.init)handler.init(socket);
            call && call(socket);
        };
        socket.onerror  = function(event){
            console.log('onerror');
            console.log(event);
            if(handler.onerror)handler.onerror();
        };
    });
    WY.bind('socket-down-score',function(data){
        lastSocket.send(JSON.stringify({
            type:'downScore',
            merchantId:data.merchantId,
        }))
    });
})();