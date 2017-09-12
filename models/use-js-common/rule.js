useGame.rule = useGame.rule||{};
useGame.rule.reload = function(data){
    var ruleData = data.data;
    var that = {};
    var betRule  = ruleData.filter(function(a){return a.code === 'bet'}).pop();
    var withdrawRule  = ruleData.filter(function(a){return a.code === 'withdraw'}).pop();
    var resRule  = ruleData.filter(function(a){return a.code === 'res'}).pop();
    that.betRule = Object.assign(data.rule.bet,useCommon.parse(betRule && betRule.content));
    that.withdrawRule = Object.assign(data.rule.withdraw,useCommon.parse(withdrawRule && withdrawRule.content));
    that.resRule = data.rule.res;
    that.resDataId = resRule && resRule.id;
    that.betDataId = betRule && betRule.id;
    that.withdrawDataId = withdrawRule && withdrawRule.id;
    var resRuleData = useCommon.parse(resRule && resRule.content);
    if(resRuleData){
        resRuleData.forEach(function(a){
            if(that.resRule.every(function(b , i){
                    if(a.code === b.code){
                        that.resRule[i] = a;
                        return false;
                    }
                    return true
                })){
                that.resRule.push(a);
            }
        });
    }
    return that;
};
