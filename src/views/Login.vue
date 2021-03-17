<template>
  <div class="login">
    <div class="login__form">
      <h1 class="form__title">欢迎登录云工位</h1>
      <div class="form__item">
        <img src="../assets/login/user.png" alt="用户名" class="icon" />
        <input type="text" class="input" v-model="account.loginName" />
      </div>
      <div class="form__item">
        <img src="../assets/login/lock.png" alt="密码" class="icon" />
        <input type="password" class="input" v-model="account.password" />
      </div>
      <div class="form__item btn">
        <a href="javascript:void(0);" class="submit" @click="submit">登录</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { message } from 'ant-design-vue'
import { getTokenByAccount } from '../api/user'
import router from '../router'
import { reportLogin } from '../api/cloud-station'
import db from '../common/db'

const account = reactive({ loginName: '', password: '' })
const submit = async () => {
  if (!account.loginName || !account.password) {
    message.warning(`请检查用户名和密码`)
    return
  }

  db.read()
    .set('userInfo', {})
    .write()

  try {
    const res = await getTokenByAccount({ ...account })
    db.read()
      .set('userInfo', { token: res.data })
      .write()
    reportLogin()
    router.push('/')
  } catch (err) {
    message.error(err.message)
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent url(../assets/login/login_bg.png) center center/cover no-repeat;

  &__form {
    background: #ffffff;
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    border-radius: 4px;
    padding: 32px;
  }

  .form__title {
    font-family: PingFangSC-Regular;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 32px;
    padding: 0;
    margin: 0;
    margin-bottom: 16px;
  }
  .form__item {
    margin-bottom: 24px;
    background: #ffffff;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    border-radius: 2px;
    height: 40px;
    width: 280px;
    display: flex;
    align-items: center;
    overflow: hidden;
    .icon {
      margin-left: 15px;
      margin-right: 10px;
    }
    .input {
      border: 0;
      height: 100%;
      flex: 1;
      outline: none;
    }

    &.btn {
      background: #1890ff;
      border-radius: 2px;
      border-radius: 2px;
      a {
        flex: 1;
        height: 100%;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #ffffff;
        line-height: 40px;
        text-decoration: none;
        text-align: center;
      }
    }
  }
}
</style>
