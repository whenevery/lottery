(function(){
    useValidate.merchant = {
        validator:function(data , type){
            var valid;
            if(type == 'add'){
                valid = useValidate.validator({
                    phone:{
                        required:1,
                        isPhone:1,
                        requiredMessage:'请输入手机号',
                        isPhoneMessage:'请输入有效的手机号'
                    },
                    wechatNumber:{
                        required:1,
                        requiredMessage:'请输入微信号',
                    }
                },data);
            }
            return valid;
        }
    };
})();