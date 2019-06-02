export function createStore(reducer, enhancer) {
    if (enhancer) {
        // 若检测到createStore传入第二个参数，也就是applyMiddleware(logger, thunk, ...)，直接return 函数执行，在传入reducer
        return enhancer(createStore)(reducer)
    }
    // 当前状态注册的地方
    let currentState = {}
    // 监听器注册的地方
    let currentListeners = []
    // 返回当前状态
    function getState() {
        return currentState
    }
    // 注册监听器，传入的listener是函数
    function subscribe(listener) {
        currentListeners.push(listener)
    }
    // 发起action
    function dispatch(action) {
        // 根据传入的action，执行reducer，去执行处理逻辑，最终返回新的currentState
        currentState = reducer(currentState, action)
        // 当状态发生变化，执行所有监听器函数，例如去做一些日志等等，相当于状态变化时就去执行的钩子函数
        currentListeners.forEach(v => v())
        return action
    }
    dispatch({ type: '@IMOOC/KKB-REDUX' })
    return { getState, subscribe, dispatch }
}

// 高阶函数，传入了一堆中间件，返回一个函数
export function applyMiddleware(...middlewares) {
    return createStore => (...args) => {
        const store = createStore(...args)
        let dispatch = store.dispatch
        const midApi = {
            getState: store.getState,
            dispatch: (...args) => dispatch(...args)
        }
        // 对所有中间件执行map，执行每个中间件，传入midApi（两个方法，getState，dispatch）
        const middlewareChain = middlewares.map(middleware => middleware(midApi))
        // 传入store.dispatch，返回强化过的dispatch
        dispatch = compose(...middlewareChain)(store.dispatch)
        return {
            ...store,
            dispatch
        }
    }
}


export function compose(...funcs) {
    if (funcs.length == 0) {
        return arg => arg
    }
    if (funcs.length == 1) {
        return funcs[0]
    }
    // ..args就是传入的那些个dispatch，然后依次让从左往右的中间件处理
    return funcs.reduce((left, right) => (...args) => right(left(...args)))
}

// 证明了mapDispatchToProps直接传对象是可行的，其实是经过处理，返回了dispatch函数
function bindActionCreator(creator, dispatch) {
    return (...args) => dispatch(creator(...args))
}


export function bindActionCreators(creators, dispatch) {
    return Object.keys(creators).reduce((ret, item) => {
        ret[item] = bindActionCreator(creators[item], dispatch)
        return ret
    }, {})
}