# WebSocketClient 使用文档

## 简介

`WebSocketClient` 是一个用于管理 WebSocket 连接的 JavaScript 类，支持自动重连、连接超时、事件监听、消息发送等功能，适用于浏览器端实时通信场景。

## 引入方式

```js
import { WebSocketClient } from './websocket';
```

## 快速上手

### 创建实例

```js
const wsClient = new WebSocketClient({
    url: 'wss://your-websocket-server',
    maxReconnectAttempts: 5, // 可选，最大重连次数，默认 5
    timeout: 10000, // 可选，连接超时时间（毫秒），默认 10000
    onClose: (event) => {
        console.log('连接关闭', event);
    }
});
```

### 发送消息

```js
wsClient.send(JSON.stringify({ type: 'ping' }));
```

### 监听事件

```js
wsClient.on('open', (event) => {
    console.log('WebSocket 已连接');
});
wsClient.on('message', (data) => {
    console.log('收到消息', data);
});
wsClient.on('error', (event) => {
    console.error('WebSocket 错误', event);
});
wsClient.on('close', (event) => {
    console.log('WebSocket 关闭', event);
});
```

### 断开连接

```js
wsClient.disconnect();
```

## 配置参数

| 参数名                | 类型     | 默认值   | 说明                       |
|----------------------|----------|----------|----------------------------|
| url                  | String   | 必填     | WebSocket 服务器地址        |
| maxReconnectAttempts | Number   | 5        | 最大重连尝试次数            |
| timeout              | Number   | 10000    | 连接超时时间（毫秒）        |
| onClose              | Function | -        | 连接关闭回调（可选）        |

## 事件说明

通过 `on(eventName, callback)` 方法注册事件监听器。

| 事件名   | 参数         | 说明                 |
|----------|--------------|----------------------|
| open     | event        | 连接成功时触发       |
| message  | data         | 收到消息时触发       |
| error    | event        | 发生错误时触发       |
| close    | event        | 连接关闭时触发       |

## 方法说明

| 方法名         | 说明                                   |
|----------------|----------------------------------------|
| send(data)     | 发送数据到服务器                       |
| on(event, cb)  | 注册事件监听器                         |
| off(event, cb) | 移除事件监听器，cb 不传则移除所有监听   |
| disconnect()   | 手动断开连接                           |
| getReadyState()| 获取原生 WebSocket 的 readyState 状态码 |
| getStatus()    | 获取当前连接状态字符串                 |

## 状态说明

- `connecting`：正在连接
- `open`：已连接
- `closing`：正在关闭
- `closed`：已关闭
- `reconnecting`：重连中

## 注意事项

1. `url` 参数为必填项。
2. 连接超时和重连机制已内置，无需手动处理。
3. 事件监听需通过 `on` 方法注册，断开连接后监听器会被清理。
4. 发送消息前请确保连接已打开（可通过 `getStatus()` 或 `getReadyState()` 判断）。
5. 若需自定义重连逻辑，可扩展 `handleReconnect` 方法。

## 示例：完整流程

```js
const ws = new WebSocketClient({ url: 'wss://echo.websocket.org' });
ws.on('open', () => ws.send('hello'));
ws.on('message', (msg) => console.log('收到:', msg));
ws.on('close', () => console.log('连接关闭'));
``` 