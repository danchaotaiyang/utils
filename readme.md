# utils.js

[TOC]

## 安装



### Git 仓库:

暂未发布为模块，需要从仓库克隆到本地项目中。

```c
git clone http://git.tcloud-corp.com:12080/danchaotaiyang/utils.git
```



## 使用



### 引入 utils 包

Vue 2.x 项目为例，项目结构如下：

```
public
node_modules
src
├─assets
│  ├─css
│  ├─img
│  ├─js
│  └─lib
│     ├─ utils (*)
│     └─ ...
├─views
│  ├─index.vue
│  └─...
├─App.vue
└─main.js
```

在 main.js 中写入以下内容：

```javascript
import Vue from 'vue';
import App from './App.vue';
import * as utils from './assets/lib/utils';

Vue.prototype.$utils = utils;

new Vue({
    render: h => h(App)
}).$mount('#app');
```

以上代码便完成了 utils 的引入。

在组件中或模块中引入：

```javascript
import { toSBC } from './assets/lib/utils';
const str = toSBC('＞｝＆＠；');
// >}&@;
```



### 引入 utils/index.js

在非工程化开发项目中，将 utils/index.js 放到任意目录中。

```html
<!-- 引入方法库 -->
<script src="../static/lib/utils/index.js"></script>
```



------



# 数字类型处理



### utils.createRandomNumber(digit)

> 创建指定位数的随机数字的字符串。 

**引入版本**

​	1.0.0

**参数**

​	[digit=1] *(number)* : 创建随机数位数

**返回**

​	*(String)* : 返回随机数字字符串 (存在0开头)

**示例**

```javascript
utils.createRandomNumber(4);
// '3781'

utils.createRandomNumber(7);
// '0808238'
```



------

### utils.createRandomNumberRange

> 创建指定范围的随机数字

**引入版本**

​	1.0.0

**参数**

​	[min=0] *(number)* : 创建随机数最小值

​	[max=1] *(number)* : 创建随机数最大值

​	fixed *(number)* : 精度

**返回**

​	*(number)* : 返回>=min并且<=max的随机数字

**示例**

```javascript
utils.createRandomNumberRange(.5, 10, 4);
// 9.9574
// 4.2249
utils.createRandomNumberRange(100, 200, 1);
// 156.9
// 115.3
```



------

### utils.localizeNumber(number)

> 阿拉伯数字转为汉字数字

**引入版本**

​	1.0.0

**参数**

​	number *(number)* : 任意正整数

​	[option={}] *(Object)* : 选项对象

​	[option.idealize=false] *(boolean)* : 优化显示

​	[option.capital=false] *(boolean)* : 是否为大写

**返回**

​	*(string)* : 返回汉化数字

**示例**

```javascript
utils.localizeNumber(50490606);
// 五千零四十九万零六百零六

utils.localizeNumber(46120, { capital: true });
// 肆万陆仟壹佰贰拾

utils.localizeNumber(16);
// 十六

utils.localizeNumber(16, { idealize: true });
// 一十六
```



------

### isEven

> 校验数字是奇数还是偶数

**引入版本**

​	1.0.0

**参数**

​	number *(number)* : 校验数字

**返回**

​	*(boolean)* : 返回是否为偶数

**示例**

```javascript
utils.isEven(3);
// false
utils.isEven(6);
// true
```



------

### average

> 求数字的平均值

**引入版本**

​	1.0.0

**参数**

​	args *(...number)* : *参与计算数字*

**返回**

​	*(number)* : 返回参与计算数字的平均数

**示例**

```javascript
utils.average(2, 9, 2, 6);
// 4.75
utils.average(3, 19, 88, 1000, 5, 8.8, 6);
// 161.4
```





# 字符类型处理



### utils.createRandomString(digit)

> 创建指定位数的随机字符串。 

**引入版本**

​	1.0.0

**参数**

​	[digit=1] *(number)* : 创建随机字符串位数

**返回**

​	*(string)* : 返回随机数字字符串

**示例**

```javascript
utils.createRandomString(5);
// X4dyX

utils.createRandomString(8);
// Z8XwrbSe
```



