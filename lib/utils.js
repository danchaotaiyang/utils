(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.utils = {}));
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
     * @param { number } [edgeRangeOuter=0] 边缘羽化处理范围：
     *  - 未传或 0：不进行羽化处理，严格限制在父多边形内部；
     *  - > 0：在父多边形边缘处进行羽化处理，允许向外扩展 [0, edgeRangeOuter] 范围，实现柔和的边界过渡
     * @param { number } [edgeRangeInner=0] 避让子多边形范围：
     *  - 未传或 0：不进行避让范围扩展；
     *  - > 0：在子多边形边缘处向外扩展避让范围，扩展范围为 [0, edgeRangeInner]
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
     * // 带边缘羽化和避让范围示例
     * const parent = [ [0,0], [20,0], [20,10], [0,10] ];
     * const hole   = [ [8,3], [12,3], [12,7], [8,7] ];
     * const pts = randomPointInPolygonExcludingChildren(parent, [hole], 5, 2, 1);
     * // => 父多边形边缘羽化处理2个单位范围，子多边形边缘向外避让1个单位
     *
     * @example
     * // 批量生成并绘制（伪代码）
     * const parent = /* ... * / [];
     * const holes = /* ... * / [];
     * const samples = randomPointInPolygonExcludingChildren(parent, holes, 100, 1, 0.5);
     * samples.forEach(([x, y]) => drawCircle(x, y));
     * // => 边缘羽化1个单位，避让范围0.5个单位
     */
    var randomPointInPolygonExcludingChildren = function (parent, children, count, edgeRangeOuter, edgeRangeInner) {
        if (children === void 0) { children = []; }
        if (count === void 0) { count = 1; }
        if (edgeRangeOuter === void 0) { edgeRangeOuter = 0; }
        if (edgeRangeInner === void 0) { edgeRangeInner = 0; }
        if (!Array.isArray(parent) || parent.length < 3 || count <= 0) {
            return [];
        }
        // 计算点到多边形边的最短距离
        var getDistanceToPolygonEdge = function (x, y, polygon) {
            var minDistance = Infinity;
            for (var i = 0; i < polygon.length; i++) {
                var p1 = polygon[i];
                var p2 = polygon[(i + 1) % polygon.length];
                // 计算点到线段的距离
                var A = x - p1[0];
                var B = y - p1[1];
                var C = p2[0] - p1[0];
                var D = p2[1] - p1[1];
                var dot = A * C + B * D;
                var lenSq = C * C + D * D;
                var param = -1;
                if (lenSq !== 0) {
                    param = dot / lenSq;
                }
                var xx = void 0, yy = void 0;
                if (param < 0) {
                    xx = p1[0];
                    yy = p1[1];
                }
                else if (param > 1) {
                    xx = p2[0];
                    yy = p2[1];
                }
                else {
                    xx = p1[0] + param * C;
                    yy = p1[1] + param * D;
                }
                var dx = x - xx;
                var dy = y - yy;
                var distance = Math.sqrt(dx * dx + dy * dy);
                minDistance = Math.min(minDistance, distance);
            }
            return minDistance;
        };
        // 计算父多边形的轴对齐包围盒（扩展羽化处理范围）
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
        // 扩展包围盒以包含羽化处理范围
        if (edgeRangeOuter > 0) {
            minX -= edgeRangeOuter;
            maxX += edgeRangeOuter;
            minY -= edgeRangeOuter;
            maxY += edgeRangeOuter;
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
                // 扩展子多边形包围盒以包含避让范围
                if (edgeRangeInner > 0) {
                    hMinX -= edgeRangeInner;
                    hMaxX += edgeRangeInner;
                    hMinY -= edgeRangeInner;
                    hMaxY += edgeRangeInner;
                }
                holeBBoxes.push({ minX: hMinX, maxX: hMaxX, minY: hMinY, maxY: hMaxY, idx: i });
            }
        }
        var isValid = function (x, y) {
            // 检查是否在父多边形内
            var inParent = isInside(x, y, parent);
            if (!inParent && edgeRangeOuter > 0) {
                // 如果在父多边形外，检查是否在羽化处理范围内
                var distanceToEdge = getDistanceToPolygonEdge(x, y, parent);
                if (distanceToEdge <= edgeRangeOuter) {
                    inParent = true;
                }
            }
            if (!inParent) {
                return false;
            }
            // 检查是否避让子多边形（考虑避让范围）
            for (var b = 0; b < holeBBoxes.length; b++) {
                var bb = holeBBoxes[b];
                if (x >= bb.minX && x <= bb.maxX && y >= bb.minY && y <= bb.maxY) {
                    var hole = children[bb.idx];
                    // 首先检查是否在子多边形内
                    if (isInside(x, y, hole)) {
                        return false;
                    }
                    // 如果设置了避让范围，还要检查是否在避让范围内
                    if (edgeRangeInner > 0) {
                        var distanceToHoleEdge = getDistanceToPolygonEdge(x, y, hole);
                        if (distanceToHoleEdge <= edgeRangeInner) {
                            return false;
                        }
                    }
                }
            }
            return true;
        };
        // 如果设置了羽化处理，需要调整随机点生成策略
        var generateRandomPoint = function () {
            var rx = Math.random() * (maxX - minX) + minX;
            var ry = Math.random() * (maxY - minY) + minY;
            // 如果设置了羽化处理，优先在边缘附近生成点
            if (edgeRangeOuter > 0) {
                // 随机决定是否在边缘区域生成点（50%概率）
                if (Math.random() < 0.5) {
                    // 在父多边形边缘附近生成点，实现羽化效果
                    var distanceToEdge = getDistanceToPolygonEdge(rx, ry, parent);
                    if (distanceToEdge > edgeRangeOuter) {
                        // 如果点距离边缘太远，向边缘方向移动
                        var randomOffset = Math.random() * edgeRangeOuter;
                        // 简化处理：向包围盒边缘移动
                        var centerX = (minX + maxX) / 2;
                        var centerY = (minY + maxY) / 2;
                        var directionX = rx > centerX ? 1 : -1;
                        var directionY = ry > centerY ? 1 : -1;
                        rx += directionX * randomOffset * 0.5;
                        ry += directionY * randomOffset * 0.5;
                    }
                }
            }
            return [rx, ry];
        };
        var results = [];
        var attempts = 0;
        var maxAttempts = count * 1000; // 防止无限循环
        while (results.length < count && attempts < maxAttempts) {
            var _a = generateRandomPoint(), rx = _a[0], ry = _a[1];
            if (isValid(rx, ry)) {
                results.push([rx, ry]);
            }
            attempts++;
        }
        return results;
    };

    exports.isInside = isInside;
    exports.randomPointInPolygonExcludingChildren = randomPointInPolygonExcludingChildren;

}));
