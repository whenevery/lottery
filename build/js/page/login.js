;$(function(){
	var $loginForm = $('.login-form');
	var $registerForm = $('.register-form');
    $loginForm.submit(function(){
        var sendData = {
            username:$(this).find('[name=username]').val().trim(),
            password:$(this).find('[name=password]').val().trim()
        };
	    var valid = useValidate.login.validator(sendData , 'login');
	    if(!valid.valid){
		    useCommon.toast(valid.message);
	    	return false;
	    }
	    sendData.password = window.md5(sendData.password);
        setAjaxIpcData({
            'type':'login',
            data:sendData
        });
        return false;
    });
    $registerForm.submit(function(){
	    var sendData = {
	        username:$(this).find('[name=username]').val().trim(),
            password:$(this).find('[name=password]').val().trim()
	    };
	    var valid = useValidate.login.validator(sendData , 'login');
	    if(!valid.valid){
		    useCommon.toast(valid.message);
	    	return false;
	    }
	    sendData.password = window.md5(sendData.password);
        setAjaxIpcData({
            'type':'register',
            data:sendData
        });
        return false;
    });
    $('.to-login-btn').click(function(){
        $registerForm.hide();
        $loginForm.show();
        return false;
	});
    $('.to-res-btn').click(function(){
        $registerForm.show();
        $loginForm.hide();
        return false;
	});
});