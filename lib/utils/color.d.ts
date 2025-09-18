/**
 ==================================================
 Color value processing
 颜色类型值处理
 ==================================================
 */
interface rgbToHex {
    (reb?: number, green?: number, blue?: number, alpha?: number): string;
    (rgb?: string): string;
}
/**
 * RGB颜色转十六进制
 * @param { Number | String } a1 - 红色
 * @param { Number } a2 - 绿色
 * @param { Number } a3 - 蓝色
 * @param { Number } a4 - 透明度
 * @return { String } 十六进制颜色值
 * */
export declare const rgbToHex: rgbToHex;
/**
 * 生成随机十六进制颜色
 * @return { String } 十六进制颜色值
 * */
export declare const createRandomColorHex: () => string;
export {};
