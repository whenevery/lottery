module.exports = {
    init:function(call){
        require('./game');
        require('./rule');
        call && call();
    }
};