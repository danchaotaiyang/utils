/**
 * @param { Number } [digit = 1] - 随机字符串长度
 * @return { String } 返回指定长度随机字符串
 */
export declare const createRandomString: (digit?: number) => string;
/**
 * 字符串转全角
 * @param { String } content - 任意字符串
 * @return { String } 返回转全角后的字符串
 */
export declare const toDBC: (content: string) => string;
/**
 * 字符串转半角
 * @param { String } content - 任意字符串
 * @return { String } 返回转半角后的字符串
 */
export declare const toSBC: (content: string) => string;
/**
 * 英文字符串首字母大写
 * @param { String } content - 英文字符串
 * @return { String } 首字母大写字符串
 * */
export declare const capitalize: (content: string) => string;
/**
 * 字符串超出指定长度省略
 * @param { String } content - 输入文本内容
 * @param { Number } length - 指定字符串最大长度
 * @param { String } [suffix=……] - 超出部分替换内容
 * @return { String } 返回处理后的字符
 * */
export declare const ellipsis: (content: string, length: number, suffix?: string) => string;
/**
 * 字符串按指定长度拆成数组
 * @param { String } content - 输入文本内容
 * @param { Number } length - 指定字符串最大长度
 * @return { String[] } 返回处理后的数组字符
 * */
export declare const splitStringByLength: (content: string, length: number) => string[];
/**
 * 字符串是否包含空格
 * @param { String } content - 输入文本内容
 * @return { Boolean } 返回是否包含空格
 * */
export declare const validateContainsSpace: (content: string) => boolean;
/**
 * 验证邮箱
 * @param { String } email 邮箱
 * @return { Boolean } 返回验证结果
 * */
export declare const validateEmail: (email: string) => boolean;
/**
 * 验证手机号
 * @param { String } phoneNumber 手机号
 * @return { Boolean } 返回验证结果
 * */
export declare const validatePhone: (phoneNumber: any) => boolean;
/**
 * 隐藏手机号信息
 * @param { String } phone 手机号
 * @return { String } 隐藏信息后的手机号
 * */
export declare const hidePhone: (phone: any) => string;
/**
 * 验证电话号
 * @param { String } telephoneNumber 手机号
 * @return { Boolean } 是否为有效手机号
 * */
export declare const validateTelephone: (telephoneNumber: string) => boolean;
/**
 * 身份证验证
 * @param { String } identification 身份证号
 * @return { Boolean } 返回验证结果
 * */
export declare const validateIdentification: (identification: any) => boolean;
/**
 * 隐藏身份证号信息
 * @param { String } identification 身份证号
 * @param { Boolean } validate 是否验证身份证号
 * @return { String } 隐藏信息后的身份证号
 * */
export declare const hideIdentification: (identification: any, validate?: boolean) => string;
/**
 * 正则验证IP
 * @param { String } ip 任意字符串
 * @return { Boolean } 返回验证结果
 */
export declare const validateIP: (ip: string) => boolean;
/**
 * 正则验证URL
 * @param { String } url 任意字符串
 * @return { Boolean } 返回是否为URL
 */
export declare const validateURL: (url: string) => boolean;
/**
 * 从 URL 获取查询参数
 * @param { String } href 查询的地址
 * @return { Object } 查询参数对象
 * */
export declare const getUrlQuery: (href?: string) => any;
/**
 * 设置 URL 查询参数
 * @param { String } href - 地址
 * @param { Object } data - 查询参数
 * @return { String } 带参url
 * */
export declare const setUrlQuery: (href: string, data: any) => string;
export declare const plateNumberReg: RegExp;
export declare const plateNumberNEVReg: RegExp;
/**
 * 验证车牌号
 * @param { String } plateNumber 车牌号
 * @return { Boolean } 返回验证结果
 * */
export declare const validatePlateNumber: (plateNumber: string) => boolean;
/**
 * 获取文件后缀
 * @param { string } filePath - 文件路径
 * @return { string } - 返回后缀名
 * */
export declare const getFileSuffix: (filePath: string) => string;
