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
    var randomPointInPolygonExcludingChildren = function (parent, children, count, feather) {
        if (children === void 0) { children = []; }
        if (count === void 0) { count = 1; }
        if (feather === void 0) { feather = 0; }
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
        // 计算点到线段的最短距离
        var pointToSegmentDistance = function (x, y, x1, y1, x2, y2) {
            var dx = x2 - x1;
            var dy = y2 - y1;
            var lenSq = dx * dx + dy * dy;
            if (lenSq === 0) {
                var ddx = x - x1;
                var ddy = y - y1;
                return Math.sqrt(ddx * ddx + ddy * ddy);
            }
            var t = ((x - x1) * dx + (y - y1) * dy) / lenSq;
            t = Math.max(0, Math.min(1, t));
            var px = x1 + t * dx;
            var py = y1 + t * dy;
            var ex = x - px;
            var ey = y - py;
            return Math.sqrt(ex * ex + ey * ey);
        };
        // 计算点到多边形边缘的最小距离
        var minDistanceToPolygonEdges = function (polygon, x, y) {
            var minD = Infinity;
            for (var i = 0; i < polygon.length; i++) {
                var a = polygon[i];
                var b = polygon[(i + 1) % polygon.length];
                var d = pointToSegmentDistance(x, y, a[0], a[1], b[0], b[1]);
                if (d < minD)
                    minD = d;
            }
            return minD;
        };
        // 归一化羽化参数并计算羽化半径（以父多边形外接矩形短边为基准，最大10%）
        var clampedFeather = Math.max(0, feather);
        var boxW = maxX - minX;
        var boxH = maxY - minY;
        var baseSize = Math.min(boxW, boxH);
        var featherRadius = clampedFeather > 0 && baseSize > 0 ? (baseSize * 0.1 * clampedFeather) : 0;
        var buildEdges = function (polygon) {
            var edges = [];
            if (!Array.isArray(polygon) || polygon.length < 2)
                return edges;
            for (var i = 0; i < polygon.length; i++) {
                var a = polygon[i];
                var b = polygon[(i + 1) % polygon.length];
                var x1 = a[0], y1 = a[1];
                var x2 = b[0], y2 = b[1];
                edges.push({
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2,
                    minX: Math.min(x1, x2),
                    maxX: Math.max(x1, x2),
                    minY: Math.min(y1, y2),
                    maxY: Math.max(y1, y2)
                });
            }
            return edges;
        };
        var gridCols = 0, gridRows = 0, cellW = 0, cellH = 0;
        var grid = [];
        var allEdges = [];
        if (featherRadius > 0) {
            var parentEdges = buildEdges(parent);
            var holeEdges = [];
            for (var i = 0; i < children.length; i++) {
                var hole = children[i];
                if (!Array.isArray(hole) || hole.length < 3)
                    continue;
                var es = buildEdges(hole);
                for (var k = 0; k < es.length; k++)
                    holeEdges.push(es[k]);
            }
            allEdges = parentEdges.concat(holeEdges);
            if (allEdges.length) {
                var targetCell = Math.max(featherRadius, baseSize / 32);
                gridCols = Math.max(1, Math.min(128, Math.floor((boxW || 1) / targetCell) || 1));
                gridRows = Math.max(1, Math.min(128, Math.floor((boxH || 1) / targetCell) || 1));
                cellW = (boxW || 1) / gridCols;
                cellH = (boxH || 1) / gridRows;
                grid = new Array(gridCols * gridRows);
                for (var i = 0; i < grid.length; i++)
                    grid[i] = [];
                var clamp_1 = function (v, min, max) { return v < min ? min : (v > max ? max : v); };
                var toCol = function (x) { return clamp_1(Math.floor((x - minX) / cellW), 0, gridCols - 1); };
                var toRow = function (y) { return clamp_1(Math.floor((y - minY) / cellH), 0, gridRows - 1); };
                for (var ei = 0; ei < allEdges.length; ei++) {
                    var e = allEdges[ei];
                    var c1 = toCol(e.minX), c2 = toCol(e.maxX);
                    var r1 = toRow(e.minY), r2 = toRow(e.maxY);
                    for (var r = r1; r <= r2; r++) {
                        for (var c = c1; c <= c2; c++) {
                            grid[r * gridCols + c].push(ei);
                        }
                    }
                }
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
        // 为避免在羽化较大或区域狭小情况下无限循环，引入尝试上限
        var maxAttempts = Math.max(1000, count * 2000);
        var attempts = 0;
        while (results.length < count && attempts < maxAttempts) {
            attempts++;
            var rx = Math.random() * (maxX - minX) + minX;
            var ry = Math.random() * (maxY - minY) + minY;
            if (isValid(rx, ry)) {
                if (featherRadius > 0 && allEdges.length && gridCols > 0 && gridRows > 0) {
                    // 使用网格近邻查询最近边距离
                    var cx = Math.max(0, Math.min(gridCols - 1, Math.floor((rx - minX) / cellW)));
                    var cy = Math.max(0, Math.min(gridRows - 1, Math.floor((ry - minY) / cellH)));
                    var dEdge = Infinity;
                    for (var oy = -1; oy <= 1; oy++) {
                        var rr = cy + oy;
                        if (rr < 0 || rr >= gridRows)
                            continue;
                        for (var ox = -1; ox <= 1; ox++) {
                            var cc = cx + ox;
                            if (cc < 0 || cc >= gridCols)
                                continue;
                            var cell = grid[rr * gridCols + cc];
                            for (var idx = 0; idx < cell.length; idx++) {
                                var e = allEdges[cell[idx]];
                                // 包围盒距离下界快速剪枝
                                var bx = rx < e.minX ? (e.minX - rx) : (rx > e.maxX ? (rx - e.maxX) : 0);
                                var by = ry < e.minY ? (e.minY - ry) : (ry > e.maxY ? (ry - e.maxY) : 0);
                                var lowerBound = bx > 0 && by > 0 ? Math.hypot(bx, by) : Math.max(bx, by);
                                if (lowerBound >= dEdge)
                                    continue;
                                var d = pointToSegmentDistance(rx, ry, e.x1, e.y1, e.x2, e.y2);
                                if (d < dEdge)
                                    dEdge = d;
                            }
                        }
                    }
                    if (!isFinite(dEdge)) {
                        results.push([rx, ry]);
                    }
                    else {
                        var t = Math.max(0, Math.min(1, dEdge / featherRadius));
                        var prob = t * t * (3 - 2 * t);
                        if (Math.random() < prob) {
                            results.push([rx, ry]);
                        }
                    }
                }
                else if (featherRadius > 0) {
                    // 回退到精确计算（无网格或无边）
                    var dEdge = minDistanceToPolygonEdges(parent, rx, ry);
                    for (var i = 0; i < children.length; i++) {
                        var hole = children[i];
                        if (!Array.isArray(hole) || hole.length < 3)
                            continue;
                        var dh = minDistanceToPolygonEdges(hole, rx, ry);
                        if (dh < dEdge)
                            dEdge = dh;
                    }
                    var t = Math.max(0, Math.min(1, dEdge / featherRadius));
                    var prob = t * t * (3 - 2 * t);
                    if (Math.random() < prob) {
                        results.push([rx, ry]);
                    }
                }
                else {
                    results.push([rx, ry]);
                }
            }
        }
        return results;
    };

    exports.isInside = isInside;
    exports.randomPointInPolygonExcludingChildren = randomPointInPolygonExcludingChildren;

}));
