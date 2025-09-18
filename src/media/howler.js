import { Howl } from 'howler';


/**
 * 音频状态枚举
 * @enum {string}
 */
export const AudioState = {
    /** 加载中 */
    LOADING: 'loading',
    /** 已加载 */
    LOADED: 'loaded',
    /** 播放中 */
    PLAYING: 'playing',
    /** 已暂停 */
    PAUSED: 'paused',
    /** 已停止 */
    STOPPED: 'stopped',
    /** 错误状态 */
    ERROR: 'error',
    MUTED: 'muted'
};

/**
 * 音频管理器类
 * 用于管理所有音频实例，提供音频的加载、播放、暂停、停止等功能
 * @class
 */
export class AudioManager {
    /**
     * 构造函数
     * 初始化音频管理器，设置默认音量和循环状态
     */
    constructor() {
        /** @type {Map<string, Howl>} 音频实例映射表 */
        this.audios = new Map();
        /** @type {number} 默认音量值，范围 0-1 */
        this.defaultVolume = 1.0;
        /** @type {boolean} 默认是否循环播放 */
        this.defaultLoop = false;
    }

    /**
     * 获取音频实例
     * @param {string} src - 音频源路径
     * @returns {Howl|null} 返回音频实例，如果不存在则返回 null
     */
    getAudio(src) {
        return this.audios.get(src) || null;
    }

    /**
     * 添加音频
     * @param {string} src - 音频源路径
     * @param {Object} options - 配置选项
     * @param {number} [options.volume=1.0] - 音量值，范围 0-1
     * @param {boolean} [options.mute=false] - 是否静音
     * @param {boolean} [options.loop=false] - 是否循环播放
     * @returns {Howl|null} 返回音频实例，如果创建失败则返回 null
     */
    load(src, options = {}) {
        return new Promise((resolve, reject) => {
            if (!src || typeof src !== 'string') {
                console.warn('无效的音频源');
                reject('无效的音频源');
            }

            if (this.audios.has(src)) {
                resolve(this.getAudio(src));
            }

            try {
                const instance = new Howl({
                    src: [ src ],
                    html5: true,
                    format: ['mp3', 'wav'],
                    volume: options.volume ?? this.defaultVolume,
                    loop: options.loop ?? this.defaultLoop,
                    onload: () => {
                        // console.log('音频加载成功:', src);
                        instance.state = AudioState.LOADED;
                    },
                    onloaderror: (id, error) => {
                        console.warn('音频加载失败:', error, src);
                        instance.state = AudioState.ERROR;
                    },
                    onplayerror: (id, error) => {
                        console.warn('音频播放失败:', error, src);
                        instance.state = AudioState.ERROR;
                    },
                    onplay: () => {
                        // console.log('开始播放:', src);
                        instance.state = AudioState.PLAYING;
                        typeof options.onPlay === 'function' && options.onPlay();
                    },
                    onpause: () => {
                        // console.log('暂停播放:', src);
                        instance.state = AudioState.PAUSED;
                        typeof options.onPause === 'function' && options.onPause();
                    },
                    onstop: () => {
                        // console.log('停止播放:', src);
                        instance.state = AudioState.STOPPED;
                        typeof options.onEnd === 'function' && options.onEnd();
                    },
                    onend: () => {
                        // console.log('播放结束:', src);
                        instance.state = AudioState.STOPPED;
                        typeof options.onEnd === 'function' && options.onEnd();
                    }
                });
                this.audios.set(src, instance);
                resolve(instance);
            } catch (error) {
                console.error('创建音频实例失败:', error);
                reject(error);
            }
        });
    }

    /**
     * 播放音频
     * @param {string} src - 音频源路径
     * @param {Object} options - 配置选项
     * @param {number} [options.volume] - 音量值，范围 0-1
     * @param {boolean} [options.loop] - 是否循环播放
     */
    async play(src, options = {}) {

        const instance = this.audios.get(src) || await this.load(src, options);

        instance.volume(options.volume ?? this.defaultVolume);
        instance.mute(options.mute);
        instance.loop(options.loop ?? this.defaultLoop);

        if (instance && instance.state !== AudioState.ERROR) {
            instance.play();
        }
    }

    /**
     * 暂停音频
     * @param {string} src - 音频源路径
     */
    pause(src) {
        const instance = this.getAudio(src);
        if (instance && instance.playing()) {
            instance.pause();
        }
    }

    /**
     * 停止音频
     * @param {string} src - 音频源路径
     */
    stop(src) {
        const instance = this.getAudio(src);
        if (instance) {
            instance.stop();
        }
    }

    /**
     * 跳转到指定时间点
     * @param {string} src - 音频源路径
     * @param {number} time - 要跳转的时间点（秒）
     */
    seek(src, time) {
        const instance = this.getAudio(src);
        if (instance) {
            const duration = this.getDuration(src);
            instance.seek(duration * time);
        }
    }

    /**
     * 设置音频音量
     * @param {string} src - 音频源路径
     * @param {number} volume - 音量值，范围 0-1
     */
    volume(src, volume) {
        const instance = this.getAudio(src);
        if (instance) {
            instance.volume(volume);
        }
    }

    /**
     * 设置音频循环状态
     * @param {string} src - 音频源路径
     * @param {boolean} loop - 是否循环播放
     */
    setLoop(src, loop) {
        const instance = this.getAudio(src);
        if (instance) {
            instance.loop(loop);
        }
    }

    /**
     * 获取音频当前状态
     * @param {string} src - 音频源路径
     * @returns {string} 返回音频状态，如果音频不存在则返回 ERROR
     */
    getState(src) {
        const instance = this.getAudio(src);
        return instance ? instance.state : AudioState.ERROR;
    }

