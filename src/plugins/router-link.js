export default {
  props: {
    to: String,
    required: true
  },
  methods: {
    clickHandler (e) {
      if (this.$router.options.mode === 'history') {
        history.pushState({}, '', this.to)
      }
      // 更新observable object视图会自动更新
      this.$router.data.current = this.to
      this.$router.resetMatched()
      if (this.$router.options.mode === 'history') {
        e.preventDefault()
      }
    }
  },
  // template: '<a :href="to"><slot></slot></a>', // 运行时版本下解决要使用template模版的方法1: 如何把vue cli创建的项目中切换成完整版本？我们需要在项目根目录下创建vue.config.js
  render (h) { // 参数h是一个函数，它是帮我们创建虚拟DOM的，是Vue传递过来的,
    // h函数接收三个参数，
    // 01 创建的元素对应的选择器；
    // 02 给标签设置一些dom属性，{attrs:{}};
    // 03 设置生成的元素中的子元素，是一个数组形式[], 这里演示的<a>标签下是一个<slot>，我们可以通过this.$slots.default拿到默认的未命名的slot元素
    // hash模式需要 '#'
    // 虚拟dom设置a标签属性和值
    // return h('a', { attrs: { href: '#' + this.to } }, this.$slots.default)
    return h('a', {
      attrs: {
        href: this.$router.options.mode === 'hash' ? '#' + this.to : this.to
      },
      on: {
        click: this.clickHandler
      }
    }, [this.$slots.default])
  }
}
