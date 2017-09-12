WY.ready('user-member-obj',function(merchantObj){

    merchantObj.member = {
        init:function(){
            if(!this.content){
                this.content = $('.swiper-member .member-list-content');
                this.searchForm = $('.swiper-member .search-form');
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
            this.pageSize = 10;
            this.doSearch(1);
        },
        setData:function(data,sts){
            var that = this;
            var pageData = data.pageData;
            this.lastPage = pageData.lastPage;
            if(sts)this.content.find('.data-list').remove();
            $.each(data.data , function(i , o){
                var $tr = $('<tr class="data-list">');
                $tr.append('<td>'+o.nickName+'</td>');
                $tr.append('<td><img class="ico-head-sm border-rds-100" src="'+useCommon.concatImgUrl(o.headImg)+'" alt=""></td>');
                $tr.append('<td>'+(o.score || 0)+'</td>');
                $tr.append('<td>' +
                    '<a class="btn btn-sm color-999" href="/agent/member/info?userId='+o.userId+'">详情</a>' +
                    '</td>');
                that.content.append($tr);
            });
            this.moreElement.html(pageData.lastPage?'没有更多了':'加载更多');
        },
        doSearch:function(sts){
            var that = this;
            $.get('/agent/member/list',{
                agentId:sessionJson.userInfo.userId,
                nickName:this.searchForm.find('[name=nickName]').val(),
                page:this.page,
                pageSize:this.pageSize,
            },function(data){
                that.setData(data,sts);
            });
        }
    }
});