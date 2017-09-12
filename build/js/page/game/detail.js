$(function(){
    var $count = $('.show-count-content');
    var $info = $('.show-info-content');
    var $bet = $('.show-bet-content');
    var moreElement = $('<div class="text-center color-999 pt-10 pb-10">');
    var $searchForm = $('.search-form');
    $bet.after(moreElement);
    $searchForm.submit(function(){
        reset();
        return false;
    });
    function setCount(){
        $.get('/game/bet/count',{
            gameId:hrefData.gameId,
            agentId:$searchForm.find('[name=agentId]').val().trim(),
            searchType:searchType,
            useType:resJson.useType
        },function(data){
            data = data.data;
            $count.find('.data-list').remove();
            $count.append(createTr(['下注总积分',useCommon.sum(data,function(a){return a.betScore})]));
            $count.append(createTr(['下注总次数',useCommon.sum(data,function(a){return a.betCount})]));
            $count.append(createTr(['结算总积分',useCommon.sum(data,function(a){return a.status===1?a.betScore+a.resultScore:0})]));
            $count.append(createTr(['结算总次数',useCommon.sum(data,function(a){return a.status===1?a.betCount:0})]));
            $count.append(createTr(['撤销总积分',useCommon.sum(data,function(a){return a.status===3?a.betScore:0})]));
            $count.append(createTr(['撤销总次数',useCommon.sum(data,function(a){return a.status===3?a.betCount:0})]));
        });
    }
    $.get('/game/detail/info',{
        gameId:hrefData.gameId,
    },function(data){
        data = data.data[0];
        if(data.openTime)data.openTime = useCommon.parseDate(data.openTime);
        $info.__formData(data , 'game-info');
    });
    function createTr(data){
        return '<div class="flex-between data-list">' +
            '<div>'+data[0]+'</div>' +
            '<div>'+data[1]+'</div>' +
            '</div>';
    }
    var page=0,pageSize=10,lastPage;
    function reset(){
        page = 0;
        doSearch(1);
        setCount();
    }
    function doSearch(sts){
        $.get('/game/bet/list/user',{
            gameId:hrefData.gameId,
            agentId:$searchForm.find('[name=agentId]').val().trim(),
            useType:resJson.useType,
            searchType:searchType,
            pageSize:pageSize,
            page:page
        },function(data){
            setData(data,sts);
        });
    }
    function setData(data,sts){
        var pageData = data.pageData;
        lastPage = pageData.lastPage;
        if(sts)$bet.find('.data-list').remove();
        $.each(data.data , function(i , o){
            var $tr = $('<tr class="data-list">');
            $tr.append('<td>'+o.userName+'</td>');
            $tr.append('<td>'+o.betTypeName+'</td>');
            $tr.append('<td>'+useGame.lottery.getBetShowName(o.betType,o.betContent)+'</td>');
            $tr.append('<td>'+o.score*o.betCount+'</td>');
            $tr.append('<td>'+(o.resultScore || '')+'</td>');
            $bet.append($tr);
        });
        moreElement.html(lastPage?'没有更多了':'加载更多');
    }
    reset()
    var searchType;
    WY.bind('active-item',function($item){
        searchType = ['all','agent','my'][$item.index()];
        reset();
    });
});