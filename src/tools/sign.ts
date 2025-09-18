/**
 ==================================================
 Request signature parameter processing
 请求签名参数处理
 ==================================================
 */

import Md5 from 'md5';
import { AnyData, AnyParams, ToolsSignFormatOptions, ToolsSignFormatProp } from '@/types';
import { createRandomNumber } from '@/utils';

export interface LicenseConfig {
    PLATFORM: string,
    VERSION: string,
    SALT: string
}

const configDefault = {
    token: false,
    payload: false,
    offset: 0,
    debug: false
};

const propDefault = {
    token: 'token'
};

/**
 * 创建签名
 * @param { Object } params 包含公共参数的请求参数对象
 * @param { ?Object } license 签名信息
 * @param { ?Boolean } debugging 是否开启调试模式
 * @return { String } 返回签名字符串
 * */

export const createSign = (license: LicenseConfig, params: any = {}, debugging: boolean = false): string => {
    const keys = Object.keys(params).sort((a, b) => {
        return a > b ? 1 : -1;
    });

    const KEYS = keys.reduce((cur, nxt) => `${ cur }${ nxt }${ params[ nxt ] }`, '');
    const { SALT } = license;
    const SIGN = `${ KEYS }${ SALT }`;

    if (debugging) {
        console.group('<<< sign >>>')
        console.log('Params：', JSON.stringify(params));
        console.log('Keys：', KEYS);
        console.log('Salt：', SALT);
        console.log('Result：', Md5(SIGN).toLocaleUpperCase());
        console.groupEnd()
    }

    return Md5(SIGN).toLocaleUpperCase();
};

/**
 * 通过请求参数对象生成签名对象
 * @param { Object } license 签名信息
 * @param { Object } data 请求参数对象
 * @param { Object } options 请求配置
 * @param { Boolean } options.token 签名是否包含token
 * @param { Boolean } options.payload 签名是否包含请求参数
 * @param { Number } options.offset 时间戳偏移量
 * @param { Boolean } options.debugging 是否开启调试模式
 * @param { Object } prop 配置选项
 * @param { String } prop.token 配置选项:token字段名称
 * @return { Object } 返回签名参数对象
 * */
export const signFormat = (license: LicenseConfig, data: AnyData, options: ToolsSignFormatOptions = configDefault, prop: ToolsSignFormatProp = propDefault): AnyParams => {

    if (!license) {
        return data;
    }

    const { PLATFORM: platform, VERSION: version } = license;

    if (!platform || !version) {
        return data;
    }

    const { token = false, payload = false, offset = 0 } = options;
    const { token: fieldToken } = prop;
    const nonce = createRandomNumber(4);

    let timestamp = Math.floor(new Date().getTime() / 1000);

    if (typeof offset !== 'undefined') {
        timestamp += offset;
    }

    const params: any = { platform, timestamp, nonce, version };

    if (payload) {
        Object.assign(params, data);
    }

    if (token && data && fieldToken && typeof data[ fieldToken ] === 'string') {
        params[ fieldToken ] = data[ fieldToken ];
    }

    const sign = createSign(license, params, options.debug);

    return { ...data, ...params, sign };
};
