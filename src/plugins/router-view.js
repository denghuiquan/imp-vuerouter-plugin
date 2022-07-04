/*  路由嵌套实现思路
1、标记路由嵌套层数
2、路由匹配获取代表深度层级的matched数组
*/
export default {
  render (h) {
    // 标记当前router-view深度
    this.$vnode.data.routerView = true
    // 路由嵌套层数计算
    let depath = 0
    let parent = this.$parent
    // 根据当前vnode的parent追索到根节点去查询父辈vnode是否有routeView，有则当前vnode的router-view深度depath++
    while (parent) {
      const vnodeData = parent.$vnode && parent.$vnode.data
      if (vnodeData) {
        if (vnodeData.routerView) {
          depath++
        }
      }
      parent = parent.$parent
    }
    // 定义存储组件变量
    let components = null
    // 查找到对应组件赋值
    let route = '!'
    if (this.$router.data.matched.length) {
      route = this.$router.data.matched[depath]
    } else {
      // 处理404情况
      if (this.$router.routeMap['*']) {
        route = this.$router.routeMap['*']
      }
    }
    if (route) {
      components = route.component
    }
    // 渲染对应组件
    return h(components)
  }
}
