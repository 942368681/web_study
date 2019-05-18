# vue源码剖析

## vue工作机制
==通过 Object.defineProperty 设置 getter setter 用来实现 【响应式】与【依赖收集】==

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