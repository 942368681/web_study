// console.log('hello world');

const os = require('os');
const mem = os.freemem / os.totalmem * 100;
// console.log(os.totalmem()/(1024*1024*1024));
// console.log(`内存占用：${mem.toFixed(2)}%`);

const cupStat = require('cpu-stat');
cupStat.usagePercent((err, percent) => {
    // console.log(`CPU占用：${percent.toFixed(2)}%`);
});
const util = require('util');
const getCpu = util.promisify(cupStat.usagePercent);
// getCpu().then(percent => console.log(`CPU占用：${percent.toFixed(2)}%`));

const showStat = async () => {
    const mem = os.freemem / os.totalmem * 100;
    console.log(`内存占用：${mem.toFixed(2)}%`);
    const percent = await getCpu();
    console.log(`CPU占用：${percent.toFixed(2)}%`);
};

module.exports = {showStat};