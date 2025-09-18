/**
 ==================================================
 Character type data manipulation
 字符类型数据处理
 ==================================================
 */
import { isEmpty } from '@/utils/object';

// 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
const _charts_: string = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';

/**
 * @param { Number } [digit = 1] - 随机字符串长度
 * @return { String } 返回指定长度随机字符串
 */
export const createRandomString = (digit: number = 1): string => {
    const _digit_ = Number(digit);

    if (isNaN(_digit_) || _digit_ < 1) {
        return '';
    }

    let random: string = '';
    let len = _charts_.length;

    for (let i = 0; i < _digit_; i++) {
        random += _charts_.charAt(Math.floor(Math.random() * len));
    }

    return random;
};

/**
 * 字符串转全角
 * @param { String } content - 任意字符串
 * @return { String } 返回转全角后的字符串
 */
export const toDBC = (content: string): string => {
    let _result_ = '';

    if (content === '') {
        return _result_;
    }

    for (let i = 0; i < content.length; i++) {
        if (content.charCodeAt(i) === 32) {
            _result_ = _result_ + String.fromCharCode(12288);
        } else if (content.charCodeAt(i) === 10) {
            _result_ = _result_ + String.fromCharCode(content.charCodeAt(i));
        } else if (content.charCodeAt(i) < 127) {
            _result_ = _result_ + String.fromCharCode(content.charCodeAt(i) + 65248);
        } else {
            _result_ = _result_ + String.fromCharCode(content.charCodeAt(i));
        }
    }

    return _result_;
};

/**
 * 字符串转半角
 * @param { String } content - 任意字符串
 * @return { String } 返回转半角后的字符串
 */
export const toSBC = (content: string): string => {
    let _result_ = '';

    if (content === '') {
        return _result_;
    }

    for (let i = 0; i < content.length; i++) {
        if (content.charCodeAt(i) > 65280 && content.charCodeAt(i) < 65375) {
            _result_ += String.fromCharCode(content.charCodeAt(i) - 65248);
        } else if (content.charCodeAt(i) === 12288) {
            _result_ += String.fromCharCode(32);
        } else {
            _result_ += String.fromCharCode(content.charCodeAt(i));
        }
    }

    return _result_;
};

/**
 * 英文字符串首字母大写
 * @param { String } content - 英文字符串
 * @return { String } 首字母大写字符串
 * */
export const capitalize = (content: string): string => content.charAt(0).toUpperCase() + content.slice(1);

/**
 * 字符串超出指定长度省略
 * @param { String } content - 输入文本内容
 * @param { Number } length - 指定字符串最大长度
 * @param { String } [suffix=……] - 超出部分替换内容
 * @return { String } 返回处理后的字符
 * */
export const ellipsis = (content: string, length: number, suffix: string = '...'): string => {

    if (typeof content === 'undefined') {
        return content;
    }

    if (!isNaN(+length) && content.length > length) {
        return `${ content.slice(0, length - 1) }${ suffix }`;
    }

    return content;
};

/**
 * 字符串按指定长度拆成数组
 * @param { String } content - 输入文本内容
 * @param { Number } length - 指定字符串最大长度
 * @return { String[] } 返回处理后的数组字符
 * */
export const splitStringByLength = (content: string, length: number): string[] => {
    const result: string[] = [];
    let pos = 0;

    while (pos < content.length) {
        result.push(content.substring(pos, pos + length));
        pos += length;
    }

    return result;
};

/**
 * 字符串是否包含空格
 * @param { String } content - 输入文本内容
 * @return { Boolean } 返回是否包含空格
 * */
export const validateContainsSpace = (content: string): boolean => {
    return /\s/g.test(content);
}

/**
 * 验证邮箱
 * @param { String } email 邮箱
 * @return { Boolean } 返回验证结果
 * */
export const validateEmail = (email: string): boolean => {
    const regexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexp.test(email);
};

/**
 * 验证手机号
 * @param { String } phoneNumber 手机号
 * @return { Boolean } 返回验证结果
 * */
export const validatePhone = (phoneNumber: any): boolean => {

    let regexp = /^1\d{10}$/;

    return regexp.test(phoneNumber);
};

/**
 * 隐藏手机号信息
 * @param { String } phone 手机号
 * @return { String } 隐藏信息后的手机号
 * */
export const hidePhone = (phone: any): string => {
    if (!validatePhone(phone)) {
        return phone;
    }
    return phone.replace(/^(.{3})(?:\d+)(.{4})$/, '$1****$2');
};

/**
 * 验证电话号
 * @param { String } telephoneNumber 手机号
 * @return { Boolean } 是否为有效手机号
 * */
