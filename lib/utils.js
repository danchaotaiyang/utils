(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.utils = {}));
})(this, (function (exports) { 'use strict';

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
    var createRandomNumber = function (digit) {
        if (digit === void 0) { digit = 1; }
        var _digit_ = Number(digit);
        if (isNaN(_digit_) || _digit_ < 1) {
            return '';
        }
        var random = '';
        for (var i = 0; i < _digit_; i++) {
            var __r__ = Math.random();
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
    var createRandomNumberRange = function (min, max, fixed) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 1; }
        var random = Math.random();
        random = random * (max - min) + min;
        if (typeof fixed !== 'undefined') {
            random = Number(random.toFixed(fixed));
        }
        return random;
    };
    var numberChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    var numberCharUppercase = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    var numberCharUnit = ['', '十', '百', '千'];
    var numberCharUnitUppercase = ['', '拾', '佰', '仟'];
    var numberCharUnitLarge = ['', '万', '亿', '万亿', '亿亿'];
    var numberCharUnitDecimalCapital = ['角', '分'];
    var numberCharUnitInteger = '元';
    var numberCharUnitIntegerUppercase = '圆';
    var filterCharZero = function (string) {
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
    var localizeNumber = function (number, option) {
        if (option === void 0) { option = {}; }
        var _a = option.idealize, idealize = _a === void 0 ? false : _a, _b = option.uppercase, uppercase = _b === void 0 ? false : _b, _c = option.currency, currency = _c === void 0 ? false : _c;
        var _numberChar_ = uppercase ? numberCharUppercase : numberChar;
        var _numberCharUnit_ = uppercase ? numberCharUnitUppercase : numberCharUnit;
        var _numberCharUnitInteger_ = uppercase ? numberCharUnitIntegerUppercase : numberCharUnitInteger;
        var _numberCharSplit_ = currency ? _numberCharUnitInteger_ : '点';
        if (number === 0) {
            return _numberChar_[0];
        }
        var _d = number.toFixed(2).split('.'), integerPart = _d[0], decimalPart = _d[1]; // 分离整数和小数部分
        var result = '';
        var len = integerPart.length;
        for (var i = 0; i < len; i++) {
            var currentNum = integerPart[i];
            if (i === 0 && currentNum === '-') {
                result = '负';
                continue;
            }
            var unitIndex = (len - 1 - i) % 4; // 单位
            var unitIndexLarge = Math.floor((len - 1 - i) / 4); // 大单位
            if (currentNum !== '0') {
                if (((i === 0 && currentNum === '1') || (i === 1 && integerPart[0] === '-' && currentNum === '1')) && unitIndex === 1 && !idealize) {
                    result += _numberCharUnit_[unitIndex];
                }
                else {
                    result += _numberChar_[+currentNum] + _numberCharUnit_[unitIndex];
                }
            }
            else if (i === len - 1 || integerPart[i + 1] !== '0') {
                result += _numberChar_[+currentNum];
            }
            if (unitIndex === 0 && currentNum !== '0') {
                result += numberCharUnitLarge[unitIndexLarge]; // 加上万、亿等单位
            }
        }
        result = filterCharZero(result);
        if (decimalPart && decimalPart !== '00') {
            var decimalResult = '';
            for (var i = 0; i < decimalPart.length; i++) {
                var currentDecimalNum = decimalPart[i];
                if (currentDecimalNum !== '0') {
                    decimalResult += _numberChar_[+currentDecimalNum];
                    if (currency) {
                        decimalResult += numberCharUnitDecimalCapital[i];
                    }
                }
                else {
                    decimalResult += '零';
                }
            }
            decimalResult = filterCharZero(decimalResult);
            if (currency) {
                if (result) {
                    result += _numberCharSplit_ + decimalResult;
                }
                else {
                    result = decimalResult;
                }
            }
            else {
                if (result) {
                    result += _numberCharSplit_ + decimalResult;
                }
                else {
                    result = _numberChar_[0] + _numberCharSplit_ + decimalResult;
                }
            }
        }
        else {
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
    var toNumber = function (value, precision, pure) {
        if (pure === void 0) { pure = false; }
        var __value__ = 0;
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
     * @param { Number } num - 需要格式化的数字
     * @return { String } 返回千分位格式化后的字符串
     */
    var formatThousands = function (value) {
        var num = Number(value);
        if (isNaN(num)) {
            return String(value);
        }
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    /**
     * 数字千分位反格式化
     * @param { String } formattedNum - 千分位格式化的字符串
     * @return { Number | string } 返回还原后的数字，如果无法还原则返回原字符串
     */
    var unformatThousands = function (formattedNum) {
        if (typeof formattedNum !== 'string') {
            return formattedNum;
        }
        var cleanedNum = formattedNum.replace(/,/g, '');
        var num = Number(cleanedNum);
        if (isNaN(num)) {
            return formattedNum;
        }
        return num;
    };

    /**
     ==================================================
     Object type data manipulation
     对象类型数据处理
     ==================================================
     */
    /**
     * 判断是否为空值
     * @param { * } value -任意类型值
     * @return { Boolean } 是否为空值
     * */
    var isEmpty = function (value) {
        return !value && value !== 0 || Array.isArray(value) && !value.length || value instanceof Object && !Object.keys(value).length;
    };
    /**
     * 判断是否为对象
     * @param { * } value 任意数据类型值
     * @return { Boolean } 返回是否为对象的布尔值
     */
    var isObject = function (value) { return typeof value === 'object' && value !== null && !Array.isArray(value); };

    /**
     ==================================================
     Character type data manipulation
     字符类型数据处理
     ==================================================
     */
    // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
    var _charts_ = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    /**
     * @param { Number } [digit = 1] - 随机字符串长度
     * @return { String } 返回指定长度随机字符串
     */
    var createRandomString = function (digit) {
        if (digit === void 0) { digit = 1; }
        var _digit_ = Number(digit);
        if (isNaN(_digit_) || _digit_ < 1) {
            return '';
        }
        var random = '';
        var len = _charts_.length;
        for (var i = 0; i < _digit_; i++) {
            random += _charts_.charAt(Math.floor(Math.random() * len));
        }
        return random;
    };
    /**
     * 字符串转全角
     * @param { String } content - 任意字符串
     * @return { String } 返回转全角后的字符串
     */
    var toDBC = function (content) {
        var _result_ = '';
        if (content === '') {
            return _result_;
        }
        for (var i = 0; i < content.length; i++) {
            if (content.charCodeAt(i) === 32) {
                _result_ = _result_ + String.fromCharCode(12288);
            }
            else if (content.charCodeAt(i) === 10) {
                _result_ = _result_ + String.fromCharCode(content.charCodeAt(i));
            }
            else if (content.charCodeAt(i) < 127) {
                _result_ = _result_ + String.fromCharCode(content.charCodeAt(i) + 65248);
            }
            else {
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
    var toSBC = function (content) {
        var _result_ = '';
        if (content === '') {
            return _result_;
        }
        for (var i = 0; i < content.length; i++) {
            if (content.charCodeAt(i) > 65280 && content.charCodeAt(i) < 65375) {
                _result_ += String.fromCharCode(content.charCodeAt(i) - 65248);
            }
            else if (content.charCodeAt(i) === 12288) {
                _result_ += String.fromCharCode(32);
            }
            else {
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
    var capitalize = function (content) { return content.charAt(0).toUpperCase() + content.slice(1); };
    /**
     * 字符串超出指定长度省略
     * @param { String } content - 输入文本内容
     * @param { Number } length - 指定字符串最大长度
     * @param { String } [suffix=……] - 超出部分替换内容
     * @return { String } 返回处理后的字符
     * */
    var ellipsis = function (content, length, suffix) {
        if (suffix === void 0) { suffix = '...'; }
        if (typeof content === 'undefined') {
            return content;
        }
        if (!isNaN(+length) && content.length > length) {
            return "".concat(content.slice(0, length - 1)).concat(suffix);
        }
        return content;
    };
    /**
     * 字符串按指定长度拆成数组
     * @param { String } content - 输入文本内容
     * @param { Number } length - 指定字符串最大长度
     * @return { String[] } 返回处理后的数组字符
     * */
    var splitStringByLength = function (content, length) {
        var result = [];
        var pos = 0;
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
    var validateContainsSpace = function (content) {
        return /\s/g.test(content);
    };
    /**
     * 验证邮箱
     * @param { String } email 邮箱
     * @return { Boolean } 返回验证结果
     * */
    var validateEmail = function (email) {
        var regexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexp.test(email);
    };
    /**
     * 验证手机号
     * @param { String } phoneNumber 手机号
     * @return { Boolean } 返回验证结果
     * */
    var validatePhone = function (phoneNumber) {
        var regexp = /^1\d{10}$/;
        return regexp.test(phoneNumber);
    };
    /**
     * 隐藏手机号信息
     * @param { String } phone 手机号
     * @return { String } 隐藏信息后的手机号
     * */
    var hidePhone = function (phone) {
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
    var validateTelephone = function (telephoneNumber) {
        var regexp = /^((\+\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/;
        return regexp.test(telephoneNumber);
    };
    /**
     * 身份证验证
     * @param { String } identification 身份证号
     * @return { Boolean } 返回验证结果
     * */
    var validateIdentification = function (identification) {
        if (typeof identification !== 'string' || identification === '') {
            return false;
        }
        // 身份证号码可能的前17位数字
        var num = identification.replace(/x|X/g, '10').slice(0, 17);
        // 校验码的权重（从左到右）
        var weight = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        // 校验码的字符集
        var checkCode = '10X98765432';
        // 计算校验码
        var sum = 0;
        for (var i = 0; i < 17; i++) {
            sum += num[i] * weight[i];
        }
        // 根据模11的结果得到校验码位置
        var mod = sum % 11;
        var check = checkCode[mod];
        // 替换身份证号码中的校验码
        var lastChar = identification.slice(-1);
        return check === lastChar && lastChar !== '0';
    };
    /**
     * 隐藏身份证号信息
     * @param { String } identification 身份证号
     * @param { Boolean } validate 是否验证身份证号
     * @return { String } 隐藏信息后的身份证号
     * */
    var hideIdentification = function (identification, validate) {
        if (typeof identification !== 'string' || identification === '') {
            return '';
        }
        if (validate && !validateIdentification(identification)) {
            return "".concat(identification, "(\u4F2A)");
        }
        return identification.replace(/^(.{4})(?:\d+)(.{4})$/, '$1******$2');
    };
    /**
     * 正则验证IP
     * @param { String } ip 任意字符串
     * @return { Boolean } 返回验证结果
     */
    var validateIP = function (ip) {
        var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        return reg.test(ip);
    };
    /**
     * 正则验证URL
     * @param { String } url 任意字符串
     * @return { Boolean } 返回是否为URL
     */
    var validateURL = function (url) {
        var _reg_exp_str_ = '^((https|http|ftp|rtsp|mms|itms-apps)?://)'
            + '(([0-9]{1,3}\.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
            + '|' // 允许IP和DOMAIN（域名）
            + '([0-9a-z_!~*\'()-]+\.)*' // 域名- www.
            + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.' // 二级域名
            + '[a-z]{2,6})' // first level domain- .com or .museum
            + '(:[0-9]{1,4})?' // 端口- :80
            + '((/?)|' // a slash isn't required if there is no file name
            + '(/\.+)+/?)$';
        var _regexp_ = new RegExp(_reg_exp_str_);
        return _regexp_.test(url);
    };
    /**
     * 从 URL 获取查询参数
     * @param { String } href 查询的地址
     * @return { Object } 查询参数对象
     * */
    var getUrlQuery = function (href) {
        if (href === void 0) { href = window.location.href; }
        var _a = href.split('#')[0], url = _a === void 0 ? '' : _a;
        var _b = url.split('?'), _c = _b[1], search = _c === void 0 ? '' : _c;
        var query = {};
        try {
            query = Object.fromEntries(new URLSearchParams(search));
        }
        catch (e) {
            console.warn(e);
            if (search) {
                query = JSON.parse('{"' +
                    decodeURI(search)
                        .replace(/"/g, '\"')
                        .replace(/&/g, '","')
                        .replace(/=/g, '":"') +
                    '"}');
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
    var setUrlQuery = function (href, data) {
        var _a = href.split('#'), url = _a[0], hash = _a[1];
        var path = url.split('?')[0];
        var originQuery = getUrlQuery(url);
        var query = [];
        if (data instanceof Object && !isEmpty(data)) {
            var params_1 = Object.assign(originQuery, data);
            Object.keys(params_1).map(function (key) {
                query.push("".concat(key, "=").concat(params_1[key]));
            });
        }
        var result = "".concat(path);
        if (query.length) {
            result += "?".concat(query.join('&'));
        }
        if (hash) {
            result += "#".concat(hash);
        }
        return result;
    };
    var plateNumberReg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
    var plateNumberNEVReg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
    /**
     * 验证车牌号
     * @param { String } plateNumber 车牌号
     * @return { Boolean } 返回验证结果
     * */
    var validatePlateNumber = function (plateNumber) {
        if (plateNumber.length === 7) {
            return plateNumberReg.test(plateNumber);
        }
        else if (plateNumber.length === 8) {
            return plateNumberNEVReg.test(plateNumber);
        }
        else {
            return false;
        }
    };
    /**
     * 获取文件后缀
     * @param { string } filePath - 文件路径
     * @return { string } - 返回后缀名
     * */
    var getFileSuffix = function (filePath) {
        var suffix = '';
        var index = filePath.lastIndexOf('.');
        if (index > -1) {
            suffix = filePath.slice(index + 1);
        }
        return suffix;
    };

    /**
     ==================================================
     Array type data manipulation
     数组类型数据处理
     ==================================================
     */
    /**
     * 打乱数组顺序
     * @param { Array } value - 任意类型项的数组
     * @return { Array } 打乱顺序后的数组
     * */
    var shuffleArray = function (value) { return value.sort(function () { return 0.5 - Math.random(); }); };
    /**
     * 过滤树状数据
     * @param { Array } data 数据
     * @param { String } keyword 关键字
     * @param { Array } attrs 检索属性
     * @param { Object } props 数据结构
     * @return { Array } 返回过滤后数据
     * */
    var getTreeFilter = function (data, keyword, attrs, props) {
        if (attrs === void 0) { attrs = ['label', 'value']; }
        if (props === void 0) { props = { label: 'label', value: 'value', children: 'children' }; }
        var result = [];
        data.map(function (item) {
            for (var i = 0, len = attrs.length; i < len; i++) {
                var key = attrs[i];
                if (item.hasOwnProperty(key)) {
                    if (item[key] && item[key].indexOf(keyword) !== -1) {
                        result.push(item);
                        break;
                    }
                    else {
                        if (item[props['children']] && item[props['children']].length > 0) {
                            var children = getTreeFilter(item[props['children']], keyword);
                            if (children && children.length > 0) {
                                item[props['children']] = children;
                                result.push(item);
                                break;
                            }
                        }
                    }
                }
            }
        });
        return result;
    };

    /**
     ==================================================
     Date time type data manipulation
     日期时间类型数据处理
     ==================================================
     */
    var millisecondInDay = 86400000;
    /**
     * 检查日期是否合法
     * @param { * } date - 检查日期
     * @return { Boolean } 是否为合法日期
     * */
    var validateDate = function (date) {
        var __date__ = new Date(date);
        return !isNaN(__date__.getTime());
    };
    /**
     * 查询年份是否为闰年
     * @param { Number } year - 查询年份
     * @return { Boolean } 返回是否为闰年
     * */
    var isLeap = function (year) { return (year % 4) === 0 && (year % 100) !== 0 || (year % 400) === 0; };
    /**
     * 查询月份天数
     * @param { Number } year - 查询年份
     * @param { Number } month - 查询月份
     * @return { Number } 月份天数
     * */
    var daysInMonth = function (year, month) {
        return new Date(year, month + 1, 0).getDate();
    };
    /**
     * 查询年份天数
     * @param { Number } year - 查询年份
     * @return { Number } 年份天数
     * */
    var daysInYear = function (year) {
        var _days_ = 365;
        var _year_ = year || new Date().getFullYear();
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
    var dayIndex = function (date) {
        var _date_full_ = new Date(date);
        var _date_year_ = new Date(_date_full_.getFullYear().toString());
        var _date_index_ = (_date_full_ - _date_year_) / millisecondInDay;
        return Math.ceil(_date_index_) + 1;
    };
    /**
     * 计算母亲节日期
     * @param { Date | String | Number } year - 开始时间
     * @return { Object | null } 返回五月的第二个星期日
     */
    var getMothersDay = function (year) {
        var date = new Date(year, 4, 1);
        date.setDate(1 + ((7 - date.getDay()) % 7) + 7);
        return date;
    };
    /**
     * 计算父亲节日期
     * @param { Date | String | Number } year - 开始时间
     * @return { Object | null } 返回六月的第三个星期日
     */
    var getFathersDay = function (year) {
        var date = new Date(year, 5, 1);
        date.setDate(1 + ((7 - date.getDay()) % 7) + 14);
        return date;
    };
    var formatSecondsResultDefault = function (day, hour, minute, second) {
        var result = '';
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
    var formatSeconds = function (value, formatter) {
        try {
            //  秒
            var second = Math.ceil(value);
            //  分
            var minute = 0;
            //  小时
            var hour = 0;
            //  天
            var day = 0;
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
            var factory = formatSecondsResultDefault;
            if (typeof formatter === 'function') {
                factory = formatter;
            }
            return factory(day, hour, minute, second);
        }
        catch (error) {
            console.warn(error);
            return value;
        }
    };

    /**
     ==================================================
     Color value processing
     颜色类型值处理
     ==================================================
     */
    /**
     * RGB颜色转十六进制
     * @param { Number | String } a1 - 红色
     * @param { Number } a2 - 绿色
     * @param { Number } a3 - 蓝色
     * @param { Number } a4 - 透明度
     * @return { String } 十六进制颜色值
     * */
    var rgbToHex = function (a1, a2, a3, a4) {
        var hex = '#';
        var rgb = [0, 0, 0];
        if (typeof a1 === 'string' && a1 !== '') {
            if (!(/^(rgba?|RGBA?)\(.+\)$/.test(a1))) {
                throw new Error('参数不是合法颜色值');
            }
            var hex_1 = a1.replace(/(?:\(|\)|rgba?|RGBA?)*/g, '').split(',');
            hex_1.map(function (d, i) { return rgb[i] = +d; });
        }
        else {
            if (typeof a1 === 'number') {
                rgb[0] = a1;
            }
            if (typeof a2 === 'number') {
                rgb[1] = a2;
            }
            if (typeof a3 === 'number') {
                rgb[2] = a3;
            }
            if (typeof a4 === 'number') {
                rgb[3] = a4;
            }
        }
        rgb
            .map(function (d, i) {
            var max = i < 3 ? 255 : 1;
            return Math.max(0, d, Math.min(d, max));
        })
            .map(function (d, i) {
            if (i > 2) {
                d = Math.round(255 * d);
            }
            var item = d.toString(16);
            if (d < 16) {
                item = '0' + item;
            }
            hex += item;
        });
        return hex;
    };
    /**
     * 生成随机十六进制颜色
     * @return { String } 十六进制颜色值
     * */
    var createRandomColorHex = function () { return "#".concat(Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0')); };

    /**
     ==================================================
     BOM data manipulation
     元素类型处理
     ==================================================
     */
    /**
     * 获取元素offset top
     * @param { HTMLElement } ele 目标DOM元素
     * @param { Number } offset 干预值
     * @return { Number } 返回元素偏移值
     * */
    var getElementOffsetTop = function (ele, offset) {
        if (offset === void 0) { offset = 0; }
        var self = ele;
        var offsetTop = self.offsetTop;
        var parent = self['offsetParent'];
        while (parent) {
            offsetTop += parent['offsetTop'];
            parent = parent['offsetParent'];
        }
        return offsetTop + offset;
    };
    /**
     * 获取元素offset left
     * @param { HTMLElement } ele 目标DOM元素
     * @param { Number } offset 干预值
     * @return { Number } 返回元素偏移值
     * */
    var getElementOffsetLeft = function (ele, offset) {
        if (offset === void 0) { offset = 0; }
        var self = ele;
        var offsetLeft = self.offsetLeft;
        var parent = self['offsetParent'];
        while (parent) {
            offsetLeft += parent['offsetLeft'];
            parent = parent['offsetParent'];
        }
        return offsetLeft + offset;
    };
    /**
     * 跳转到window滚动条指定位置
     * @param { Number } x 横向滚动条位置
     * @param { Number } y 纵向滚动条位置
     * */
    var scrollTo = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        return window.scrollTo(x, y);
    };
    /**
     * 获取用户选择的文本
     * @return { Number } 用户选择的文本
     * */
    var getSelectedText = function () {
        var selected = window.getSelection();
        if (selected) {
            return selected.toString();
        }
    };
    var scrollBarWidth;
    /**
     * 获取浏览器滚动条宽度
     * @return { Number } 滚动条宽度
     * */
    var getScrollBarWidth = function () {
        if (scrollBarWidth !== undefined)
            return scrollBarWidth;
        var outer = document.createElement('div');
        outer.className = 'el-scrollbar__wrap';
        outer.style.visibility = 'hidden';
        outer.style.width = '100px';
        outer.style.position = 'absolute';
        outer.style.top = '-9999px';
        document.body.appendChild(outer);
        var widthNoScroll = outer.offsetWidth;
        outer.style.overflow = 'scroll';
        var inner = document.createElement('div');
        inner.style.width = '100%';
        outer.appendChild(inner);
        var widthWithScroll = inner.offsetWidth;
        outer.parentNode.removeChild(outer);
        scrollBarWidth = widthNoScroll - widthWithScroll;
        return scrollBarWidth;
    };
    /**
     * 获取浏览器窗口的尺寸
     * @return { Object } 浏览器窗口的尺寸
     * */
    var getClientSize = function () {
        var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        return { width: width, height: height };
    };
    /**
     * 获取范围内的元素位置
     * @param { Number[] } range 限制范围
     * @param { Number[] } area 子元素大小
     * @param { Number } left 点位横坐标
     * @param { Number } top 点位纵坐标
     * @param { Number } [point = 0] 点的大小
     * @return { Object } 返回值说明
     * */
    var getElementPositionWithinRange = function (range, area, left, top, point) {
        if (point === void 0) { point = 0; }
        var itmX = left;
        var itmY = top + point / 2;
        var minY = range[1] - area[1];
        var x = Math.max(0, Math.min(itmX - area[0] / 2, range[0] - area[0]));
        var y = Math.max(0, Math.min(minY, itmY - (itmY > minY ? point + area[1] : 0)));
        return { x: x, y: y };
    };
    /**
     * 下载文件
     * @param { String } filePath 文件路径
     * @param { String } fileName 文件名
     * */
    var downloadFile = function (filePath, fileName) {
        return new Promise(function (resolve, reject) {
            if (!filePath) {
                reject('文件路径不正确');
                return;
            }
            if (fileName) {
                var downloadLink = document.createElement('a');
                downloadLink.style.display = 'none';
                downloadLink.setAttribute('download', fileName);
                downloadLink.setAttribute('href', filePath);
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                resolve();
            }
            else {
                window.location.href = filePath;
                resolve();
            }
        });
    };

    /**
     * 浏览器进入全屏模式
     * */
    var requestFullscreen = function (el) {
        if (el === void 0) { el = document.documentElement; }
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (rfs) {
            rfs.call(el);
        }
        else if (typeof window.ActiveXObject !== 'undefined') {
            var ws = new ActiveXObject('WScript.Shell');
            if (ws != null) {
                ws.SendKeys('{F11}');
            }
        }
    };
    /**
     * 浏览器退出全屏模式
     * */
    var exitFullscreen = function () {
        var el = document;
        var cfs = el.cancelFullScreen || el.mozCancelFullScreen || el.msExitFullscreen || el.webkitExitFullscreen || el.exitFullscreen;
        if (cfs) {
            cfs.call(el);
        }
        else if (typeof window.ActiveXObject !== 'undefined') {
            var ws = new ActiveXObject('WScript.Shell');
            if (ws != null) {
                ws.SendKeys('{F11}');
            }
        }
    };
    /**
     * 判断浏览器全屏状态
     * @return { Boolean } 返回是否为全屏状态
     * */
    var isFullscreen = function () { return Math.abs(window.screen.height - window.document.documentElement.clientHeight) <= getScrollBarWidth(); };
    /**
     * 判断是否为桌面系统
     * @return { Boolean } 返回是否为桌面系统
     * */
    var isDesktopSystem = function () {
        var userAgentInfo = navigator.userAgent;
        var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    };
    /**
     * 获取浏览器信息
     * @return { Object | null } 返回客户端信息
     * */
    var getBrowser = function () {
        var global = window;
        if (!global) {
            return null;
        }
        var document = global.document;
        var agent = global.navigator.userAgent.toLowerCase();
        //IE8+支持.返回浏览器渲染当前文档所用的模式
        //IE6,IE7:undefined.IE8:8(兼容模式返回7).IE9:9(兼容模式返回7||8)
        //IE10:10(兼容模式7||8||9)
        var IEMode = document.documentMode;
        //chrome
        var chrome = global.chrome || false;
        var System = {
            //user-agent
            agent: agent,
            //是否为IE
            isIE: /msie/.test(agent) || agent.indexOf('rv:11.0') > -1,
            //Gecko内核
            isGecko: agent.indexOf('gecko') > 0 && agent.indexOf('like gecko') < 0,
            //webkit内核
            isWebkit: agent.indexOf('webkit') > 0,
            //是否为标准模式
            isStrict: document.compatMode === 'CSS1Compat',
            //是否支持subtitle
            supportSubTitle: function () {
                return 'track' in document.createElement('track');
            },
            //是否支持scoped
            supportScope: function () {
                return 'scoped' in document.createElement('style');
            },
            //获取IE的版本号
            ieVersion: function () {
                try {
                    return agent.match(/msie ([\d.]+)/)[1] || (agent.indexOf('rv:11.0') > -1 ? '11.0' : 0);
                }
                catch (e) {
                    console.warn('ieVersion catch', e);
                    return IEMode;
                }
            },
            //Opera版本号
            operaVersion: function () {
                try {
                    if (global.opera) {
                        return agent.match(/opera.([\d.]+)/)[1];
                    }
                    else if (agent.indexOf('opr') > 0) {
                        return agent.match(/opr\/([\d.]+)/)[1];
                    }
                }
                catch (e) {
                    console.warn('operaVersion catch', e);
                    return 0;
                }
            },
            //描述:version过滤.如31.0.252.152 只保留31.0
            versionFilter: function () {
                if (arguments.length === 1 && typeof arguments[0] === 'string') {
                    var version = arguments[0];
                    var start = version.indexOf('.');
                    if (start > 0) {
                        var end = version.indexOf('.', start + 1);
                        if (end !== -1) {
                            return version.substr(0, end);
                        }
                    }
                    return version;
                }
                else if (arguments.length === 1) {
                    return arguments[0];
                }
                return 0;
            }
        };
        try {
            //浏览器类型(IE、Opera、Chrome、Safari、Firefox)
            System.type = System.isIE ? 'IE' :
                global.opera || (agent.indexOf('opr') > 0) ? 'Opera' :
                    (agent.indexOf('chrome') > 0) ? 'Chrome' :
                        //safari也提供了专门的判定方式
                        global.openDatabase ? 'Safari' :
                            (agent.indexOf('firefox') > 0) ? 'Firefox' :
                                'unknown';
            //版本号
            System.version = (System.type === 'IE') ? System.ieVersion() :
                (System.type === 'Firefox') ? agent.match(/firefox\/([\d.]+)/)[1] :
                    (System.type === 'Chrome') ? agent.match(/chrome\/([\d.]+)/)[1] :
                        (System.type === 'Opera') ? System.operaVersion() :
                            (System.type === 'Safari') ? agent.match(/version\/([\d.]+)/)[1] :
                                '0';
            //浏览器外壳
            System.shell = function () {
                //遨游浏览器
                if (agent.indexOf('maxthon') > 0) {
                    System.version = agent.match(/maxthon\/([\d.]+)/)[1] || System.version;
                    return '傲游浏览器';
                }
                //QQ浏览器
                if (agent.indexOf('qqbrowser') > 0) {
                    System.version = agent.match(/qqbrowser\/([\d.]+)/)[1] || System.version;
                    return 'QQ浏览器';
                }
                //搜狗浏览器
                if (agent.indexOf('se 2.x') > 0) {
                    return '搜狗浏览器';
                }
                //Chrome:也可以使用global.chrome && global.chrome.webstore判断
                if (chrome && System.type !== 'Opera') {
                    var external_1 = global.external, clientInfo = global.clientInformation, 
                    //客户端语言:zh-cn,zh.360下面会返回undefined
                    clientLanguage = clientInfo.languages;
                    //猎豹浏览器:或者agent.indexOf("lbbrowser")>0
                    if (external_1 && 'LiebaoGetVersion' in external_1) {
                        return '猎豹浏览器';
                    }
                    //百度浏览器
                    if (agent.indexOf('bidubrowser') > 0) {
                        System.version = agent.match(/bidubrowser\/([\d.]+)/)[1] ||
                            agent.match(/chrome\/([\d.]+)/)[1];
                        return '百度浏览器';
                    }
                    //360极速浏览器和360安全浏览器
                    if (System.supportSubTitle() && typeof clientLanguage === 'undefined') {
                        //object.key()返回一个数组.包含可枚举属性和方法名称
                        var storeKeyLen = Object.keys(chrome.webstore).length, v8Locale = 'v8Locale' in global;
                        return storeKeyLen > 1 ? '360极速浏览器' : '360安全浏览器';
                    }
                    return 'Chrome';
                }
                return System.type;
            };
            //浏览器名称(如果是壳浏览器,则返回壳名称)
            System.name = System.shell();
            //对版本号进行过滤过处理
            System.version = System.versionFilter(System.version);
        }
        catch (e) {
            console.warn('getBrowser catch', e);
        }
        return {
            client: System
        };
    };

    /**
     * 设备坐标归一化
     * 坐标转换 0~n 转换成 -1~1
     * @param { Number } x - 原坐标x
     * @param { Number } y - 原坐标y
     * @param { Number } width - 原坐标y
     * @param { Number } height - 原坐标y
     * @return { Array } 旋转后坐标
     * */
    var deviceCoordinateToNormalized = function (x, y, width, height) {
        return [(x / width * 2) - 1, 1 - (y / height * 2)];
    };
    /**
     * 设备坐标转卡迪尔坐标
     * 坐标转换 0~n 转换成 -1~1
     * @param { Number } x - 原坐标x
     * @param { Number } y - 原坐标y
     * @param { Number } width - 原坐标y
     * @param { Number } height - 原坐标y
     * @return { Array } 旋转后坐标
     * */
    var deviceCoordinateToCartesian = function (x, y, width, height) {
        return [x - width / 2, -(y - height / 2)];
    };
    /**
     * 2D坐标距离
     * @param { Object } o - 原点
     * @param { Object } t - 目标点
     * @return { Number } 旋转后坐标
     * */
    var distance2 = function (o, t) {
        var dx = o.x - t.x;
        var dy = o.y - t.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    /**
     * 2D坐标旋转任意弧度
     * @param { Number } x - 原坐标x
     * @param { Number } y - 原坐标y
     * @param { Number } rad - 任意弧度值
     * @return { Array } 旋转后坐标
     * */
    var rotateRad = function (x, y, rad) {
        return [x * Math.cos(rad) - y * Math.sin(rad), x * Math.sin(rad) + y * Math.cos(rad)];
    };
    /**
     * 2D坐标原点为中心旋转任意角度
     * @param { Number } x - 原坐标x
     * @param { Number } y - 原坐标y
     * @param { Number } deg - 任意角度
     * @return { Array } 旋转后坐标
     * */
    var rotateDeg = function (x, y, deg) {
        return rotateRad(x, y, Math.PI / 180 * deg);
    };
    /**
     * 2D坐标原点为中心旋转180度
     * @param { Number } x - 原坐标x
     * @param { Number } y - 原坐标y
     * @return { Array } 旋转后坐标
     * */
    var rotate180 = function (x, y) {
        return [-x, -y];
    };
    /**
     * 2D坐标原点为中心顺时针旋转90度
     * @param { Number } x - 原坐标x
     * @param { Number } y - 原坐标y
     * @return { Array } 旋转后坐标
     * */
    var rotate90D = function (x, y) {
        return [-y, x];
    };
    /**
     * 2D坐标原点为中心逆时针旋转90度
     * @param { Number } x - 原坐标x
     * @param { Number } y - 原坐标y
     * @return { Array } 旋转后坐标
     * */
    var rotate90DC = function (x, y) {
        return [y, -x];
    };
    /**
     * 2D坐标原点为中心顺时针旋转45度
     * @param { Number } x - 原坐标x
     * @param { Number } y - 原坐标y
     * @return { Array } 旋转后坐标
     * */
    var rotate45D = function (x, y) {
        return [(x * Math.sqrt(2) / 2) - (y * Math.sqrt(2) / 2), (x * Math.sqrt(2) / 2) + (y * Math.sqrt(2) / 2)];
    };
    /**
     * 2D坐标原点为中心逆时针旋转45度
     * @param { Number } x - 原坐标x
     * @param { Number } y - 原坐标y
     * @return { Array } 旋转后坐标
     * */
    var rotate45DC = function (x, y) {
        return [(x * Math.sqrt(2) / 2) + (y * Math.sqrt(2) / 2), -(x * Math.sqrt(2) / 2) + (y * Math.sqrt(2) / 2)];
    };
    /**
     * 2D坐标判断在围栏中
     * @param { Number } x - 原坐标x
     * @param { Number } y - 原坐标y
     * @param { Array } vertexes - 围栏范围坐标
     * @return { Boolean } 是否在围栏中
     * */
    var isInside = function (x, y, vertexes) {
        var intersections = 0;
        var length = vertexes.length;
        for (var i = 0; i < length; i++) {
            var c = vertexes[i];
            var n = vertexes[(i + 1) % length];
            var cx = c[0];
            var cy = c[1];
            var nx = n[0];
            var ny = n[1];
            if ((cy > y) !== (ny > y) && x < (nx - cx) * (y - cy) / (ny - cy) + cx) {
                intersections++;
            }
        }
        return intersections % 2 === 1;
        /*
        let intersectCount = 0;

        for (let i = 0; i < vertexes.length - 1; i++) {

            let x1 = vertexes[ i ][ 0 ];
            let y1 = vertexes[ i ][ 1 ];
            let x2 = vertexes[ i + 1 ][ 0 ];
            let y2 = vertexes[ i + 1 ][ 1 ];

            if ((y1 <= y && y < y2) || (y2 <= y && y < y1)) {
                // 计算交点的x坐标
                let xIntersect = (x1 + (y - y1) * (x2 - x1) / (y2 - y1));

                if (xIntersect <= x) {
                    intersectCount++;
                }
            }
        }

        return intersectCount % 2 === 1;
        */
        /*
        let intersect = false;

        for (let i = 0, j = vertexes.length - 1; i < vertexes.length; j = i++) {

            let xi = vertexes[ i ][ 0 ], yi = vertexes[ i ][ 1 ];
            let xj = vertexes[ j ][ 0 ], yj = vertexes[ j ][ 1 ];

            let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

            if (intersect) {
                intersect = !intersect;
            }
        }

        return intersect;
        */
    };
    /**
     * 2D坐标获取中心点
     * @param { Array } vertexes - 坐标列表
     * @return { Array } 中心坐标
     * */
    var getCenter = function (vertexes) {
        var _a = [
            vertexes[0][0], vertexes[0][0],
            vertexes[0][1], vertexes[0][1]
        ], minX = _a[0], maxX = _a[1], minY = _a[2], maxY = _a[3];
        for (var i = 1; i < vertexes.length; i++) {
            var _b = vertexes[i], x = _b[0], y = _b[1];
            minX = x < minX ? x : minX;
            maxX = x > maxX ? x : maxX;
            minY = y < minY ? y : minY;
            maxY = y > maxY ? y : maxY;
        }
        return [(minX + maxX) * 0.5, (minY + maxY) * 0.5];
    };

    exports.capitalize = capitalize;
    exports.createRandomColorHex = createRandomColorHex;
    exports.createRandomNumber = createRandomNumber;
    exports.createRandomNumberRange = createRandomNumberRange;
    exports.createRandomString = createRandomString;
    exports.dayIndex = dayIndex;
    exports.daysInMonth = daysInMonth;
    exports.daysInYear = daysInYear;
    exports.deviceCoordinateToCartesian = deviceCoordinateToCartesian;
    exports.deviceCoordinateToNormalized = deviceCoordinateToNormalized;
    exports.distance2 = distance2;
    exports.downloadFile = downloadFile;
    exports.ellipsis = ellipsis;
    exports.exitFullscreen = exitFullscreen;
    exports.formatSeconds = formatSeconds;
    exports.formatThousands = formatThousands;
    exports.getBrowser = getBrowser;
    exports.getCenter = getCenter;
    exports.getClientSize = getClientSize;
    exports.getElementOffsetLeft = getElementOffsetLeft;
    exports.getElementOffsetTop = getElementOffsetTop;
    exports.getElementPositionWithinRange = getElementPositionWithinRange;
    exports.getFathersDay = getFathersDay;
    exports.getFileSuffix = getFileSuffix;
    exports.getMothersDay = getMothersDay;
    exports.getScrollBarWidth = getScrollBarWidth;
    exports.getSelectedText = getSelectedText;
    exports.getTreeFilter = getTreeFilter;
    exports.getUrlQuery = getUrlQuery;
    exports.hideIdentification = hideIdentification;
    exports.hidePhone = hidePhone;
    exports.isDesktopSystem = isDesktopSystem;
    exports.isEmpty = isEmpty;
    exports.isFullscreen = isFullscreen;
    exports.isInside = isInside;
    exports.isLeap = isLeap;
    exports.isObject = isObject;
    exports.localizeNumber = localizeNumber;
    exports.millisecondInDay = millisecondInDay;
    exports.plateNumberNEVReg = plateNumberNEVReg;
    exports.plateNumberReg = plateNumberReg;
    exports.requestFullscreen = requestFullscreen;
    exports.rgbToHex = rgbToHex;
    exports.rotate180 = rotate180;
    exports.rotate45D = rotate45D;
    exports.rotate45DC = rotate45DC;
    exports.rotate90D = rotate90D;
    exports.rotate90DC = rotate90DC;
    exports.rotateDeg = rotateDeg;
    exports.rotateRad = rotateRad;
    exports.scrollTo = scrollTo;
    exports.setUrlQuery = setUrlQuery;
    exports.shuffleArray = shuffleArray;
    exports.splitStringByLength = splitStringByLength;
    exports.toDBC = toDBC;
    exports.toNumber = toNumber;
    exports.toSBC = toSBC;
    exports.unformatThousands = unformatThousands;
    exports.validateContainsSpace = validateContainsSpace;
    exports.validateDate = validateDate;
    exports.validateEmail = validateEmail;
    exports.validateIP = validateIP;
    exports.validateIdentification = validateIdentification;
    exports.validatePhone = validatePhone;
    exports.validatePlateNumber = validatePlateNumber;
    exports.validateTelephone = validateTelephone;
    exports.validateURL = validateURL;

}));
