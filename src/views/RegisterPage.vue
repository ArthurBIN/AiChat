<template>
<!--  已连接后端api-->

  <!--  登录界面-->
  <div class="All">

    <!--    背景图片-->
    <div class="bgiBox">
      <img src="../images/bgc1.png" alt="">
    </div>

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


      <!--      手机号框-->
      <div class="pW_Box input_ItemBox">
        <div class="input_ItemBox_text">*手机号</div>
        <input type="text" v-model="mobile"/>
      </div>

      <!--      登录按钮-->
      <div class="LoginBtn"
           @touchstart.stop="pressButton"
           @touchend.stop="releaseButton"
           ontouchstart="return false;"
           onselectstart="return false;"
           :class="{ 'small': isPressed }"
      >
        注册
      </div>

    </div>

  </div>

</template>

<script>
import {Toast} from "vant";
import myaxios from "@/config/myaxios";

export default {
  name: "RegisterPage",
  data() {
    return {
      isPressed: false,
      username: "",
      password: "",
      mobile: "",
    }
  },
  mounted() {

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
      if (!this.username || !this.password || !this.mobile) {
        Toast("信息未填写完整")
      } else {

        const info = {
          username: this.username,
          password: this.password,
          mobile: this.mobile
        }

        myaxios.post("/user/register", info, {
          withCredentials: true
        }).then(res => {
          if (res.data.code === 0) {
            const id = res.data.data.user_id
            localStorage.setItem('user_id', id)

            // 显示注册成功提示
            Toast("注册成功！");

            // console.log(res.headers)
            // // 获取Set-Cookie值
            // const cookieValue = res.headers['set-cookie'];
            // console.log(cookieValue);

            // 跳转到首页
            this.$router.replace({ name: 'index' });
          }
        }).catch( err => {
          console.log(err)
          Toast.fail("该用户已存在！")
        })
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

.small {
  transform: scale(0.9) !important;
}
</style>