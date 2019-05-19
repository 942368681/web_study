// 期望调用方式
/* 
    new KVue({
        data: {
            mag: "hello world"
        }
    });
*/

class KVue {
    constructor (options) {
        this.$options = options;
        // 处理data
        this.$data = options.data;
        // 响应化操作
        this.observe(this.$data);

        // 测试代码
        /* new Watcher();
        this.name;
        new Watcher();
        this.foo.bar; */

        // 创建编译器
        new Compile(options.el, this);

        if (options.created) {
            options.created.call(this);
        }
    };

    /**
     * observe检测到data变化通知dep做视图更新
     */
    observe (data) {
        if (!data || typeof data !== 'object') {
            return;
        }
        // 遍历对象
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key]);
            // 将此key代理到vue实例上，如果不代理，外部访问需要通过this.$data.xxx，代理之后外部访问变为this.xxx
            this.proxyData(key);
        });
    };

    proxyData (key) {
        Object.defineProperty(this, key, {
            get () {
                return this.$data[key];
            },
            set (newVal) {
                this.$data[key] = newVal;
            }
        });
    };

    defineReactive (data, key, val) {
        // 给data中的每一层级的每个key创建一个Dep
        const dep = new Dep();
        // 给data中的每一层级的每个key都设置getter，setter，用来监听属性的变化
        Object.defineProperty(data, key, {
            get () {
                // 将Dep.target添加到dep中
                Dep.target && dep.addDep(Dep.target);
                return val;
            },
            set (newVal) {
                if (newVal !== val) {
                    val = newVal;
                    dep.notify();
                }
            }
        });
        // 在此递归
        this.observe(val);
    };
};

/**
 * Dep接收observe通知的变化
 * deps中保管着与这个key相关的所有视图依赖（watcher）
 */
class Dep {
    constructor () {
        // deps存放着此条属性和视图有关的依赖，有几个依赖就有几个watcher
        this.deps = [];
    };

    addDep (watcher) {
        this.deps.push(watcher);
    };

    notify () {
        this.deps.forEach(watcher => watcher.update());
    };
};

/**
 * 每一个视图依赖就有一个watcher
 * update更新这个依赖的视图
 */
class Watcher {
    constructor (vm, key, cb) {
        this.vm = vm;
        this.key = key;
        this.cb = cb;

        Dep.target = this;
        this.vm[this.key]; // 添加watcher到dep
        Dep.target = null;
    };

    update () {
        // console.log('属性更新了');
        this.cb.call(this.vm, this.vm[this.key]);
    }
};