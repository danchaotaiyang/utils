import { lamejs } from './lame.all.js';

// 动态注入 AudioWorkletProcessor
const workletCode = `
class LameProcessor extends AudioWorkletProcessor {
    process(inputs) {
        const input = inputs[0];
        if (input && input[0]) {
            this.port.postMessage(input[0]);
        }
        return true;
    }
}
registerProcessor('lame-processor', LameProcessor);
`;

export async function loadLameWorklet(audioContext) {
    const blob = new Blob([workletCode], { type: 'application/javascript' });
    const blobUrl = URL.createObjectURL(blob);
    await audioContext.audioWorklet.addModule(blobUrl);
    URL.revokeObjectURL(blobUrl);
}

// 检查 lamejs 是否正确加载
if (!lamejs || !lamejs.Mp3Encoder) {
    console.warn('lamejs 加载失败:', lamejs);
    throw new Error('lamejs 库加载失败，请确保正确安装和导入');
}

export class LameRecorder {
    constructor(options = {}) {
        this.config = {
            sampleRate: 44100,
            bitRate: 128,
            channels: 1,
            ...options
        };

        // 内部状态
        this.audioContext = null;
        this.mediaStream = null;
        this.audioWorkletNode = null;
        this.mp3Encoder = null;
        this.audioChunks = [];
        this.analyserNode = null;
        this.volumeDataArray = null;

        // 录音状态
        this.isRecording = false;
        this.isPaused = false;
        this.duration = 0;
        this.startTime = 0;
        this.pausedTime = 0;
        this.lastPauseTime = 0;
        this.volumeCallback = null;
        this.animationFrameId = null;
    }

    /**
     * 检查浏览器是否支持录音功能
     */
    static checkSupport() {
        const support = {
            mediaDevices: !!navigator.mediaDevices,
            getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
            audioContext: !!(window.AudioContext || window.webkitAudioContext),
            supported: false
        };

        support.supported = support.mediaDevices &&
            support.getUserMedia &&
            support.audioContext;

        return support;
    }

    /**
     * 请求麦克风权限
     */
    async requestPermission() {
        const support = LameRecorder.checkSupport();
        if (!support.supported) {
            throw new Error('您的浏览器不支持录音功能，请使用现代浏览器');
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (error) {
            let message = '麦克风访问失败：';
            switch (error.name) {
                case 'NotAllowedError':
                    message += '请允许浏览器访问麦克风';
                    break;
                case 'NotFoundError':
                    message += '未找到麦克风设备';
                    break;
                case 'NotReadableError':
                    message += '麦克风被占用或无法访问';
                    break;
                default:
                    message += error.message || '未知错误';
            }
            throw new Error(message);
        }
    }

    /**
     * 开始录音
     */
    async start(onVolumeChange = null) {
        if (this.isRecording) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();

            // 动态加载 worklet
            await loadLameWorklet(this.audioContext);

            // 获取音频流
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            // 设置音频分析器
            this.analyserNode = this.audioContext.createAnalyser();
            this.analyserNode.fftSize = 256;
            const source = this.audioContext.createMediaStreamSource(this.mediaStream);
            source.connect(this.analyserNode);

            // 初始化 MP3 编码器
            try {
                this.mp3Encoder = new lamejs.Mp3Encoder(
                    this.config.channels,
                    this.config.sampleRate,
                    this.config.bitRate
                );
            } catch (error) {
                console.warn('MP3 编码器初始化失败:', error);
                return;
            }

            // 创建 AudioWorkletNode
            this.audioWorkletNode = new AudioWorkletNode(this.audioContext, 'lame-processor');
            this.audioWorkletNode.port.onmessage = (event) => {
                if (!this.isRecording || this.isPaused) return;
                const inputData = event.data;
                // Float32Array 转 Int16Array
                const int16Data = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                    int16Data[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
                }
                // 编码为 MP3
                const mp3Data = this.mp3Encoder.encodeBuffer(int16Data);
                if (mp3Data.length > 0) {
                    this.audioChunks.push(mp3Data);
                }
            };

            // 连接节点
            source.connect(this.audioWorkletNode);
            this.audioWorkletNode.connect(this.audioContext.destination);

            // 初始化音量监控
            this.volumeCallback = onVolumeChange;
            this.volumeDataArray = new Uint8Array(this.analyserNode.frequencyBinCount);

            // 重置状态
            this.audioChunks = [];
            this.duration = 0;
            this.startTime = Date.now();
            this.pausedTime = 0;
            this.lastPauseTime = 0;
            this.isRecording = true;
            this.isPaused = false;

            // 启动计时器和音量监控
            this._startTimer();
            if (this.volumeCallback) {
                this._startVolumeMonitor();
            }
        } catch (error) {
            console.warn('录音初始化失败:', error);
            throw new Error(error);
        }
    }

