var game = {};
require('./lottery')(game);
game.init = function(call){
    for(var key in game){
        if(game[key].doRequire)game[key].doRequire();
        console.log(useConfig.debug);
        if(!useConfig.debug)if(game[key].init)game[key].init();
    }
    call && call();
};
game.able = function(req,res,next){
    var game = req.params.game;
    if(['lottery'].indexOf(game) >= 0){
        return next();
    }
    res.send('无效的链接');
};
module.exports = game;