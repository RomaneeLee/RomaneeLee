export default {
  data() {
    return {
      calendar: [], //日历数组
      currentDate: [], //当前日期
      time:'',//选中日期
      start_time:'',//开始日期
      end_time:'',//结束日期
    }
  },
  onLoad() {
    let currentDate = this.currentime();
    this.currentDate = currentDate;
    let currentYear = currentDate[0];
    let currentMonth = currentDate[1] > 9 ? currentDate[1] : '0'+currentDate[1];
    let currentDay = currentDate[2] > 9 ? currentDate[2] : '0'+currentDate[2];
    // 足迹01页面日期筛选默认值
    this.time = `${currentYear}-${currentMonth}-${currentDay}`;
    
    // 足迹02页面日期筛选赋值 默认三个月
    // 开始时间
    if(currentDate[1] > 4){
      let prevMonth = currentDate[1]-3 > 9 ? currentDate[1]-3 : '0'+(currentDate[1]-3) ;
      let prevDay = currentDate[2] > 9 ? currentDate[2] : '0'+currentDate[2];
      this.start_time = `${currentDate[0]}-${prevMonth}-${prevDay}`;
    }else{
      let prevYear = currentDate[0]-1;
      let prevMonth = currentDate[1]-3 + 12 > 9 ? currentDate[1]-3 + 12 : '0'+(currentDate[1]-3 + 12) ;
      let prevDay = currentDate[2] > 9 ? currentDate[2] : '0'+currentDate[2];
      this.start_time = `${prevYear}-${prevMonth}-${prevDay}`;
    }
    // 结束时间
    this.end_time = `${currentYear}-${currentMonth}-${currentDay}`;
    // 日历赋值
    this.calendar = this.getCalendar(currentDate[0], currentDate[1]);


  },
  methods: {
    /**
     * @description 获取当前时间函数
     */
    currentime() {
      var date = new Date();
      var y = Number(date.getFullYear());
      var m = Number(date.getMonth() + 1);
      var d = Number(date.getDate());
      return [y, m, d];
    },
    /**
     * @author 邓东方
     * @description 获取日历
     * @param {String,Number} y 年
     * @param {String,Number} m 月
     * @param {String,Number} currentDay 当前日  传入了显示 当前日 active == true
     */
    getCalendar(y, m) {
      // 求解cy年cm月cd日是星期几,parseInt代表取整 d=1是去每个月第一天
      var cc = parseInt(y / 100); //c
      var cy = y - cc * 100; //y
      var cm = m; //m
      var cd = 1; //d
      // 某年的1、2月要看作上一年的13、14月来计算，比如2003年1月1日要看作2002年的13月1日来计算
      if (m == 1 || m == 2) {
        cc = parseInt((y - 1) / 100);
        cy = y - 1 - cc * 100;
        cm = 12 + m;
      }
      //w=y+[y/4]+[c/4]-2c+[26(m+1）/10]+d-1
      // var csum = y + [y / 4] + [c / 4] - 2c+[26(m + 1）/10]+d-1;
      var csum = cy + parseInt(cy / 4) + parseInt(cc / 4) - 2 * cc + parseInt(26 * (cm + 1) / 10) + cd - 1;
      // 注意使用蔡勒公式时出现负数情况    fd 每月第一天星期几
      if (csum < 0) {
        var fd = parseInt((csum % 7 + 7) % 7);
      } else {
        var fd = parseInt(csum % 7);
      }

      // 上个月天数
      var cond1 = y % 4 == 0; //条件1：年份必须要能被4整除
      var cond2 = y % 100 != 0; //条件2：年份不能是整百数
      var cond3 = y % 400 == 0; //条件3：年份是400的倍数
      //当条件1和条件2同时成立时，就肯定是闰年，所以条件1和条件2之间为“与”的关系。
      //如果条件1和条件2不能同时成立，但如果条件3能成立，则仍然是闰年。所以条件3与前2项为“或”的关系。
      //所以得出判断闰年的表达式：
      var cond = cond1 && cond2 || cond3;
      //判断当月有多少天
      var allDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
      if (cond && m == 2) {
        allDays = 29;
      }
      //上个月是不是去年
      let prevYear = y;
      let prevMonth = m - 1;
      if (m == 1) {
        prevYear = y - 1;
        prevMonth = 12;
      }
      let _prevMonth = prevMonth>9?prevMonth:'0'+prevMonth;
      let _m = m>9?m:'0'+m;
      //判断上个月天数
      var prevDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][prevMonth - 1];
      var arr = [];
      //这里塞入上个月末尾日期
      //day 日  active 是否选择 isNot 是不是这个月 formData 日期格式 isBg 是否加背景色（日期段筛选时使用）
      for (let i = 1; i <= fd; i++) {
        let prevDay = prevDays - fd + i;
        let _prevDay = prevDay>9?prevDay:'0'+prevDay;

        arr.push({
          'day': prevDay,
          'active': false,
          'isNot': true,
          'formData': prevYear + '-' + _prevMonth + '-' + _prevDay
        })
      }
      //这里塞入正常这个月的日期
      for (let i = 1; i <= allDays; i++) {
        let _i = i>9?i:'0'+i;
        arr.push({
          'day': i,
          'active': false,
          'isNot': false,
          'formData': y + '-' + _m + '-' + _i
        })
      }
      //下个月是不是下一年
      let nextYear = y;
      let nextMonth = m + 1;
      if (m == 12) {
        nextYear = y + 1;
        nextMonth = 1;
      }
      let _nextMonth = nextMonth>9?nextMonth:'0'+nextMonth;
      //判断数组最后一排剩余几个位置塞入下个月日期
      let takedie = arr.length % 7;
      if (7 - takedie > 0 && 7 - takedie < 7) {
        for (let i = 1; i <= 7 - takedie; i++) {
          let _i = i>9?i:'0'+i;
          arr.push({
            'day': i,
            'active': false,
            'isNot': true,
            'formData': nextYear + '-' + _nextMonth + '-' + _i
          })
        }
      }

      // 处理数组钩子
      if(this.handleCalendarFn){
        arr = this.handleCalendarFn(arr);
      }

      return arr;
    },
    /**
     * @description 上月
     */
    prevMonth() {
      let currentDate = this.currentDate;
      if (currentDate[1] - 1 == 0) {
        currentDate = [currentDate[0] - 1, 12];
      } else {
        currentDate = [currentDate[0], currentDate[1] - 1];
      }
      this.currentDate = currentDate;
      this.calendar = this.getCalendar(currentDate[0], currentDate[1]);
    },
    /**
     * @description 下月
     */
    nextMonth() {
      let currentDate = this.currentDate;
      if (currentDate[1] == 12) {
        currentDate = [Number(currentDate[0]) + 1, 1];
      } else {
        currentDate = [Number(currentDate[0]), Number(currentDate[1]) + 1];
      }
      this.currentDate = currentDate;
      this.calendar = this.getCalendar(currentDate[0], currentDate[1]);
    }
  }
}
