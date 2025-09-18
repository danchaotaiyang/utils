import { createAlova } from 'alova';
import { VueHook } from 'alova/vue3';


// 默认配置
const DEFAULT_CONFIG = {
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 3000,
    statesHook: VueHook,
    // 请求缓存配置
    cache: {
        mode: 'memory',
        expire: 5 * 60 * 1000 // 5分钟
    },
    // 请求重试配置
    retry: {
        maxRetryTimes: 2,
        retryDelay: 1000
    }
};

// 请求拦截器
const requestInterceptor = (method) => {
    //  method.config.headers
    return method;
};

// 响应拦截器
const responseInterceptor = {
    onSuccess: (response) => {

        const { data, status } = response;

        if (status === 200) {
            return data;
        }
    },
    onError: (error) => {
        throw error;
    }
};

/**
 * 创建 Alova 实例
 * @param {Object} config - 配置对象
 * @param {Function} beforeRequest - 请求拦截器
 * @param {Object} responded - 响应拦截器
 * @returns {Object} Alova 实例
 */
const createAlovaInstance = (config = {}, beforeRequest, responded) => {
    return createAlova({
        ...DEFAULT_CONFIG,
        ...config,
        beforeRequest: (method) => {
            const interceptedMethod = requestInterceptor(method);
            return beforeRequest ? beforeRequest(interceptedMethod) : interceptedMethod;
        },
        responded: {
            ...responseInterceptor,
            ...responded
        }
    });
};

// 创建默认实例
export const $alova = createAlovaInstance();
/*
// 创建带自定义配置的实例
export const createCustomAlova = (config) => {
    return createAlovaInstance(config);
};

// 导出请求方法
export const useRequest = (method) => {
    return $alova.useRequest(method);
};

// 导出 GET 请求方法
export const useGet = (url, config = {}) => {
    return useRequest($alova.Get(url, config));
};

// 导出 POST 请求方法
export const usePost = (url, data = {}, config = {}) => {
    return useRequest($alova.Post(url, data, config));
};

// 导出 PUT 请求方法
export const usePut = (url, data = {}, config = {}) => {
    return useRequest($alova.Put(url, data, config));
};

// 导出 DELETE 请求方法
export const useDelete = (url, config = {}) => {
    return useRequest($alova.Delete(url, config));
}; */

//  yarn add alova -S
