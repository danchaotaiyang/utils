
let scrollBarWidth: number | undefined;

/**
 * 获取浏览器滚动条宽度
 * @return { Number } 滚动条宽度
 * */
export const getScrollBarWidth = (): number => {
    if (scrollBarWidth !== undefined) return scrollBarWidth;

    const outer: HTMLElement = document.createElement('div');
    outer.className = 'el-scrollbar__wrap';
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.position = 'absolute';
    outer.style.top = '-9999px';
    document.body.appendChild(outer);

    const widthNoScroll = outer.offsetWidth;
    outer.style.overflow = 'scroll';

    const inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);

    const widthWithScroll = inner.offsetWidth;
    (outer as any).parentNode.removeChild(outer);
    scrollBarWidth = widthNoScroll - widthWithScroll;

    return scrollBarWidth;
};


/**
 * 浏览器进入全屏模式
 * */
export const requestFullscreen = (el: any = document.documentElement): void => {

    let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;

    if (rfs) {
        rfs.call(el);
    } else if (typeof window.ActiveXObject !== 'undefined') {

        let ws = new ActiveXObject('WScript.Shell');

        if (ws != null) {
            ws.SendKeys('{F11}');
        }
    }
};

/**
 * 浏览器退出全屏模式
 * */
export const exitFullscreen = (): void => {

    let el: any = document;
    let cfs = el.cancelFullScreen || el.mozCancelFullScreen || el.msExitFullscreen || el.webkitExitFullscreen || el.exitFullscreen;

    if (cfs) {
        cfs.call(el);
    } else if (typeof window.ActiveXObject !== 'undefined') {

        let ws = new ActiveXObject('WScript.Shell');

        if (ws != null) {
            ws.SendKeys('{F11}');
        }
    }
};

/**
 * 判断浏览器全屏状态
 * @return { Boolean } 返回是否为全屏状态
 * */
export const isFullscreen = (): boolean => Math.abs(window.screen.height - window.document.documentElement.clientHeight) <= getScrollBarWidth();

/**
 * 判断是否为桌面系统
 * @return { Boolean } 返回是否为桌面系统
 * */
export const isDesktopSystem = (): boolean => {

    const userAgentInfo = navigator.userAgent;
    const Agents = [ 'Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod' ];

    let flag = true;

    for (let v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[ v ]) > 0) {
            flag = false;
            break;
        }
    }

    return flag;
};

/**
 * 获取浏览器信息
 * @return { Object | null } 返回客户端信息
 * */
