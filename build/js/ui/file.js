$(function(){
    $.uploadFile = function(file ,options,data, call){
        var formData = new FormData();
        formData.append(options.fileName || 'fileName' , file);
        formData.append('path' , 'lottery/'+(options.type || 'img'));
        for(var i in data){
            formData.append(i , data[i]);
        }
        $.ajax({
            url : options.url || '/file/upload',
            type : "POST",
            data : formData,
            dataType:"json",
            cache:false,
            processData : false,
            contentType : false,
            errorText:'上传失败',
            success:function(o){
                if(call)call(o);
            },
            error:function(o){
                if(call)call(o);
            }
        });
    };
    $.uploadFiles = function(file ,options,data, call){
        var formData = new FormData();
        if(!file.length){
            file = [file];
        }else{
            file = [].slice.call(file);
        }
        var imgMaxSize=0,videoMaxSize=0;
        file.forEach(function(a){
            if(a.type.indexOf('image') >=0 ){
                if(a.size > imgMaxSize){
                    imgMaxSize = a.size;
                }
            }else{
                videoMaxSize = a.size;
            }
        });
        if(imgMaxSize > 3 * 1024 * 1024 || videoMaxSize > 30 * 1024 * 1024){
            useCommon.toast('文件过大小限制（图片3M 视频30M）');
            return false;
        }
        if(file.length === 1)data.fileSize = file.map(function(a){return a.size}).join();
        file.forEach(function(f){
            console.log(f);
            formData.append(options.fileName || 'fileName' , f);
            formData.append('fileSizes' , f.size || 0);
        });
        formData.append('path' , options.type || 'memorial');
        data.fileFormat = data.fileFormat || 'img';
        for(var i in data){
            formData.append(i , data[i]);
        }
        $.ajax({
            url : options.url || '/file/upload',
            type : "POST",
            data : formData,
            dataType:"json",
            cache:false,
            processData : false,
            contentType : false,
            errorText:'上传失败',
            xhr:options.xhr,
            timeout:options.timeout || 60 * 1000,
            success:function(o){
                WY.loading(0);
                if(call)call(o);
            },
            error:function(o){
                console.log(o);
                WY.loading(0)
                if(call)call(o);
            }
        });
    };
    $.fn.showFileUpload = function(options){
        options = options || {};
        return this.each(function(){
            var $this = $(this);
            var showName = (options.showName|| $this.attr('show-name') || 'showName');
            var fileName = (options.fileName|| $this.attr('file-name') || 'fileName');
            $this.append($('<div class="img-content">'+
                '<div class="del-ico"></div>'+
                '<img src="" alt="" class="img-thumbnail">'+
                '</div>'))
                .append($('<input type="file" accept="'+(options.fileFormat=='video'?'video/mp4':'image/jpg,image/jpeg,image/png,image/gif')+'" class="upload-file" name="'+fileName+'">'))
                .append($('<input type="hidden" class="show-file-name" name="'+showName+'">'))
                .append($('<div class="add-ico text-center">+</div>'));
            $this.find(':file').change(function(){
                if($(this).val()){
                    $.uploadFile(this.files[0] , {
                        fileName:fileName,
                        type:options.type,
                        url:options.url
                    } ,options.data || {}, function(a){
                        if(a.code == 'SUCCESS'){
                            showUrl((a.result.path || a.result));
                        }else{
                            useCommon.toast(a.message || '上传失败');
                        }
                    });
                }{
                    clear();
                }
            });
            function showUrl(src){
                $this.find('.img-content').addClass('show');
                $this.find('.show-file-name').val(src);
                $this.find('img').attr('src' , useCommon.concatImgUrl(src));
            }
            $this.find('.del-ico').click(function(){
                clear();
            });
            function clear(){
                $this.find('.show-file-name').val('');
                $this.find('img').attr('src' , '');
                $this.find('.img-content').removeClass('show');
            }
            var showImg = $(this).attr('showImg');
            if(showImg){
                showUrl(showImg);
            }
        });
    };
});