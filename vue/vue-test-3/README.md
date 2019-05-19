# vue源码剖析

## vue工作机制
> 通过 Object.defineProperty 设置 getter setter 用来实现 【响应式】与【依赖收集】

### 流程图说明
![image](https://raw.githubusercontent.com/942368681/web_study/master/vue/vue-test-3/vue%E5%BA%95%E5%B1%82%E5%8E%9F%E7%90%86%E5%85%B3%E7%B3%BB%E5%9B%BE%EF%BC%88%E5%8E%9F%EF%BC%89.png)

###### 创建vue实例

###### 挂载实例（$mount）

###### 执行编译函数（compile）
- parse
- optimize
- generate
```
compile作用：
    执行编译过程，根据template生成渲染函数（render func）
    parse：使用正则解析tempalte中的vue指令（v-xxx）等等，形成抽象语法树AST
    optimize：标记一些静态节点，用作后面的一些性能优化，在diff的时候直接略过
    generate：把第一部分的AST转化为渲染函数render function
```

###### 调用render function
```
两条线：
    1. render生成Virtual Dom Tree => patch()生成真实Dom
    2. touch进行依赖收集 => getter => watcher更新一个新的Virtual Dom Tree => patch()比较新老两个树，执行diff算法，更新不同的部分到真实的Dom
```

## 手动实现简版vue核心

### 简化后流程图为根目录下 vue底层原理关系图（简）.png

> 流程说明：初始化kvue实例，执行Observe，执行Compile，第一次把data中的属性更新到与之相关的视图中并且进行这个属性的依赖收集（new Watcher）

> data双向绑定实现过程：遍历data中每个层级的每个属性，给每个属性创建一个Dependency，这个Dependency中有存放着一个或多个watcher，每个watcher代表着一个与视图有关的依赖，当kvue初始化挂载时，执行编译函数，将data中有关视图的依赖属性值更新到视图上时，再执行一个依赖收集的逻辑（new Watcher），这个逻辑会把当前这个watcher实例添加到这个属性的Dependency中（通过访问一次这个属性值调用get方法实现），以后每次更改这个data的属性值的时候，会调用这个属性的set方法，从而调用这个属性的Dependency的notify方法，从而遍历调用Dependency中的所有watcher的update方法，达到更新与这个属性相关的所有视图的目的。

###### observe函数
```
对传入的data进行【响应化操作】和【做代理】，响应化操作也就是设置好属性的getter，setter并且为每个属性创建好其对应的Dependency
observe => defineReactive / proxyData

defineReactive：给data中的每一层级的每个key创建一个Dep && 给data中的每一层级的每个key都设置getter，setter，用来监听属性的变化
proxyData：将此key代理到vue实例上，如果不代理，外部访问需要通过this.$data.xxx，代理之后外部访问变为this.xxx
```

###### getter
```
1. return val
2. 为这个属性的Dependency添加watcher
```

###### setter
```
1. 赋值
2. 调用与这个属性相关的所有watcher的更新方法：dep.notify() => this.deps.forEach(watcher => watcher.update()) => 更新Dom
```