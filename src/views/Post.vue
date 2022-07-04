<template>
    <div class="home">
        <p>The Post Id accepted from dynamic URL route is: <code>{{ id }}</code></p>
        <p> 方式1、通过当前路由规则，获取数据:
            {{ $route.params.id }}</p>
        <p> 方式2、路由规则中开启了props传参，可以为组件添加props: ['id']，来把URL参数拿到
            {{ id }}</p>
    </div>
</template>

<script>
export default {
  name: 'post',
  props: ['id']
}
</script>