    /**
     * 暂停录音
     */
    pause() {
        if (!this.isRecording || this.isPaused) return;

        this.isPaused = true;
        this.lastPauseTime = Date.now();
        this._stopTimer();

        // 暂停音频流
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => {
                track.enabled = false;
            });
        }
    }

    /**
     * 继续录音
     */
    resume() {
        if (!this.isRecording || !this.isPaused) return;

        this.isPaused = false;
        this.pausedTime += Date.now() - this.lastPauseTime;
        this._startTimer();

        // 恢复音频流
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => {
                track.enabled = true;
            });
        }
    }

    /**
     * 停止录音
     */
    async stop() {
        if (!this.isRecording) return null;

        return new Promise((resolve) => {
            try {
                // 确保所有数据都被编码
                const mp3Data = this.mp3Encoder.flush();
                if (mp3Data.length > 0) {
                    this.audioChunks.push(mp3Data);
                }

                // 创建最终的 MP3 Blob
                const mp3Blob = new Blob(this.audioChunks, { type: 'audio/mp3' });

                this._cleanup();
                resolve(mp3Blob);
            } catch (error) {
                console.warn('停止录音时出错:', error);
                this._cleanup();
                resolve(null);
            }
        });
    }

    /**
     * 获取录音时长（秒）
     */
    getDuration() {
        return Math.floor(this.duration / 1000);
    }

    /**
     * 清理资源
     */
    _cleanup() {
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }

        if (this.audioContext) {
            this.audioContext.close().catch(console.warn);
            this.audioContext = null;
        }

        if (this.audioWorkletNode) {
            this.audioWorkletNode.disconnect();
            this.audioWorkletNode = null;
        }

        if (this.analyserNode) {
            this.analyserNode.disconnect();
            this.analyserNode = null;
        }

        this.mp3Encoder = null;
        this._stopTimer();
        this._stopVolumeMonitor();

        this.isRecording = false;
        this.isPaused = false;
        this.duration = 0;
        this.startTime = 0;
        this.pausedTime = 0;
        this.lastPauseTime = 0;
    }

    /**
     * 开始计时器
     */
    _startTimer() {
        this._stopTimer();

        const updateTimer = () => {
            if (!this.isPaused && this.isRecording) {
                this.duration = Date.now() - this.startTime - this.pausedTime;
                this.animationFrameId = requestAnimationFrame(updateTimer);
            }
        };
        this.animationFrameId = requestAnimationFrame(updateTimer);
    }

    /**
     * 停止计时器
     */
    _stopTimer() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * 开始音量监控
     */
    _startVolumeMonitor() {
        const monitorVolume = () => {
            if (!this.isRecording || !this.analyserNode || !this.volumeCallback) {
                return;
            }

            this.analyserNode.getByteFrequencyData(this.volumeDataArray);

            // 计算音量级别（0-100）
            let sum = 0;
            for (let i = 0; i < this.volumeDataArray.length; i++) {
                sum += this.volumeDataArray[i];
            }
            const average = sum / this.volumeDataArray.length;
            const volume = Math.round((average / 255) * 100);

            this.volumeCallback(volume);
            requestAnimationFrame(monitorVolume);
        };

        monitorVolume();
    }

    /**
     * 停止音量监控
     */
    _stopVolumeMonitor() {
        this.volumeCallback = null;
    }
}

export default LameRecorder;
