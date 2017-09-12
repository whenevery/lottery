$(function(){
    var $table = $('.show-data-table');
    var $searchForm = $('.search-form');
    var status = 1,page=0;
    function doSearch(){
        $.get('/user/list/merchant',{
            status:status,
            nickName:$searchForm.find('[name=nickName]').val(),
            page:page
        },function(data){
            $.each(data.data,function(i , o){
                var $item = $('<tr class="data-list">');
                $item.append('<td >'+o.nickName+'</td>');
                $item.append('<td>'+o.phone+'</td>');
                $item.append('<td class="break-all">'+(o.validTime?((new Date(o.validTime) > Date.now())?useCommon.parseDate(o.validTime):'过期'):'无')+'</td>');
                $item.append('<td>'+((o.status==1)?
                    '<a code="'+o.userId+'" class="btn back-blue color-white examine-btn">审核</a>'
                    :'<a code="'+o.userId+'" class="btn back-blue color-white add-time-btn break-none">加时</a>')+'</td>');
                $table.append($item);
            });
        });
    }
    $searchForm.submit(function(){
        reset();
        doSearch();
        return false;
    });
    function reset(){
        page=0;
        $table.find('.data-list').remove();
    }
    WY.bind('active-item',function($item){
        status = $item.attr('status');
        $searchForm.find('[name=nickName]').val('');
        reset();
        doSearch();
    });
    doSearch();
    $table.on('click','.examine-btn',function(){
        var userId = $(this).attr('code');
        useCommon.confirm({
            title:'审核通过？',
            done:function(){
                $.post('/admin/examine/merchant',{
                    userId:userId
                } , function(a){
                    useCommon.toast(a.message , '',function(){
                        if(a.code == 0){
                            reset();
                            doSearch();
                        }
                    });
                })
            }
        })
    });
    $table.on('click','.add-time-btn',function(){
        var userId = $(this).attr('code');
        useCommon.prompt({
            title:'添加时间',
            placeholder:'输入要添加的时间（月）',
            done:function(val){
                if(isNaN(val) || val<= 0 || val != (val|0)){
                    useCommon.toast('请输入有效的时间');
                    return false;
                }
                $.post('/admin/add/time',{
                    userId:userId,
                    time:val
                } , function(a){
                    useCommon.toast(a.message , '',function(){
                    });
                    if(a.code == 0){
                        reset();
                        doSearch();
                    }
                })
            }
        })
    });
});