------

### utils.toDBC(content)

> 字符串转全角。

**引入版本**

​	1.0.0

**参数**

​	content *(string)* : 任意字符串

**返回**

​	*(string)* : 返回转全角后的字符串

**示例**

```javascript
utils.toDBC('",.([');
// ＂，．（［

utils.toDBC('Abc_');
// Ａｂｃ＿
```



------

### utils.toSBC(content)

> 字符串转半角。

**引入版本**

​	1.0.0

**参数**

​	content *(string)* : 任意字符串

**返回**

​	*(string)* : 返回转半角后的字符串

**示例**

```javascript
utils.toSBC('Ｕｔｉｌｓ．ｊｓ');
// Utils.js

utils.toSBC('＞｝＆＠；');
// >}&@;
```



------

### capitalize

> 英文字符串首字母大写

**引入版本**

​	1.0.0

**参数**

​	content *(string)* : 英文字符串

**返回**

​	*(string)* : 首字母大写字符串

**示例**

```javascript
utils.capitalize('from char code');
// 'From char code'

utils.capitalize('example');
// 'Example'
```



------

### ellipsis

> 字符串超出指定长度省略

**引入版本**

​	1.0.0

**参数**

​	content *(string)* : 输入文本内容

​	length *(number)* : 指定字符串最大长度

​	[suffix='……'] *(string)* : 超出部分替换内容

**返回**

​	*(string)* : 返回处理后的字符

**示例**

```javascript
utils.ellipsis('字符串超出指定长度省略', 8);
// '字符串超出指定...'

utils.ellipsis('字符串超出指定长度省略', 4, '_____');
'字符串_____'
```



# 数组处理

### shuffleArray

> 打乱数组顺序

**引入版本**

​	1.0.0

**参数**

​	value *(array)* : 任意类型项的数组

**返回**

​	*(array)* : 返回打乱顺序后的数组

**示例**

```javascript
utils.shuffleArray([ 4, 7, 1, 0, 2, 11 ]);
// [1, 7, 2, 0, 4, 11]
// [7, 0, 2, 1, 11, 4]

utils.shuffleArray([ 99, 2, 'a', 45, 724, 676, 'sort' ]);
// [2, 'sort', 99, 676, 45, 'a', 724]
// [724, 99, 676, 2, 'a', 'sort', 45]
```



------









# 签名参数方法



### utils.createSign(params, license)

> 创建签名

**引入版本**

​	1.0.0

**参数**

​	params*(Object)* : 包含公共参数的请求参数对象

​	license*(Object)*: 签名信息

**返回**

​	*(string)* : 返回签名字符串

**示例**

```javascript
const LICENSE_CONFIG = { SALT: 'F2E10A88885DDB063A66A7863F1583FB', PLATFORM: 'jl_music', VERSION: '0.1' };

utils.createSign({ 
    id: 'iG6fFxAwp7mZWry4F8xdJ', 
    type: 'utils' 
}, LICENSE_CONFIG);

// 8F59CEE44AA98DA5FA1122FC2A44957B
```



------



### utils.signFormat(data, license[, offset])

> 通过请求参数对象生成签名对象

**引入版本**

​	1.0.0

**参数**

​	data*(Object)* : 请求参数对象

​	license*(Object)* : 签名信息

​	[offset=0]*(Number)* : 与服务器时间偏移量（分）

**返回**

​	*(Object)* : 返回签名参数对象

**示例**

```javascript
var LICENSE_CONFIG = { SALT: 'F2E10A88885DDB063A66A7863F1583FB', PLATFORM: 'jl_music', VERSION: '0.1' };

utils.signFormat({
    id: 'iG6fFxAwp7mZWry4F8xdJ', 
    type: 'utils' 
}, LICENSE_CONFIG, 1);

// {
//     id: "iG6fFxAwp7mZWry4F8xdJ"
//     nonce: "3050"
//     platform: "jl_music"
//     sign: "C26B883220B2C5B35BF6B0A896871B8A"
//     timestamp: 1629424435
//     type: "utils"
//     version: "0.1"
// }
```

