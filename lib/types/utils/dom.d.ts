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
 * 获取浏览器窗口的尺寸
 * @return { Object } 浏览器窗口的尺寸
 * */
export declare const getClientSize: () => object;
