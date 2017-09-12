var mongooseDb = require('./mongoose-db.js');
var mongooseData = require('./data.js');
var __mongoose = {},__mongooseDB = {};
var mongooseConnection = {};
var method = {
    start:function(dbname , call){
        var dbConfig = useConfig.dbOptions;
        if(typeof dbname == 'function'){
            call = dbname;
            dbname = '';
        }
        dbname = dbname || dbConfig.dbname || 'lottery';
        if(mongooseConnection[dbname])return this.mongoose = mongooseConnection[dbname];
        var mongoose = require('mongoose');
        var uri = 'mongodb://' + (dbConfig.host || 'localhost') + useCommon.unShift(dbConfig.port,':');
        var that = this;
        var db = mongoose.connect(uri + useCommon.unShift(dbname), {
            useMongoClient:true
        });
        db.then(function(db){
            that.mongoose = mongooseConnection[dbname] = mongoose;
            call && call();
        }).catch(function(err){
            useLog.log('[mongodb连接异常] - ' + err);
        });
    },
    init:function(call){
        this.start('',call);
    },
    create:function(tablename , options){
        if(!tablename){
            useLog.log("tablename is null");
            return null;
        }
        if(!mongooseData[tablename] && !options){
            useLog.log("Schema data is null");
            return null;
        }
        if(__mongooseDB[tablename])return __mongooseDB[tablename];
        var db = __mongoose[tablename] = __mongoose[tablename] || this.mongoose.model(tablename , new this.mongoose.Schema(mongooseData[tablename] || options));
        return __mongooseDB[tablename] = new mongooseDb(db);
    },
    createData:function(tablename , data , options){
        var rt = {};
        if(!tablename){
            useLog.log("tablename is null");
            return rt;
        }
        if(!mongooseData[tablename] && !options){
            useLog.log("Schema data is null");
            return rt;
        }
        options = options || mongooseData[tablename];
        for(var key in options){
            if(data[key]!=null)rt[key] = data[key];
        }
        return rt;
    }
};
module.exports = method;
