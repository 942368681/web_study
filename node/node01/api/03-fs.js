/* const fs = require('fs')
// const data = fs.readFileSync('./app.js')
// console.log(Buffer.from(data).toString())
const path = require('path')
fs.readFile(path.resolve(path.resolve(__dirname, './app.js')), (err, data) => {
    if (err) throw err
    console.log(data)
}) */

const path = require('path');
const util = require('util');
const fs = require('fs');
const data = fs.readFileSync(path.resolve(__dirname, './app.js'));
console.log(data);

const readFilePro = util.promisify(fs.readFile);
readFilePro(path.resolve(__dirname, './app.js')).then(res => console.log(res));