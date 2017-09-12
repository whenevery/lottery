var WebSocketServer  = require('ws').Server;
var  wss = new WebSocketServer({
    port: useConfig.wsPort, //监听接口
});
var merchantList = [];
wss.on('connection' , function(ws){
    console.log('has one connection');
    ws.on('message', function(jsonStr,flags) {
        var data = useCommon.parse(jsonStr);
        console.log('on message');
        console.log(data);
        if(handler[data.type]){
            handler[data.type](data , ws);
        }
    });
    ws.on('close', function(close) {
        if(ws.isMerchant){
            merchantList.every(function(a,i){
                if(a.ws === ws){
                    merchantList.splice(i , 1);
                    return false;
                }
                return true;
            });
        }
    });
});
var handler = {
    sendMerchant:function(data , ws){
        merchantList.forEach(function(a){
            a.ws.send(JSON.stringify(data));
        })
    },
    addMerchant:function(data , ws){
        ws.isMerchant = 1;
        merchantList.push({
            merchantId:data.merchantId,
            ws:ws
        });
    },
    downScore:function(data , ws){
        var merchant = merchantList.filter(function(a){
            return a.merchantId === data.merchantId;
        }).pop();
        if(merchant){
            merchant.ws.send(JSON.stringify({type:'downScore'}));
        }
    },
};
module.exports = {
    sendMerchant:function(data){
        handler.sendMerchant(data);
    }
};