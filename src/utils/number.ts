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
export const createRandomNumber = (digit: number = 1): string => {
    const _digit_ = Number(digit);

    if (isNaN(_digit_) || _digit_ < 1) {
        return '';
    }

    let random: string = '';

    for (let i = 0; i < _digit_; i++) {
        const __r__ = Math.random();
        random += Math.floor(__r__ < 1 ? __r__ * 10 : __r__);
    }

    return random;
};

/**
 * 创建指定范围的随机数字
 * @param { Number } [min = 0] - 创建随机数最小值
 * @param { Number } [max = 1] - 创建随机数最大值
 * @param { Number } [fixed] - 精度
 * @return { String } 返回随机数字
 * */
export const createRandomNumberRange = (min: number = 0, max: number = 1, fixed: number): number => {
    let random = Math.random();
    random = random * (max - min) + min;
    if (typeof fixed !== 'undefined') {
        random = Number(random.toFixed(fixed));
    }
    return random;
};

interface LocalizeOption {
    idealize?: boolean,
    uppercase?: boolean
    currency?: boolean
}

const numberChar: string[] = [ '零', '一', '二', '三', '四', '五', '六', '七', '八', '九' ];
const numberCharUppercase: string[] = [ '零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖' ];
const numberCharUnit: string[] = [ '', '十', '百', '千' ];
const numberCharUnitUppercase: string[] = [ '', '拾', '佰', '仟' ];
const numberCharUnitLarge: string[] = [ '', '万', '亿', '万亿', '亿亿' ];
const numberCharUnitDecimalCapital: string[] = [ '角', '分' ];
const numberCharUnitInteger = '元';
const numberCharUnitIntegerUppercase = '圆';

const filterCharZero = (string: string): string => {
    return string.replace(/零+/g, '零').replace(/零$/, '');
};

/**
 * Arabic数字转为汉字数字
 * @param { Number } number - 任意正整数
 * @param { Object } [option] - 选项
 * @param { Boolean } [option.idealize = false] - 完整显示
 * @param { Boolean } [option.uppercase = false] - 是否为大写
 * @param { Boolean } [option.currency = false] - 是否货币
 * @return { String } 返回汉化数字
 */
export const localizeNumber = (number: number, option: LocalizeOption = {}): string => {

    const { idealize = false, uppercase = false, currency = false } = option;
    const _numberChar_ = uppercase ? numberCharUppercase : numberChar;
    const _numberCharUnit_ = uppercase ? numberCharUnitUppercase : numberCharUnit;
    const _numberCharUnitInteger_ = uppercase ? numberCharUnitIntegerUppercase : numberCharUnitInteger;
    const _numberCharSplit_ = currency ? _numberCharUnitInteger_ : '点';

    if (number === 0) {
        return _numberChar_[ 0 ];
    }

    let [ integerPart, decimalPart ] = number.toFixed(2).split('.'); // 分离整数和小数部分

    let result = '';
    let len = integerPart.length;

    for (let i = 0; i < len; i++) {

        let currentNum: string = integerPart[ i ];

        if (i === 0 && currentNum === '-') {
            result = '负';
            continue;
        }

        let unitIndex = (len - 1 - i) % 4; // 单位
        let unitIndexLarge = Math.floor((len - 1 - i) / 4); // 大单位

        if (currentNum !== '0') {
            if (((i === 0 && currentNum === '1') || (i === 1 && integerPart[ 0 ] === '-' && currentNum === '1')) && unitIndex === 1 && !idealize) {
                result += _numberCharUnit_[ unitIndex ];
            } else {
                result += _numberChar_[ +currentNum ] + _numberCharUnit_[ unitIndex ];
            }
        } else if (i === len - 1 || integerPart[ i + 1 ] !== '0') {
            result += _numberChar_[ +currentNum ];
        }

        if (unitIndex === 0 && currentNum !== '0') {
            result += numberCharUnitLarge[ unitIndexLarge ]; // 加上万、亿等单位
        }

    }

    result = filterCharZero(result);

    if (decimalPart && decimalPart !== '00') {

        let decimalResult = '';

        for (let i = 0; i < decimalPart.length; i++) {
            let currentDecimalNum: string = decimalPart[ i ];
            if (currentDecimalNum !== '0') {
                decimalResult += _numberChar_[ +currentDecimalNum ];
                if (currency) {
                    decimalResult += numberCharUnitDecimalCapital[ i ];
                }
            } else {
                decimalResult += '零';
            }
        }

        decimalResult = filterCharZero(decimalResult);

        if (currency) {
            if (result) {
                result += _numberCharSplit_ + decimalResult;
            } else {
                result = decimalResult;
            }
        } else {
            if (result) {
                result += _numberCharSplit_ + decimalResult;
            } else {
                result = _numberChar_[ 0 ] + _numberCharSplit_ + decimalResult;
            }
        }

    } else {

        if (currency) {
            result += _numberCharUnitInteger_ + '整';
        }

    }

    return result;
};
/**
 * 非数字处理
 * @param { * } value - 被处理的数据
 * @param { Number | undefined } [precision] - 精度
 * @param { Boolean = } pure - 纯数字
 * @return { Number | String } 数字
 * */
export const toNumber = (value: any, precision: number | undefined, pure: boolean = false): number | string => {

    let __value__: any = 0;

    if (value && !isNaN(Number(value))) {

        __value__ = Number(value);

        if (typeof precision === 'number' && precision >= 0) {

            __value__ = __value__.toFixed(precision);

            if (pure) {
                __value__ = Number(__value__);
            }
        }
    }

    return __value__;
};

/**
 * 数字千分位格式化
 * @param { Number } value - 需要格式化的数字
 * @return { String } 返回千分位格式化后的字符串
 */
export const formatThousands = (value: any): string => {
    const num = Number(value);
    if (isNaN(num)) {
        return String(value);
    }
    return Number(num).toLocaleString();
    // return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 数字千分位反格式化
 * @param { String } formattedNum - 千分位格式化的字符串
 * @return { Number | string } 返回还原后的数字，如果无法还原则返回原字符串
 */
export const unformatThousands = (formattedNum: string): number | string => {
    if (typeof formattedNum !== 'string') {
        return formattedNum;
    }
    const cleanedNum = formattedNum.replace(/,/g, '');
    const num = Number(cleanedNum);
    if (isNaN(num)) {
        return formattedNum;
    }
    return num;
};
