import { isDesktopSystem } from '@/utils';

export default (options: any) => {

    let canvasElement: any = null;
    let canvasContext: any = {};
    let beginPoint: any = null;
    // 存放操作点数组  为了用二次贝塞尔曲线画圆滑的线
    let points: any[] = [];
    let canvasImage = '';
    let hasDraw = true;
    let preDrawAry: any[] = [];// 存储当前表面状态数组-上一步
    let nextDrawAry: any[] = [];// 存储当前表面状态数组-下一步
    let middleAry: any[] = [];// 中间数组
    let canvasMoveUse = false;
    let canComplete = false;
    let config: any = {
        width: 900,
        height: 500,
        lineWidth: 2,
        lineColor: '#000000',
        shadowBlur: 1
    };

    const setCanvasStyle = () => {
        canvasContext.lineWidth = config.lineWidth;
        canvasContext.shadowBlur = config.shadowBlur;
        canvasContext.shadowColor = config.lineColor;
        canvasContext.strokeStyle = config.lineColor;
        canvasContext.lineJoin = 'round';
        canvasContext.lineCap = 'round';
    };

    const getPos = (e: any): any => { //获取操作位置的横竖坐标

        let currentX, currentY, t = e.target;

        let flag = isDesktopSystem();

        if (flag) {
            currentX = e.clientX - t.parentNode.offsetLeft;
            currentY = e.clientY - t.parentNode.offsetTop;
        } else {
            if (e.changedTouches && e.changedTouches.length > 0 && e.changedTouches[ 0 ].clientX) {
                currentX = e.targetTouches[ 0 ].clientX - canvasElement.offsetLeft;
                currentY = e.targetTouches[ 0 ].clientY - canvasElement.offsetTop;
            } else {
                currentX = e.clientX - t.parentNode.offsetLeft;
                currentY = e.clientY - t.parentNode.offsetTop;
            }
        }
        return {
            x: currentX, y: currentY
        };
    };

    const drawLine = (beginPoint: any, controlPoint: any, endPoint: any) => {

        canvasContext.beginPath();

        if (beginPoint && beginPoint.x) {
            canvasContext.moveTo(beginPoint.x, beginPoint.y);
            canvasContext.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
            canvasContext.stroke();
            canvasContext.closePath();
        }

    };

    const canvasDown = (e: any) => {

        const { canvasX, canvasY } = getPos(e);

        canvasMoveUse = true;
        points = [];

        points.push({
            x: canvasX, y: canvasY
        });
        beginPoint = {
            x: canvasX, y: canvasY
        };

        setCanvasStyle(); //提前设置好  删除了选择版
        // 清除子路径
        canvasContext.beginPath();
        canvasContext.moveTo(canvasX, canvasY);
        // 当前绘图表面状态
        const preData = canvasContext.getImageData(0, 0, 600, 400);
        // 当前绘图表面进栈
        preDrawAry.push(preData);
    };
    const eventMousedown = (e: any) => {
        canvasDown(e);
    };

    const canvasUp = () => {

        if (points.length > 3) {

            const lastTwoPoints = points.slice(-2);
            const controlPoint = lastTwoPoints[ 0 ];
            const endPoint = lastTwoPoints[ 1 ];

            drawLine(beginPoint, controlPoint, endPoint);

            if (!hasDraw) {
                hasDraw = true;
            }

        }

        beginPoint = null;

        const preData = canvasContext.getImageData(0, 0, 600, 400);

        if (!nextDrawAry.length) {
            // 当前绘图表面进栈
            middleAry.push(preData);
        } else {
            middleAry = [];
            middleAry = middleAry.concat(preDrawAry);
            middleAry.push(preData);
            nextDrawAry = [];
        }

        canvasMoveUse = false;
    };
    const eventMouseup = () => {
        canvasUp();
    };

    const canvasMove = (e: any) => {

        e.preventDefault();

        if (canvasMoveUse) {

            const { x, y } = getPos(e);

            points.push({ x, y });

            if (points.length > 3) {

                const lastTwoPoints = points.slice(-2);
                const controlPoint = lastTwoPoints[ 0 ];
                const endPoint = {
                    x: (lastTwoPoints[ 0 ].x + lastTwoPoints[ 1 ].x) / 2,
                    y: (lastTwoPoints[ 0 ].y + lastTwoPoints[ 1 ].y) / 2
                };

                drawLine(beginPoint, controlPoint, endPoint);

                beginPoint = endPoint;

                if (!hasDraw) {
                    hasDraw = true;
                }
            }
        }
    };
    const eventMousemove = (e: any) => {
        canvasMove(e);
    };

    const clearCanvas = () => {
        canvasContext.clearRect(0, 0, config.width, config.height);
        points = [];
        if (hasDraw) {
            hasDraw = false;
        }
    };

    const complete = () => {
        canComplete = points.length > 3;
        getImage();
        canvasUp();
        canvasContext.clearRect(0, 0, config.width, config.height);

        return canvasImage;
    };

    const getImage = () => {
        if (points.length > 3) {
            canvasImage = canvasElement.toDataURL('image/png');
        } else {
            canvasImage = '';
        }
    };

    const reset = () => {
        clearCanvas();
    };

    const create = (options: any = {}) => {

        Object.assign(config, options);

        const { el, width, height } = config;

        if (!el) {
            return null;
        }

        canvasElement = document.querySelector(el);

        canvasContext = canvasElement.getContext('2d');
        const preData = canvasContext.getImageData(0, 0, width, height);
        // 空绘图表面进栈
        middleAry.push(preData);
        setCanvasStyle();
        canvasElement.style.width = width;
        canvasElement.style.height = height;
        canvasElement.width = width;
        canvasElement.height = height;
        canvasImage = '';

        canvasElement.removeEventListener('touchstart', eventMousedown, false);
        canvasElement.removeEventListener('touchend', eventMouseup, false);
        canvasElement.removeEventListener('touchmove', eventMousemove, false);
        canvasElement.removeEventListener('mousedown', eventMousedown, false);
        canvasElement.removeEventListener('mouseup', eventMouseup, false);
        canvasElement.removeEventListener('mousemove', eventMousemove, false);

        canvasElement.addEventListener('touchstart', eventMousedown, false);
        canvasElement.addEventListener('touchend', eventMouseup, false);
        canvasElement.addEventListener('touchmove', eventMousemove, false);
        canvasElement.addEventListener('mousedown', eventMousedown, false);
        canvasElement.addEventListener('mouseup', eventMouseup, false);
        canvasElement.addEventListener('mousemove', eventMousemove, false);

        return {
            el: canvasElement,
            config,
            complete,
            reset
        };

    };

    return create(options);

};

