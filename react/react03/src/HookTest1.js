import React, { useState, useEffect, useReducer, useContext } from 'react';

/**
 * 添加水果组件
 */
function FruitAdd ({setFruits}) {
    const [pname, setPname] = useState('');
    const {dispatch} = useContext(Context);
    const onAddFruit = e => {
        if (e.key === "Enter") {
            dispatch({type: 'add', payload: pname});
            setPname('');
        }
    };
    return(
        <div>
            <input 
                type="text" 
                value={pname} 
                onChange={e => setPname(e.target.value)} 
                onKeyDown={onAddFruit}
            />
        </div>
    );
};


/**
 * 水果列表UI组件
 */
function FruitList ({fruits, setFruit}) {
    return (
        fruits.map((e, i) => <li key={e + i} onClick={() => setFruit(e)}>{e}</li>)
    );
};


/**
 * 创建上下文
 */
const Context = React.createContext();


/**
 * 全局状态管理，reducer
 */
function fruitReducer (state, action) {
    switch (action.type) {
        // 初始化数据
        case "init":
            return action.payload;
        // 新增一条数据
        case "add":
            return [...state, action.payload];
        default:
            return state;
    }
};


/**
 * 水果选择组件
 */
export default function Hooktest () {
    const [fruit, setFruit] = useState('樱桃');
    // const [fruits, setFruits] = useState([]);
    // 参数一是相关reducer，参数二是初始值
    const [fruits, dispatch] = useReducer(fruitReducer, []);

    // 使用useEffect操作副作用
    // 请务必设置依赖选项，如果没有则设置空数组表示仅执行一次
    useEffect(() => {
        setTimeout(() => {
            console.log("get fruits");
            // setFruits(["樱桃", "香蕉"]);
            dispatch({type: 'init', payload: ["樱桃", "香蕉"]});
        }, 1000);
    }, []);

    useEffect(() => {
        document.title = fruit;
    }, [fruit]);

    useEffect(() => {
        const timer = setInterval(() => {
            console.log("应用启动了");
        }, 1000);
        // 返回清除函数
        return function() {
          clearInterval(timer);
        };
    }, []);

    return (
        <Context.Provider value={{ fruits, dispatch }}>
            <div>
                <p>{fruit === "" ? "请选择喜爱的水果" : `您选择的是${fruit}`}</p>
                <FruitAdd />
                <FruitList fruits={fruits} setFruit={setFruit} />
            </div>
        </Context.Provider>
    );
};