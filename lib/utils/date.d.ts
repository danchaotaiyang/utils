/**
 ==================================================
 Date time type data manipulation
 日期时间类型数据处理
 ==================================================
 */
export declare const millisecondInDay: number;
/**
 * 检查日期是否合法
 * @param { * } date - 检查日期
 * @return { Boolean } 是否为合法日期
 * */
export declare const validateDate: (date: any) => boolean;
/**
 * 查询年份是否为闰年
 * @param { Number } year - 查询年份
 * @return { Boolean } 返回是否为闰年
 * */
export declare const isLeap: (year: number) => boolean;
/**
 * 查询月份天数
 * @param { Number } year - 查询年份
 * @param { Number } month - 查询月份
 * @return { Number } 月份天数
 * */
export declare const daysInMonth: (year: number, month: number) => number;
/**
 * 查询年份天数
 * @param { Number } year - 查询年份
 * @return { Number } 年份天数
 * */
export declare const daysInYear: (year: number) => number;
/**
 * 查找日期位于一年中的第几天
 * @param { * } date - 查找目标日期
 * @return { Number } 索引
 * */
export declare const dayIndex: (date: any) => number;
/**
 * 计算母亲节日期
 * @param { Date | String | Number } year - 开始时间
 * @return { Object | null } 返回五月的第二个星期日
 */
export declare const getMothersDay: (year: number) => Date;
/**
 * 计算父亲节日期
 * @param { Date | String | Number } year - 开始时间
 * @return { Object | null } 返回六月的第三个星期日
 */
export declare const getFathersDay: (year: number) => Date;
/**
 * 秒数转化为时分秒
 * @param { Number } value - 秒数
 * @param { Function } formatter - 格式化方法
 * @return { String } 返回时间描述
 */
export declare const formatSeconds: (value: number, formatter?: any) => any;
