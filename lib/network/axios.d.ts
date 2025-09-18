import { AxiosInstance, CancelTokenSource } from 'axios';
declare global {
    interface ImportMeta {
        env: {
            VITE_APP_BASE_API: string;
        };
    }
}
export declare const defaultErrorHandler: (error: any) => Promise<never>;
/**
 * 取消指定 API 的请求
 * @param {Function} api - API 标识符
 */
export declare const cancelRequest: (api: Function) => void;
/**
 * 创建新的取消令牌
 * @param {Function} api - API 标识符
 * @returns {CancelTokenSource} 取消令牌对象
 */
export declare const createCancelToken: (api: Function) => CancelTokenSource;
/**
 * 发送请求
 * @param {Function} api - API 函数
 * @param {Object?} payload - 请求参数
 * @returns {Promise} 请求 Promise
 */
export declare const useAxiosRequest: (api: Function, payload: any) => Promise<any>;
export declare const $http: AxiosInstance;
export declare const $file: AxiosInstance;
export declare const $form: AxiosInstance;
