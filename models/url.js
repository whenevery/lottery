var apiUrl = useConfig.yqsapi ;
module.exports = {
    lottery:{
        next:'http://caipiao.163.com/order/preBet_periodInfoTime.html?gameEn=ssc&cache=',
        settle:'https://api.zao28.com/News?name=cqssc&type=json',
    },
    file:{
        upload:apiUrl + '/yqsapi/api/app/file/fileUpload',
    }
};