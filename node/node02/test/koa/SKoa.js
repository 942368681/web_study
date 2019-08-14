const http = require('http');
const context = require('./context');
const request = require('./request');
const response = require('./response');

class SKoa {
    listen(...args) {
        const server = http.createServer((req, res) => {

            // 创建上下文环境
            const ctx = this.createContext(req, res);

            this.callback(ctx);

            res.end(ctx.body);
        });

        server.listen(...args);
    }

    use(callback) {
        this.callback = callback;
    }

    createContext(req, res) {
        /**
         * koa源码是这么做的，使用时不建议绕过koa的res，req对象而去直接使用原始node下的res，req对象
         * 这里ctx.request 和 ctx.response是封装过的对象
         * ctx.req 和 ctx.res是原始的node下的res，req对象
         */
        const ctx = Object.create(context);
        ctx.request = Object.create(request);
        ctx.response = Object.create(response);
        ctx.req = ctx.request.req = req;
        ctx.res = ctx.response.res = res;
        return ctx;
    }

    compose(middlewares) {
        return function (ctx) {
            return dispatch(0);

            function dispatch(i) {
                let fn = middlewares[i];
                if (!fn) {
                    return;
                }
                return Promise.resolve(
                    fn(ctx, function next() {
                        return dispatch(i + 1);
                    })
                );
            };
        };
    }
};

module.exports = SKoa;