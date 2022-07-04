import Vue from 'vue'
// import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Router from './plugins/vue-router'

// 1、注册路由插件
// Vue.use是用来注册插件的，它会调用传入对象对的install方法
Vue.use(Router)

// 3、创建并暴露Router对象实例
export default new Router({
  mode: 'history', // 'hash' | 'history',
  base: process.env.BASE_URL,
  // 2、编写创建路由规则数组
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
    },
    {
      path: '/dashboard',
      component: () => import(/* webpackChunkName: "dashboardlayout" */ '@/components/Layout.vue'),
      children: [
        {
          path: '',
          name: 'dabout',
          component: About
        },
        {
          path: 'post/:id',
          name: 'postdetail',
          // 开启props，会把URL中的参数传递给组件
          //  在组件中可通过props来接受URL参数
          props: true,
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "post" */ '@/views/Post.vue')
        }
      ]
    },
    {
      path: '*',
      name: 'notfound',
      component: () => import(/* webpackChunkName: "notfound" */ '@/views/NotFound.vue')
    }
  ]
})
