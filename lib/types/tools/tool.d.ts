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
/**
 * 下载文件
 * @param { String } filePath 文件路径
 * @param { String } fileName 文件名
 * */
export declare const downloadFile: (filePath: string, fileName?: string) => Promise<void>;
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
 * 在父多边形内随机生成若干点，且避开所有子多边形
 * @param { Array<Array<number>> } parent 父多边形顶点列表，至少3个点，格式 [[x,y], ...]
 * @param { Array<Array<Array<number>>> } children 子多边形集合，格式 [[[x,y],...], ...]
 * @param { number } [count=1] 需要生成的点数量
 * @param { number } [feather=0] 羽化强度系数：
 *   - 0：关闭羽化，均匀采样（当前行为）。
 *   - >0：开启“概率羽化”，离边越近命中概率越低、点数越少；离边越远概率越高。
 *   - 取值推荐范围 [0,1]；允许 >1，将进一步增大羽化半径、加强边缘稀疏。
 *   - 实现说明：以父多边形外接矩形短边为基准，羽化半径 = 短边 × 0.1 × feather；
 *     实际保留概率采用 smoothstep(d / radius)（d 为点到最近边的距离），实现平滑过渡。
 * @returns { Array<Array<number>> } 命中的点集合 [[x, y], ...]，可能少于 count
 *
 * @example
 * // 基础示例：在无孔洞的三角形内生成 1 个点（无羽化）
 * const parent = [ [0,0], [10,0], [5,8] ];
 * const pts = randomPointInPolygonExcludingChildren(parent, [], 1, 0);
 * // => 例如 [[4.12, 2.35]]
 *
 * @example
 * // 含孔洞示例：在矩形内生成 5 个点，但避开中心小矩形，并开启羽化
 * const parent = [ [0,0], [20,0], [20,10], [0,10] ];
 * const hole   = [ [8,3], [12,3], [12,7], [8,7] ];
 * const pts = randomPointInPolygonExcludingChildren(parent, [hole], 5, 0.6);
 * // => 返回 0~5 个点（靠近边缘/孔洞处更稀疏）
 *
 * @example
 * // 批量生成并绘制（伪代码）
 * const parent = /* ... * / [];
 * const holes = /* ... * / [];
 * const samples = randomPointInPolygonExcludingChildren(parent, holes, 100, 1);
 * samples.forEach(([x, y]) => drawCircle(x, y));
 */
export declare const randomPointInPolygonExcludingChildren: (parent: Array<Array<number>>, children?: Array<Array<Array<number>>>, count?: number, feather?: number) => Array<Array<number>>;
export {};
