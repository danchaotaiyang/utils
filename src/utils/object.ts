/**
 ==================================================
 Object type data manipulation
 对象类型数据处理
 ==================================================
 */

/**
 * 判断是否为空值
 * @param { * } value -任意类型值
 * @return { Boolean } 是否为空值
 * */
export const isEmpty = (value: unknown): boolean => {
    return !value && value !== 0 || Array.isArray(value) && !value.length || value instanceof Object && !Object.keys(value).length;
};

/**
 * 判断是否为对象
 * @param { * } value 任意数据类型值
 * @return { Boolean } 返回是否为对象的布尔值
 */
export const isObject = (value: any): boolean => typeof value === 'object' && value !== null && !Array.isArray(value);
