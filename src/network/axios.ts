import Axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';


interface RequestInterceptor {
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
}

interface ResponseProcessor {
  (response: AxiosResponse): any;
}

interface ErrorHandler {
  (error: any): Promise<any>;
}

interface AxiosConfig extends Omit<InternalAxiosRequestConfig, 'headers'> {
    baseURL: string;
    timeout: number;
    headers: Partial<Record<string, string>>;
}

declare global {
    interface ImportMeta {
        env: {
            VITE_APP_BASE_API: string;
        };
    }
}

/**
 * 创建 Axios 实例
 * @param {AxiosConfig} config - Axios 配置
 * @param {RequestInterceptor} requestInterceptor - 请求拦截器
 * @param {ResponseProcessor} responseProcessor - 响应处理器
 * @param {ErrorHandler} errorHandler - 错误处理器
 * @returns {AxiosInstance} Axios 实例
 */
const createAxiosInstance = (
    config: AxiosConfig,
    requestInterceptor: RequestInterceptor,
    responseProcessor: ResponseProcessor,
    errorHandler: ErrorHandler
): AxiosInstance => {
    const instance = Axios.create(config);

    instance.interceptors.request.use(
        (config) => {
            if (typeof requestInterceptor === 'function') {
                return requestInterceptor(config);
            }
            return config;
        },
        (error) => {
            if (typeof errorHandler === 'function') {
                return errorHandler(error);
            }
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => {
            if (typeof responseProcessor === 'function') {
                return responseProcessor(response);
            }
            return response;
        },
        (error) => {
            if (typeof errorHandler === 'function') {
                return errorHandler(error);
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

export const defaultErrorHandler = (error: any) => {
    if (Axios.isCancel(error)) {
        return Promise.reject(new Error('请求已取消'));
    }

    if (error.response) {
        const { status, data } = error.response;
        console.warn(`请求错误: ${ status }`, data);
    } else if (error.request) {
        console.warn('网络错误: 请求未发送成功');
    } else {
        console.warn('请求错误:', error.message);
    }

    return Promise.reject(error);
};

// 请求取消令牌管理
const cancelTokens = new WeakMap<Function, CancelTokenSource>();

/**
 * 取消指定 API 的请求
 * @param {Function} api - API 标识符
 */
export const cancelRequest = (api: Function): void => {
    const cancelToken = cancelTokens.get(api);
    if (cancelToken) {
        cancelToken.cancel('请求已取消');
        cancelTokens.delete(api);
    }
};

/**
 * 创建新的取消令牌
 * @param {Function} api - API 标识符
 * @returns {CancelTokenSource} 取消令牌对象
 */
export const createCancelToken = (api: Function): CancelTokenSource => {
    const cancelToken = Axios.CancelToken.source();
    cancelTokens.set(api, cancelToken);
    return cancelToken;
};

/**
 * 发送请求
 * @param {Function} api - API 函数
 * @param {Object?} payload - 请求参数
 * @returns {Promise} 请求 Promise
 */
export const useAxiosRequest = (api: Function, payload: any): Promise<any> => {
    cancelRequest(api);
    const { token: cancelToken } = createCancelToken(api);
    return api(payload, { cancelToken });
};

export const $http = createAxiosInstance(
    {
        baseURL: import.meta.env.VITE_APP_BASE_API,
        timeout: 3000,
        headers: {
            'Content-Type': 'application/json'
        }
    },
    (config) => {
        return config;
    },
    (response) => {
        return response.data;
    },
    defaultErrorHandler
);

export const $form = createAxiosInstance(
    {
        baseURL: import.meta.env.VITE_APP_BASE_API,
        timeout: 3000,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    },
    async (config) => {
        config.headers.authentication = '';
        return config;
    },
    (response) => {
        return response.data;
    },
    defaultErrorHandler
);

export const $file = createAxiosInstance(
    {
        baseURL: import.meta.env.VITE_APP_BASE_API,
        timeout: 3000,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    },
    (config) => {
        return config;
    },
    (response) => {
        return response.data;
    },
    defaultErrorHandler
);

// 导出请求方法
// export const $get = (url: string, params?: any) => $http.get(url, { params });
// export const $post = (url: string, data?: any) => $http.post(url, data);
// export const $put = (url: string, data?: any) => $http.put(url, data);
// export const $del = (url: string) => $http.delete(url);

//  yarn add axios -S
