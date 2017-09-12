WY.ready('user-member-obj',function(merchantObj){
    merchantObj.my = {
        init:function(){
            if(this.isInit)return false;
            this.isInit = true;
            this.content = $('.swiper-my');
            var that = this;
            WY.ready('user-info',function(userInfo){
                that.content.__formData(userInfo,'user-info');
            });
            var roomUrl = location.origin + '/game/lottery/' + sessionJson.userInfo.userId;
            $('span.show-game-room').text(roomUrl);
            $('a.show-game-room').attr('href',roomUrl);
            this.content.on('click','[data-update]',function(){
                var update = this.dataset.update;
                var type = this.dataset.type;
                var data = {};
                if(type === 'text'){
                    useCommon.prompt({
                        title:$(this).prev().text(),
                        value:$(this).find('[user-info]').text(),
                        done:function(val){
                            if(val){
                                data[update] = val;
                                that.update(data);
                            }
                        }
                    })
                }else{
                    var $file = $('<input type="file" name="fileName">').hide();
                    $file.appendTo('body');
                    $file.change(function(){
                        if($(this).val()){
                            $.uploadFile(this.files[0],{},{},function(a){
                                if(a.code === 'SUCCESS'){
                                    data[update] = a.result;
                                    that.update(data);
                                }else{
                                    a.toast(a.message);
                                }
                            });
                        }
                    });
                    $file[0].click();
                }
            });
            var $showCanvas = $('.show-qrcode-canvas');
            $showCanvas.qrcode({render:"canvas",height:380, width:380,correctLevel:0,text:roomUrl});
            this.showCanvasUrl = $showCanvas.find('canvas')[0].toDataURL();
            WY.bind('show-spread',function(){
                if(!that.showSpreadImg){
                    useCommon.toast('图片生成中，请稍后');
                    return false;
                }
                WY.trigger('modal',{
                    content:'<img src="'+that.showSpreadImg+'" class="width-80-100 margin-auto">'
                })
            });
            that.createSpread();
        },
        update:function(data){
            var that = this;
            $.post('/merchant/update',data,function(a){
                if(data.spreadName)that.createSpread(data.spreadName);
                useCommon.toast(a.message);
                if(a.code == 0){
                    WY.trigger('merchant-info-flush');
                }
            });
        },
        createSpread:function(spreadName){
            var img = new Image();
            img.src = '/images/lottery/spread.jpg';
            var that = this;
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
                qrImg.src = that.showCanvasUrl;
                qrImg.onload = function(){
                    ctx.drawImage(qrImg,0,0,380,380,170,410,380,380);
                    that.showSpreadImg = canvas.toDataURL();
                    // var blob = useCommon.convertBase64UrlToBlob(canvas.toDataURL(),'image/png');
                    // $.uploadFile(blob,{
                    //     url:'/file/test',
                    // },{},function(a){
                    //     showSpreadImg = canvas.toDataURL()
                    //     WY.trigger('show-spread');
                    // })
                }
            }
        }
    }
});