const Koa = require('koa');
const app = new Koa();

// const router = {};
// router['/home'] = ctx => {
//     ctx.type = 'text/html;charset=utf-8';
//     ctx.body = `<h2>名字：${ctx.body[0].name}</h2>`;
// };

// app.use((ctx, next) => {
//     ctx.body = [
//         {
//             name: 'sfl'
//         }
//     ];
//     next();
// });
// app.use((ctx, next) => {
//     router[ctx.url](ctx);
// });
// app.listen(3000);

const router = require('koa-router')();
app.use(router.routes());

router.get('/string', async (ctx, next) => {
    ctx.body = 'sssffflll';
});
router.get('/json', async (ctx, next) => {
    ctx.body = {
        age: 18
    };
});

app.use(require('koa-static')(__dirname + '/'));

app.listen(3000);