/**
 * 获取浏览器滚动条宽度
 * @return { Number } 滚动条宽度
 * */
export declare const getScrollBarWidth: () => number;
/**
 * 浏览器进入全屏模式
 * */
export declare const requestFullscreen: (el?: any) => void;
/**
 * 浏览器退出全屏模式
 * */
export declare const exitFullscreen: () => void;
/**
 * 判断浏览器全屏状态
 * @return { Boolean } 返回是否为全屏状态
 * */
export declare const isFullscreen: () => boolean;
/**
 * 判断是否为桌面系统
 * @return { Boolean } 返回是否为桌面系统
 * */
export declare const isDesktopSystem: () => boolean;
/**
 * 获取浏览器信息
 * @return { Object | null } 返回客户端信息
 * */
export declare const getBrowser: () => object | null;
