$(function(){
    var merchantId = resJson.merchantInfo.userId;
    var $betMain = $('.bet-main-content');
    if($betMain.offset().top+$betMain.outerHeight() < $(window).height()){
        $betMain.addClass('position-fixed');
    }
    function searchRule(){
        $.get('/game/lottery/rule',{
            userId:merchantId,
        },function(data){
            betNumber.other = '';
            WY.trigger('rule-data',data.data);
        });
    }
    var lastData,nextData,thisGame,gameStatus;
    var $lastBetResult = $('.last-bet-result');
    var $showBetTime = $('.lottery-time-title');
    function searchBet(){
        $('.lottery-bet-list').remove();
        searchRule();
        searchLast();
        searchNext(function(){
            searchBetList();
        });
    }
    function searchLast(){
        $.get('/game/lottery/last',{
        },function(data){
            lastData = data;
            $('.last-bet-title').text(useCommon.parseDate(lastData.time,'H:i') +  ' ' + lastData.issue.split('-')[1] + '期开奖号码');
            WY.lotteryObject.makeBetResult(lastData.kjcode,$lastBetResult.html('') );
        });
    }
    function searchNext(call){
        $.get('/game/lottery/next',{
        },function(data){
            nextData = data.nextData;
            thisGame = data.thisGame;
            var showStr = '';
            var dateData = useCommon.sumDate(data.timeLeft);
            var timeLeft;
            gameStatus = nextData.gameStatus;
            switch (gameStatus){
                case 'buy':
                    if(dateData.i > 60){
                        showStr = '今天活动已结束，请明天再来';
                    }
                    else{
                        showStr = '<span class="lh-20 text-middle">'+
                            nextData.nextTerm+
                            '期剩余押注时间：</span><span class="color-green-1 fz-20 lh-20 text-middle date-time-count">' +
                            '</span>';
                        timeLeft = nextData.timeLeft;
                    }
                    break;
                case 'wait':
                    showStr = '<span class="lh-20 text-middle">'+
                        nextData.nextTerm+
                        '期<span class="color-red">等待开奖</span>时间：</span><span class="color-green-1 fz-20 lh-20 text-middle date-time-count">'+
                        '</span>';
                    timeLeft = nextData.timeLeft;
                    break;
                case 'result':
                case 'settle':
                    showStr = '<span class="lh-20 text-middle">'+
                        nextData.nextTerm+ '期等待结算中';
                    searchResult();
            }
            $showBetTime.html(showStr);
            if(timeLeft && timeLeft > 0){
                WY.trigger('date-time-count',timeLeft,$showBetTime.find('.date-time-count'));
                setTimeout(function(){
                    searchNext();
                },timeLeft);
            }
            call && call();
        });
    }
    WY.bind('test-win',searchWin);
    function searchWin(gameId,resultData){
        if(betDataList && betDataList.length)$.get('/game/lottery/win',{
            gameId:gameId
        },function(data){
            if(data.code == 0){
                console.log(resultData);
                console.log(data.data);
                WY.trigger('modal-view','game/lottery/win-bet',function($content){
                    console.log($content);
                    $content.find('.this-bet-title').text(resultData.issue.split('-')[1] + '期开奖号码');
                    WY.lotteryObject.makeBetResult(resultData.kjcode,$content.find('.this-bet-result') , 'win-sm');
                    var $dataTable = $content.find('.show-data-table');
                    $.each(data.data,function(i , o){
                        var $tr = $('<tr class="data-list fz-10">\n' +
                            '            <td ><div class="btn btn-sm '+(useGame.lottery.getBetTypeClass(o.betType))+'">'+useGame.lottery.getBetName(useCommon.parse(o.betContent) , o.betType)+'</div></td>\n' +
                            '            <td><div class="bet-content flex-center color-white"></div></td>\n' +
                            '            <td><div >'+o.score+(o.betCount > 1?('<span class="fz-10 color-red">'+'x'+o.betCount+'</span>'):'')+'</div></td>\n' +
                            '            <td><div class="'+(o.resultScore<0?'color-yellow-2':'')+'" >'+o.resultScore+'</div></td>\n' +
                            '        </tr>');
                        WY.lotteryObject.createBetShow({
                            type:o.betType,
                            content:o.betContent
                        },$tr.find('.bet-content'));
                        $dataTable.append($tr);
                    });
                });
            }
        });
    }
    function searchResult(){
        if(thisGame){
            $.get('/game/lottery/result',{
                term:thisGame.term,
            },function(data){
                if(data.code == 0){
                    WY.trigger('user-info-flush');
                    searchWin(thisGame.id,data.data);
                    searchBet();
                }
                else{
                    if(data.timeLeft && data.timeLeft > 0){
                        setTimeout(searchResult,data.timeLeft);
                    }else{
                        searchBet();
                    }
                }
            });
        }else searchBet();
    }
    searchBet();
    var $activeItem = $('.lottery-btn');
    var thisSwiper = new Swiper('.swiper-container',{
        onSlideChangeEnd:function(swiper){
            var index = swiper.activeIndex;
            WY.trigger('change-active-item',$activeItem.eq(index));
            doInit(index);
        }
    });
    function doInit(index){

    }
    var betType = 'group',betNumber={
        group:'',
        select:['','','','',''],
        other:'',
        selectOther:['','','','',''],
        otherDouble:'',
    },betSelectIndex,betSelectItem,selectOtherIndex,selectOtherValue;
    var $showGroupResult = $('.show-group-result');
    var $selectItemList = $('.select-item-list');
    var $selectItem = $('[data-type=select]'),$selectTypeItem = $('[data-type=selectType]');
    WY.bind('active-item',function($item){
        var type = $item[0].dataset.type;
        var index = $item.index();
        var val = $item.text();
        if( type === 'type'){
            betType = ['group','select','other','selectOther','otherDouble'][index];
            thisSwiper.slideTo(index);
        }
        else if(type === 'group'){
            if(betNumber.group.length >=5){
                $item.removeClass('active');
                return false;
            }
            setGroup(betNumber.group+val);
            setTimeout(function(){
                $item.removeClass('active');
            },500);
        }
        else if(type === 'selectType'){
            betSelectIndex = index;
            betSelectItem = $item;
            $selectItem.removeClass('active');
            $selectItemList.show();
            if(!isNaN(val)){
                $selectItem.eq(val).addClass('active');
            }
        }
        else if(type === 'select'){
            betNumber.select[betSelectIndex] = val;
            betSelectItem.text(val).addClass('number');
        }
        else if(type === 'other'){
            betNumber.other = $item[0].dataset.code;
        }
        else if(type === 'selectOther'){
            selectOtherIndex = index;
            setSelectOther();
        }
        else if(type === 'selectOtherValue'){
            selectOtherValue = $item[0].dataset.value;
            setSelectOther();
        }
        else if(type === 'otherDoubleValue'){
            betNumber.otherDouble = $item[0].dataset.value;
        }
    });
    function setSelectOther(){
        betNumber.selectOther = ['','','','',''];
        if(selectOtherValue && selectOtherIndex >=0){
            betNumber.selectOther[selectOtherIndex] = selectOtherValue;
        }
    }
    $('.reset-bet-btn').click(function(){
        if(betType === 'group'){
            setGroup('');
        }else{
            $selectTypeItem.each(function(i , o){
               $(this).removeClass('number')
                   .removeClass('active')
                   .text(this.dataset.auto);
            });
            betNumber.select = ['','','','',''];
            $selectItemList.hide();
        }
    });
    function setGroup(val){
        betNumber.group = val;
        $showGroupResult.text((betNumber.group + '*****').slice(0,5));
    }
    var merchantInfo = resJson.merchantInfo;
    $('body').__formData(merchantInfo , 'merchant-data');
    WY.ready('user-info' , function(userInfo){
        userInfo.score = userInfo.score || 0;
        $('body').__formData(userInfo , 'user-info');
    });

    $('.add-bet-btn').click(function(){
        if(!thisGame){
            useCommon.toast('游戏还没准备好！');
            return false;
        }
        if(gameStatus !== 'buy'){
            useCommon.toast('不在下注时间内');
            return false;
        }
        var betStr = betNumber[betType];
        if(betStr && betStr.join)betStr = betStr.join('');
        if(!betStr){
            useCommon.toast('请选择具体下注类型');
            return false;
        }
        var score = $('.bet-score-input').val().trim();
        if(!score || isNaN(score)){
            useCommon.toast('请输入有效的积分');
            return false;
        }
        if(score > sessionJson.userInfo.score){
            useCommon.toast('积分不足，请上分');
            return false;
        }
        var betContent = useCommon.stringify(betNumber[betType]);
        if(betType === 'group'){
            betContent = betContent.split('').sort(function(a,b){return a-b}).join('');
        }
        addBet({
            term:thisGame.term,
            date:thisGame.date,
            gameId:thisGame.id,
            betType:betType,
            betContent:betContent,
            score:score,
            merchantId:merchantId
        });
    });
    WY.bind('bet-change',function(data){
        useCommon.toast(data.message , 0 , function(){
            if(data.reload)location.reload();
        });
        if(data.code == 0){
            WY.trigger('user-info-flush');
            searchBetList();
        }
    });
    function addBet(betData){
        $.post('/game/lottery/add',betData,function(data){
            WY.trigger('bet-change',data);
        });
    }
    function delBet(betData){
        $.post('/game/lottery/del',betData,function(data){
            WY.trigger('bet-change',data);
        });
    }
    var $betDataTable = $('.bet-data-table');
    var betDataList;
    function searchBetList(){
        if(thisGame)$.get('/game/bet/list',{
            gameId:thisGame.id,
            merchantId:merchantId,
            term:thisGame.term,
            status:0
        },function(data){
            $betDataTable.find('.lottery-bet-list').remove();
            $.each(betDataList = data.data , function(i , o){
                var $tr = $('<tr class="height-40 lottery-bet-list color-white border-b-red">\n' +
                    '                    <td>'+o.term+'</td>\n' +
                    '                    <td><div class="btn btn-sm back-blue break-none fz-10 '+(
                        ({
                            select:'back-blue',
                            group:'back-blue-2',
                            other:'back-blue-1',
                        })[o.betType] || 'back-blue-1'
                    )+'">'+o.betTypeName+'</div></td>\n' +
                    '                    <td>\n' +
                    '                        <div class="flex-center bet-content">\n' +
                    '                        </div>\n' +
                    '                    </td>\n' +
                    '                    <td>\n' +
                    '                        '+o.score+(o.betCount > 1?('<span class="fz-10 color-red">'+'x'+o.betCount+'</span>'):'') +
                    '                    </td>\n' +
                    '                    <td>\n' +
                    '                        <div class="flex-between">\n' +
                    '                            <div index="'+i+'" class="btn btn-sm bet-btn color-yellow-2 border-yellow-2 break-none scale-08 add-one-bet">+</div>\n' +
                    '                            <div index="'+i+'" class="btn btn-sm bet-btn color-yellow-2 border-yellow-2 break-none scale-08 del-one-bet">×</div>\n' +
                    '                        </div>\n' +
                    '                    </td>\n' +
                    '                </tr>');
                WY.lotteryObject.createBetShow({
                    type:o.betType,
                    content:o.betContent
                },$tr.find('.bet-content'));
                $betDataTable.append($tr)
            });
        });
    }
    $betDataTable.on('click','.add-one-bet',function(){
        var index  =$(this).attr('index');
        useCommon.confirm({
            title:'对此加注？',
            done:function(){
                var betInfo = betDataList[index];
                addBet({
                    date:betInfo.date,
                    term:betInfo.term,
                    gameId:betInfo.gameId,
                    betType:betInfo.betType,
                    betContent:betInfo.betContent,
                    score:betInfo.score,
                    merchantId:merchantId
                });
            }
        });
    });
    $betDataTable.on('click','.del-one-bet',function(){
        var index  =$(this).attr('index');
        useCommon.confirm({
            title:'撤销此注？',
            done:function(){
                var betInfo = betDataList[index];
                delBet({
                    betId:betInfo.id,
                });
            }
        });
    });


    function showImg(data){
        WY.trigger('modal-view','game/lottery/img&' + useCommon.serialize(data))
    }
    WY.bind('show-upload-img',function(){
        showImg({
            title:'上分',
            content:'请长按下方二维码上分',
            src:useCommon.concatImgUrl(merchantInfo.upScoreImg)
        })
    });
    WY.bind('show-connect-img',function(){
        showImg({
            title:'联系管理员',
            content:'请长按下方二维码联系管理员',
            src:useCommon.concatImgUrl(merchantInfo.connectImg)
        })
    });
    if(sessionJson.userInfo.type === 0){
        $('[wy-click="show-spread"]').show();
    }
    var showSpreadImg;
    var $showCanvas = $('.show-qrcode-canvas');
    var roomUrl = location.origin + '/agent/lottery/' + sessionJson.userInfo.merchantId + '/' + sessionJson.userInfo.userId;
    $showCanvas.qrcode({render:"canvas",height:380, width:380,correctLevel:0,text:roomUrl});
    var showCanvasUrl = $showCanvas.find('canvas')[0].toDataURL();
    WY.bind('show-spread',function(){
        if(!showSpreadImg){
            useCommon.toast('图片生成中，请稍后');
            return false;
        }
        WY.trigger('modal',{
            content:'<img src="'+showSpreadImg+'" class="width-80-100 margin-auto">'
        })
    });
    function createSpread(spreadName){
        var img = new Image();
        img.src = '/images/lottery/spread.jpg';
        img.onload = function(){
            var canvas = document.createElement('canvas');
            $(canvas).attr({
                width:img.width+'px',
                height:img.height+'px',
            });
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img,0,0);
            ctx.font="40px Georgia";
            ctx.fillStyle = '#fff';
            spreadName = spreadName || sessionJson.userInfo.spreadName || '时时彩';
            ctx.fillText(spreadName ,(img.width - 40 * spreadName.length)/2,50);
            var qrImg = new Image();
            qrImg.src = showCanvasUrl;
            qrImg.onload = function(){
                ctx.drawImage(qrImg,0,0,380,380,170,410,380,380);
                showSpreadImg = canvas.toDataURL();
            }
        }
    }
    createSpread();
});