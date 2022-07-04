<template>
  <div class="login">
    <div>
      <fieldset>
        <legend>## 用户登录 ##</legend>
        <p>
          <label for="email">邮箱：</label>
          <input type="email" name="email" id="email" v-model="email" placeholder="please input your email">
        </p>
        <p>
          <label for="email">密码：</label>
          <input type="password" name="password" id="password" v-model="password" placeholder="please input your password">
        </p>
        <p>
          <input type="checkbox" name="acceptpolicy" id="policyCheck" v-model="accepted">
          <label class="acceptpolicy" for="acceptpolicy" :class="{accepttip: tryLogined&&!accepted}">我已阅读并同意平台服务条款（请在阅读平台服务协议后并同意的情况下勾选）</label>
          <button type="submit" @click="submit">登录</button><button type="reset" @click="reset">重置</button>
        </p>
      </fieldset>
    </div>
  </div>
</template>

<style scoped>
.login {
  text-align: center;
}
.acceptpolicy{
  font-size: small;
}
.accepttip {
  color: red;
}
</style>

<script>
let isAuthenticated = false
export default {
  name: 'home',
  data () {
    return {
      accepted: false,
      email: '',
      password: '',
      tryLogined: false
    }
  },
  methods: {
    submit () {
      this.tryLogined = true
      // ajax request
      if (this.accepted) {
        console.log(this.email, this.password)
        isAuthenticated = true
        this.goToDashboard()
      } else {
        this.$el.focus()
      }
    },
    reset () {
      this.email = ''
      this.password = ''
    },
    goToDashboard () {
      if (isAuthenticated) {
        this.$router.push('/dashboard')
      } else {
        this.$router.push('/login')
      }
    }
  }
}
</script>
