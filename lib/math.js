(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.math = {}));
})(this, (function (exports) { 'use strict';

    /**
     * 设备坐标归一化
     * 坐标转换 0~n 转换成 -1~1
     * @param { Number } x - 原坐标x
     * @param { Number } y - 原坐标y
     * @param { Number } width - 原坐标y
     * @param { Number } height - 原坐标y
     * @return { Array } 旋转后坐标
     * */
    var deviceCoordinateToNormalized = function (x, y, width, height) {
        return [(x / width * 2) - 1, 1 - (y / height * 2)];
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
    var deviceCoordinateToCartesian = function (x, y, width, height) {
        return [x - width / 2, -(y - height / 2)];
    };
    /**
     * 2D坐标距离
     * @param { Object } o - 原点
     * @param { Object } t - 目标点
     * @return { Number } 旋转后坐标
     * */
    var distance2 = function (o, t) {
        var dx = o.x - t.x;
        var dy = o.y - t.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    /**
     * 2D坐标旋转任意弧度
     * @param { Number } x - 原坐标x
     * @param { Number } y - 原坐标y
     * @param { Number } rad - 任意弧度值
     * @return { Array } 旋转后坐标
     * */
    var rotateRad = function (x, y, rad) {
        return [x * Math.cos(rad) - y * Math.sin(rad), x * Math.sin(rad) + y * Math.cos(rad)];
    };
    /**
     * 2D坐标原点为中心旋转任意角度
     * @param { Number } x - 原坐标x
     * @param { Number } y - 原坐标y
     * @param { Number } deg - 任意角度
     * @return { Array } 旋转后坐标
     * */
    var rotateDeg = function (x, y, deg) {
        return rotateRad(x, y, Math.PI / 180 * deg);
    };
    /**
     * 2D坐标原点为中心旋转180度
     * @param { Number } x - 原坐标x
     * @param { Number } y - 原坐标y
     * @return { Array } 旋转后坐标
     * */
    var rotate180 = function (x, y) {
        return [-x, -y];
    };
    /**
     * 2D坐标原点为中心顺时针旋转90度
     * @param { Number } x - 原坐标x
     * @param { Number } y - 原坐标y
     * @return { Array } 旋转后坐标
     * */
    var rotate90D = function (x, y) {
        return [-y, x];
    };
    /**
     * 2D坐标原点为中心逆时针旋转90度
     * @param { Number } x - 原坐标x
     * @param { Number } y - 原坐标y
     * @return { Array } 旋转后坐标
     * */
    var rotate90DC = function (x, y) {
        return [y, -x];
    };
    /**
     * 2D坐标原点为中心顺时针旋转45度
     * @param { Number } x - 原坐标x
     * @param { Number } y - 原坐标y
     * @return { Array } 旋转后坐标
     * */
    var rotate45D = function (x, y) {
        return [(x * Math.sqrt(2) / 2) - (y * Math.sqrt(2) / 2), (x * Math.sqrt(2) / 2) + (y * Math.sqrt(2) / 2)];
    };
    /**
     * 2D坐标原点为中心逆时针旋转45度
     * @param { Number } x - 原坐标x
     * @param { Number } y - 原坐标y
     * @return { Array } 旋转后坐标
     * */
    var rotate45DC = function (x, y) {
        return [(x * Math.sqrt(2) / 2) + (y * Math.sqrt(2) / 2), -(x * Math.sqrt(2) / 2) + (y * Math.sqrt(2) / 2)];
    };
    /**
     * 2D坐标判断在围栏中
     * @param { Number } x - 原坐标x
     * @param { Number } y - 原坐标y
     * @param { Array } vertexes - 围栏范围坐标
     * @return { Boolean } 是否在围栏中
     * */
    var isInside = function (x, y, vertexes) {
        var intersections = 0;
        var length = vertexes.length;
        for (var i = 0; i < length; i++) {
            var c = vertexes[i];
            var n = vertexes[(i + 1) % length];
            var cx = c[0];
            var cy = c[1];
            var nx = n[0];
            var ny = n[1];
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
    var getCenter = function (vertexes) {
        var _a = [
            vertexes[0][0], vertexes[0][0],
            vertexes[0][1], vertexes[0][1]
        ], minX = _a[0], maxX = _a[1], minY = _a[2], maxY = _a[3];
        for (var i = 1; i < vertexes.length; i++) {
            var _b = vertexes[i], x = _b[0], y = _b[1];
            minX = x < minX ? x : minX;
            maxX = x > maxX ? x : maxX;
            minY = y < minY ? y : minY;
            maxY = y > maxY ? y : maxY;
        }
        return [(minX + maxX) * 0.5, (minY + maxY) * 0.5];
    };

    exports.deviceCoordinateToCartesian = deviceCoordinateToCartesian;
    exports.deviceCoordinateToNormalized = deviceCoordinateToNormalized;
    exports.distance2 = distance2;
    exports.getCenter = getCenter;
    exports.isInside = isInside;
    exports.rotate180 = rotate180;
    exports.rotate45D = rotate45D;
    exports.rotate45DC = rotate45DC;
    exports.rotate90D = rotate90D;
    exports.rotate90DC = rotate90DC;
    exports.rotateDeg = rotateDeg;
    exports.rotateRad = rotateRad;

}));