    /**
     * 卸载指定音频
     * @param {string} src - 音频源路径
     */
    unload(src) {
        const audio = this.getAudio(src);
        if (audio) {
            audio.unload();
            this.audios.delete(src);
        }
    }

    /**
     * 卸载所有音频
     * 释放所有音频资源
     */
    unloadAll() {
        this.audios.forEach(d => d.unload());
        this.audios.clear();
    }

    /**
     * 获取音频总时长（秒）
     * @param {string} src - 音频源路径
     * @returns {number} 返回音频总时长（秒），如果音频不存在则返回 0
     */
    getDuration(src) {
        const instance = this.getAudio(src);
        let duration = 0;
        if (instance) {
            duration = instance.duration() || 0;
        }
        return duration;
    }

    /**
     * 获取音频当前播放时间（秒）
     * @param {string} src - 音频源路径
     * @returns {number} 返回当前播放时间（秒），如果音频不存在则返回 0
     */
    getCurrentTime(src) {
        const instance = this.getAudio(src);
        if (instance) {
            return instance.seek() || 0;
        }
        return 0;
    }

    /**
     * 获取音频播放进度（0-1）
     * @param {string} src - 音频源路径
     * @returns {number} 返回播放进度（0-1），如果音频不存在则返回 0
     */
    getProgress(src) {
        const instance = this.getAudio(src);
        if (instance) {
            const duration = this.getDuration(src);
            const currentTime = this.getCurrentTime(src);
            return duration > 0 ? currentTime / duration : 0;
        }
        return 0;
    }

    /**
     * 监听音频播放时间变化
     * @param {string} src - 音频源路径
     * @param {Function} callback - 回调函数，参数为当前播放时间（秒）
     * @returns {Function} 返回取消监听的函数
     */
    onTimeUpdate(src, callback) {
        const instance = this.getAudio(src);
        if (!instance) {
            console.warn('音频不存在');
            return () => {
            };
        }

        const timeUpdateHandler = () => {

            callback(this.getCurrentTime(src));

            if (instance.playing() || instance.seek()) {
                requestAnimationFrame(timeUpdateHandler);
            }
        };

        instance.on('play', timeUpdateHandler);
        instance.on('seek', timeUpdateHandler);

        return () => {
            instance.off('play', timeUpdateHandler);
            instance.off('seek', timeUpdateHandler);
        };
    }

    /**
     * 监听音频播放进度变化
     * @param {string} src - 音频源路径
     * @param {Function} callback - 回调函数，参数为当前播放进度（0-1）
     * @returns {Function} 返回取消监听的函数
     */
    onProgressUpdate(src, callback) {
        const instance = this.getAudio(src);
        if (!instance) {
            console.warn('音频不存在');
            return () => {
            };
        }

        const progressUpdateHandler = () => {

            callback(this.getProgress(src));

            if (instance.playing() || instance.seek()) {
                requestAnimationFrame(progressUpdateHandler);
            }
        };

        instance.on('play', progressUpdateHandler);
        instance.on('seek', progressUpdateHandler);

        return () => {
            instance.off('play', progressUpdateHandler);
            instance.off('seek', progressUpdateHandler);
        };
    }

    /**
     * 监听音频状态变化
     * @param {string} src - 音频源路径
     * @param {Function} callback - 回调函数，参数为当前状态
     * @returns {Function} 返回取消监听的函数
     */
    onStateChange(src, callback) {
        const instance = this.getAudio(src);
        if (!instance) {
            console.warn('音频不存在');
            return () => {
            };
        }

        const playHandler = () => {
            callback(AudioState.PLAYING);
        };

        const pauseHandler = () => {
            callback(AudioState.PAUSED);
        };

        const stopHandler = () => {
            callback(AudioState.STOPPED);
        };

        const loadHandler = () => {
            callback(AudioState.LOADED);
        };

        const loadErrorHandler = () => {
            callback(AudioState.ERROR);
        };

        // 绑定事件
        instance.on('play', playHandler);
        instance.on('pause', pauseHandler);
        instance.on('stop', stopHandler);
        instance.on('load', loadHandler);
        instance.on('loaderror', loadErrorHandler);

        // 返回取消监听的函数
        return () => {
            instance.off('play', playHandler);
            instance.off('pause', pauseHandler);
            instance.off('stop', stopHandler);
            instance.off('load', loadHandler);
            instance.off('loaderror', loadErrorHandler);
        };
    }
}

// 创建单例实例
export const $audioManager = new AudioManager();

// 导出常用方法
export const $audioItem = (src) => $audioManager.getAudio(src);
export const $audioLoad = (src, options) => $audioManager.load(src, options);
export const $audioPlay = (src, options) => $audioManager.play(src, options);
export const $audioPause = (src) => $audioManager.pause(src);
export const $audioStop = (src) => $audioManager.stop(src);
export const $audioSeek = (src, time) => $audioManager.seek(src, time);
export const $audioVolume = (src, volume) => $audioManager.volume(src, volume);
export const $audioSetLoop = (src, loop) => $audioManager.setLoop(src, loop);
export const $audioState = (src) => $audioManager.getState(src);
export const $audioDestroy = (src) => $audioManager.unload(src);
export const $audioDestroyAll = () => $audioManager.unloadAll();
export const $audioCurrentTime = (src) => $audioManager.getCurrentTime(src);
export const $audioProgress = (src) => $audioManager.getProgress(src);
export const $audioDuration = (src) => $audioManager.getDuration(src);
export const $audioTimeUpdate = (src, callback) => $audioManager.onTimeUpdate(src, callback);
export const $audioProgressUpdate = (src, callback) => $audioManager.onProgressUpdate(src, callback);
export const $audioStateChange = (src, callback) => $audioManager.onStateChange(src, callback);

//  yarn add howler -S