export const validateTelephone = (telephoneNumber: string): boolean => {

    let regexp = /^((\+\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/;

    return regexp.test(telephoneNumber);
};

/**
 * 身份证验证
 * @param { String } identification 身份证号
 * @return { Boolean } 返回验证结果
 * */
export const validateIdentification = (identification: any): boolean => {
    if (typeof identification !== 'string' || identification === '') {
        return false;
    }
    // 身份证号码可能的前17位数字
    const num: any = identification.replace(/x|X/g, '10').slice(0, 17);
    // 校验码的权重（从左到右）
    const weight = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
    // 校验码的字符集
    const checkCode = '10X98765432';

    // 计算校验码
    let sum = 0;
    for (let i = 0; i < 17; i++) {
        sum += num[ i ] * weight[ i ];
    }

    // 根据模11的结果得到校验码位置
    const mod = sum % 11;
    const check = checkCode[ mod ];

    // 替换身份证号码中的校验码
    const lastChar = identification.slice(-1);
    return check === lastChar && lastChar !== '0';
};

/**
 * 隐藏身份证号信息
 * @param { String } identification 身份证号
 * @param { Boolean } validate 是否验证身份证号
 * @return { String } 隐藏信息后的身份证号
 * */
export const hideIdentification = (identification: any, validate?: boolean): string => {
    if (typeof identification !== 'string' || identification === '') {
        return '';
    }
    if (validate && !validateIdentification(identification)) {
        return `${ identification }(伪)`;
    }
    return identification.replace(/^(.{4})(?:\d+)(.{4})$/, '$1******$2');
};

/**
 * 正则验证IP
 * @param { String } ip 任意字符串
 * @return { Boolean } 返回验证结果
 */
export const validateIP = (ip: string): boolean => {
    const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

    return reg.test(ip);
};

/**
 * 正则验证URL
 * @param { String } url 任意字符串
 * @return { Boolean } 返回是否为URL
 */
export const validateURL = (url: string): boolean => {
    const _reg_exp_str_ = '^((https|http|ftp|rtsp|mms|itms-apps)?://)'
        + '(([0-9]{1,3}\.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
        + '|' // 允许IP和DOMAIN（域名）
        + '([0-9a-z_!~*\'()-]+\.)*' // 域名- www.
        + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.' // 二级域名
        + '[a-z]{2,6})' // first level domain- .com or .museum
        + '(:[0-9]{1,4})?' // 端口- :80
        + '((/?)|' // a slash isn't required if there is no file name
        + '(/\.+)+/?)$';
    const _regexp_ = new RegExp(_reg_exp_str_);

    return _regexp_.test(url);
};

/**
 * 从 URL 获取查询参数
 * @param { String } href 查询的地址
 * @return { Object } 查询参数对象
 * */
export const getUrlQuery = (href: string = window.location.href): any => {

    const [ url = '' ] = href.split('#');
    const [ , search = '' ] = url.split('?');

    let query: any = {};

    try {
        query = Object.fromEntries(new URLSearchParams(search));
    } catch (e) {
        console.warn(e);
        if (search) {
            query = JSON.parse(
                '{"' +
                decodeURI(search)
                    .replace(/"/g, '\"')
                    .replace(/&/g, '","')
                    .replace(/=/g, '":"') +
                '"}'
            );
        }
    }

    return query;
};

/**
 * 设置 URL 查询参数
 * @param { String } href - 地址
 * @param { Object } data - 查询参数
 * @return { String } 带参url
 * */
export const setUrlQuery = (href: string, data: any): string => {

    const [ url, hash ] = href.split('#');
    const [ path ] = url.split('?');

    const originQuery = getUrlQuery(url);

    let query: string[] = [];

    if (data instanceof Object && !isEmpty(data)) {

        const params = Object.assign(originQuery, data);

        Object.keys(params).map((key: string) => {
            query.push(`${ key }=${ params[ key ] }`);
        });
    }

    let result = `${ path }`;

    if (query.length) {
        result += `?${ query.join('&') }`;
    }

    if (hash) {
        result += `#${ hash }`;
    }

    return result;
};

export const plateNumberReg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
export const plateNumberNEVReg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;

/**
 * 验证车牌号
 * @param { String } plateNumber 车牌号
 * @return { Boolean } 返回验证结果
 * */
export const validatePlateNumber = (plateNumber: string): boolean => {
    if (plateNumber.length === 7) {
        return plateNumberReg.test(plateNumber);
    } else if (plateNumber.length === 8) {
        return plateNumberNEVReg.test(plateNumber);
    } else {
        return false;
    }
};

/**
 * 获取文件后缀
 * @param { string } filePath - 文件路径
 * @return { string } - 返回后缀名
 * */
export const getFileSuffix = (filePath: string): string => {
    let suffix = '';
    const index = filePath.lastIndexOf('.');

    if (index > -1) {
        suffix = filePath.slice(index + 1);
    }

    return suffix;
};
