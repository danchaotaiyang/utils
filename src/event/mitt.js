import mitt from 'mitt';


export class Mitt {
    constructor() {

        let emitter = mitt();
        Object.freeze(emitter);
        Object.defineProperty(this, 'emitter', {
            configurable: false,
            enumerable: false,
            get() {
                return emitter;
            }
        });

        Object.seal(this);
    }

    // 发射事件
    emit(type, data) {
        this.emitter.emit(type, data);
    }

    // 监听事件
    on(type, handler) {
        this.emitter.on(type, handler);
    }

    // 移除事件监听
    off(type, handler) {
        this.emitter.off(type, handler);
    }

    // 清理所有事件监听
    clear() {
        this.emitter.all.clear();
    }
}

Object.freeze(Mitt.prototype);

//  yarn add mitt -S
