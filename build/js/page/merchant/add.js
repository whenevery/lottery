$(function(){
    $('.merchant-add-btn').click(function(){
        var data = $('.merchant-add-form').__serializeJSON();
        var valid = useValidate.merchant.validator(data , 'add');
        if(!valid.valid){
            useCommon.toast(valid.message);
            return false;
        }
        $.post('/merchant/add',data,function(a){
            useCommon.toast(a.message,0,function(){
                if(a.code == 0)location.href = '/merchant';
            });
        })
    })
});