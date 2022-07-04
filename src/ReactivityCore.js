// 模拟Vue的实例
let VM2x = {}
let VM30 = {}
// 观察者模式 的 发布者
export class Dependency {
  constructor () {
    // 存储所有的观察者
    this.subs = []
  }
  // 添加观察者
  addSub (sub) {
    if (sub && typeof sub.update === 'function') {
      this.subs.push(sub)
    }
  }
  // 通知所有的观察者
  notify (data) {
    this.subs.forEach(sub => {
      sub.update(data)
    })
  }
}
// 观察者模式 的 订阅者
export class Watcher {
  constructor (options) {
    // 存储所有的观察者
    this.data = options
  }
  update (data) {
    console.log(`Watching catched: ${JSON.stringify(this.data)} updated ${JSON.stringify(data)}`)
    this.data = data
    document.querySelector('#app').textContent = JSON.stringify(this.data)
  }
}

// 事件触发器
class EventEmitter {
  constructor () {
    // {'click': [fn1, fn2], 'change': [f2]}
    this.subscribes = Object.create(null)
  }
  // 触发事件
  $emit (eventType, data) {
    if (!this.subscribes[eventType]) {
      return
    }
    this.subscribes[eventType].forEach(handler => {
      handler(data)
    })
  }
  // 注册事件
  $on (eventType, handler) {
    if (!this.subscribes[eventType]) {
      this.subscribes[eventType] = []
    }
    this.subscribes[eventType].push(handler)
  }
}

export default class ReactivityCore {
  // 构造函数，初始化一个EventEmitter
  constructor (options) {
    this.eventEmitter = new EventEmitter()
    this.$dep = new Dependency()
    this.$addSub = this.$dep.addSub.bind(this.$dep)
    this.$notify = this.$dep.notify.bind(this.$dep)
    this.$emit = this.eventEmitter.$emit.bind(this.eventEmitter)
    this.$on = this.eventEmitter.$on.bind(this.eventEmitter)
  }

  static vue2x (options) {
    const interceptData = (data = {}) => {
      Object.entries(data).map(([key, value]) => {
        console.log(key, value)
        Object.defineProperty(VM2x, key, {
          enumerable: true,
          configurable: true,
          get () {
            console.log(`get: [${key}] value is: ${data[key]}`)
            return data[key]
          },
          set (newValue) {
            if (newValue === data[key]) {
              return
            }
            data[key] = newValue
            console.log(`set: [${key}] value is: ${newValue}`)
            document.querySelector('#app').textContent = newValue
          }
        })
      })
    }
    interceptData(options.data)

    return { data: VM2x }
  }

  static vue30 (options) {
    const proxyData = (data) => {
      return new Proxy(data, {
        get (target, key) {
          return target[key]
        },
        set (target, key, value) {
          if (value === target[key]) {
            return true
          }
          target[key] = value
          document.querySelector('#app').innerHTML = value
        }
      })
    }
    VM30 = proxyData(options.data)
    return { data: VM30 }
  }
}
