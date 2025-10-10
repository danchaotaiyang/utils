class Analyser {

    constructor(preferences) {

        this.validationPreferences(preferences);

        this.defineAnalyser(preferences);

        this.createAnalyser();

        Object.freeze(this);
    }

    validationPreferences(preferences) {

        if (!preferences) {
            throw new TypeError('Analyser: preferences 参数不能为空，请传入包含 source、mode 等配置的对象');
        }

        let { source, mode, fftSize = 32768 / 4 } = preferences;

        if (typeof source === 'string') {
            throw new TypeError('Analyser: preferences.source 参数不支持字符串URL，请先加载音频文件并传入 AudioBuffer 或 HTMLMediaElement 对象');
        }

        if (typeof mode !== 'string') {
            throw new TypeError('Analyser: preferences.mode 参数类型错误，期望字符串类型，实际传入：' + typeof mode);
        }

        if (typeof fftSize !== 'number' || !Number.isInteger(fftSize)) {
            throw new TypeError('Analyser: preferences.fftSize 参数必须是整数类型，实际传入：' + typeof fftSize);
        }

        if (fftSize < 32 || fftSize > 32768 || (fftSize & (fftSize - 1)) !== 0) {
            throw new RangeError('Analyser: preferences.fftSize 参数必须在 32 到 32768 范围内且为 2 的幂，实际传入：' + fftSize);
        }
    }

    defineAnalyser(preferences) {

        let { source, mode, fftSize = 32768 / 4 } = preferences;

        Object.defineProperty(this, 'source', {
            configurable: false,
            enumerable: false,
            get() {
                return source;
            }
        });

        Object.defineProperty(this, 'mode', {
            configurable: false,
            enumerable: false,
            get() {
                return mode;
            }
        });

        Object.defineProperty(this, 'fftSize', {
            configurable: false,
            enumerable: false,
            get() {
                return fftSize;
            }
        });
    }

    createSource() {

        const source = this.source;

        // HTMLMediaElement (audio, video)
        if (source instanceof HTMLMediaElement) {
            return this.analyserContext.createMediaElementSource(source);
        }

        // MediaStream (getUserMedia, captureStream, etc.)
        if (source instanceof MediaStream) {
            return this.analyserContext.createMediaStreamSource(source);
        }

        // AudioBuffer (预加载的音频数据)
        if (source instanceof AudioBuffer) {
            const bufferSource = this.analyserContext.createBufferSource();
            bufferSource.buffer = source;
            bufferSource.loop = true;
            bufferSource.start();
            return bufferSource;
        }

        // OscillatorNode (合成音频)
        if (source instanceof OscillatorNode) {
            return source;
        }

        // GainNode (音量控制)
        if (source instanceof GainNode) {
            return source;
        }

        // AudioNode (其他音频节点)
        if (source instanceof AudioNode) {
            return source;
        }

        throw new TypeError(`Analyser: 不支持的音频源类型：${ source.constructor.name }，请传入AudioBuffer、HTMLMediaElement或AudioNode对象`);
    }

    createAnalyser() {

        if (!AudioContext) {
            AudioContext = window[ 'webkitAudioContext' ];
        }

        let context = new AudioContext();
        Object.freeze(context);
        Object.defineProperty(this, 'analyserContext', {
            configurable: false,
            enumerable: false,
            get() {
                return context;
            }
        });

        let node = context.createAnalyser();
        node.fftSize = this.fftSize;
        node.connect(context.destination);
        Object.freeze(node);
        Object.defineProperty(this, 'analyserNode', {
            configurable: false,
            enumerable: false,
            get() {
                return node;
            }
        });

        let source = this.createSource();
        source.connect(node);
        Object.freeze(source);
        Object.defineProperty(this, 'analyserSource', {
            configurable: false,
            enumerable: false,
            get() {
                return source;
            }
        });
    }

    createAnalyserData() {

        //  将当前频率数据复制到传入的 Uint8Array（无符号字节数组）中。
        //  如果数组的长度小于 Analyser.frequencyBinCount, 那么 Analyser 多出的元素会被删除。如果是大于，那么数组多余的元素会被忽略。
        //  analyserNode.getByteFrequencyData(new Uint8Array());

        //  复制当前波形或时域数据到传递给它的 Uint8Array (无符号字节数组) 中
        //  analyserNode.getByteTimeDomainData(new Uint8Array());

        //  将当前分析节点（Analyser）的频率数据拷贝进一个 Float32Array 数组对象。
        //  此数组表示的频率范围为 0 ~ 22050 Hz，每个元素表示对应频率上的信号分量强度，单位为分贝。
        //  如果你需要更好的性能并且不太在意数据的精度，你可以使用 Analyser.getByteFrequencyData() 作为代替，这一接口使用 Uint8Array来存储数据（对应的也是这个精度的格式）.
        //  analyserNode.getFloatFrequencyData(new Float32Array());

        //  将当前波形或时域数据复制到Float32Array传入的数组中。每个数组值都是一个样本，即特定时间的信号幅度。
        //  analyserNode.getFloatTimeDomainData(new Float32Array());

        let dataType;
        let dataSize;

        switch (this.mode) {
            case 'byteFrequency': {
                dataType = 'Uint8Array';
                dataSize = 'frequencyBinCount';
                break;
            }
            case 'byteTimeDomain': {
                dataType = 'Uint8Array';
                dataSize = 'fftSize';
                break;
            }
            case 'floatFrequency': {
                dataType = 'Float32Array';
                dataSize = 'frequencyBinCount';
                break;
            }
            case 'floatTimeDomain': {
                dataType = 'Float32Array';
                dataSize = 'fftSize';
                break;
            }
        }

        let size = this.analyserNode[ dataSize ];

        switch (dataType) {
            case 'Uint8Array': {
                return new Uint8Array(size);
            }
            case 'Float32Array': {
                return new Float32Array(size);
            }
        }
    }

    setData(data, callback) {

        if (!(data && (data instanceof Uint8Array || data instanceof Float32Array))) {
            return;
        }

        switch (this.mode) {
            case 'byteFrequency': {
                this.analyserNode.getByteFrequencyData(data);
                break;
            }
            case 'byteTimeDomain': {
                this.analyserNode.getByteTimeDomainData(data);
                break;
            }
            case 'floatFrequency': {
                this.analyserNode.getFloatFrequencyData(data);
                break;
            }
            case 'floatTimeDomain': {
                this.analyserNode.getFloatTimeDomainData(data);
                break;
            }
        }

        typeof callback === 'function' && callback(data);
    }

    destroy() {

        // 断开音频节点连接
        try {
            if (this.analyserNode && typeof this.analyserNode.disconnect === 'function') {
                this.analyserNode.disconnect();
            }
        } catch (_) {
        }

        // 如果是 BufferSource，需要停止播放
        try {
            if (this.analyserSource && typeof this.analyserSource.stop === 'function') {
                this.analyserSource.stop();
            }
        } catch (_) {
        }

        // 关闭音频上下文
        try {
            if (this.analyserContext && typeof this.analyserContext.close === 'function') {
                this.analyserContext.close();
            }
        } catch (_) {
        }
    }
}

