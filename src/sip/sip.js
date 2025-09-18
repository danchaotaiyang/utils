/**
 * SIP 服务类
 * 用于处理 SIP 通信的核心类，包括注册、呼叫、媒体流处理等功能
 */
import {
    UserAgent,
    // UserAgentOptions,
    Session,
    SessionState,
    Inviter,
    // InviterOptions,
    Registerer,
    // RegistererOptions
} from 'sip.js';

export class SipService {
    /**
     * 构造函数
     * @param {Object} el - DOM 元素对象，用于显示视频
     * @param {Object} config - SIP 配置参数对象
     * @param {string} config.sipId - SIP 用户 ID
     * @param {string} config.sipPassword - SIP 用户密码
     * @param {string} config.sipHost - SIP 服务器地址
     * @param {string} config.wssUrl - WebSocket 服务器地址
     * @param {string} config.stunHost - STUN 服务器地址
     * @param {string} config.turnHost - TURN 服务器地址
     * @param {string} config.turnPassword - TURN 服务器密码
     * @param {string} config.turnUsername - TURN 服务器用户名
     * @param {Function} config.onRemoteStream - 远程媒体流回调函数
     * @param {boolean} config.enableAudio - 是否启用音频，默认为 true
     * @param {boolean} config.enableVideo - 是否启用视频，默认为 true
     */
    constructor(el, config) {
        this.userAgent = null;        // SIP 用户代理实例
        this.registerer = null;       // SIP 注册器实例
        this.currentSession = null;   // 当前通话会话
        this.isRegistered = false;    // 注册状态标志
        this.el = el;                 // DOM 元素
        this.config = {
            enableAudio: true,        // 默认启用音频
            enableVideo: true,        // 默认启用视频
            ...config                 // 合并用户配置
        };
        this.onRemoteStream = config.onRemoteStream || this.defaultRemoteStreamHandler; // 媒体流处理回调
    }

    /**
     * 添加显式初始化方法
     * @throws {Error} 当 SIP 初始化失败时抛出错误
     */
    async start() {
        try {
            await this.initialize();
        } catch (error) {
            console.error('SIP 初始化失败:', error);
            throw error;
        }
    }

    /**
     * 初始化并注册 SIP 用户代理
     * 包括创建 URI、配置选项、设置事件监听等
     * @throws {Error} 当 URI 创建失败时抛出错误
     */
    async initialize() {
        try {
            // 解构配置参数
            const {
                sipId,
                sipPassword,
                sipHost,
                wssUrl,
                stunHost,
                turnHost,
                turnPassword,
                turnUsername
            } = this.config;

            // 创建 SIP URI
            const uri = UserAgent.makeURI(`sip:${sipId}@${sipHost}`);
            if (!uri) {
                console.warn('Failed to create URI');
                return;
            }

            // 配置 UserAgent 选项
            const userAgentOptions = {
                uri,    // SIP URI
                transportOptions: {
                    wsServers: [wssUrl],  // WebSocket 服务器地址
                    connectionTimeout: 30  // 连接超时时间（秒）
                },
                authorizationUsername: sipId,      // 认证用户名
                authorizationPassword: sipPassword, // 认证密码
                sessionDescriptionHandlerFactoryOptions: {
                    peerConnectionOptions: {
                        iceServers: [
                            { urls: `stun:${stunHost}` },  // STUN 服务器配置
                            {
                                urls: `turn:${turnHost}`,  // TURN 服务器配置
                                username: turnUsername,
                                credential: turnPassword
                            }
                        ]
                    }
                }
            };

            // 创建 UserAgent 实例
            this.userAgent = new UserAgent(userAgentOptions);

            // 设置入站呼叫处理
            this.userAgent.delegate = {
                onInvite: (invitation) => {
                    this.handleIncomingCall(invitation);
                }
            };

            // 启动 UserAgent
            await this.userAgent.start();

            // 创建并配置 Registerer
            const registererOptions = {};
            this.registerer = new Registerer(this.userAgent, registererOptions);

            // 注册状态监听
            this.registerer.stateChange.addListener((newState) => {
                switch (newState) {
                    case 'registered':
                        this.isRegistered = true;
                        console.log('SIP 注册成功');
                        break;
                    case 'unregistered':
                        this.isRegistered = false;
                        console.log('SIP 未注册');
                        break;
                    case 'terminated':
                        this.isRegistered = false;
                        console.log('SIP 注册已终止');
                        break;
                }
            });

            // 执行注册
            await this.registerer.register();
        } catch (error) {
            console.error('SIP 初始化失败:', error);
            this.isRegistered = false;
            throw error;
        }
    }

