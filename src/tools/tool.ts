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
 * @param { number } [edgeRange=0] 点位微扰范围：
 *  - 未传或 0：不进行偏移，随机点严格依据原始命中结果；
 *  - > 0：对每个命中的随机点，在 x、y 方向各添加 [0, edgeRange] 的随机偏移。
 *    注意：此偏移基于当前实现不会再二次校验，若点非常靠近边界，偏移后可能越界；
 *    若需要严格限制在范围内，请将该参数设为 0。
 * @returns { Array<Array<number>> } 命中的点集合 [[x, y], ...]，可能少于 count
 *
 * @example
 * // 基础示例：在无孔洞的三角形内生成 1 个点
 * const parent = [ [0,0], [10,0], [5,8] ];
 * const pts = randomPointInPolygonExcludingChildren(parent, [], 1);
 * // => 例如 [[4.12, 2.35]]
 *
 * @example
 * // 含孔洞示例：在矩形内生成 5 个点，但避开中心小矩形
 * const parent = [ [0,0], [20,0], [20,10], [0,10] ];
 * const hole   = [ [8,3], [12,3], [12,7], [8,7] ];
 * const pts = randomPointInPolygonExcludingChildren(parent, [hole], 5);
 * // => 返回 0~5 个点（若孔洞较大或区域狭小，可能不足 5 个）
 *
 * @example
 * // 批量生成并绘制（伪代码）
 * const parent = /* ... * / [];
 * const holes = /* ... * / [];
 * const samples = randomPointInPolygonExcludingChildren(parent, holes, 100);
 * samples.forEach(([x, y]) => drawCircle(x, y));
 */
export const randomPointInPolygonExcludingChildren = (
    parent: Array<Array<number>>,
    children: Array<Array<Array<number>>> = [],
    count: number = 1,
    edgeRange: number = 0
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

    while (results.length < count) {
        let rx = Math.random() * (maxX - minX) + minX;
        let ry = Math.random() * (maxY - minY) + minY;
        if (isValid(rx, ry)) {
            if (!isNaN(Number(edgeRange))) {
                let rxm = Math.random() * edgeRange / 2;
                let rym = Math.random() * edgeRange / 2;
                rx = Math.random() > .5 ? rx + rxm : rx - rxm;
                ry = Math.random() > .5 ? ry + rym : ry - rym;
            }
            results.push([ rx, ry ]);
        }
    }

    return results;
};
