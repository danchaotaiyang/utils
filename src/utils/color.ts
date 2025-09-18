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
export const rgbToHex: rgbToHex = (a1?: number | string, a2?: number, a3?: number, a4?: number): string => {

    let hex = '#';
    let rgb: number[] = [ 0, 0, 0 ];

    if (typeof a1 === 'string' && a1 !== '') {

        if (!(/^(rgba?|RGBA?)\(.+\)$/.test(a1))) {
            throw new Error('参数不是合法颜色值');
        }

        const hex = a1.replace(/(?:\(|\)|rgba?|RGBA?)*/g, '').split(',');

        hex.map((d: string, i: number) => rgb[ i ] = +d);

    } else {
        if (typeof a1 === 'number') {
            rgb[ 0 ] = a1;
        }

        if (typeof a2 === 'number') {
            rgb[ 1 ] = a2;
        }

        if (typeof a3 === 'number') {
            rgb[ 2 ] = a3;
        }

        if (typeof a4 === 'number') {
            rgb[ 3 ] = a4;
        }
    }

    rgb
        .map((d, i) => {
            const max = i < 3 ? 255 : 1;
            return Math.max(0, d, Math.min(d, max));
        })
        .map((d, i) => {

            if (i > 2) {
                d = Math.round(255 * d);
            }

            let item = d.toString(16);

            if (d < 16) {
                item = '0' + item;
            }

            hex += item;
        });

    return hex;
};

/**
 * 生成随机十六进制颜色
 * @return { String } 十六进制颜色值
 * */
export const createRandomColorHex = (): string => `#${ Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0') }`;
