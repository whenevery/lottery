var env = process.env.NODE_ENV;
var configData = require(__ROOT__ + '/config/config');
try{
    var envData = require(__ROOT__ + '/config/config-' + env);
    Object.assign(configData , envData);
}catch(e){
}
console.log(configData);
module.exports = configData;