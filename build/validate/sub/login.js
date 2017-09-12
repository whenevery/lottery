(function(){
    useValidate.login = {
		validator:function(data , type){
			var valid;
			if(type == 'smsSend'){
				valid = useValidate.validator({
					username:{
						required:1,
						isPhone:1,
						requiredMessage:'请输入手机号',
						isPhoneMessage:'请输入有效的手机号'
					},
					imgCode:{
						required:1,
						length:5,
						requiredMessage:'请输入图片验证码',
						lengthMessage:'请输入5位图片验证码'
					}
				},data);
			}
			else if(type == 'bind'){
				valid = useValidate.validator({
					username:{
						required:1,
						isPhone:1,
						requiredMessage:'请输入手机号',
						isPhoneMessage:'请输入有效的手机号'
					},
					sendCode:{
						required:1,
						length:6,
						requiredMessage:'请输入短信验证码',
						lengthMessage:'请输入6位图片验证码'
					},
					password:{
						required:1,
						minlength:6,
						requiredMessage:'请输入密码',
						minlengthMessage:'请输入至少6位密码'
					}
				},data);
			}
			else if(type == 'h5'){
				valid = useValidate.validator({
					username:{
						required:1,
						isPhone:1,
						requiredMessage:'请输入手机号',
						isPhoneMessage:'请输入有效的手机号'
					},
					sendCode:{
						required:1,
						length:6,
						requiredMessage:'请输入短信验证码',
						lengthMessage:'请输入6位图片验证码'
					}
				},data);
			}
			else{
				valid = useValidate.validator({
					username:{
						required:1,
						maxlength:20,
						requiredMessage:'请输入登录账号',
						maxlengthMessage:'账号最长为20'
					},
					password:{
						required:1,
						lengthRange:[6,18],
						requiredMessage:'请输入登录密码',
						lengthRangeMessage:'登录密码为6-18位'
					}
				},data);
			}
			return valid;
		}
	};
})();