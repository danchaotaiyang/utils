/**
 ==================================================
 BOM data manipulation
 元素类型处理
 ==================================================
 */

/**
 * 获取元素offset top
 * @param { HTMLElement } ele 目标DOM元素
 * @param { Number } offset 干预值
 * @return { Number } 返回元素偏移值
 * */
export const getElementOffsetTop = (ele: HTMLElement, offset: number = 0): number => {
    let self = ele;
    let offsetTop = self.offsetTop;
    let parent: any = self[ 'offsetParent' ];

    while (parent) {
        offsetTop += parent[ 'offsetTop' ];
        parent = parent[ 'offsetParent' ];
    }

    return offsetTop + offset;
};

/**
 * 获取元素offset left
 * @param { HTMLElement } ele 目标DOM元素
 * @param { Number } offset 干预值
 * @return { Number } 返回元素偏移值
 * */
export const getElementOffsetLeft = (ele: HTMLElement, offset: number = 0): number => {
    let self = ele;
    let offsetLeft = self.offsetLeft;
    let parent: any = self[ 'offsetParent' ];

    while (parent) {
        offsetLeft += parent[ 'offsetLeft' ];
        parent = parent[ 'offsetParent' ];
    }

    return offsetLeft + offset;
};

/**
 * 跳转到window滚动条指定位置
 * @param { Number } x 横向滚动条位置
 * @param { Number } y 纵向滚动条位置
 * */
export const scrollTo = (x: number = 0, y: number = 0) => window.scrollTo(x, y);

/**
 * 获取用户选择的文本
 * @return { Number } 用户选择的文本
 * */
export const getSelectedText = () => {
    const selected = window.getSelection();

    if (selected) {
        return selected.toString();
    }
};

/**
 * 获取浏览器窗口的尺寸
 * @return { Object } 浏览器窗口的尺寸
 * */
export const getClientSize = (): object => {

    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    return { width, height };
};
