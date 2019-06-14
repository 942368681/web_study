const fs = require('fs')
const path = require('path');
const rs2 = fs.createReadStream(path.resolve(__dirname, './img.png'));
const ws2 = fs.createWriteStream(path.resolve(__dirname, './img-copy.png'))
rs2.pipe(ws2)