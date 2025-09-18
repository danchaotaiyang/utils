/**
 * 设备坐标归一化
 * 坐标转换 0~n 转换成 -1~1
 * @param { Number } x - 原坐标x
 * @param { Number } y - 原坐标y
 * @param { Number } width - 原坐标y
 * @param { Number } height - 原坐标y
 * @return { Array } 旋转后坐标
 * */
export declare const deviceCoordinateToNormalized: (x: number, y: number, width: number, height: number) => Array<number>;
/**
 * 设备坐标转卡迪尔坐标
 * 坐标转换 0~n 转换成 -1~1
 * @param { Number } x - 原坐标x
 * @param { Number } y - 原坐标y
 * @param { Number } width - 原坐标y
 * @param { Number } height - 原坐标y
 * @return { Array } 旋转后坐标
 * */
export declare const deviceCoordinateToCartesian: (x: number, y: number, width: number, height: number) => Array<number>;
/**
 * 2D坐标距离
 * @param { Object } o - 原点
 * @param { Object } t - 目标点
 * @return { Number } 旋转后坐标
 * */
export declare const distance2: (o: any, t: any) => number;
/**
 * 2D坐标旋转任意弧度
 * @param { Number } x - 原坐标x
 * @param { Number } y - 原坐标y
 * @param { Number } rad - 任意弧度值
 * @return { Array } 旋转后坐标
 * */
export declare const rotateRad: (x: number, y: number, rad: number) => Array<number>;
/**
 * 2D坐标原点为中心旋转任意角度
 * @param { Number } x - 原坐标x
 * @param { Number } y - 原坐标y
 * @param { Number } deg - 任意角度
 * @return { Array } 旋转后坐标
 * */
export declare const rotateDeg: (x: number, y: number, deg: number) => Array<number>;
/**
 * 2D坐标原点为中心旋转180度
 * @param { Number } x - 原坐标x
 * @param { Number } y - 原坐标y
 * @return { Array } 旋转后坐标
 * */
export declare const rotate180: (x: number, y: number) => Array<number>;
/**
 * 2D坐标原点为中心顺时针旋转90度
 * @param { Number } x - 原坐标x
 * @param { Number } y - 原坐标y
 * @return { Array } 旋转后坐标
 * */
export declare const rotate90D: (x: number, y: number) => Array<number>;
/**
 * 2D坐标原点为中心逆时针旋转90度
 * @param { Number } x - 原坐标x
 * @param { Number } y - 原坐标y
 * @return { Array } 旋转后坐标
 * */
export declare const rotate90DC: (x: number, y: number) => Array<number>;
/**
 * 2D坐标原点为中心顺时针旋转45度
 * @param { Number } x - 原坐标x
 * @param { Number } y - 原坐标y
 * @return { Array } 旋转后坐标
 * */
export declare const rotate45D: (x: number, y: number) => Array<number>;
/**
 * 2D坐标原点为中心逆时针旋转45度
 * @param { Number } x - 原坐标x
 * @param { Number } y - 原坐标y
 * @return { Array } 旋转后坐标
 * */
export declare const rotate45DC: (x: number, y: number) => Array<number>;
/**
 * 2D坐标判断在围栏中
 * @param { Number } x - 原坐标x
 * @param { Number } y - 原坐标y
 * @param { Array } vertexes - 围栏范围坐标
 * @return { Boolean } 是否在围栏中
 * */
export declare const isInside: (x: number, y: number, vertexes: Array<Array<number>>) => boolean;
/**
 * 2D坐标获取中心点
 * @param { Array } vertexes - 坐标列表
 * @return { Array } 中心坐标
 * */
export declare const getCenter: (vertexes: Array<Array<number>>) => Array<number>;
