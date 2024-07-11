<template>
<!--  已连接后端api  -->

<!--  登录界面-->
  <div class="All">

    <!--    背景图片-->
    <div class="bgiBox">
      <img src="../images/bgc1.png" alt="">
    </div>

    <div class="inputBox">

<!--      用户名框-->
      <div class="userName_Box input_ItemBox">
        <div class="input_ItemBox_text">用户名</div>
        <input type="text" v-model="username"/>
      </div>

<!--      密码框-->
      <div class="pW_Box input_ItemBox">
        <div class="input_ItemBox_text">密码</div>
        <input type="password" v-model="password"/>
      </div>

<!--      登录按钮-->
      <div class="LoginBtn"
           @touchstart.stop="pressButton"
           @touchend.stop="releaseButton"
           ontouchstart="return false;"
           onselectstart="return false;"
           :class="{ 'small': isPressed }"
      >
        登录
      </div>

<!--      忘记密码/注册-->
      <div class="registerBox">
        <div>忘记密码</div>
        <div @click="goRegister()">注册</div>
      </div>

    </div>

  </div>

</template>

<script>
import {Toast} from "vant";
import myaxios from "@/config/myaxios";
import Cookies from 'js-cookie';

export default {
  name: "LoginPage",
  data() {
    return {
      isPressed: false,
      username: "",
      password: "",
      userList: []
    }
  },
  mounted() {

  },
  beforeCreate() {

  },
  methods: {

    pressButton() {
      this.isPressed = true
    },

    // 按住登录按钮的手指松开
    releaseButton() {
      // 先还原按钮
      this.isPressed = false

      if (!this.username || !this.password) {
        Toast("请将信息填写完整！")
      } else {
        const info = {
          username: this.username,
          password: this.password
        }
        myaxios.post("/user/login",info).then(res => {
          if (res.data.code === 0) {
            const id = res.data.data.userInfo.user_id
            localStorage.setItem('user_id', id)

            const token = res.data.data.token
            Cookies.set('token', token, { expires: 365 });

            Toast("登录成功！");
            // 跳转到首页
            this.$router.replace({ name: 'index' });
          }
        }).catch(res => {
          console.error(res)
          Toast.fail("登录失败")
        })
      }

    },

    // 前往注册页
    goRegister() {
      this.$router.replace({name: 'register'})
    }
  }
}
</script>

<style scoped>
.All {
  width: 100%;
  height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  overflow: hidden;
}
.bgiBox {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center; /* 水平方向居中 */
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -999;
}
.bgiBox img {
  width: 100%;
  height: 100%;
}
.inputBox {
  width: 80%;
  /*height: 400px;*/
  background-color: rgba(255,255,255, .7);
  margin: 0 auto;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  padding-top: 50px;
  padding-bottom: 40px;
  box-sizing: border-box;
}
.input_ItemBox {
  width: 70%;
  margin: 0 auto;
}
.input_ItemBox_text {
  font-size: 18px;
}
.input_ItemBox input{
  width: 100%;
  height: 37px;
  font-size: 16px;
  border: 0;
  padding: 0 0 0 10px;
  margin-top: 10px;
  margin-bottom: 20px;
  box-sizing: border-box;
  background-color: #E4E4E4;
}
.LoginBtn {
  width: 80px;
  height: 40px;
  border-radius: 13px;
  text-align: center;
  line-height: 40px;
  font-weight: 700;
  color: #455A37;
  background-color: #B2C498;
  margin: 10px auto 0;
  box-shadow: 0 0 10px 3px rgba(0,0,0, .1);
  transition: transform 0.2s ease-out;
}
.registerBox {
  display: flex;
  width: 100%;
  margin-top: 30px;
}
.registerBox div {
  flex: 1;
  text-align: center;
  color: #7E987E;
}
.small {
  transform: scale(0.9) !important;
}
</style>