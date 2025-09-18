/**
 ==================================================
 Array type data manipulation
 数组类型数据处理
 ==================================================
 */
/**
 * 打乱数组顺序
 * @param { Array } value - 任意类型项的数组
 * @return { Array } 打乱顺序后的数组
 * */
export declare const shuffleArray: (value: any[]) => any[];
/**
 * 判断是否为数组
 * @param { * } value - 任意数据类型值
 * @return { Boolean } 返回是否为数组的布尔值
 * */
export declare const isArray: (value: any) => boolean;
/**
 * 过滤树状数据
 * @param { Array } data 数据
 * @param { String } keyword 关键字
 * @param { Array } attrs 检索属性
 * @param { Object } props 数据结构
 * @return { Array } 返回过滤后数据
 * */
export declare const getTreeFilter: (data: any[], keyword: string, attrs?: string[], props?: any) => any[];
