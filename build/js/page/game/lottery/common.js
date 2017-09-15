;(function(){
    function makeBall(num,type,sm){
        return '<span class="ico-win '+(sm?'win-sm':'')+' ball-'+type+' scale-09">'+num+'</span>';
    }
    WY.lotteryObject = {};
    WY.lotteryObject.makeBetResult = function(kjcode , $content , sm){
        $content = $($content);
        WY.lotteryObject.createBetResult(kjcode , $content,sm);
        var res = useGame.lottery.checkOther(kjcode);
        $content.append('<span class="'+(res.bigClass)+'">'+(res.bigName)+'</span>');
        $content.append('<span class="'+(res.evenClass)+'">'+(res.evenName)+'</span>');
        $content.append('<span class="'+(res.longClass)+'">'+(res.longName)+'</span>');
    };

    WY.lotteryObject.createBetResult = function(kjcode , $content , sm){
        $content = $($content);
        kjcode.split(',').forEach(function(a){
            $content.append(makeBall(a,'yellow',sm));
        });
    };
    WY.lotteryObject.createBetShow = function(options , $content){
        var arr;
        var type = options.type,content = options.content,classType = options.classType||'red';
        if(type === 'select'){
            arr = useCommon.parse(content);
        }else if(type === 'group'){
            arr = content.split('');
        }else if(type === 'selectOther'){
            content = useCommon.parse(content);
            content.every(function(a , i){
                if(a){
                    arr = [['万','千','百','十','个'][i]];
                    return false;
                }
                return true;
            })
        }else if(type === 'otherDouble'){
            arr = useGame.lottery.getOtherBetTypeName(content , type).split('');
        }else{
            if(content.join)content = content.join();
            arr = [useGame.lottery.getOtherBetTypeName(content , type)];
        }
        arr.forEach(function(a){
            $content.append('<div class="ico-win  ball-'+classType+' scale-09 '+(type==='other'?'fz-sm':'')+'">'+a+'</div>');
        });
    };
    var $ruleView;
    WY.bind('rule-show',function(){
        if($ruleView)doShow();
        else WY.trigger('load-view','game/lottery/rule',function(view){
            $ruleView = $(view);
            $ruleView.appendTo('body');
            doShow();
        });
        function doShow(){
            var $content = $ruleView.find('.show-rule-list-content');
            $content.find('.data-list').remove();
            $.each(ruleData.resRule,function(i,o){
                $content.append('<tr class="data-list">\n' +
                    '            <td>'+o.name+'</td>\n' +
                    '            <td>'+o.rate+'</td>\n' +
                    '        </tr>');
            });
            $ruleView.showEasyWindow();
        }
    });
    var ruleData;
    var $showOtherRule = $('.show-other-bet-list');
    WY.bind('rule-data',function(rd){
        ruleData = rd;
        $showOtherRule.html('');
        ruleData.resRule.forEach(function(a){
            if(a.type == 3 && !a.disabled){
                $showOtherRule.append('<div class="lottery-number active-item lottery-number-big mr-2" data-type="other" data-code="'+a.code+'">'+a.name+'</div>');
            }
        });
        $('.show-bet-count-rule').text(ruleData.betRule.betMinScore + '-' + ruleData.betRule.betMaxScore);
        WY.trigger('active-item-bind',$showOtherRule);
    });

    var $betView;
    WY.bind('bet-show',function(){
        var lastPage;
        if($betView)doShow();
        else WY.trigger('load-view','game/lottery/bet',function(view){
            $betView = $(view);
            $betView.appendTo('body');
            $betView.on('click','.show-more',function(){
                if(!lastPage){
                    page++;
                    doSearch();
                }
            });
            doShow();
        });
        var $showMore;
        var $content;
        var page = 0;
        function doShow(){
            $showMore = $betView.find('.show-more');
            $content = $betView.find('.show-bet-list-content');
            $content.find('.data-list').remove();
            doSearch();
            $betView.showEasyWindow();
        }
        function doSearch(){
            $.get('/game/bet/list/all',{
                page:page,
                pageSize:20,
                status:1,
            },function(a){
                lastPage = a.pageData.lastPage;
                $.each(a.data,function(i,o){
                    var $tr = $('<tr class="data-list fz-10">\n' +
                        '            <td>'+o.date.slice(4)+'-'+o.term+'</td>\n' +
                        '            <td ><div class="btn btn-sm '+(useGame.lottery.getBetTypeClass(o.betType))+'">'+useGame.lottery.getBetName(useCommon.parse(o.betContent) , o.betType)+'</div></td>\n' +
                        '            <td><div class="bet-content flex-center"></div></td>\n' +
                        '            <td>'+o.score+(o.betCount>1?('<span class="color-red">x'+o.betCount+'</span>'):'')+'</td>\n' +
                        '            <td class="'+(o.resultScore<0?'color-yellow-2':'color-white')+'">'+o.resultScore+'</td>\n' +
                        '        </tr>');
                    WY.lotteryObject.createBetShow({
                        type:o.betType,
                        content:o.betContent
                    },$tr.find('.bet-content'));
                    $content.append($tr);
                });
                $showMore.text(lastPage?'没有更多了':'加载更多');
            });
        }
    });

    var $lastBetView;
    WY.bind('last-bet-show',function(){
        if($lastBetView)doShow();
        else WY.trigger('load-view','game/lottery/last-bet',function(view){
            $lastBetView = view;
            doShow();
        });
        var $content;
        function doShow(){
            $lastBetView = $($lastBetView);
            $content = $lastBetView.find('.show-bet-list-content');
            $content.find('.data-list').remove();
            $.get('/game/list/last',function(a){
                $.each(a.data,function(i,o){
                    var res = useGame.lottery.checkOther(o.result);
                    var $tr = $('<tr class="data-list fz-10">\n' +
                        '            <td>'+useCommon.parseDate(o.openTime,'H:i')+'</td>\n' +
                        '            <td>'+o.term+'</td>\n' +
                        '            <td><div class="bet-content flex-center color-white"></div></td>\n' +
                        '            <td >' +
                        '<span class="'+(res.bigClass)+'">'+res.bigName+'</span>' +
                        '<span class="'+(res.evenClass)+'">'+res.evenName+'</span>' +
                        '<span class="'+(res.longClass)+'">'+res.longName+'</span>' +
                        '</td>\n' +
                        '        </tr>');
                    if(i%2)$tr.addClass('back-yellow-6');
                    WY.lotteryObject.createBetResult(o.result,$tr.find('.bet-content'));
                    $content.append($tr);
                });
                WY.trigger('modal',{
                    content:$lastBetView
                });
            });
        }
    });

    WY.bind('score-down',function(){
        WY.trigger('modal-view','game/lottery/score-down',function($content){

        });
    });
    WY.trigger('create-socket');
    WY.bind('modal-handler-score-down',function($content){
        $content.click(function(){
            var score = $('.score-down-input').val();
            if(isNaN(score) || score <=0 ){
                useCommon.toast('请输入有效的下分积分');
                return false;
            }
            if(score > sessionJson.userInfo.score){
                useCommon.toast('积分不足');
                return false;
            }
            $.post('/game/bet/down',{
                score:score,
            },function(a){
                useCommon.toast(a.message);
                if(a.code == 0){
                    WY.trigger('socket-down-score',{merchantId:resJson.merchantInfo.userId});
                    WY.trigger('modal-hide');
                    //WY.trigger('user-info-flush');
                }
            })
        });
    });
})();