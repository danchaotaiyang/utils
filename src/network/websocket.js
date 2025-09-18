export class WebSocketClient {
    // 连接状态常量
    static CONNECTING = 'connecting';
    static OPEN = 'open';
    static CLOSING = 'closing';
    static CLOSED = 'closed';
    static RECONNECTING = 'reconnecting';

    options = {};
    connectionTimer = null; // 新增：连接超时定时器
    reconnectAttempts = 0;
    explicitlyClosed = false; // 标记是否是用户手动关闭连接
    listeners = { open: [], message: [], error: [], close: [] }; // 新增：存储 on 方法注册的监听器
    status = WebSocketClient.CLOSED; // 新增：连接状态属性

    /**
     * @param {object} options 配置项
     * @param {string} options.url WebSocket 服务器地址
     * @param {number} [options.maxReconnectAttempts=5] 最大重连尝试次数
     * @param {number} [options.timeout=10000] 连接超时时间 (毫秒)
     */
    constructor(options) {
        this.options = {
            maxReconnectAttempts: 5, // 默认最多重连 5 次
            timeout: 10000, // 默认连接超时 10 秒
            ...options
        };
        if (!this.options.url) {
            throw new Error('WebSocket URL 是必须的。');
        }
        this.connect();
        Object.seal(this);
    }

    connect() {
        // 如果已经是 OPEN 或 CONNECTING，则不执行任何操作
        if (this.status === WebSocketClient.OPEN || this.status === WebSocketClient.CONNECTING) {
            console.warn(`WebSocket 当前状态为 ${ this.status }，无需重复连接。`);
            return;
        }

        // console.log('开始连接 WebSocket...');
        this.status = WebSocketClient.CONNECTING; // 标记为连接中
        this.explicitlyClosed = false;

        // 清除可能存在的旧的连接超时定时器
        if (this.connectionTimer) {
            clearTimeout(this.connectionTimer);
            this.connectionTimer = null;
        }

        // 设置连接超时定时器
        this.connectionTimer = setTimeout(() => {
            if (this.status === WebSocketClient.CONNECTING) {
                console.warn('WebSocket 连接超时。');
                this.ws?.close(); // 尝试关闭可能正在连接的 ws 实例
                this.status = WebSocketClient.CLOSED; // 设置状态为 CLOSED
                // 触发错误监听器，可以传递一个特定的错误信息
                const errorEvent = new Event('error');
                // 你可以在这里添加自定义属性到事件对象，如 event.reason = 'timeout';
                this.listeners.error.forEach(callback => callback(errorEvent));
                // 尝试重连
                if (!this.explicitlyClosed && this.options.timeout > 0 && this.options.maxReconnectAttempts > 0) {
                    this.handleReconnect();
                }
            }
        }, this.options.timeout);

        try {
            let ws = new WebSocket(this.options.url);
            Object.freeze(ws);
            Object.defineProperty(this, 'ws', {
                configurable: false,
                enumerable: false,
                get() {
                    return ws;
                }
            });
        } catch (error) {
            console.warn('创建 WebSocket 失败:', error);
            this.status = WebSocketClient.CLOSED; // 创建失败，状态视为 CLOSED
            // 不再重连
            return; // 阻止后续事件绑定
        }

        this.ws.onopen = (event) => {
            this.status = WebSocketClient.OPEN; // 设置状态为已连接
            // 清除连接超时定时器
            if (this.connectionTimer) {
                clearTimeout(this.connectionTimer);
                this.connectionTimer = null;
            }
            this.reconnectAttempts = 0; // 连接成功后重置重连次数
            // 调用通过 on 方法注册的 open 监听器
            this.listeners.open.forEach(callback => callback(event));
        };

        this.ws.onmessage = (event) => {
            try {
                // 调用通过 on 方法注册的 message 监听器
                let { data } = event;
                data = JSON.parse(data);
                this.listeners.message.forEach(callback => callback(data));
            } catch (e) {
                console.warn(e);
            }
        };

        this.ws.onerror = (event) => {
            console.warn('WebSocket 错误:', event);
            // 但在此处触发 error 监听器是合适的
            this.listeners.error.forEach(callback => callback(event));
        };

        this.ws.onclose = (event) => {
            this.status = WebSocketClient.CLOSED; // 默认设置为 CLOSED
            // 调用通过 on 方法注册的 close 监听器
            this.listeners.close.forEach(callback => callback(event));

            // 不再重连，直接清理监听器
            this.listeners = { open: [], message: [], error: [], close: [] };
        };
    }

    /**
     * 发送数据
     * @param {string | ArrayBufferLike | Blob | ArrayBufferView} data 要发送的数据
     */
    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(data);
        } else {
            console.warn('WebSocket 尚未连接。');
            // 可以在这里添加消息缓冲逻辑，等待连接成功后发送
        }
    }

    /**
     * 注册 WebSocket 事件监听器
     * @param {'open' | 'message' | 'error' | 'close'} eventName 事件名称
     * @param {Function} callback 回调函数
     */
    on(eventName, callback) {
        if (this.listeners[ eventName ]) {
            this.listeners[ eventName ].push(callback);
        } else {
            console.warn(`不支持的事件类型: ${ eventName }`);
        }
    }

    /**
     * 移除 WebSocket 事件监听器
     * @param {'open' | 'message' | 'error' | 'close'} eventName 事件名称
     * @param {Function} [callback] 要移除的回调函数。如果未提供，则移除该事件的所有监听器。
     */
    off(eventName, callback) {
        if (this.listeners[ eventName ]) {
            if (callback) {
                // 移除指定的回调
                this.listeners[ eventName ] = this.listeners[ eventName ].filter(
                    listener => listener !== callback
                );
            } else {
                // 移除该事件的所有回调
                this.listeners[ eventName ] = [];
            }
        } else {
            console.warn(`不支持的事件类型: ${ eventName }`);
        }
    }

    /**
     * 手动断开 WebSocket 连接
     */
    disconnect() {
        if (this.ws) {
            // console.log('手动断开 WebSocket 连接。');
            this.explicitlyClosed = true;
            // 清理原生 WebSocket 事件监听器
            this.ws.onopen = null;
            this.ws.onmessage = null;
            this.ws.onerror = null;
            this.ws.onclose = null;
            // 关闭连接
            this.status = WebSocketClient.CLOSING; // 标记为正在关闭
            this.ws.close(1000, 'Manual disconnection'); // 使用标准关闭代码 1000
            // onclose 事件处理器会将状态最终设为 CLOSED
            // 并清理 listeners
            this.ws = null; // 清理 WebSocket 实例引用
        }
    }

    /**
     * 处理重连逻辑
     * @private
     */
    handleReconnect() {
        // 确保 ws 实例已被清理或连接已关闭，避免旧连接干扰
        if (this.ws) {
            // 显式地移除事件监听器，防止内存泄漏和意外行为
            this.ws.onopen = null;
            this.ws.onmessage = null;
            this.ws.onerror = null;
            this.ws.onclose = null;
            // 如果连接仍然存在，则尝试关闭它
            if (this.ws.readyState !== WebSocket.CLOSED) {
                this.ws.close();
            }
            this.ws = null;
        }

        if (this.reconnectAttempts < (this.options.maxReconnectAttempts ?? 0)) {
            this.reconnectAttempts++;
            console.log(`尝试重新连接 (${ this.reconnectAttempts }/${ this.options.maxReconnectAttempts })...`);
            this.status = WebSocketClient.RECONNECTING; // 设置状态为重连中
            this.connect();
        } else {
            console.warn('已达到最大重连尝试次数。');
            this.status = WebSocketClient.CLOSED; // 重连失败，状态设为 CLOSED
            // 可以在这里触发一个特定的事件或回调，通知应用重连失败
            // 重置监听器，因为连接已永久失败
            this.listeners = { open: [], message: [], error: [], close: [] };
        }
    }

    /**
     * 获取 WebSocket 的当前状态 (readyState)
     * @returns {number | null} 返回 WebSocket 的 readyState 状态码，如果 ws 未初始化则返回 null
     * WebSocket.CONNECTING (0): 正在连接
     * WebSocket.OPEN (1): 已连接
     * WebSocket.CLOSING (2): 正在关闭
     * WebSocket.CLOSED (3): 已关闭
     */
    getReadyState() {
        return this.ws ? this.ws.readyState : null;
    }

    /**
     * 获取当前的连接状态
     * @returns {string} 返回当前的状态字符串 (connecting, open, closing, closed, reconnecting)
     */
    getStatus() {
        return this.status;
    }
}

Object.freeze(WebSocketClient.prototype);
