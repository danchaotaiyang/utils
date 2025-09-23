import { isObject, isInside } from '@/utils';
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
export const unitMatch = (value: string, normal: string = 'px'): string => {

    let unit: string = '';

    let matched = value.match(/(px|rpx|em|rem|vw|vh|%)$/);

    if (matched) {
        unit = matched[ 0 ];
    }

    return `${ value }${ unit ? '' : normal }`;
};

/**
 * 清除对象属性值中字符串的首尾空格
 * @param { * } data - 参数说明
 * @return { * } 清理后的值
 * */
export const trimParams = (data: any): any => {

    if (Array.isArray(data)) {
        data = data.map((d: any) => trimParams(d));
    }

    if (isObject(data)) {
        Object.keys(data).map((key: any) => data[ key ] = trimParams(data[ key ]));
    }

    if (typeof data === 'string') {
        data = data.replace(/(^\s*)|(\s*$)/g, '');
    }

    return data;
};

const pow1024 = (value: number) => Math.pow(1024, value);

/**
 * 存储容量转换
 * @param { Number } value - 原字节值
 * @param { Number } fixed - 保留原值精度
 * @return { String } 结果
 * */
export const formatByte = (value: number, fixed: number = 2): string => {
    if (!value) {
        return '';
    }
    if (value < pow1024(1)) {
        return value + 'B';
    }
    if (value < pow1024(2)) {
        return Number((value / pow1024(1)).toFixed(fixed)) + 'KB';
    }
    if (value < pow1024(3)) {
        return Number((value / pow1024(2)).toFixed(fixed)) + 'MB';
    }
    if (value < pow1024(4)) {
        return Number((value / pow1024(3)).toFixed(fixed)) + 'GB';
    }
    return Number((value / pow1024(4)).toFixed(fixed)) + 'TB';
};

interface iLocation {
    x: number;
    y: number;
    x2: number;
    y2: number;
}

const getGradientLocation = (dx: number, dy: number): iLocation => {
    const tanV = dx / dy;
    const directSign = Math.abs(tanV) < 1;
    const t = directSign ? tanV : 1 / tanV;

    const sign1 = t > 0 ? 1 : -1;
    const sign2 = dx > 0 ? 1 : -1;
    const sign = directSign ? sign1 * sign2 : sign2;

    const group1 = [ 0.5 - sign * t / 2, 0.5 + sign * t / 2 ];
    const group2 = sign > 0 ? [ 0, 1 ] : [ 1, 0 ];
    const group = group1.concat(group2);
    const keys = directSign ? [ 'x', 'x2', 'y', 'y2' ] : [ 'y', 'y2', 'x', 'x2' ];

    let res: any = {};
    keys.forEach((k, idx) => {
        res[ k ] = group[ idx ];
    });
    return res;
};

/**
 * 线性渐变起止方向的计算方法
 *
 * @param { Number } startArc 开始角度
 * @param { Number } endArc 结束角度
 * @returns 四个坐标 x,y,x2,y2
 */
export const getGradientCoordinates = (startArc: number, endArc: number): iLocation => {
    const position = [
        Math.sin(startArc),
        -Math.cos(startArc),
        Math.sin(endArc),
        -Math.cos(endArc)
    ];
    const dx = position[ 2 ] - position[ 0 ];
    const dy = position[ 3 ] - position[ 1 ];

    return getGradientLocation(dx, dy);
};

/**
 * 延迟等待
 *
 * @param { Number } [time = 32] 等待时间
 */
export const waiting = (time: number = 32): Promise<void> => {
    return new Promise((resolve) => {

        let timerCallback: any = null;
        let timerWait: any = null;

        timerCallback = () => {
            resolve();
            clearTimeout(timerWait);
            timerCallback = null;
            timerWait = null;
        };

        timerWait = setTimeout(timerCallback, time);
    });
};

/**
 * 下载文件
 * @param { String } filePath 文件路径
 * @param { String } fileName 文件名
 * */
export const downloadFile = (filePath: string, fileName?: string): Promise<void> => {
    return new Promise((resolve, reject) => {

        if (!filePath) {

            reject('文件路径不正确');

            return;
        }

        if (fileName) {
            let downloadLink: HTMLElement = document.createElement('a');

            downloadLink.style.display = 'none';
            downloadLink.setAttribute('download', fileName);
            downloadLink.setAttribute('href', filePath);

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            resolve();
        } else {
            window.location.href = filePath;
            resolve();
        }
    });
};


/**
 * 获取范围内的元素位置
 * @param { Number[] } range 限制范围
 * @param { Number[] } area 子元素大小
 * @param { Number } left 点位横坐标
 * @param { Number } top 点位纵坐标
 * @param { Number } [point = 0] 点的大小
 * @return { Object } 返回值说明
 * */
