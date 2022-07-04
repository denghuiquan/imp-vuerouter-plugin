import routerLink from './router-link'
import routerView from './router-view'

let _Vue = null

export default class VueRouter {
  // Vue.use(VueRouter)其实就是调用的install的方法
  // Vue.use调用会传入Vue参数
  static install (Vue, options) {
    // 01 判断当前插件是否已经被安装，没装才需要继续安装
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true

    // 02 把Vue的构造函数记录到全局变量中，因为在将来的实例方法中还要使用这个Vue构造函数，
    // 比如说要去创建<router-link>和<router-view>这两个组件的时候,就要用到Vue.component()来创建
    _Vue = Vue
    // 03 把创建Vue实例时传入的router对象给注入到所有的Vue实例上，包括所有的组件，如this.$router this.$route
    //  通过使用混入mixins，在每个Vue组件创建前确保都拥有$router， 使得每个使用Vue创建的组件都有$router属性
    _Vue.mixin({
      beforeCreate () {
        // 只有在创建Vue实例对象的时候才传入了router对象
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
          _Vue.prototype.$route = this.$options.router.data
        }
      }
    })
  }
  constructor (options) {
    // 初始化类的三个属性
    this.options = options
    // 使用Vue.observable(object)可以创建一个响应式的数据对象
    // 响应式的数据对象可以直接用在渲染函数或者计算属性里
    let current = null
    if (options && options.mode) {
      switch (options.mode) {
        case 'hash':
          current = window.location.hash.slice(1)
          break
        case 'history':
          current = window.location.pathname
          break
        default:
          current = '/'
          break
      }
    }
    this.data = _Vue.observable({
      current, // 用于存储当前的路由地址，刷新页面数据保留
      matched: [] // 记录路由匹配
    })
    this.routeMap = {} // 路径：视图组件（键值对）
    console.log('mode::---->>>', options.mode)
  }
  // 这里统一只采用一种实现的话可以大大简化代码，
  // 要么直接使用this.options.routes做遍历，
  // 要么就在构造routeMap时给元素挂parent属性方便追溯父级，减少遍历判断次数,
  // 这里就不做优化了
  match (routes) {
    // routes = routes || this.options.routes
    if (routes) {
      // 这里的默认子路由还没有实现
      // 递归遍历
      for (const route of routes) {
        // /dashboard/about 类似的嵌套子路由
        if (route.path !== '/' && this.data.current.indexOf(route.path) > 0) {
          this.data.matched.push(route)
          if (route.children) {
            this.match(route.children)
          }
          return
        } else if (this.data.current.indexOf(route.path) < 0) {
          if (route.props) {
            // 这里需要处理/dashboard/post/:id的情况，也就是嵌套子路由在props: true的条件下的情况
            // 从route.path中解析出 props key
            const matchProps = route.path.match(/\/:(.+)\/?/)
            const pathPrefix = route.path.substr(0, matchProps.index)
            if (this.data.current.indexOf(pathPrefix) !== -1) {
              // 从this.data.current中解析出 props value
              const matchpropValues = this.data.current.substr(this.data.current.indexOf(pathPrefix)).match(/\/(.+)\/?/)
              if (matchProps && matchpropValues) {
                let propKey = matchProps[1]
                let value = matchpropValues[1]
                // mout the props as params object
                this.data.params = {
                  [propKey]: value
                }
              }
              this.data.matched.push(route)
              if (route.children) {
                this.match(route.children)
              }
            }
          }
        }
      }
    } else {
      // 通过routeMap匹配当前路径的components
      if (this.routeMap[this.data.current] && !this.routeMap[this.data.current].parent) {
        // 处理路由完全匹配的情况
        this.data.matched.push(this.routeMap[this.data.current])
        // 完全匹配下的默认路径''也需要作为matched的路由被处理
        if (this.routeMap[this.data.current].children) {
          const routeChildren = this.routeMap[this.data.current].children
          for (let index = 0; index < routeChildren.length; index++) {
            if (routeChildren[index].path === '') {
              this.data.matched.push(routeChildren[index])
            }
          }
        }
      } else if (this.data.current === '' && !this.routeMap['/'].parent) {
        // 处理根路由的情况
        this.data.matched.push(this.routeMap['/'])
      } else {
        // 处理嵌套路由
        for (const path in this.routeMap) {
          if (path !== '/' && path !== '*' && path !== '' && this.data.current.indexOf(path) !== -1 && this.routeMap[path]) {
            // 逐层处理匹配到的路由，push到this.data.matched数组中
            if (this.data.current.indexOf(path) === 0) {
              this.data.matched.push(this.routeMap[path])
              if (this.routeMap[path].children) {
                this.match(this.routeMap[path].children) // 如果单纯使用routeMap这里的传值意义就不大了
              }
              return
            }
          }
        }
      }
    }
  }
  createRouteMap (routes, parentRoute) { // 这个倒是没什么意义了，可能有，的确能根据路径path快速找到component
    // 没传值则默认处理的options配置的routes
    routes = routes || this.options.routes

    routes.forEach(route => {
      // 构建当前要构建的路径作为key值
      let current = route.path
      // 遍历所有的路由规则，把路由规则解析成键值对的形式存储到routeMap中
      // 构建键值对
      this.routeMap[current] = route
      // 这里添加Parent，方便手续的路由反向解析成real path
      this.routeMap[current].parent = parentRoute
      if (route.children && route.children.length > 0) {
        this.createRouteMap(route.children, route)
      }
    })
  }
  push (options) {
    let to = ''
    if (typeof options === 'string') {
      to = options
    } else if (typeof options === 'object') {
      let matchRoute = null
      for (const path in this.routeMap) {
        if (this.routeMap[path].name === options.name) {
          matchRoute = this.routeMap[path]
        }
      }
      to = Object.entries(options.params).reduce((prev, curr) => {
        return (prev + '').replace(`:${curr[0]}`, curr[1])
      }, matchRoute.path)
      let parentRoute = matchRoute.parent
      // 根据当前匹配到的route的parent追索到根节点去查询父辈route的path并进行拼接
      while (parentRoute) {
        if (parentRoute) {
          to = matchRoute.parent.path + '/' + to
        }
        parentRoute = parentRoute.parent
      }
      to.replace(/\/\//g, '/')
    }
    // 更新observable object视图会自动更新
    this.data.current = to
    window.history.pushState(options.params, 'title', this.data.current)
    // 清空路由数组
    this.resetMatched()
  }
  go (options) {
    let to = ''
    if (typeof options === 'string') {
      to = options
    } else if (typeof options === 'object') {
      to = `${options.pathname}/${Object.values(options.params).join('/')}`
    }
    history.pushState({}, '', to)
    // 更新observable object视图会自动更新
    this.data.current = to
    // 清空路由数组
    this.resetMatched()
  }
  initComponents (Vue) {
    // 构建Router-Link组件
    Vue.component('router-link', routerLink)
    // 构建Router-View组件
    Vue.component('router-view', routerView)
  }
  initEvent () {
    switch (this.options.mode) {
      case 'hash':
        // hash mode
        // 监听hash的变化  hash mode
        window.addEventListener('hashchange', (state) => {
          console.log(`hashchange: ${state.oldURL} ——> ${state.newURL}`)
          // window.location.hash 获取的值 #/home
          this.data.current = window.location.hash.slice(1)
          this.resetMatched()
        })
        break
      case 'history':
        // history mode
        window.addEventListener('popstate', (state) => {
          console.log(`${state.type}: at timeStamp ${state.timeStamp}`)
          // 把当前浏览器地址栏的路径pathname部分设置到router.data.current上即可
          this.data.current = window.location.pathname
          // 清空路由数组
          this.resetMatched()
        })
        break
      default:
        // 可能是在非浏览器端使用的情况， 例如使用的是ssr模式
        console.log(`invalid mode ${this.options.mode} for now`)
        break
    }
  }
  init () {
    this.createRouteMap() // 创建路由规则可快速匹配的键值对形式
    this.initComponents(_Vue) // 创建两个全局组件：router-link 和 router-view
    this.initEvent() // 初始化时注册popstate事件的监听器处理函数，主要是用于处理地址栏前进后退按钮的视图更新问题
    this.resetMatched()
  }
  resetMatched () {
    this.data.matched = []
    this.match()
  }
}
