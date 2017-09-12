WY.ready('user-member-obj',function(obj , options){
    obj.count = {
        init:function(){
            if(!this.content){
                this.menuType = 'member';
                this.content = $('.swiper-count .count-list-content');
                this.searchForm = $('.swiper-count .search-form');
            }
            this.reset();
            if(this.isInit)return false;
            this.isInit = true;
            var that = this;
            this.searchForm.submit(function(){
                that.reset();
                return false;
            });
            WY.bind('active-item',function($item){
                if($item[0].dataset.type === 'count'){
                    that.changeMenu($item.index());
                }
            });
        },
        changeMenu:function(index){
            this.menuType = ['member','game','bet','score','rebate'][index];
            this.reset();
        },
        reset:function(){
            this.page = 0;
            this.pageSize = 10;
            this.content.html('');
            this.doSearch();
        },
        createTr:function(data){
            var $tr = $('<tr>');
            $.each(data,function(i , o){
                $tr.append('<td>'+(o||'')+'</td>');
            });
            return $tr;
        },
        setData:function(data){
            data = data.data;
            var $count = this.content;
            switch (this.menuType){
                case 'game':
                    data = data[0];
                    $count.append(this.createTr(['游戏进行数',data.count]));
                    $count.append(this.createTr(['下注人数',data.betNumber]));
                    $count.append(this.createTr(['下注次数',data.betCount]));
                    $count.append(this.createTr(['下注积分',data.betScore]));
                    $count.append(this.createTr(['中奖人数',data.resNumber]));
                    $count.append(this.createTr(['中奖注数',data.resCount]));
                    $count.append(this.createTr(['中奖积分',data.resScore]));
                    break;
                case 'bet':
                    $count.append(this.createTr(['下注总积分',useCommon.sum(data,function(a){return a.betScore})]));
                    $count.append(this.createTr(['下注总次数',useCommon.sum(data,function(a){return a.betCount})]));
                    $count.append(this.createTr(['结算总积分',useCommon.sum(data,function(a){return a.status===1?a.betScore+a.resultScore:0})]));
                    $count.append(this.createTr(['结算总次数',useCommon.sum(data,function(a){return a.status===1?a.betCount:0})]));
                    $count.append(this.createTr(['撤销总积分',useCommon.sum(data,function(a){return a.status===3?a.betScore:0})]));
                    $count.append(this.createTr(['撤销总次数',useCommon.sum(data,function(a){return a.status===3?a.betCount:0})]));
                    $count.append(this.createTr(['退回总积分',useCommon.sum(data,function(a){return a.status===2?a.betScore:0})]));
                    $count.append(this.createTr(['退回总次数',useCommon.sum(data,function(a){return a.status===2?a.betCount:0})]));
                    break;
                case 'score':
                    $count.append(this.createTr(['总上分',useCommon.sum(data,function(a){return a.type==='upload'?a.score:0})]));
                    $count.append(this.createTr(['总上分次数',useCommon.sum(data,function(a){return a.type==='upload'?a.count:0})]));
                    $count.append(this.createTr(['总下分',-useCommon.sum(data,function(a){return a.type==='down'&&a.status===1?a.score:0})]));
                    $count.append(this.createTr(['总下分次数',useCommon.sum(data,function(a){return a.type==='down'&&a.status===1?a.count:0})]));
                    $count.append(this.createTr(['申请中下分',-useCommon.sum(data,function(a){return a.type==='down'&&a.status===0?a.score:0})]));
                    $count.append(this.createTr(['申请中下分次数',useCommon.sum(data,function(a){return a.type==='down'&&a.status===0?a.count:0})]));
                    $count.append(this.createTr(['拒绝下分',useCommon.sum(data,function(a){return a.type==='return'?a.score:0})]));
                    $count.append(this.createTr(['拒绝下分次数',useCommon.sum(data,function(a){return a.type==='return'?a.count:0})]));
                    break;
                case 'rebate':
                    data = data[0];
                    $count.append(this.createTr(['回水次数',data.count]));
                    $count.append(this.createTr(['回水人数',data.number]));
                    $count.append(this.createTr(['回水积分',data.score]));
                    break;
                case 'member':
                    $count.append(this.createTr(['会员数',data[0]&&data[0].userCount]));
                    $count.append(this.createTr(['会员总积分',data[0]&&data[0].score]));
                    $count.append(this.createTr(['下注会员数',data[1]&&data[1].userCount]));
                    $count.append(this.createTr(['上分会员数',
                        data[2]&&
                        data[2].filter(function(a){return a.type === 'upload'}).pop()&&
                        data[2].filter(function(a){return a.type === 'upload'}).pop().userCount
                    ]));
                    $count.append(this.createTr(['上分会员数',
                        data[2]&&
                        data[2].filter(function(a){return a.type === 'down'}).pop()&&
                        data[2].filter(function(a){return a.type === 'down'}).pop().userCount
                    ]));
                    break;
            }
        },
        doSearch:function(sts){
            var that = this;
            $.get('/'+(options.type || 'merchant')+'/count/'+this.menuType,{
            },function(data){
                that.setData(data,sts);
            });
        }
    }
});