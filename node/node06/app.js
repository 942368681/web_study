const koa = require('koa')
const app = new koa()
const session = require('koa-session')

const redisStore = require('koa-redis')
const redis = require('redis')
const redisClient = redis.createClient(6379, 'localhost')

const wrapper = require('co-redis')
const client = wrapper(redisClient)

app.keys = ['some secret']

const SESS_CONFIG = {
    key: 'kkb:sess', // 名
    // maxAge: 8640000, // 有效期
    // httpOnly: true, // 服务器有效
    // signed: true // 签名
    store: redisStore({ client })
}

app.use(session(SESS_CONFIG, app))

app.use(async (ctx, next) => {
    const keys = await clinet.keys('*');
    keys.forEach(async key => console.log(await client.get(key)));
    await next();
});

app.use(ctx => {
    if (ctx.path === '/favicon.ico') return
    let n = ctx.session.count || 0
    ctx.session.count = ++n
    ctx.body = '第' + n + '次访问'
})
app.listen(3000)