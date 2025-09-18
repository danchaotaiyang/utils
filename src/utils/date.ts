/**
 ==================================================
 Date time type data manipulation
 日期时间类型数据处理
 ==================================================
 */

export const millisecondInDay: number = 86400000;

const dateFormat = [ '年', '个月', '天', '小时', '分钟', '秒' ];

/**
 * 检查日期是否合法
 * @param { * } date - 检查日期
 * @return { Boolean } 是否为合法日期
 * */
export const validateDate = (date: any): boolean => {

    const __date__ = new Date(date);

    return !isNaN(__date__.getTime());
};

/**
 * 查询年份是否为闰年
 * @param { Number } year - 查询年份
 * @return { Boolean } 返回是否为闰年
 * */
export const isLeap = (year: number): boolean => (year % 4) === 0 && (year % 100) !== 0 || (year % 400) === 0;

/**
 * 查询月份天数
 * @param { Number } year - 查询年份
 * @param { Number } month - 查询月份
 * @return { Number } 月份天数
 * */
export const daysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
};

/**
 * 查询年份天数
 * @param { Number } year - 查询年份
 * @return { Number } 年份天数
 * */
export const daysInYear = (year: number): number => {
    let _days_ = 365;
    let _year_ = year || new Date().getFullYear();

    if (isLeap(_year_)) {
        _days_ += 1;
    }

    return _days_;
};

/**
 * 查找日期位于一年中的第几天
 * @param { * } date - 查找目标日期
 * @return { Number } 索引
 * */
export const dayIndex = (date: any): number => {

    let _date_full_: any = new Date(date);
    let _date_year_: any = new Date(_date_full_.getFullYear().toString());
    let _date_index_ = (_date_full_ - _date_year_) / millisecondInDay;

    return Math.ceil(_date_index_) + 1;
};

/**
 * 计算母亲节日期
 * @param { Date | String | Number } year - 开始时间
 * @return { Object | null } 返回五月的第二个星期日
 */
export const getMothersDay = (year: number): Date => {

    const date = new Date(year, 4, 1);
    date.setDate(1 + ((7 - date.getDay()) % 7) + 7);

    return date;
};


/**
 * 计算父亲节日期
 * @param { Date | String | Number } year - 开始时间
 * @return { Object | null } 返回六月的第三个星期日
 */
export const getFathersDay = (year: number): Date => {

    const date = new Date(year, 5, 1);
    date.setDate(1 + ((7 - date.getDay()) % 7) + 14);

    return date;
};


const formatSecondsResultDefault = (day: number, hour: number, minute: number, second: number): any => {

    let result = '';

    if (second > 0) {
        result = Math.round(second) + '秒';
    }

    if (minute > 0) {
        result = '' + Math.round(minute) + '分' + result;
    }

    if (hour > 0) {
        result = '' + Math.round(hour) + '小时' + result;
    }

    if (day > 0) {
        result = '' + Math.round(day) + '天' + result;
    }

    return result;
};

/**
 * 秒数转化为时分秒
 * @param { Number } value - 秒数
 * @param { Function } formatter - 格式化方法
 * @return { String } 返回时间描述
 */
export const formatSeconds = (value: number, formatter?: any): any => {
    try {
        //  秒
        let second = Math.ceil(value);
        //  分
        let minute = 0;
        //  小时
        let hour = 0;
        //  天
        let day = 0;
        //  如果秒数大于60，将秒数转换成整数
        if (second > 59) {
            //  获取分钟，除以60取整数，得到整数分钟
            minute = Math.floor(second / 60);
            //  获取秒数，秒数取佘，得到整数秒数
            second = Math.ceil(second % 60);
            //  如果分钟大于60，将分钟转换成小时
            if (minute > 59) {
                //  获取小时，获取分钟除以60，得到整数小时
                hour = Math.floor(minute / 60);
                //  获取小时后取佘的分，获取分钟除以60取佘的分
                minute = Math.ceil(minute % 60);
                //  如果小时大于24，将小时转换成天
                if (hour > 23) {
                    //  获取天数，获取小时除以24，得到整天数
                    day = Math.floor(hour / 24);
                    //  获取天数后取余的小时，获取小时除以24取余的小时
                    hour = Math.ceil(hour % 24);
                }
            }
        }

        let factory = formatSecondsResultDefault;

        if (typeof formatter === 'function') {
            factory = formatter;
        }

        return factory(day, hour, minute, second);
    } catch (error) {
        console.warn(error);
        return value;
    }
};
