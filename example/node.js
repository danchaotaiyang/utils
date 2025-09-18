const utils = require('utils');

const digit = Number(utils.createRandomNumber(1));
const num = utils.createRandomNumber(digit);
console.log(digit + '位随机数', num);
console.log(num + '汉化', utils.localizeNumber(Number(num)));
console.log(digit + '位随机字符串：', utils.createRandomString(digit));