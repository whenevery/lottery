WY.ready('user-member-obj',function(merchantObj){
    merchantObj.game = {
        init:function(){
            if(!this.content){
                this.content = $('.swiper-game .count-list-content');
                this.searchForm = $('.swiper-game .search-form');
            }
            this.reset();
            if(this.isInit)return false;
            this.isInit = true;
            this.moreElement = $('<div class="text-center color-999 pt-10 pb-10">');
            this.content.after(this.moreElement);
            var that = this;
            this.searchForm.submit(function(){
                that.reset();
                return false;
            });
            this.moreElement.click(function(){
                if(!that.lastPage){
                    that.page++;
                    that.doSearch();
                }
            });
        },
        reset:function(){
            this.page = 0;
            this.pageSize = 20;
            this.doSearch(1);
        },
        doSearch:function(sts){
            var that = this;
            $.get('/game/list',{
                date:this.searchForm.find('[name=date]').val(),
                term:this.searchForm.find('[name=term]').val(),
                page:this.page,
                pageSize:this.pageSize,
            },function(data){
                that.setData(data,sts);
            });
        },
        setData:function(data,sts){
            var that = this;
            var pageData = data.pageData;
            this.lastPage = pageData.lastPage;
            if(sts)this.content.find('.data-list').remove();
            $.each(data.data , function(i , o){
                var $tr = $('<tr class="data-list">');
                $tr.append('<td>'+o.date+'</td>');
                $tr.append('<td>'+o.term+'</td>');
                $tr.append('<td>'+['新建','已结算','未参与'][o.status]+'</td>');
                $tr.append('<td>'+(o.result || '')+'</td>');
                $tr.append('<td>'+(o.openTime?useCommon.parseDate(o.openTime,'H:i:s'):'')+'</td>');
                $tr.append('<td>' +
                    '<a class="btn btn-sm color-999" href="/user/game/detail?gameId='+o.id+'">详情</a>' +
                    '</td>');
                that.content.append($tr);
            });
            this.moreElement.html(pageData.lastPage?'没有更多了':'加载更多');
        },
    }
});