/**
 ==================================================
 Business method tools
 业务方法工具
 ==================================================
 */
/**
 * 过滤正确单位值
 * @param { string } value 值
 * @param { string } [normal = px] 默认单位
 * @return { string } 返回正确单位值
 * */
export declare const unitMatch: (value: string, normal?: string) => string;
/**
 * 清除对象属性值中字符串的首尾空格
 * @param { * } data - 参数说明
 * @return { * } 清理后的值
 * */
export declare const trimParams: (data: any) => any;
/**
 * 存储容量转换
 * @param { Number } value - 原字节值
 * @param { Number } fixed - 保留原值精度
 * @return { String } 结果
 * */
export declare const formatByte: (value: number, fixed?: number) => string;
interface iLocation {
    x: number;
    y: number;
    x2: number;
    y2: number;
}
/**
 * 线性渐变起止方向的计算方法
 *
 * @param { Number } startArc 开始角度
 * @param { Number } endArc 结束角度
 * @returns 四个坐标 x,y,x2,y2
 */
export declare const getGradientCoordinates: (startArc: number, endArc: number) => iLocation;
/**
 * 延迟等待
 *
 * @param { Number } [time = 32] 等待时间
 */
export declare const waiting: (time?: number) => Promise<void>;
export {};