export const getBrowser = (): object | null => {
    const global: any = window;
    if (!global) {
        return null;
    }
    let document = global.document;
    let agent = global.navigator.userAgent.toLowerCase();
    //IE8+支持.返回浏览器渲染当前文档所用的模式
    //IE6,IE7:undefined.IE8:8(兼容模式返回7).IE9:9(兼容模式返回7||8)
    //IE10:10(兼容模式7||8||9)
    let IEMode = document.documentMode;
    //chrome
    let chrome = global.chrome || false;
    let System: any = {
        //user-agent
        agent: agent,
        //是否为IE
        isIE: /msie/.test(agent) || agent.indexOf('rv:11.0') > -1,
        //Gecko内核
        isGecko: agent.indexOf('gecko') > 0 && agent.indexOf('like gecko') < 0,
        //webkit内核
        isWebkit: agent.indexOf('webkit') > 0,
        //是否为标准模式
        isStrict: document.compatMode === 'CSS1Compat',
        //是否支持subtitle
        supportSubTitle() {
            return 'track' in document.createElement('track');
        },
        //是否支持scoped
        supportScope() {
            return 'scoped' in document.createElement('style');
        },
        //获取IE的版本号
        ieVersion() {
            try {
                return agent.match(/msie ([\d.]+)/)[ 1 ] || (agent.indexOf('rv:11.0') > -1 ? '11.0' : 0);
            } catch (e) {
                console.warn('ieVersion catch', e);
                return IEMode;
            }
        },
        //Opera版本号
        operaVersion() {
            try {
                if (global.opera) {
                    return agent.match(/opera.([\d.]+)/)[ 1 ];
                } else if (agent.indexOf('opr') > 0) {
                    return agent.match(/opr\/([\d.]+)/)[ 1 ];
                }
            } catch (e) {
                console.warn('operaVersion catch', e);
                return 0;
            }
        },
        //描述:version过滤.如31.0.252.152 只保留31.0
        versionFilter() {
            if (arguments.length === 1 && typeof arguments[ 0 ] === 'string') {
                let version = arguments[ 0 ];
                let start = version.indexOf('.');
                if (start > 0) {
                    let end = version.indexOf('.', start + 1);
                    if (end !== -1) {
                        return version.substr(0, end);
                    }
                }
                return version;
            } else if (arguments.length === 1) {
                return arguments[ 0 ];
            }
            return 0;
        }
    };

    try {
        //浏览器类型(IE、Opera、Chrome、Safari、Firefox)
        System.type = System.isIE ? 'IE' :
            global.opera || (agent.indexOf('opr') > 0) ? 'Opera' :
                (agent.indexOf('chrome') > 0) ? 'Chrome' :
                    //safari也提供了专门的判定方式
                    global.openDatabase ? 'Safari' :
                        (agent.indexOf('firefox') > 0) ? 'Firefox' :
                            'unknown';

        //版本号
        System.version = (System.type === 'IE') ? System.ieVersion() :
            (System.type === 'Firefox') ? agent.match(/firefox\/([\d.]+)/)[ 1 ] :
                (System.type === 'Chrome') ? agent.match(/chrome\/([\d.]+)/)[ 1 ] :
                    (System.type === 'Opera') ? System.operaVersion() :
                        (System.type === 'Safari') ? agent.match(/version\/([\d.]+)/)[ 1 ] :
                            '0';

        //浏览器外壳
        System.shell = () => {
            //遨游浏览器
            if (agent.indexOf('maxthon') > 0) {
                System.version = agent.match(/maxthon\/([\d.]+)/)[ 1 ] || System.version;
                return '傲游浏览器';
            }
            //QQ浏览器
            if (agent.indexOf('qqbrowser') > 0) {
                System.version = agent.match(/qqbrowser\/([\d.]+)/)[ 1 ] || System.version;
                return 'QQ浏览器';
            }

            //搜狗浏览器
            if (agent.indexOf('se 2.x') > 0) {
                return '搜狗浏览器';
            }

            //Chrome:也可以使用global.chrome && global.chrome.webstore判断
            if (chrome && System.type !== 'Opera') {
                let external = global.external,
                    clientInfo = global.clientInformation,
                    //客户端语言:zh-cn,zh.360下面会返回undefined
                    clientLanguage = clientInfo.languages;

                //猎豹浏览器:或者agent.indexOf("lbbrowser")>0
                if (external && 'LiebaoGetVersion' in external) {
                    return '猎豹浏览器';
                }
                //百度浏览器
                if (agent.indexOf('bidubrowser') > 0) {
                    System.version = agent.match(/bidubrowser\/([\d.]+)/)[ 1 ] ||
                        agent.match(/chrome\/([\d.]+)/)[ 1 ];
                    return '百度浏览器';
                }
                //360极速浏览器和360安全浏览器
                if (System.supportSubTitle() && typeof clientLanguage === 'undefined') {
                    //object.key()返回一个数组.包含可枚举属性和方法名称
                    let storeKeyLen = Object.keys(chrome.webstore).length,
                        v8Locale = 'v8Locale' in global;
                    return storeKeyLen > 1 ? '360极速浏览器' : '360安全浏览器';
                }
                return 'Chrome';
            }
            return System.type;
        };

        //浏览器名称(如果是壳浏览器,则返回壳名称)
        System.name = System.shell();
        //对版本号进行过滤过处理
        System.version = System.versionFilter(System.version);

    } catch (e) {
        console.warn('getBrowser catch', e);
    }
    return {
        client: System
    };
};
