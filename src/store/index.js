import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId: null
  },
  getters: {
    getUserId: state => state.userId
  },
  mutations: {
    setUserId(state, id) {
      state.userId = id;  // 设置用户 ID 的 mutation
    }
  },
  actions: {
    setUserId({ commit }, id) {
      commit('setUserId', id);  // 触发设置用户 ID 的 action
    }
  },
  modules: {
  }
})
