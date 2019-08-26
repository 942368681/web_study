const Koa = require('koa');

const app = module.exports = new Koa();

app.use(async ctx => {
    // we need to explicitly set 404 here
    // so that koa doesn't assign 200 on body=
    ctx.status = 404;

    switch (ctx.accepts('html', 'json')) {
        case 'html':
            console.log('html');
            ctx.type = 'html';
            ctx.body = '<p>Page Not Found</p>';
            break;
        case 'json':
            console.log('json');
            ctx.body = {
                message: 'Page Not Found'
            };
            break;
        default:
            console.log('text');
            ctx.type = 'text';
            ctx.body = 'Page Not Found';
    }
});

if (!module.parent) app.listen(3000);