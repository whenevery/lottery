var fileReader = require('../file-reader');
var path = require('path');
var config = require('../use-config');
module.exports = function(app , call){
    //需要渠道的路由
    fileReader.getAllFileList(useCommon.arrayUnique(config.controller || []).concat(['controller']).map(function(a){return __ROOT__ + useCommon.unShift(a);})  ,function(o){
        o.forEach(function(path){
            var router = require('' + path);
            app.use(router.__path || '/',router.router || router);
        });
        if(call)call();
    });

};