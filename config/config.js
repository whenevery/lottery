//admin 1234yqs_admin
module.exports = {
    "port":3083,
    wsPort:2999,
    wsHref:'ws://127.0.0.1:2999',
    debug:0,
    "yqsapi":"http://api.yqsapp.com",
    "imgUrl":"http://img.yqsapp.com/",
    "wechatLoginUrl":'http://h5.yqsapp.com/wechat/entrance/test?port=3083',
    "log4js":{
        "customBaseDir" :"/logs/",
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
        host:'120.77.156.29',
        port:'27017',
        dbname:'lottery'
    },
    mysqlOptions:{
        host:'127.0.0.1',
        user:'dev',
        password :'dev123',
        database :'node'
    }
};

