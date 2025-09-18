(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.tools = {}));
})(this, (function (exports) { 'use strict';

    /**
     ==================================================
     Object type data manipulation
     对象类型数据处理
     ==================================================
     */
    /**
     * 判断是否为空值
     * @param { * } value -任意类型值
     * @return { Boolean } 是否为空值
     * */
    /**
     * 判断是否为对象
     * @param { * } value 任意数据类型值
     * @return { Boolean } 返回是否为对象的布尔值
     */
    var isObject = function (value) { return typeof value === 'object' && value !== null && !Array.isArray(value); };

    /**
     ==================================================
     Array type data manipulation
     数组类型数据处理
     ==================================================
     */
    /**
     * 打乱数组顺序
     * @param { Array } value - 任意类型项的数组
     * @return { Array } 打乱顺序后的数组
     * */
    /**
     * 判断是否为数组
     * @param { * } value - 任意数据类型值
     * @return { Boolean } 返回是否为数组的布尔值
     * */
    var isArray = function (value) { return Array.isArray(value); };

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
    var unitMatch = function (value, normal) {
        if (normal === void 0) { normal = 'px'; }
        var unit = '';
        var matched = value.match(/(px|rpx|em|rem|vw|vh|%)$/);
        if (matched) {
            unit = matched[0];
        }
        return "".concat(value).concat(unit ? '' : normal);
    };
    /**
     * 清除对象属性值中字符串的首尾空格
     * @param { * } data - 参数说明
     * @return { * } 清理后的值
     * */
    var trimParams = function (data) {
        if (isArray(data)) {
            data = data.map(function (d) { return trimParams(d); });
        }
        if (isObject(data)) {
            Object.keys(data).map(function (key) { return data[key] = trimParams(data[key]); });
        }
        if (typeof data === 'string') {
            data = data.replace(/(^\s*)|(\s*$)/g, '');
        }
        return data;
    };
    var pow1024 = function (value) { return Math.pow(1024, value); };
    /**
     * 存储容量转换
     * @param { Number } value - 原字节值
     * @param { Number } fixed - 保留原值精度
     * @return { String } 结果
     * */
    var formatByte = function (value, fixed) {
        if (fixed === void 0) { fixed = 2; }
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
    var getGradientLocation = function (dx, dy) {
        var tanV = dx / dy;
        var directSign = Math.abs(tanV) < 1;
        var t = directSign ? tanV : 1 / tanV;
        var sign1 = t > 0 ? 1 : -1;
        var sign2 = dx > 0 ? 1 : -1;
        var sign = directSign ? sign1 * sign2 : sign2;
        var group1 = [0.5 - sign * t / 2, 0.5 + sign * t / 2];
        var group2 = sign > 0 ? [0, 1] : [1, 0];
        var group = group1.concat(group2);
        var keys = directSign ? ['x', 'x2', 'y', 'y2'] : ['y', 'y2', 'x', 'x2'];
        var res = {};
        keys.forEach(function (k, idx) {
            res[k] = group[idx];
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
    var getGradientCoordinates = function (startArc, endArc) {
        var position = [
            Math.sin(startArc),
            -Math.cos(startArc),
            Math.sin(endArc),
            -Math.cos(endArc)
        ];
        var dx = position[2] - position[0];
        var dy = position[3] - position[1];
        return getGradientLocation(dx, dy);
    };
    /**
     * 延迟等待
     *
     * @param { Number } [time = 32] 等待时间
     */
    var waiting = function (time) {
        if (time === void 0) { time = 32; }
        return new Promise(function (resolve) {
            var timerCallback = null;
            var timerWait = null;
            timerCallback = function () {
                resolve();
                clearTimeout(timerWait);
                timerCallback = null;
                timerWait = null;
            };
            timerWait = setTimeout(timerCallback, time);
        });
    };

    exports.formatByte = formatByte;
    exports.getGradientCoordinates = getGradientCoordinates;
    exports.trimParams = trimParams;
    exports.unitMatch = unitMatch;
    exports.waiting = waiting;

}));
