$(function(){
    $('body').__formData(resJson.memberInfo,'member-info');
    var memberId = resJson.memberId || hrefData.userId;
    var $count = $('.show-count-content');
    var memberType = resJson.memberType || 'merchant';
    $.get('/'+memberType+'/count/score',{
        userId:memberId
    },function(data){
        data = data.data;
        $count.append(createTr(['总上分',useCommon.sum(data,function(a){return a.type==='upload'?a.score:0})]));
        $count.append(createTr(['总上分次数',useCommon.sum(data,function(a){return a.type==='upload'?a.count:0})]));
        $count.append(createTr(['总下分',-useCommon.sum(data,function(a){return a.type==='down'&&a.status===1?a.score:0})]));
        $count.append(createTr(['总下分次数',useCommon.sum(data,function(a){return a.type==='down'&&a.status===1?a.count:0})]));
        $count.append(createTr(['申请中下分',-useCommon.sum(data,function(a){return a.type==='down'&&a.status===0?a.score:0})]));
        $count.append(createTr(['申请中下分次数',useCommon.sum(data,function(a){return a.type==='down'&&a.status===0?a.count:0})]));
        $count.append(createTr(['撤销下分',-useCommon.sum(data,function(a){return a.type==='down'&&a.status===2?a.score:0})]));
        $count.append(createTr(['撤销下分次数',useCommon.sum(data,function(a){return a.type==='down'&&a.status===2?a.count:0})]));
        searchRebate();
    });
    function createTr(arr){
        return '<div class="pt-10 border-b-white flex-between">\n' +
            '            <div>'+arr[0]+'</div><div>'+(arr[1]||'')+'</div>\n' +
            '        </div>';
    }

    function searchRebate(){
        $.get('/'+memberType+'/count/rebate',{
            userId:memberId
        },function(data){
            data = data.data[0];
            $count.append(createTr(['回水次数',data.count]));
            $count.append(createTr(['回水积分',data.score]));
            searchBet();
        });
    }
    function searchBet(){
        $.get('/'+memberType+'/count/bet',{
            userId:memberId
        },function(data){
            data = data.data;
            $count.append(createTr(['下注总积分',useCommon.sum(data,function(a){return a.betScore})]));
            $count.append(createTr(['下注总次数',useCommon.sum(data,function(a){return a.betCount})]));
            $count.append(createTr(['结算总积分',useCommon.sum(data,function(a){return a.status===1?a.betScore+a.resultScore:0})]));
            $count.append(createTr(['结算总次数',useCommon.sum(data,function(a){return a.status===1?a.betCount:0})]));
            $count.append(createTr(['撤销总积分',useCommon.sum(data,function(a){return a.status===3?a.betScore:0})]));
            $count.append(createTr(['撤销总次数',useCommon.sum(data,function(a){return a.status===3?a.betCount:0})]));
            $count.append(createTr(['退回总积分',useCommon.sum(data,function(a){return a.status===2?a.betScore:0})]));
            $count.append(createTr(['退回总次数',useCommon.sum(data,function(a){return a.status===2?a.betCount:0})]));
        });
    }
});