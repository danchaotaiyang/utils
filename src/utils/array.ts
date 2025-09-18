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
export const shuffleArray = (value: any[]): any[] => value.sort(() => 0.5 - Math.random());

/**
 * 过滤树状数据
 * @param { Array } data 数据
 * @param { String } keyword 关键字
 * @param { Array } attrs 检索属性
 * @param { Object } props 数据结构
 * @return { Array } 返回过滤后数据
 * */
export const getTreeFilter = (data: any[], keyword: string, attrs: string[] = [ 'label', 'value' ], props: any = { label: 'label', value: 'value', children: 'children' }): any[] => {

    let result: any[] = [];

    data.map((item: any) => {
        for (let i = 0, len = attrs.length; i < len; i++) {

            let key = attrs[ i ];

            if (item.hasOwnProperty(key)) {
                if (item[ key ] && item[ key ].indexOf(keyword) !== -1) {

                    result.push(item);

                    break;
                } else {
                    if (item[ props[ 'children' ] ] && item[ props[ 'children' ] ].length > 0) {

                        let children = getTreeFilter(item[ props[ 'children' ] ], keyword);

                        if (children && children.length > 0) {

                            item[ props[ 'children' ] ] = children;

                            result.push(item);

                            break;
                        }
                    }
                }
            }
        }
    });

    return result;
};
