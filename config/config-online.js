//admin 1234yqs_admin
module.exports = {
    debug:0,
    wsHref:'ws://120.27.213.0:2999',
    "wechatLoginUrl":'http://h5.yqsapp.com/wechat/entrance/wxcp',
    "log4js":{
        "customBaseDir" :"../logs/lottery/",
        "customDefaultAtt" :{
            "type": "dateFile",
            "absolute": true,
            "alwaysIncludePattern": true
        },
        "appenders": [
            {"type": "console", "category": "console"},
            {"pattern": "debug/yyyyMMdd.log", "category": "logDebug"},
            {"pattern": "info/yyyyMMdd.log", "category": "logInfo"},
            {"pattern": "warn/yyyyMMdd.log", "category": "logWarn"},
            {"pattern": "err/yyyyMMdd.log", "category": "logErr"}
        ],
        "replaceConsole": true,
        "allConsole":true,
        "levels":{ "logDebug": "DEBUG", "logInfo": "DEBUG", "logWarn": "DEBUG", "logErr": "DEBUG"}
    },

    dbOptions:{
        host:'127.0.0.1',
        port:'27017',
        dbname:'lottery'
    },
    mysqlOptions:{
        host:'127.0.0.1',
        user:'root',
        password :'yqs2016moneytree',
        database :'node'
    }
};

