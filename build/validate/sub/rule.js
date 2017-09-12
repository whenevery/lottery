(function(){
    useValidate.rule = {
        validator:function(data , type){
            var valid;
            if(type === 'bet'){
                valid = useValidate.validator({
                    betMaxCount:{
                        required:1,
                        isInt:1,
                        moreThen:0,
                        requiredMessage:'请输入最大下注数',
                        message:'请输入有效的最大下注数',
                    },
                    betMinScore:{
                        required:1,
                        isInt:1,
                        moreThen:0,
                        requiredMessage:'请输入单注最小积分',
                        message:'请输入有效的单注最小积分',
                    },
                    betMaxScore:{
                        required:1,
                        isInt:1,
                        moreThen:data.betMinScore,
                        requiredMessage:'请输入单注最大积分',
                        moreThenMessage:'最大积分需要大于最小积分',
                        message:'请输入有效的单注最大积分',
                    },
                    betAllMaxScore:{
                        required:1,
                        isInt:1,
                        moreThen:0,
                        requiredMessage:'请输入当期最大积分',
                        message:'请输入有效的当期最大积分',
                    },
                },data);
            }
            else if(type === 'withdraw'){
                valid = useValidate.validator({
                    min:{
                        required:1,
                        isInt:1,
                        moreThen:0,
                        requiredMessage:'请输入下分最小积分',
                        message:'请输入有效的下分最小积分',
                    },
                    max:{
                        required:1,
                        isInt:1,
                        moreThen:data.min,
                        requiredMessage:'请输入下分最大积分',
                        moreThenMessage:'最大积分需要大于最小积分',
                        message:'请输入有效的下分最大积分',
                    },
                },data);
            }
            else if(type === 'res'){
                data.every(function(a){
                    valid = useValidate.validator({
                        rate:{
                            required:1,
                            isNumber:1,
                            moreThen:0,
                            requiredMessage:'请输入下注倍率',
                            message:'请输入有效的下注倍率',
                        },
                    },a);
                    return valid.valid;
                });

            }
            return valid;
        }
    };
})();