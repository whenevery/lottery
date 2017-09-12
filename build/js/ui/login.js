WY.bind('login',function(num){
    if(sessionJson.userInfo){
        WY.trigger('login-flush',num || 1);
    }else{
        if(sessionJson.wechatLoginCode == 'pleaseBinding'){
            WY.trigger('other-bind');
        }else{
            WY.trigger('h5-code');
        }
    }
});
WY.ready('user-info',function(userInfo){
    userInfo.headImg = useCommon.concatImgUrl(userInfo.headImg);
    sessionJson.userInfo = userInfo;
    localStorage.openId = sessionJson.openId || localStorage.openId || '';
    localStorage.unionid = sessionJson.unionid || localStorage.unionid || '';
    localStorage.userInfo = useCommon.stringify(userInfo);
});
$(document).ajaxComplete(function(a,b,c){
    var resData = useCommon.parse(b.responseText);
    if(resData && (resData.baseCode == 'PleaseLogin' || resData.code == 'PleaseLogin')){
        localStorage.loginTime = '';
        WY.trigger('login-flush',1);
    }
});
WY.bind('login-flush',function(num){
    if(num){
        num++;
        if(num > 3)return false;
    }

    if(!sessionJson.userInfo)return false;
    if(sessionJson.unionid){
        $.post('/wechat/other',{
            loginSource:'H5',
            sType:'wx',
            uid:sessionJson.unionid,
            openId:sessionJson.openId
        } , function(a){
            if(a.code == 0){
                localStorage.loginTime = Date.now();
                WY.ready('user-info',a.data);
            }else{
                WY.trigger('login' , num);
            }
        })
    }else{
        $.post('/login/flush',{
            thisIsSB:sessionJson.userInfo.thisIsSB,
        } , function(a){
            if(a.code == 0){
                localStorage.loginTime = Date.now();
                WY.ready('user-info',a.data);
            }else{
                WY.trigger('login' , num);
            }
        })
    }
});
var loginCodeType;
WY.bind('other-bind',function(){
    loginCodeType = 'other-bind';
    WY.trigger('modal-view','window/bind',{
        hideAble:1,
        done:function($content){
            $content.find('.password-login-line').remove();
        },
        submit:function($window){
            var data = $window.__serializeJSON();
            var valid = useValidate.login.validator(data , 'bind');
            if(!valid.valid){
                useCommon.toast(valid.message , 1000);
                return false;
            }
            data.sType = 'wx';
            data.uid = sessionJson.unionid;
            data.openId = sessionJson.openId;
            data.phone = data.username;
            $.post('/login/bind',data,function(a){
                if(a.code == 'BINDING_SUCCESS'){
                    localStorage.loginTime = Date.now();
                }
                if(a.loginSuccess){
                    localStorage.loginTime = Date.now();
                    if(a.code != 'BINDING_SUCCESS'){
                        WY.trigger('login-flush');
                    }
                    WY.trigger('modal-hide');
                    WY.ready('user-info',a.data);
                }else{
                    useCommon.toast(a.message);
                }
            });
        }
    });
});
WY.bind('h5-code',function(){
    loginCodeType = 'h5-code';
    WY.trigger('modal-view','window/bind&sendType=H5LOGIN',{
        hideAble:1,
        done:function($content){
            $content.find('.password-line').remove();
        },
        submit:function($window){
            var data = $window.__serializeJSON();
            var valid = useValidate.login.validator(data , 'h5');
            if(!valid.valid){
                useCommon.toast(valid.message , 1000);
                return false;
            }
            data.phoneType = browserClient.android?'android':(browserClient.ios?'ios':'computer');
            data.code = data.sendCode;
            $.post('/login/h5/code',data,function(a){
                if(a.code == 0){
                    localStorage.loginTime = Date.now();
                    WY.trigger('modal-hide');
                    WY.ready('user-info',a.data);
                }else{
                    useCommon.toast(a.message);
                }
            });
        }
    });
});
WY.bind('h5-login',function(){
    WY.trigger('modal-view','window/login',{
        hideAble:1,
        done:function($content){
            $content.find('[wy-click]').attr('wy-click',loginCodeType);
        },
        submit:function($window){
            var data = $window.__serializeJSON();
            var valid = useValidate.login.validator(data );
            if(!valid.valid){
                useCommon.toast(valid.message , 1000);
                return false;
            }
            data.pwd = data.password;
            data.phoneType = browserClient.android?'android':(browserClient.ios?'ios':'computer');
            $.post('/login/h5',data,function(a){
                if(a.code == 0){
                    localStorage.loginTime = Date.now();
                    WY.trigger('modal-hide');
                    WY.ready('user-info',a.data);
                }else{
                    useCommon.toast(a.message);
                }
            });
        }
    });
});
$(function(){
    sessionJson.userInfo = sessionJson.userInfo || useCommon.parse(localStorage.userInfo) || '';
    sessionJson.openId = sessionJson.openId || localStorage.openId || '';
    sessionJson.unionid = sessionJson.unionid || localStorage.unionid || '';
    WY.trigger('login')
});