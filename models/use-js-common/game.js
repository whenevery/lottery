if(typeof useGame === 'undefined')window.useGame = {};
useGame.lottery = useGame.lottery || {};
var winDataCount = 0;
var winData = {};
useGame.lottery.checkOther = function(result){
    if(!result)return {};
    if(typeof  result === 'string'){
        result = result.split(',');
    }
    if(winData[result.join()])return winData[result.join()];
    var sum = 0;
    var resultLen = result.length;
    result.forEach(function(a){
        sum += a-0;
    });
    var rt = {};
    rt.odd = sum % 2;
    rt.even = !rt.odd;
    rt.long = result[0] > result[4];
    rt.hu = result[0] < result[4];
    rt.he = result[0] === result[4];
    rt.big = sum > (resultLen>1?22:4);
    rt.small = !rt.big;
    rt.bigName = rt.big?'大':'小';
    rt.evenName = rt.even?'双':'单';
    rt.longName = rt.long?'龙':(rt.hu?'虎':'和');
    rt.bigClass = rt.big?'color-red-2':'color-blue-1';
    rt.evenClass = rt.even?'color-red-2':'color-blue-1';
    rt.longClass = rt.long?'color-red-2':(rt.hu?'color-blue-1':'color-green-1');
    rt.bigOdd = rt.odd && rt.big;
    rt.bigEven = rt.even && rt.big;
    rt.smallOdd = rt.odd && rt.small;
    rt.smallEven = rt.even && rt.small;
    rt.otherClass = 'color-blue-1';
    if(winDataCount > 20){
        winDataCount = 0;
        winData = {};
    }else{
        winDataCount ++ ;
        winData[result.join()] = rt;
    }
    return rt;
};
//玩法
useGame.lottery.getBetName = function(code,type){
    if(code.join)code = code.join('');
    var startName = (type==='selectOther'?'定':'');
    if(startName){
        switch (code){
            case 'odd':
                return startName + '单';
            case 'even':
                return startName + '双';
            case 'big':
                return startName + '大';
            case 'small':
                return startName + '小';
        }
    }
    if(code)switch (code){
        case 'odd':
        case 'even':
            return '单双';
        case 'big':
        case 'small':
            return '大小';
        case 'long':
        case 'hu':
        case 'he':
            return '龙虎';
    }
    if(type)switch (type){
        case 'otherDouble':
            return '组合';
        case 'select':
            return '定选';
        case 'group':
            return (code.length>1?'连码':'单码');
    }
};
useGame.lottery.getBetShowName = function(type,content ){
    if(type === 'selectOther'){
        return ['万','千','百','十','个'][useGame.lottery.getContentIndex(content)];
    }
    if(type === 'select'){
        content = useCommon.parse(content);
        return content.map(function(a){return a || '*'}).join('');
    }
    if(content.join)content = content.join('');
    return useGame.lottery.getOtherBetTypeName(content) || content;
};
useGame.lottery.getOtherBetTypeName = function(code ){
    return ({
        odd:'单',
        even:'双',
        big:'大',
        small:'小',
        long:'龙',
        hu:'虎',
        he:'和',
        bigOdd:'大单',
        bigEven:'大双',
        smallOdd:'小单',
        smallEven:'小双',
    })[code ] || '';
};
useGame.lottery.getBetTypeClass = function(type){
    return ({
        select:'back-blue',
        group:'back-blue-2',
        other:'back-blue-1',
    })[type] || 'back-blue-1';
};
useGame.lottery.checkBet = function(data){
    var betType = data.betType;
    var betContent = useCommon.parse(data.betContent);
    var betTypeName;
    betTypeName = useGame.lottery.getBetName(betContent , betType);
    var rt = {
        betType:betType,
        betContent:data.betContent,
        betTypeName:betTypeName,
        code:betContent,
    };
    if(betType === 'select'){
        rt.code = 'select_' + (betContent.join('')).length;
    }
    else if(betType === 'group'){
        rt.code = 'group_' + betContent.length;
    }
    else if(betType === 'selectOther'){
        rt.code = betContent.join('');
    }
    return rt;
};
useGame.lottery.getContentIndex = function(content){
    content = useCommon.parse(content);
    var index;
    content.every(function(a,i){
        if(a){
            index = i;
            return false;
        }
        return true;
    });
    return index;
};
useGame.lottery.checkWin = function(betData , settleData){
    var betType = betData.betType;
    var result = typeof settleData.kjcode === 'string'?settleData.kjcode.split(','):settleData.kjcode;
    var checkContent;
    if(betType === 'other' || betType === 'otherDouble')return this.checkOther(result)[betData.betContent];
    if(betType === 'selectOther'){
        checkContent = useCommon.parse(betData.betContent);
        return this.checkOther(result[useGame.lottery.getContentIndex(checkContent)])[checkContent.join('')];
    }
    if(betType === 'group'){
        //单码
        if(betData.betContent.length === 1){
            var count = 0;
            result.forEach(function(a){
                if(a === betData.betContent){
                    count++;
                }
            });
            return count;
        }
        //连码
        var map = {};
        result.forEach(function(a){
            map[a] = map[a]?(map[a]+1):1;
        });
        checkContent = betData.betContent.split('');
        var i=0,key;
        while (key = checkContent[i]){
            if(!map[key])return false;
            map[key] --;
            i++;
        }
        return true;
    }else{
        checkContent = useCommon.parse(betData.betContent);
        if(checkContent.every(function(a , i){
            if(a){
                if(a-0 !== result[i]-0){
                    return false;
                }
            }
            return true;
        }))return true;
    }
};