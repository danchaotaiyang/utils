(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.utils = {}));
})(this, (function (exports) { 'use strict';

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
    };

    /**
     * 在父多边形内随机生成若干点，且避开所有子多边形
     * @param { Array<Array<number>> } parent 父多边形顶点列表，至少3个点，格式 [[x,y], ...]
     * @param { Array<Array<Array<number>>> } children 子多边形集合，格式 [[[x,y],...], ...]
     * @param { number } [count=1] 需要生成的点数量
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
    var randomPointInPolygonExcludingChildren = function (parent, children, count) {
        if (children === void 0) { children = []; }
        if (count === void 0) { count = 1; }
        if (!Array.isArray(parent) || parent.length < 3 || count <= 0) {
            return [];
        }
        // 计算父多边形的轴对齐包围盒
        var minX = parent[0][0];
        var maxX = parent[0][0];
        var minY = parent[0][1];
        var maxY = parent[0][1];
        for (var i = 1; i < parent.length; i++) {
            var px = parent[i][0];
            var py = parent[i][1];
            minX = px < minX ? px : minX;
            maxX = px > maxX ? px : maxX;
            minY = py < minY ? py : minY;
            maxY = py > maxY ? py : maxY;
        }
        // 子多边形包围盒（用于快速剔除）
        var holeBBoxes = [];
        if (children && children.length) {
            for (var i = 0; i < children.length; i++) {
                var hole = children[i];
                if (!Array.isArray(hole) || hole.length < 3)
                    continue;
                var hMinX = hole[0][0], hMaxX = hole[0][0];
                var hMinY = hole[0][1], hMaxY = hole[0][1];
                for (var k = 1; k < hole.length; k++) {
                    var hx = hole[k][0];
                    var hy = hole[k][1];
                    hMinX = hx < hMinX ? hx : hMinX;
                    hMaxX = hx > hMaxX ? hx : hMaxX;
                    hMinY = hy < hMinY ? hy : hMinY;
                    hMaxY = hy > hMaxY ? hy : hMaxY;
                }
                holeBBoxes.push({ minX: hMinX, maxX: hMaxX, minY: hMinY, maxY: hMaxY, idx: i });
            }
        }
        var isValid = function (x, y) {
            if (!isInside(x, y, parent)) {
                return false;
            }
            for (var b = 0; b < holeBBoxes.length; b++) {
                var bb = holeBBoxes[b];
                if (x >= bb.minX && x <= bb.maxX && y >= bb.minY && y <= bb.maxY) {
                    var hole = children[bb.idx];
                    if (isInside(x, y, hole)) {
                        return false;
                    }
                }
            }
            return true;
        };
        var results = [];
        while (results.length < count) {
            var rx = Math.random() * (maxX - minX) + minX;
            var ry = Math.random() * (maxY - minY) + minY;
            if (isValid(rx, ry)) {
                results.push([rx, ry]);
            }
        }
        return results;
    };

    exports.isInside = isInside;
    exports.randomPointInPolygonExcludingChildren = randomPointInPolygonExcludingChildren;

}));
