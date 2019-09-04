(async () => {
    const Sequelize = require("sequelize");
    // 建立连接
    const sequelize = new Sequelize("mysql_test_01", "root", "123456789", {
        host: "localhost",
        dialect: "mysql",
        /* 'mysql' | 'mariadb' | 'postgres' | 'mssql' 之一 */
        operatorsAliases: false
    });

    // 定义模型
    const Fruit = sequelize.define("Fruit", {
        name: {
            type: Sequelize.STRING(20),
            allowNull: false,
            get () {
                const title = this.getDataValue("title");
                return `标题是：${title}`;
            }
        },
        price: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        stock: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    }, {
        // 参数...
        freezeTableName: true,
        getterMethods: {
            title () {
                return this.name + '-' + this.price;
            }
        },
        setterMethods: {
            title (value) {
                const title = value.split('-');
                this.setDataValue('name', title.slice(0, -1).join(' '));
                this.setDataValue('price', title.slice(-1).join(' '));
            }
        }
    });

    // 同步数据
    // {force: true} 表示强制同步，即创建表之前先删除已存在的表
    await Fruit.sync({
        force: true
    });

    // 插入
    await Fruit.create({
        name: "香蕉",
        price: 3.5
    });
    await Fruit.create({
        name: "苹果",
        price: 2
    });

    // 查询
    let ret = await Fruit.findAll();
    console.log('findAll', JSON.stringify(ret));
    let apple = await Fruit.findAll({
        where: {
            name: '苹果'
        }
    });
    console.log(JSON.stringify(apple));

    // 更新（两种方式）
    apple[0].updatedAt = Date.now();
    apple[0].name = '桃子';
    await apple[0].save();

    await Fruit.update({
        name: "菠萝",
        stock: 999
    }, {
        where: {
            name: '香蕉'
        }
    });

    // 删除
    await apple[0].destroy();

    // 关闭链接
    sequelize.close().then(() => {
        console.log('closed!!');
    });

})();