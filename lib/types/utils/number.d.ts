/**
 ==================================================
 Numeric data manipulation
 数字类型数据处理
 ==================================================
 */
/**
 * 创建指定位数的随机数字的字符串
 * @param { Number } [digit = 1] - 创建随机数位数
 * @return { String } 返回随机数字字符串 (存在0开头)
 * */
export declare const createRandomNumber: (digit?: number) => string;
/**
 * 创建指定范围的随机数字
 * @param { Number } [min = 0] - 创建随机数最小值
 * @param { Number } [max = 1] - 创建随机数最大值
 * @param { Number } [fixed] - 精度
 * @return { String } 返回随机数字
 * */
export declare const createRandomNumberRange: (min: number | undefined, max: number | undefined, fixed: number) => number;
interface LocalizeOption {
    idealize?: boolean;
    uppercase?: boolean;
    currency?: boolean;
}
/**
 * Arabic数字转为汉字数字
 * @param { Number } number - 任意正整数
 * @param { Object } [option] - 选项
 * @param { Boolean } [option.idealize = false] - 完整显示
 * @param { Boolean } [option.uppercase = false] - 是否为大写
 * @param { Boolean } [option.currency = false] - 是否货币
 * @return { String } 返回汉化数字
 */
export declare const localizeNumber: (number: number, option?: LocalizeOption) => string;
/**
 * 非数字处理
 * @param { * } value - 被处理的数据
 * @param { Number | undefined } [precision] - 精度
 * @param { Boolean = } pure - 纯数字
 * @return { Number | String } 数字
 * */
export declare const toNumber: (value: any, precision: number | undefined, pure?: boolean) => number | string;
/**
 * 数字千分位格式化
 * @param { Number } num - 需要格式化的数字
 * @return { String } 返回千分位格式化后的字符串
 */
export declare const formatThousands: (value: any) => string;
/**
 * 数字千分位反格式化
 * @param { String } formattedNum - 千分位格式化的字符串
 * @return { Number | string } 返回还原后的数字，如果无法还原则返回原字符串
 */
export declare const unformatThousands: (formattedNum: string) => number | string;
export {};
