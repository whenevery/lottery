module.exports = function(obj){
    if(obj){
        /*
         * 日期格式化
         * */
        obj.parseDate = function(date , format){
            if(date == null)date = new Date;
            format = format || 'Y-m-d H:i:s';//默认转换格式
            if(!(date instanceof Date)){
                if(date - 0){
                    date -= 0;
                }
                date = new Date(date);
            }
            if(date == 'Invalid Date')return '';
            var time = {};
            time.Y = date.getFullYear();
            time.y = (time.Y + '').slice(2);
            time.m = this.stringPadStart(date.getMonth() + 1 , 2 , '0');
            time.d = this.stringPadStart(date.getDate() , 2 , '0');
            time.D = '星期' + '日一二三四五六'[date.getDay()];
            time.H = this.stringPadStart(date.getHours() , 2 ,'0');
            time.h = this.stringPadStart(time.H%12 , 2 , '0');
            time.i = this.stringPadStart(date.getMinutes() , 2 , '0');
            time.s = this.stringPadStart(date.getSeconds(), 2 ,0);
            time.w = this.stringPadStart(date.getMilliseconds(),3 ,0);
            time.a = time.H >= 12 ?'下午':'上午';
            return format.replace(/./g,function(a){
                return time[a] || a;
            });
        };

        obj.stringDate = function(str){
            if(!str) return '';
            return [str.slice(0,4) , str.slice(4,6),str.slice(6)];
        }

        /*
         * 时间差
         * */
        obj.diffDate = function(start , end){
            if(!start || !end)return null;
            var time = new Date(end) - new Date(start);
            if(isNaN(time))return null;
            time /= 1000;
            var s = Math.floor(time % 60);
            var i = Math.floor(time / 60 % 60);
            var h = Math.floor(time / 3600 % 24);
            var d = Math.floor(time / (24 * 3600) % 365);
            var str = '';
            if(d)str += d + '天';
            if(h)str += h + '小时';
            if(i)str += i + '分';
            if(s)str += s + '秒';
            return str;
        };
        obj.concatDateString = function(date , h , i , s){
            return date + ' ' + useCommon.stringPadStart(h,2,'0') + ':' + useCommon.stringPadStart(i,2,'0') + ':' + useCommon.stringPadStart(s,2,'0');
        }
    }
};