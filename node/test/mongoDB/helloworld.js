
setTimeout(async () => {

    const { MongoClient: MongoDB } = require('mongodb');
    const client = new MongoDB(
        'mongodb://localhost:27017',
        {
            useNewUrlParser: true
        }
    );
    // 创建连接
    await client.connect();

    const db = client.db('mongodb_test_01');

    const fruits = db.collection('fruits');

    // 先清空所有行
    await fruits.deleteMany();

    // 新增一行
    await fruits.insertOne({
        name: '芒果',
        price: 20
    });

    // 新增多行
    await fruits.insertMany([{
        name: '西瓜',
        price: 10
    }, {
        name: '樱桃',
        price: 50
    }]);

    // 查询
    await fruits.findOne();

    // 更新
    await fruits.updateOne({name:'芒果'},{
        $set:{name: '苹果'}
    });

    // 删除
    await fruits.deleteOne({name:'苹果'});

    client.close();
})