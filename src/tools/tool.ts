import { isObject } from '@/utils';
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

