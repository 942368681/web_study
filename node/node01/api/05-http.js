/* const http = require('http')
const fs = require('fs')
const server = http.createServer((request, response) => {
    // console.log('recevie http')
    // response.end('a response from server')
    
    const { url, method ,headers} = request
    if (url === '/' && method === 'GET') {
        fs.readFile('index.html', (err, data) => {
            if (err) {
                response.writeHead(500, {
                    'Content-Type': 'text/plain;charset=utf-8'
                })
                return
            }
            response.statusCode = 200
            response.setHeader('Content-Type', 'text/html')
            response.end(data)
        })

    } else if (url === '/user' && method === 'GET') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/html')
        response.end(JSON.stringify([
            {
                name: 'laoxia',
                age: 342
            }
        ]))
    }else if(method === 'GET' && headers.accept.indexOf('image/*') !== -1 ){
        fs.createReadStream('.'+url).pipe(response)
    } else {
        response.statusCode = 404
        response.setHeader('Content-Type', 'text/plain;charset=utf-8')
        response.end('404 页面没找到。。。。')
    }
})
server.listen(3000) */

const http = require('http');
const fs = require('fs');
const path = require('path');
const server = http.createServer((req, res) => {
    const {url, method, headers} = req;
    if (url === '/' && method === 'GET') {
        fs.readFile(path.resolve(__dirname, './index.html'), (err, data) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(data);
        })
    } else if (url === '/user' && method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(JSON.stringify([
            {
                name: 'laoxia',
                age: 342
            }
        ]));
    } else if (method === 'GET' && headers.accept.indexOf('image/*') !== -1 ){
        fs.createReadStream('.' + url).pipe(res);
    } 
});
server.listen(3000);