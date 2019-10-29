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
    const Users = sequelize.define("users", {
        id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV1,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING(20),
            allowNull: false
        }
    }, {
        // 参数...
        freezeTableName: true
    });

    // 同步数据
    // {force: true} 表示强制同步，即创建表之前先删除已存在的表
    await Users.sync({
        force: true
    });

    // 插入
    await Users.create({
        name: "sfl"
    });
    await Users.create({
        name: "yxy"
    });

    // 关闭链接
    sequelize.close().then(() => {
        console.log('closed!!');
    });

})();