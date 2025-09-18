import { AxiosInstance, CancelTokenSource } from 'axios';
declare global {
    interface ImportMeta {
        env: {
            VITE_APP_BASE_API: string;
        };
    }
}
export declare const $http: AxiosInstance;
/**
 * 取消指定 API 的请求
 * @param {string} api - API 标识符
 */
export declare const cancelRequest: (api: string) => void;
/**
 * 创建新的取消令牌
 * @param {string} api - API 标识符
 * @returns {CancelTokenSource} 取消令牌对象
 */
export declare const createCancelToken: (api: string) => CancelTokenSource;
/**
 * 发送请求
 * @param {Function} api - API 函数
 * @param {Object} payload - 请求参数
 * @returns {Promise} 请求 Promise
 */
export declare const useAxiosRequest: (api: Function, payload: any) => Promise<any>;
