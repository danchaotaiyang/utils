/**
 * 设备坐标归一化
 * 坐标转换 0~n 转换成 -1~1
 * @param { Number } x - 原坐标x
 * @param { Number } y - 原坐标y
 * @param { Number } width - 原坐标y
 * @param { Number } height - 原坐标y
 * @return { Array } 旋转后坐标
 * */
export const deviceCoordinateToNormalized = (x: number, y: number, width: number, height: number): Array<number> => {
    return [ (x / width * 2) - 1, 1 - (y / height * 2) ];
};

/**
 * 设备坐标转卡迪尔坐标
 * 坐标转换 0~n 转换成 -1~1
 * @param { Number } x - 原坐标x
 * @param { Number } y - 原坐标y
 * @param { Number } width - 原坐标y
 * @param { Number } height - 原坐标y
 * @return { Array } 旋转后坐标
 * */
export const deviceCoordinateToCartesian = (x: number, y: number, width: number, height: number): Array<number> => {
    return [ x - width / 2, -(y - height / 2) ];
};

/**
 * 2D坐标距离
 * @param { Object } o - 原点
 * @param { Object } t - 目标点
 * @return { Number } 旋转后坐标
 * */
export const distance2 = (o: any, t: any): number => {

    const dx = o.x - t.x;
    const dy = o.y - t.y;

    return Math.sqrt(dx * dx + dy * dy);
};

/**
 * 2D坐标旋转任意弧度
 * @param { Number } x - 原坐标x
 * @param { Number } y - 原坐标y
 * @param { Number } rad - 任意弧度值
 * @return { Array } 旋转后坐标
 * */
export const rotateRad = (x: number, y: number, rad: number): Array<number> => {
    return [ x * Math.cos(rad) - y * Math.sin(rad), x * Math.sin(rad) + y * Math.cos(rad) ];
};

/**
 * 2D坐标原点为中心旋转任意角度
 * @param { Number } x - 原坐标x
 * @param { Number } y - 原坐标y
 * @param { Number } deg - 任意角度
 * @return { Array } 旋转后坐标
 * */
export const rotateDeg = (x: number, y: number, deg: number): Array<number> => {
    return rotateRad(x, y, Math.PI / 180 * deg);
};

/**
 * 2D坐标原点为中心旋转180度
 * @param { Number } x - 原坐标x
 * @param { Number } y - 原坐标y
 * @return { Array } 旋转后坐标
 * */
export const rotate180 = (x: number, y: number): Array<number> => {
    return [ -x, -y ];
};

/**
 * 2D坐标原点为中心顺时针旋转90度
 * @param { Number } x - 原坐标x
 * @param { Number } y - 原坐标y
 * @return { Array } 旋转后坐标
 * */
export const rotate90D = (x: number, y: number): Array<number> => {
    return [ -y, x ];
};

/**
 * 2D坐标原点为中心逆时针旋转90度
 * @param { Number } x - 原坐标x
 * @param { Number } y - 原坐标y
 * @return { Array } 旋转后坐标
 * */
export const rotate90DC = (x: number, y: number): Array<number> => {
    return [ y, -x ];
};

/**
 * 2D坐标原点为中心顺时针旋转45度
 * @param { Number } x - 原坐标x
 * @param { Number } y - 原坐标y
 * @return { Array } 旋转后坐标
 * */
export const rotate45D = (x: number, y: number): Array<number> => {
    return [ (x * Math.sqrt(2) / 2) - (y * Math.sqrt(2) / 2), (x * Math.sqrt(2) / 2) + (y * Math.sqrt(2) / 2) ];
};

/**
 * 2D坐标原点为中心逆时针旋转45度
 * @param { Number } x - 原坐标x
 * @param { Number } y - 原坐标y
 * @return { Array } 旋转后坐标
 * */
export const rotate45DC = (x: number, y: number): Array<number> => {
    return [ (x * Math.sqrt(2) / 2) + (y * Math.sqrt(2) / 2), -(x * Math.sqrt(2) / 2) + (y * Math.sqrt(2) / 2) ];
};

/**
 * 2D坐标判断在围栏中
 * @param { Number } x - 原坐标x
 * @param { Number } y - 原坐标y
 * @param { Array } vertexes - 围栏范围坐标
 * @return { Boolean } 是否在围栏中
 * */
export const isInside = (x: number, y: number, vertexes: Array<Array<number>>): boolean => {

    let intersections = 0;

    let length = vertexes.length;

    for (let i = 0; i < length; i++) {

        let c = vertexes[ i ];
        let n = vertexes[ (i + 1) % length ];
        let cx = c[ 0 ];
        let cy = c[ 1 ];
        let nx = n[ 0 ];
        let ny = n[ 1 ];

        if ((cy > y) !== (ny > y) && x < (nx - cx) * (y - cy) / (ny - cy) + cx) {
            intersections++;
        }
    }

    return intersections % 2 === 1;

    /*
    let intersectCount = 0;

    for (let i = 0; i < vertexes.length - 1; i++) {

        let x1 = vertexes[ i ][ 0 ];
        let y1 = vertexes[ i ][ 1 ];
        let x2 = vertexes[ i + 1 ][ 0 ];
        let y2 = vertexes[ i + 1 ][ 1 ];

        if ((y1 <= y && y < y2) || (y2 <= y && y < y1)) {
            // 计算交点的x坐标
            let xIntersect = (x1 + (y - y1) * (x2 - x1) / (y2 - y1));

            if (xIntersect <= x) {
                intersectCount++;
            }
        }
    }

    return intersectCount % 2 === 1;
    */

    /*
    let intersect = false;

    for (let i = 0, j = vertexes.length - 1; i < vertexes.length; j = i++) {

        let xi = vertexes[ i ][ 0 ], yi = vertexes[ i ][ 1 ];
        let xj = vertexes[ j ][ 0 ], yj = vertexes[ j ][ 1 ];

        let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

        if (intersect) {
            intersect = !intersect;
        }
    }

    return intersect;
    */
};


/**
 * 2D坐标获取中心点
 * @param { Array } vertexes - 坐标列表
 * @return { Array } 中心坐标
 * */
export const getCenter = (vertexes: Array<Array<number>>): Array<number> => {

    let [ minX, maxX, minY, maxY ] = [
        vertexes[ 0 ][ 0 ], vertexes[ 0 ][ 0 ],
        vertexes[ 0 ][ 1 ], vertexes[ 0 ][ 1 ]
    ];

    for (let i = 1; i < vertexes.length; i++) {

        const [ x, y ] = vertexes[ i ];
        minX = x < minX ? x : minX;
        maxX = x > maxX ? x : maxX;
        minY = y < minY ? y : minY;
        maxY = y > maxY ? y : maxY;
    }

    return [ (minX + maxX) * 0.5, (minY + maxY) * 0.5 ];
};
