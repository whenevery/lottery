module.exports = function(obj){
    if(obj){
        /*
         * 去掉重复值 会打乱顺序
         * */
        obj.arrayUnique = function(arr){
            var rt = [];
            var map = {};
            arr.forEach(function(a){
                if(!map[a])rt.push(a);
                map[a] = 1;
            });
            return rt;
        }
        /*
         * 数组计算和
         * */
        obj.arraySum = function(arr , func){
            func = func || function(a){return a;};
            var sum = 0;
            if(arr){
                arr = [].slice.call(arr);
                if(Array.isArray(arr)){
                    arr.forEach(function(o){sum += func(o) - 0;});
                }
            }
            return sum;
        }
    }
};