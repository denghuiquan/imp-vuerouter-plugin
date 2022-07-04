<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div>
      <img alt="Vue logo" src="../assets/logo.png">
    </div>
    <router-link to="/dashboard/post/1298934829"> 查看文章 </router-link>
    <button @click="goToDetail"> 查看9527绝密档案 </button>
  </div>
</template>
<script>
export default {
  name: 'about',
  data () {
    return {
      id: 9527
    }
  },
  methods: {
    goToDetail () {
      this.$router.push({ name: 'postdetail', params: { id: this.id } })
    }
  }
}
</script>
