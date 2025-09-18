/**
 ==================================================
 Request signature parameter processing
 请求签名参数处理
 ==================================================
 */
import { AnyData, AnyParams, ToolsSignFormatOptions, ToolsSignFormatProp } from '@/types';
export interface LicenseConfig {
    PLATFORM: string;
    VERSION: string;
    SALT: string;
}
/**
 * 创建签名
 * @param { Object } params 包含公共参数的请求参数对象
 * @param { ?Object } license 签名信息
 * @param { ?Boolean } debugging 是否开启调试模式
 * @return { String } 返回签名字符串
 * */
export declare const createSign: (license: LicenseConfig, params?: any, debugging?: boolean) => string;
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
export declare const signFormat: (license: LicenseConfig, data: AnyData, options?: ToolsSignFormatOptions, prop?: ToolsSignFormatProp) => AnyParams;
