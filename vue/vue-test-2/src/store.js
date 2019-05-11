import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const cart = {
  state: {
    list: []
  },
  mutations: {
    addCart(state, good) {
      const ret = state.list.find(v => v.id === good.id);
      if (ret) {
        ret.count += 1;
      } else {
        state.list.push({ ...good, count: 1, active: true });
      }
    }
  },
  actions: {
    test({ commit }, payload) {
      console.log(111111111);
    }
  },
};

export default new Vuex.Store({
  state: {
    isLogin: false
  },
  getters: {
    loginState(state) {
      return state.isLogin ? "欢迎回来" : "游客";
    },
    val (state) {
      return state.isLogin ? "" : "请登录";
    }
  },
  mutations: {
    login(state) {
      state.isLogin = true;
    }
  },
  actions: {
    requestLogin({ commit, dispatch }, payload) {
      console.log(arguments);
      console.log(payload);
      console.log(dispatch);
      dispatch("testAction", 222);
      return new Promise(resolve => {
        setTimeout(() => {
          commit("login");
          resolve(true);
        }, 1000);
      });
    },
    testAction () {
      console.log(2222);
    }
  },
  modules: {
    cart
  }
});
