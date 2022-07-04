import Vue from 'vue'
import App from './App.vue'
// 4-1、导入路由对象
import router from './router'

Vue.config.productionTip = false
// 4-2、创建Vue实例对象并挂载到页面上
new Vue({
  // 4-3、注册router对象
  router,
  render: h => h(App)
}).$mount('#app')

/* import ReactivityCore, { Watcher } from './ReactivityCore'

const reactiveData = ReactivityCore.vue2x({ data: { abc: 'hello world!' } })
const reactiveDataVM3 = ReactivityCore.vue30({ data: { cba: 'hello world!jjjj' } })
console.log(reactiveData, reactiveDataVM3)
const vm = new ReactivityCore()
vm.$on('changeTodo', (todo) => {
  console.log(todo)
})

vm.$on('changeTodo', (todo) => {
  console.log(todo.name)
})
vm.$emit('changeTodo', { name: 'help me! kill me!' })
vm.$addSub(new Watcher({ message: 'hello world!!!' }))
vm.$addSub({ update: console.log, todoTips: 'hey guys! hello!!!' })
vm.$notify({ notify: 'hey guy hello worldd!!!' })
 */