Object.freeze(Analyser.prototype);

class AudioAnalyser {

    constructor(preferences) {

        this.validationPreferences(preferences);

        this.defineAnalyser(preferences);

        Object.seal(this);
    }

    validationPreferences(preferences) {

        if (!preferences) {
            throw new TypeError('AudioAnalyser: preferences 参数不能为空，请传入包含 source、mode 等配置的对象');
        }

        let { source, mode, fftSize = 32768 / 4 } = preferences;

        if (typeof source === 'string') {
            throw new TypeError('AudioAnalyser: preferences.source 参数不支持字符串URL，请先加载音频文件并传入 AudioBuffer 或 HTMLMediaElement 对象');
        }

        if (typeof mode !== 'string') {
            throw new TypeError('AudioAnalyser: preferences.mode 参数类型错误，期望字符串类型，实际传入：' + typeof mode);
        }

        if (typeof fftSize !== 'number' || !Number.isInteger(fftSize)) {
            throw new TypeError('AudioAnalyser: preferences.fftSize 参数必须是整数类型，实际传入：' + typeof fftSize);
        }

        if (fftSize < 32 || fftSize > 32768 || (fftSize & (fftSize - 1)) !== 0) {
            throw new RangeError('AudioAnalyser: preferences.fftSize 参数必须在 32 到 32768 范围内且为 2 的幂，实际传入：' + fftSize);
        }
    }

    defineAnalyser(preferences) {

        let analyserNode = new Analyser(preferences);
        Object.freeze(analyserNode);
        Object.defineProperty(this, 'analyserNode', {
            configurable: false,
            enumerable: true,
            get() {
                return analyserNode;
            }
        });

        let data = analyserNode.createAnalyserData();
        Object.defineProperty(this, 'data', {
            get() {
                return data;
            },
            set(value) {
                data = value;
            }
        });

        let running = false;
        Object.defineProperty(this, 'running', {
            configurable: false,
            get() {
                return running;
            },
            set(value) {
                running = value;
                if (running) {
                    this.update();
                }
            }
        });

        let events = {};
        Object.defineProperty(this, 'events', {
            configurable: false,
            enumerable: true,
            get() {
                return events;
            }
        });
    }

    update() {

        requestIdleCallback(() => {
            this.running && this.update();
        });

        this.analyserNode.setData(this.data, () => {
            this.dispatch('update', this.data);
        });
    }

    on(eventName, callback) {
        this.events[ eventName ] = callback;
    }

    dispatch(eventName, data) {
        let eventCallback = this.events[ eventName ];
        typeof eventCallback === 'function' && eventCallback(data);
    }

    destroy() {
        this.pause();
        this.events = {};
        this.analyserNode.destroy();
    }

    start() {
        let { analyserContext: context } = this.analyserNode;
        if (context && context.state === 'suspended' && typeof context.resume === 'function') {
            context.resume();
        }
        this.running = true;
    }

    pause() {
        this.running = false;
    }
}

Object.freeze(AudioAnalyser.prototype);

export default AudioAnalyser;