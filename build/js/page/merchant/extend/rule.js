WY.ready('user-member-obj',function(merchantObj){
    merchantObj.rule = {
        init:function(){
            if(this.isInit)return false;
            this.isInit = true;
            this.activeItem = $('.swiper-rule .active-item');
            this.content = $('.rule-data-content');
            this.menuType = 'Bet';
            var that = this;
            WY.bind('active-item',function($item){
                if($item[0].dataset.type === 'rule'){
                    that.changeMenu($item.index());
                }
            });
            this.content.on('click','.submit-rule-btn',function(){
                that.doSubmit();
            });
            this.searchRule(function(){
                that.menuBet();
            });
        },
        doSubmit:function(){
            var menuType = this.menuType.toLowerCase();
            var data;
            if(menuType === 'res'){
                data = this.resRule;
            }else{
                data = $('.rule-data-form').__serializeJSON();
            }
            var id = this[menuType + 'DataId'];
            var valid = useValidate.rule.validator(data,menuType);
            if(!valid.valid){
                useCommon.toast(valid.message);
                return false;
            }
            var that = this;
            $.post('/rule/lottery/'+(id?'update':'add'),{
                code:menuType,
                id:id,
                content:JSON.stringify(data)
            },function(data){
                useCommon.toast(data.message);
                that.searchRule();
            });
        },
        searchRule:function(call){
            var that = this;
            $.get('/rule/lottery/data',function(data){
                var ruleData = data.data;
                that.betRule = ruleData.betRule;
                that.withdrawRule = ruleData.withdrawRule;
                that.resRule = ruleData.resRule;
                that.resDataId = ruleData.resDataId;
                that.betDataId = ruleData.betDataId;
                that.withdrawDataId = ruleData.withdrawDataId;
                call && call();
            });
        },
        changeMenu:function(index){
            this.menuType = ['Bet','Res','Withdraw'][index];
            this['menu'+this.menuType]();
        },
        menuBet:function(){
            var that = this;
            WY.trigger('load-view','merchant/extend/rule-bet',function(view){
                var $view = $(view);
                $view.__formData(that.betRule);
                that.content.html('').append($view);
            });
        },
        menuWithdraw:function(){
            var that = this;
            WY.trigger('load-view','merchant/extend/rule-withdraw',function(view){
                var $view = $(view);
                $view.__formData(that.withdrawRule);
                that.content.html('').append($view);
            });
        },
        menuRes:function(){
            var that = this;
            WY.trigger('load-view','merchant/extend/rule-res',function(view){
                var $view = $(view);
                var $content = $view.find('.show-data-table');
                that.resRule.forEach(function(a , i){
                    $content.append('<tr>' +
                        '<td>'+a.name+'</td>' +
                        '<td><input index="'+i+'" class="rate-input width-100" value="'+a.rate+'"></td>' +
                        '<td><a index="'+i+'" class="btn set-able-btn back-blue color-white">'+(a.disabled?'禁用':'正常')+'</a></td>' +
                        '</tr>')
                });
                $content.on('click','.set-able-btn',function(){
                    var index = $(this).attr('index');
                    var data = that.resRule[index];
                    data.disabled = !data.disabled;
                    $(this).text(data.disabled?'禁用':'正常');
                });
                $content.on('input','.rate-input',function(){
                    var index = $(this).attr('index');
                    var data = that.resRule[index];
                    data.rate = $(this).val().trim();
                });
                that.content.html('').append($view);
            });
        }
    }
});