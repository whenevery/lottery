$(function(){
    var $table = $('.show-data-table');
    function doSearch(){
        $table.find('.data-list').remove();
        $.get('/user/list/admin',function(data){
            $.each(data.data,function(i , o){
                var $item = $('<tr class="data-list">');
                $item.append('<td >'+o.nickName+'</td>');
                $item.append('<td>'+(o.type==99?'超级管理员':'管理员')+'</td>');
                $item.append('<td>'+(o.status==0?'正常':'审核中')+'</td>');
                $item.append('<td>'+((o.type==98 && o.status==1)?'<a code="'+o.userId+'" class="btn back-blue color-white examine-btn">审核</a>':'')+'</td>');
                $table.append($item);
            });
        });
    }
    doSearch();
    $table.on('click','.examine-btn',function(){
        var userId = $(this).attr('code');
        useCommon.confirm({
            title:'审核通过？',
            done:function(){
                $.post('/admin/examine/admin',{
                    userId:userId
                } , function(a){
                    useCommon.toast(a.message , '',function(){
                        if(a.code == 0)doSearch();
                    });
                })
            }
        })
    });
});