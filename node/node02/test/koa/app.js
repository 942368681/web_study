const SKoa = require('./Skoa');
const app = new SKoa();

// app.use((req, res) => {
//     res.writeHead(200);
//     res.end('my koa');
// });

app.use(async (ctx, next) => {
    ctx.body = 'my koa';
    await next();
    ctx.body += "!!";
});
app.use(async ctx => {
    ctx.body = ctx.body + ' my koa';
});

app.listen(3000);