    /**
     * 默认的远程媒体流处理函数
     * 将媒体流绑定到指定的 DOM 元素
     * @param {MediaStream} stream - 远程媒体流
     */
    defaultRemoteStreamHandler(stream) {
        if (this.el && this.el.tagName === 'VIDEO') {
            this.el.srcObject = stream;
            this.el.play().catch(error => {
                console.error('播放视频流失败:', error);
            });
        } else {
            console.warn('未找到有效的视频元素或元素类型不正确');
        }
    }

    /**
     * 处理入站呼叫
     * 包括设置状态监听、接受呼叫等
     * @param {Invitation} invitation - 入站呼叫邀请对象
     */
    async handleIncomingCall(invitation) {
        const session = invitation;

        // 设置会话状态监听
        session.stateChange.addListener((newState) => {
            switch (newState) {
                case SessionState.Establishing:
                    console.log('呼叫正在建立');
                    break;
                case SessionState.Established:
                    console.log('呼叫已建立');
                    this.handleEstablishedCall(session);
                    break;
                case SessionState.Terminated:
                    console.log('呼叫已终止');
                    break;
            }
        });

        // 接受呼叫
        const options = {
            sessionDescriptionHandlerOptions: {
                constraints: {
                    audio: this.config.enableAudio,  // 使用配置的音频状态
                    video: this.config.enableVideo   // 使用配置的视频状态
                }
            }
        };

        await session.accept(options);
    }

    /**
     * 处理已建立的呼叫
     * 包括获取远程媒体流、设置媒体流事件等
     * @param {Session} session - 呼叫会话对象
     */
    handleEstablishedCall(session) {
        // 获取 WebRTC 对等连接
        const pc = session.sessionDescriptionHandler.peerConnection;

        // 创建并获取远程媒体流
        const remoteStream = new MediaStream();
        pc.getReceivers().forEach(receiver => {
            remoteStream.addTrack(receiver.track);
        });

        // 触发媒体流事件
        this.onRemoteStream.call(this, remoteStream);
    }

    /**
     * 发起呼叫
     * @param {string} target - 目标 SIP URI
     * @param {Object} options - 呼叫选项
     * @throws {Error} 当未注册或 URI 创建失败时抛出错误
     */
    async makeCall(target, options = {}) {
        // 检查注册状态
        if (!this.isRegistered) {
            throw new Error('SIP 未注册');
        }

        // 创建目标 URI
        const targetUri = UserAgent.makeURI(target);
        if (!targetUri) {
            throw new Error('Failed to create target URI');
        }

        // 配置呼叫选项
        const inviterOptions = {
            sessionDescriptionHandlerOptions: {
                constraints: {
                    audio: this.config.enableAudio,  // 使用配置的音频状态
                    video: this.config.enableVideo   // 使用配置的视频状态
                }
            },
            ...options
        };

        // 创建呼叫邀请者
        const inviter = new Inviter(this.userAgent, targetUri, inviterOptions);
        this.currentSession = inviter;

        // 设置会话状态监听
        inviter.stateChange.addListener((newState) => {
            switch (newState) {
                case SessionState.Establishing:
                    console.log('呼叫正在建立');
                    break;
                case SessionState.Established:
                    console.log('呼叫已建立');
                    this.handleEstablishedCall(inviter);
                    break;
                case SessionState.Terminated:
                    console.log('呼叫已终止');
                    break;
            }
        });

        // 发起呼叫
        await inviter.invite();
    }

    /**
     * 结束当前呼叫
     * 终止当前通话会话并清理资源
     */
    async endCall() {
        if (this.currentSession) {
            await this.currentSession.terminate();
            this.currentSession = null;
        }
    }

    /**
     * 注销 SIP 用户代理
     * 包括注销注册和停止用户代理
     */
    async unregister() {
        try {
            // 先结束当前通话
            await this.endCall();

            // 注销注册
            if (this.registerer) {
                await this.registerer.unregister();
            }

            // 停止用户代理
            if (this.userAgent) {
                await this.userAgent.stop();
            }

            // 清理状态
            this.isRegistered = false;
            this.currentSession = null;
            this.registerer = null;
            this.userAgent = null;
        } catch (error) {
            console.error('注销失败:', error);
            throw error;
        }
    }

    /**
     * 更新媒体配置
     * @param {Object} options - 媒体配置选项
     * @param {boolean} options.enableAudio - 是否启用音频
     * @param {boolean} options.enableVideo - 是否启用视频
     */
    updateMediaConfig(options) {
        if (options.enableAudio !== undefined) {
            this.config.enableAudio = options.enableAudio;
        }
        if (options.enableVideo !== undefined) {
            this.config.enableVideo = options.enableVideo;
        }
    }
}

//  yarn add sip.js -S
