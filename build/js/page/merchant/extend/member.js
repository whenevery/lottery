WY.ready('user-member-obj',function(merchantObj){

    merchantObj.member = {
        init:function(){
            if(!this.content){
                this.menuType = 'up';
                this.content = $('.swiper-member .member-list-content');
                this.searchForm = $('.swiper-member .search-form');
                this.agentInput = this.searchForm.find('[name=agentId]');
                this.timeInput = this.searchForm.find('.time-div');
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
            this.content.on('click','.add-score-btn',function(){
                if(that.menuType === 'up'){
                    that.addScore($(this).attr('code'));
                }else if(that.menuType === 'down'){
                    var downId = $(this).attr('down');
                    useCommon.confirm({
                        title:'确认完成此下分？',
                        submitText:'已完成',
                        cancelText:'撤销',
                        done:function(){
                            that.doConfirm(downId,1)
                        },
                        cancel:function(){
                            that.doConfirm(downId,0)
                        }
                    })
                }else{
                    that.rebate($(this).attr('code'));
                }
            });
            WY.bind('active-item',function($item){
                if($item[0].dataset.type === 'member'){
                    that.changeMenu($item.index());
                }
            });
            $('.do-rebate-btn').click(function(){
                if($(this).hasClass('all-rebate')){
                    that.rebate('');
                }else{
                    var userIds = $('[check-one=rebate]:checked').map(function(){
                        return $(this).attr('code');
                    }).toArray().join();
                    if(!userIds){
                        useCommon.toast('请选中要回水的用户');
                        return false;
                    }
                    that.rebate(userIds);
                }
            });
        },
        rebate:function(userIds){
            var that = this;
            useCommon.confirm({
                title:'确认回水？',
                done:function(){
                    $.post('/merchant/rebate/do' + (that.menuType === 'userRebate'?'/again':''),{
                        userIds:userIds,
                        startTime:that.searchForm.find('.start-time').val().split('-').reverse().join('-'),
                        endTime:that.searchForm.find('.end-time').val().split('-').reverse().join('-'),
                        endTimeM:that.searchForm.find('.end-time-m').val(),
                        startTimeM:that.searchForm.find('.start-time-m').val(),
                    },function(a){
                        useCommon.toast(a.message);
                        if(a.code == 0)that.reset();
                    })
                }
            })
        },
        doConfirm:function(id,sts){
            var that = this;
            $.post('/merchant/member/down/confirm',{
                id:id,
                status:sts
            } , function(a){
                useCommon.toast(a.message);
                if(a.code == 0){
                    that.reset();
                }
            });
        },
        changeMenu:function(index){
            this.menuType = ['up','down','rebate','userRebate'][index];
            $('.do-rebate-btn')[index > 1?'show':'hide']();
            this.agentInput[index ===3?'hide':'show']();
            this.timeInput[index > 1?'show':'hide']();
            this.reset();
        },
        reset:function(){
            this.page = 0;
            this.pageSize = 10;
            if(this.menuType === 'up'){
                this.content.html('<tr>\n' +
                    '                <td>昵称</td>\n' +
                    '                <td>代Id</td>\n' +
                    '                <td>积分</td>\n' +
                    '                <td>操作</td>\n' +
                    '            </tr>')
            }else if(this.menuType === 'down'){
                this.content.html('<tr>\n' +
                    '                <td>昵称</td>\n' +
                    '                <td>代Id</td>\n' +
                    '                <td>当前积分</td>\n' +
                    '                <td>下分</td>\n' +
                    '                <td>操作</td>\n' +
                    '            </tr>')
            }else if(this.menuType === 'rebate'){
                this.content.html('<tr class="break-none">\n' +
                    '                <td><input type="checkbox" check-all="rebate"></td>\n' +
                    '                <td>昵称</td>\n' +
                    '                <td>代Id</td>\n' +
                    '                <td>积分</td>\n' +
                    '                <td>下注</td>\n' +
                    '                <td>赢亏</td>\n' +
                    '                <td>回水</td>\n' +
                    '                <td>操作</td>\n' +
                    '            </tr>')
            }else {
                this.content.html('<tr class="break-none">\n' +
                    '                <td><input type="checkbox" check-all="rebate"></td>\n' +
                    '                <td>昵称</td>\n' +
                    '                <td>当前积分</td>\n' +
                    '                <td>总下注</td>\n' +
                    '                <td>总赢亏</td>\n' +
                    '                <td>总回水</td>\n' +
                    '                <td>操作</td>\n' +
                    '            </tr>')
            }
            this.doSearch(1);
        },
        setData:function(data,sts){
            var that = this;
            var pageData = data.pageData;
            this.lastPage = pageData.lastPage;
            if(sts)this.content.find('.data-list').remove();
            $.each(data.data , function(i , o){
                var $tr = $('<tr class="data-list">');
                if(that.menuType === 'rebate' || that.menuType === 'userRebate')$tr.append('<td><input type="checkbox" code="'+o.userId+'" check-one="rebate"></td>');
                $tr.append('<td>'+o.nickName + '('+o.userId+')' +'</td>');
                if(that.menuType !== 'userRebate')$tr.append('<td>'+o.agentId+'</td>');
                $tr.append('<td>'+(o.score || 0)+'</td>');
                if(o.downScore)$tr.append('<td>'+(o.downScore || 0)+'</td>');
                if(o.betScore)$tr.append('<td>'+(o.betScore || 0)+'</td>');
                if(o.resultScore)$tr.append('<td >'+(o.resultScore || 0)+'</td>');
                if(o.rebateScore)$tr.append('<td>'+(o.rebateScore || 0)+'</td>');
                $tr.append('<td>' +
                    '<a class="btn btn-sm back-blue color-white add-score-btn mr-10 break-none" down="'+o.downId+'" code="'+o.userId+'">'+(
                        {
                            up:'上分',
                            down:'处理',
                            rebate:'回水',
                            userRebate:'回水',
                        }
                    )[that.menuType]
                    +'</a>' +
                    '<a class="btn btn-sm color-999 break-none" href="/merchant/member/info?userId='+o.userId+'">详情</a>' +
                    '</td>');
                that.content.append($tr);
            });
            this.moreElement.html(pageData.lastPage?'没有更多了':'加载更多');
        },
        doSearch:function(sts){
            var that = this;
            $.get(({
                up:'/merchant/member/list',
                down:'/merchant/member/down/list',
                rebate:'/merchant/rebate/list',
                userRebate:'/merchant/rebate/list/again',
            })[this.menuType],{
                nickName:this.searchForm.find('[name=nickName]').val(),
                agentId:this.searchForm.find('[name=agentId]').val(),
                startTime:this.searchForm.find('.start-time').val().split('-').reverse().join('-'),
                startTimeM:this.searchForm.find('.start-time-m').val(),
                endTime:this.searchForm.find('.end-time').val().split('-').reverse().join('-'),
                endTimeM:this.searchForm.find('.end-time-m').val(),
                page:this.page,
                pageSize:this.pageSize,
            },function(data){
                that.setData(data,sts);
            });
        },
        addScore:function(userId){
            var that = this;
            useCommon.prompt({
                title:'请输入要添加的积分',
                done:function(val){
                    if(isNaN(val)){
                        useCommon.toast('请输入有效的积分');
                        return false;
                    }
                    $.post('/merchant/score/add',{userId:userId,score:val},function(a){
                        if(a.code == 0){
                            that.reset();
                        }
                        useCommon.toast(a.message,0,function(){

                        })
                    });
                }
            })
        }
    }
});