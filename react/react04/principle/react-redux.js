import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'


/**
 * react-redux,提供了两个便利的函数
 * connect
 * Provider
 */
 
export const connect = (mapStateToProps = state => state, mapDispatchToProps = {}) => {
    // 高阶组件，传入我们的业务组件，返回强化后的组件，可以拿到state和dispatch
    (WrapComponent) => {
        return class ConnectComponent extends React.Component {
            static contextTypes = {
                store: PropTypes.object
            }
            constructor(props, context) {
                super(props, context)
                this.state = {
                    props: {}
                }
            }
            componentDidMount() {
                // 从上下文解构出store，对其执行监听，传入update函数，当每次状态变化时都会调用update，所以react-redux不需要手动执行subscribe
                const { store } = this.context
                store.subscribe(() => this.update())
                this.update()
            }
            // 更新函数
            update() {
                // 上下文中取出store
                const { store } = this.context
                // store.getState()拿状态，所以react-redux也不需要显示调用store.getState()
                // 拿到的状态传入mapStateToProps执行，返回新的state
                const stateProps = mapStateToProps(store.getState())
                // 映射dispacth
                const dispatchProps = bindActionCreators(mapDispatchToProps, store.dispatch)
                // 存最新的props
                this.setState({
                    props: {
                        ...this.state.props,
                        ...stateProps,
                        ...dispatchProps
                    }
                });
            }
            // 渲染时，将最新的props映射到我们的业务组件，组件就可以使用了
            render() {
                return <WrapComponent {...this.state.props}></WrapComponent>
            }
        }
    }
}

export class Provider extends React.Component {
    // 创建上下文，注入store
    static childContextTypes = {
        store: PropTypes.object
    }
    getChildContext() {
        return { store: this.store }
    }
    constructor(props, context) {
        super(props, context)
        // store赋值为传入的store
        this.store = props.store
    }
    // 渲染内部包裹的组件，也就是需要拿到全局store的组件
    render() {
        return this.props.children
    }
}