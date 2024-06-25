<template>
  <!--  登录界面-->
  <div class="All">

    <div class="inputBox">

      <!--      用户名框-->
      <div class="userName_Box input_ItemBox">
        <div class="input_ItemBox_text">*用户名</div>
        <input type="text" v-model="username"/>
      </div>

      <!--      密码框-->
      <div class="pW_Box input_ItemBox">
        <div class="input_ItemBox_text">*密码</div>
        <input type="password" v-model="password"/>
      </div>

      <!--      激活码框-->
      <div class="pW_Box input_ItemBox">
        <div class="input_ItemBox_text">激活码</div>
        <input type="text" v-model="activation"/>
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

    </div>

  </div>

</template>

<script>
import {Toast} from "vant";

export default {
  name: "RegisterPage",
  data() {
    return {
      isPressed: false,
      username: "",
      password: "",
      activation: "",
      userList: []
    }
  },
  beforeCreate() {
    const islogin = localStorage.getItem('isLogin');
    console.log( '当前登录状态：' + islogin)
    if (islogin === true) {
      this.$router.replace({name: 'index'})
    }
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    pressButton() {
      // 按钮缩小
      this.isPressed = true
    },

    releaseButton() {
      // 按钮还原
      this.isPressed = false

      // 判断输入框中是否有数据
      if (!this.username || !this.password) {
        Toast("信息未填写完整")
      } else {

        // 1.先获取所有用户信息
        this.getUserInfo();

        // 2.把新增的用户信息添加到该集合中
        const info = {
          username: this.username,
          password: this.password
        }
        this.userList.push(info);
        localStorage.setItem('userList', JSON.stringify(this.userList));

        // 3.显示登录成功
        Toast("登录成功！");

        // 把当前登录状态存储在缓存中
        localStorage.setItem('isLogin', true);

        // 跳转到首页
        this.$router.replace({ name: 'index' });
      }
    },

    // 获取缓存中所有用户的用户名和密码
    getUserInfo() {
      const userInfoList = localStorage.getItem('userList');
      if (userInfoList) {
        this.userList = JSON.parse(userInfoList);
      } else {
        console.log("没有找到缓存数据")
      }
    },
  }
}
</script>

<style scoped>
.All {
  width: 100%;
  height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  background-image: url('http://123.57.186.64:9000/img/5cba7dfa-e255-4cc5-9e40-9eac1e38afe8_bgc1.png');
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

.small {
  transform: scale(0.9) !important;
}
</style>