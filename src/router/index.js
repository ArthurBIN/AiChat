import Vue from 'vue'
import VueRouter from 'vue-router'
import ChatPage from '../views/ChatPage.vue'
import IndexPage from "@/views/IndexPage.vue";
import DataPage from "@/views/DataPage.vue";
import ActivityPage from "@/views/ActivityPage.vue";
import ContentInfoPage from "@/views/ContentInfoPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import EditPage from "@/views/EditPage.vue";
import EditStoryPage from "@/views/EditStoryPage.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: {
      title: '时光之语'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: {
      title: '时光之语'
    }
  },
  {
    path: '/chat',
    name: 'chat',
    component: ChatPage,
    meta: {
      title: '时光之语                                                           '
    }
  },
  {
    path: '/',
    name: 'index',
    component: IndexPage,
    meta: {
      title: '时光之语'
    }
  },
  {
    path: '/datapage',
    name: 'datapage',
    component: DataPage,
    meta: {
      title: '时光之语'
    }
  },
  {
    path: '/active',
    name: 'active',
    component: ActivityPage,
    meta: {
      title: '时光之语'
    }
  },
  {
    path: '/contentinfo',
    name: 'contentinfo',
    component: ContentInfoPage,
    meta: {
      title: '时光之语'
    }
  },
  {
    path: '/edit',
    name: 'edit',
    component: EditPage,
    meta: {
      title: '时光之语'
    }
  },
  {
    path: '/editstory',
    name: 'editstory',
    component: EditStoryPage,
    meta: {
      title: '时光之语'
    }
  },

]

const router = new VueRouter({
  routes
})

export default router
