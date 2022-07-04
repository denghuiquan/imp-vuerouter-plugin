<template>
  <div>
    <header>
      <h2>public头
        <img class='logo' alt="Vue logo" src="../assets/logo.png">
      </h2>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/dashboard">Dashboard</router-link>
    </header>
    <div>
      <router-view></router-view>
    </div>
    <footer>
      <div>
        <h3>public尾</h3>
        <p>A footer typically contains information about its section such as who wrote it, links to related
          documents, copyright data, and the like.</p>
      </div>
    </footer>
  </div>
</template>
<style scoped>
header {
  color: rgb(91, 74, 45);
  background: rgb(230, 234, 226);
}
.logo{
  width: 32px;
  height: 100%;
  vertical-align: middle;
}
footer{
  font-size: smaller;
}
</style>
<script>
export default {
  name: 'layout'
}
</script>
