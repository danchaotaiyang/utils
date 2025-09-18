import localForage from 'localforage';
import { NAME, VERSION, USE_ERROR_MESSAGE } from '@/config';

/**
 * 创建 LocalForage 实例
 * @param {string} name - 存储实例名称
 * @param {Object} [config={}] - 配置对象
 * @param {string[]} [config.driver=['indexedDB', 'webSQL', 'localStorage']] - 存储驱动优先级
 * @param {number} [config.size=5] - 存储大小限制(MB)
 * @param {string} [config.storeName='keyvaluepairs'] - 存储名称
 * @param {string} [config.description=''] - 存储描述
 * @returns {Object} LocalForage 实例
 */
const createForageInstance = (name, config = {}) => {
    if (!name || typeof name !== 'string') {
        throw new Error('LocalForage 实例名称是必需的，且必须为字符串类型');
    }

    // 默认配置
    const defaultConfig = {
        driver: [
            localForage.WEBSQL,
            localForage.INDEXEDDB,
            localForage.LOCALSTORAGE
        ]
    };

    // 合并配置
    const mergedConfig = {
        ...defaultConfig,
        ...config,
        name
    };

    // 检查浏览器支持的驱动
    const supportedDrivers = mergedConfig.driver.filter(d => localForage.supports(d));

    if (supportedDrivers.length === 0) {
        console.warn('当前浏览器环境不支持任何存储驱动，将使用内存存储模式');
        mergedConfig.driver = [localForage.LOCALSTORAGE];
    } else {
        mergedConfig.driver = supportedDrivers;
    }

    // 创建实例
    const instance = localForage.createInstance(mergedConfig);

    // 初始化检查
    instance.ready()
        .then(() => {
            const driver = instance.driver();
            USE_ERROR_MESSAGE && console.log(`LocalForage 实例 "${name}" 初始化成功，使用驱动: ${driver}`);

            // 检查存储是否可用
            instance.setItem('__test__', 'test')
                .then(() => instance.removeItem('__test__'))
                .catch(() => {
                    console.warn(`警告：LocalForage 实例 "${name}" 的存储可能不可用`);
                });
        })
        .catch(error => {
            console.warn(`LocalForage 实例 "${name}" 初始化失败:`, error);
            console.warn('建议：请检查浏览器是否启用了隐私模式或禁用了存储功能');
        });

    return instance;
};

/**
 * 默认 LocalForage 实例
 */
export const $forage = createForageInstance(`${ NAME }-${ VERSION }`, {
    storeName: 'keyvaluepairs'
});

// 导出常用方法
/* export const $getItem = async (key) => {
    try {
        return await $forage.getItem(key);
    } catch (error) {
        console.warn(`获取键为 "${key}" 的数据失败:`, error);
        return null;
    }
};

export const $setItem = async (key, value) => {
    try {
        await $forage.setItem(key, value);
        return true;
    } catch (error) {
        console.warn(`设置键为 "${key}" 的数据失败:`, error);
        return false;
    }
};

export const $removeItem = async (key) => {
    try {
        await $forage.removeItem(key);
        return true;
    } catch (error) {
        console.warn(`删除键为 "${key}" 的数据失败:`, error);
        return false;
    }
};

export const $clear = async () => {
    try {
        await $forage.clear();
        return true;
    } catch (error) {
        console.warn('清空存储失败:', error);
        return false;
    }
};

export const $length = async () => {
    try {
        return await $forage.length();
    } catch (error) {
        console.warn('获取存储长度失败:', error);
        return 0;
    }
};

export const $key = async (index) => {
    try {
        return await $forage.key(index);
    } catch (error) {
        console.warn(`获取索引 ${index} 的键失败:`, error);
        return null;
    }
};

export const $keys = async () => {
    try {
        return await $forage.keys();
    } catch (error) {
        console.warn('获取所有键失败:', error);
        return [];
    }
}; */

//  yarn add localforage -S