export const getElementPositionWithinRange = (range: number[], area: number[], left: number, top: number, point: number = 0): any => {
    const itmX = left;
    const itmY = top + point / 2;
    const minY = range[ 1 ] - area[ 1 ];
    const x = Math.max(0, Math.min(itmX - area[ 0 ] / 2, range[ 0 ] - area[ 0 ]));
    const y = Math.max(0, Math.min(minY, itmY - (itmY > minY ? point + area[ 1 ] : 0)));
    return { x, y };
};


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
export const randomPointInPolygonExcludingChildren = (
    parent: Array<Array<number>>,
    children: Array<Array<Array<number>>> = [],
    count: number = 1,
    feather: number = 0
): Array<Array<number>> => {

    if (!Array.isArray(parent) || parent.length < 3 || count <= 0) {
        return [];
    }

    // 计算父多边形的轴对齐包围盒
    let minX = parent[ 0 ][ 0 ];
    let maxX = parent[ 0 ][ 0 ];
    let minY = parent[ 0 ][ 1 ];
    let maxY = parent[ 0 ][ 1 ];

    for (let i = 1; i < parent.length; i++) {
        const px = parent[ i ][ 0 ];
        const py = parent[ i ][ 1 ];
        minX = px < minX ? px : minX;
        maxX = px > maxX ? px : maxX;
        minY = py < minY ? py : minY;
        maxY = py > maxY ? py : maxY;
    }

    // 子多边形包围盒（用于快速剔除）
    const holeBBoxes: Array<{ minX: number; maxX: number; minY: number; maxY: number; idx: number }> = [];
    if (children && children.length) {
        for (let i = 0; i < children.length; i++) {
            const hole = children[ i ];
            if (!Array.isArray(hole) || hole.length < 3) continue;
            let hMinX = hole[ 0 ][ 0 ], hMaxX = hole[ 0 ][ 0 ];
            let hMinY = hole[ 0 ][ 1 ], hMaxY = hole[ 0 ][ 1 ];
            for (let k = 1; k < hole.length; k++) {
                const hx = hole[ k ][ 0 ];
                const hy = hole[ k ][ 1 ];
                hMinX = hx < hMinX ? hx : hMinX;
                hMaxX = hx > hMaxX ? hx : hMaxX;
                hMinY = hy < hMinY ? hy : hMinY;
                hMaxY = hy > hMaxY ? hy : hMaxY;
            }
            holeBBoxes.push({ minX: hMinX, maxX: hMaxX, minY: hMinY, maxY: hMaxY, idx: i });
        }
    }

    // 计算点到线段的最短距离
    const pointToSegmentDistance = (x: number, y: number, x1: number, y1: number, x2: number, y2: number): number => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const lenSq = dx * dx + dy * dy;
        if (lenSq === 0) {
            const ddx = x - x1;
            const ddy = y - y1;
            return Math.sqrt(ddx * ddx + ddy * ddy);
        }
        let t = ((x - x1) * dx + (y - y1) * dy) / lenSq;
        t = Math.max(0, Math.min(1, t));
        const px = x1 + t * dx;
        const py = y1 + t * dy;
        const ex = x - px;
        const ey = y - py;
        return Math.sqrt(ex * ex + ey * ey);
    };

    // 计算点到多边形边缘的最小距离
    const minDistanceToPolygonEdges = (polygon: Array<Array<number>>, x: number, y: number): number => {
        let minD = Infinity;
        for (let i = 0; i < polygon.length; i++) {
            const a = polygon[ i ];
            const b = polygon[ (i + 1) % polygon.length ];
            const d = pointToSegmentDistance(x, y, a[ 0 ], a[ 1 ], b[ 0 ], b[ 1 ]);
            if (d < minD) minD = d;
        }
        return minD;
    };

    // 归一化羽化参数并计算羽化半径（以父多边形外接矩形短边为基准，最大10%）
    const clampedFeather = Math.max(0, feather);
    const boxW = maxX - minX;
    const boxH = maxY - minY;
    const baseSize = Math.min(boxW, boxH);
    const featherRadius = clampedFeather > 0 && baseSize > 0 ? (baseSize * 0.1 * clampedFeather) : 0;

    // 预构建边列表和简易网格索引（仅在开启羽化时），用于快速近邻边查询以减少距离计算量
    type Edge = { x1: number; y1: number; x2: number; y2: number; minX: number; maxX: number; minY: number; maxY: number };
    const buildEdges = (polygon: Array<Array<number>>): Edge[] => {
        const edges: Edge[] = [];
        if (!Array.isArray(polygon) || polygon.length < 2) return edges;
        for (let i = 0; i < polygon.length; i++) {
            const a = polygon[ i ];
            const b = polygon[ (i + 1) % polygon.length ];
            const x1 = a[ 0 ], y1 = a[ 1 ];
            const x2 = b[ 0 ], y2 = b[ 1 ];
            edges.push({
                x1, y1, x2, y2,
                minX: Math.min(x1, x2),
                maxX: Math.max(x1, x2),
                minY: Math.min(y1, y2),
                maxY: Math.max(y1, y2)
            });
        }
        return edges;
    };

    let gridCols = 0, gridRows = 0, cellW = 0, cellH = 0;
    let grid: Array<number[]> = [];
    let allEdges: Edge[] = [];
    if (featherRadius > 0) {
        const parentEdges = buildEdges(parent);
        const holeEdges: Edge[] = [];
        for (let i = 0; i < children.length; i++) {
            const hole = children[ i ];
            if (!Array.isArray(hole) || hole.length < 3) continue;
            const es = buildEdges(hole);
            for (let k = 0; k < es.length; k++) holeEdges.push(es[ k ]);
        }
        allEdges = parentEdges.concat(holeEdges);

        if (allEdges.length) {
            const targetCell = Math.max(featherRadius, baseSize / 32);
            gridCols = Math.max(1, Math.min(128, Math.floor((boxW || 1) / targetCell) || 1));
            gridRows = Math.max(1, Math.min(128, Math.floor((boxH || 1) / targetCell) || 1));
            cellW = (boxW || 1) / gridCols;
            cellH = (boxH || 1) / gridRows;
            grid = new Array(gridCols * gridRows);
            for (let i = 0; i < grid.length; i++) grid[ i ] = [];

            const clamp = (v: number, min: number, max: number) => v < min ? min : (v > max ? max : v);
            const toCol = (x: number) => clamp(Math.floor((x - minX) / cellW), 0, gridCols - 1);
            const toRow = (y: number) => clamp(Math.floor((y - minY) / cellH), 0, gridRows - 1);

            for (let ei = 0; ei < allEdges.length; ei++) {
                const e = allEdges[ ei ];
                const c1 = toCol(e.minX), c2 = toCol(e.maxX);
                const r1 = toRow(e.minY), r2 = toRow(e.maxY);
                for (let r = r1; r <= r2; r++) {
                    for (let c = c1; c <= c2; c++) {
                        grid[ r * gridCols + c ].push(ei);
                    }
                }
            }
        }
    }

    const isValid = (x: number, y: number): boolean => {
        if (!isInside(x, y, parent)) {
            return false;
        }
        for (let b = 0; b < holeBBoxes.length; b++) {
            const bb = holeBBoxes[ b ];
            if (x >= bb.minX && x <= bb.maxX && y >= bb.minY && y <= bb.maxY) {
                const hole = children[ bb.idx ];
                if (isInside(x, y, hole)) {
                    return false;
                }
            }
        }
        return true;
    };

    const results: Array<Array<number>> = [];

    // 为避免在羽化较大或区域狭小情况下无限循环，引入尝试上限
    const maxAttempts = Math.max(1000, count * 2000);
    let attempts = 0;

    while (results.length < count && attempts < maxAttempts) {
        attempts++;
        const rx = Math.random() * (maxX - minX) + minX;
        const ry = Math.random() * (maxY - minY) + minY;
        if (isValid(rx, ry)) {
            if (featherRadius > 0 && allEdges.length && gridCols > 0 && gridRows > 0) {
                // 使用网格近邻查询最近边距离
                const cx = Math.max(0, Math.min(gridCols - 1, Math.floor((rx - minX) / cellW)));
                const cy = Math.max(0, Math.min(gridRows - 1, Math.floor((ry - minY) / cellH)));
                let dEdge = Infinity;
                for (let oy = -1; oy <= 1; oy++) {
                    const rr = cy + oy;
                    if (rr < 0 || rr >= gridRows) continue;
                    for (let ox = -1; ox <= 1; ox++) {
                        const cc = cx + ox;
                        if (cc < 0 || cc >= gridCols) continue;
                        const cell = grid[ rr * gridCols + cc ];
                        for (let idx = 0; idx < cell.length; idx++) {
                            const e = allEdges[ cell[ idx ] ];
                            // 包围盒距离下界快速剪枝
                            const bx = rx < e.minX ? (e.minX - rx) : (rx > e.maxX ? (rx - e.maxX) : 0);
                            const by = ry < e.minY ? (e.minY - ry) : (ry > e.maxY ? (ry - e.maxY) : 0);
                            const lowerBound = bx > 0 && by > 0 ? Math.hypot(bx, by) : Math.max(bx, by);
                            if (lowerBound >= dEdge) continue;
                            const d = pointToSegmentDistance(rx, ry, e.x1, e.y1, e.x2, e.y2);
                            if (d < dEdge) dEdge = d;
                        }
                    }
                }
                if (!isFinite(dEdge)) {
                    results.push([ rx, ry ]);
                } else {
                    const t = Math.max(0, Math.min(1, dEdge / featherRadius));
                    const prob = t * t * (3 - 2 * t);
                    if (Math.random() < prob) {
                        results.push([ rx, ry ]);
                    }
                }
            } else if (featherRadius > 0) {
                // 回退到精确计算（无网格或无边）
                let dEdge = minDistanceToPolygonEdges(parent, rx, ry);
                for (let i = 0; i < children.length; i++) {
                    const hole = children[ i ];
                    if (!Array.isArray(hole) || hole.length < 3) continue;
                    const dh = minDistanceToPolygonEdges(hole, rx, ry);
                    if (dh < dEdge) dEdge = dh;
                }
                const t = Math.max(0, Math.min(1, dEdge / featherRadius));
                const prob = t * t * (3 - 2 * t);
                if (Math.random() < prob) {
                    results.push([ rx, ry ]);
                }
            } else {
                results.push([ rx, ry ]);
            }
        }
    }

    return results;
};
