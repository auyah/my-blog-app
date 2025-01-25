import { createStore } from 'vuex';

// 创建 store
export default createStore({
  state: {
    // 定义应用的状态
    user: null,
    posts: []
  },
  mutations: {
    // 同步变更状态的方法
    setUser(state, user) {
      state.user = user;
    },
    setPosts(state, posts) {
      state.posts = posts;
    }
  },
  actions: {
    // 异步操作
    fetchPosts({ commit }) {
      // 假设这里会从API获取posts数据
      const posts = [
        { id: 1, title: 'Post 1', content: 'Content 1' },
        { id: 2, title: 'Post 2', content: 'Content 2' }
      ];
      commit('setPosts', posts);
    }
  },
  modules: {
    // 可以分割store到多个模块
  }
});