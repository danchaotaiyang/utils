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
export declare const getElementOffsetTop: (ele: HTMLElement, offset?: number) => number;
/**
 * 获取元素offset left
 * @param { HTMLElement } ele 目标DOM元素
 * @param { Number } offset 干预值
 * @return { Number } 返回元素偏移值
 * */
export declare const getElementOffsetLeft: (ele: HTMLElement, offset?: number) => number;
/**
 * 跳转到window滚动条指定位置
 * @param { Number } x 横向滚动条位置
 * @param { Number } y 纵向滚动条位置
 * */
export declare const scrollTo: (x?: number, y?: number) => void;
/**
 * 获取用户选择的文本
 * @return { Number } 用户选择的文本
 * */
export declare const getSelectedText: () => string | undefined;
/**
 * 获取浏览器滚动条宽度
 * @return { Number } 滚动条宽度
 * */
export declare const getScrollBarWidth: () => number;
/**
 * 获取浏览器窗口的尺寸
 * @return { Object } 浏览器窗口的尺寸
 * */
export declare const getClientSize: () => object;
/**
 * 获取范围内的元素位置
 * @param { Number[] } range 限制范围
 * @param { Number[] } area 子元素大小
 * @param { Number } left 点位横坐标
 * @param { Number } top 点位纵坐标
 * @param { Number } [point = 0] 点的大小
 * @return { Object } 返回值说明
 * */
export declare const getElementPositionWithinRange: (range: number[], area: number[], left: number, top: number, point?: number) => any;
/**
 * 下载文件
 * @param { String } filePath 文件路径
 * @param { String } fileName 文件名
 * */
export declare const downloadFile: (filePath: string, fileName?: string) => Promise<void>;
