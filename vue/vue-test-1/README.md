# vue组件化实战，封装表单控件，实现登录表单校验功能

封装思路：
1. UI结构嵌套设计：
form(KForm) => label(KFormItem) => input(KInput)
2. 思考各层级组件做的事：
KForm（最外层）：实现全局校验（点击submit按钮时）；
KFormItem（中间层，label，包裹KInput）：对单个表单（子组件）校验；
KInput（最里层，基础input单元）：实现input双向绑定，通知父组件进行单个表单校验；


## <k-input>组件做两件事
1. 实现与组件调用层的data中的model的数据双向绑定；
2. 通知父组件（FormItem）进行校验；

#### <k-input>实现自定义组件绑定v-model语法糖
1. 组件内props接收value实现组件调用层data中的model.xxx至该组件内input的value值的单向绑定；
2. 添加@input监听，input监听事件中，通过$emit派发至组件调用层，实现组件调用层data中的model.xxx与该组件input表单的数据双向绑定；

#### 通知父组件（FormItem）进行校验（单个表单规则的校验）
1. input监听事件中，通过this.$parent.$emit("validate")，派发validate事件通知父组件进行输入校验;
2. 父组件监听validate方式：this.$on("validate", this.validate);


## <KFormItem>
1. 通过inject["form"]接收父组件实例，为的是拿到父组件的model数据和相应的校验规则，以便于交给校验器（async-validator）进行校验；
2. props接收label和prop，显示label内容，prop属性用来匹配校验规则；
3. 对子组件派发的validate事件进行监听，执行校验；
4. validate事件除了执行校验的提示功能以外，还return了一个promise.resolve(bool)对象，用来父级做全局校验，bool：代表了此表单的校验是“通过”还是“不符合”；


## <KForm>
1. 通过provide，向后代传递自身实例，这里是在KFormItem组件内接收；
2. 定义全局校验方法，点击submit时执行；
3. 该全局校验方法实际上是对所有传入了prop属性的组件执行各自的校验规则方法；







