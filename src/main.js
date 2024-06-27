import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'swiper/css/swiper.min.css'

import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);

Vue.config.productionTip = false

// router.beforeEach((to, from, next) => {
//   const isLoggedIn = localStorage.getItem('isLogin') === true;
//   if (isLoggedIn && to.path === '/') {
//     next('/index');  // 已登录用户重定向到首页
//   } else if (!isLoggedIn && to.path !== '/') {
//     next('/');  // 未登录用户重定向到登录页
//   } else {
//     next();  // 其他情况放行
//   }
// });

// Vue.mixin({
//   data() {
//     return {
//       user_id: ""
//     };
//   },
//   mounted() {
//     console.log(this.user_id)
//   }
// });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
