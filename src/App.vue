<template>
  <div id="app">
    <!--    顶部栏-->
    <div class="TopBox" v-if="$route.path !== '/active'">

<!--      返回首页-->
      <div v-if="$route.path !== '/login'
              && $route.path !== '/register' 
              && $route.path !== '/'
              && $route.path !== '/editstory' "
          class="topIcon iconfont icon-a-037_zhuye32"
          @click="goIndex()"></div>

<!--      注册页返回登录页-->
      <div v-if="$route.path === '/register'"
           class="topIcon iconfont icon-fanhui"
           @click="goRegister()"></div>

      <div v-if="$route.path === '/editstory'"
           class="topIcon iconfont icon-fanhui"
           @click="goBack()"></div>

<!--      中心标题-->
      <div class="TitleBox">{{$route.meta.title}}</div>

<!--      最右侧个人头像-->
      <van-popover
          v-model="showPopover"
          trigger="click"
          :actions="actions"
          @select="onSelect"
          placement="bottom-end"
          class="topIcon_right"
          v-if="$route.path !== '/login' && $route.path !== '/register' "
      >
        <template #reference>
          <div class="iconfont icon-geren"></div>
        </template>
      </van-popover>


    </div>

    <div :style="$route.path !== '/active'? 'padding-top: 60px' : ''">
      <router-view/>
    </div>
  </div>
</template>

<script>
import {Toast} from "vant";

export default {
  name: "app",
  data() {
    return {
      showPopover: false,
      // 通过 actions 属性来定义菜单选项
      actions: [{ text: '个人信息' },{ text: '退出登录' }],
    }
  },
  mounted() {
    const islogin = localStorage.getItem('isLogin');
    Toast("当前登录状态：" + islogin)
    if (!islogin) {
      this.$router.replace({name: 'login'})
    }
  },
  components: {

  },
  methods: {
    goIndex() {
      this.$router.push("/")
    },
    goBack() {
      this.$router.back();
    },
    goRegister() {
      this.$router.replace({name: 'login'});
    },
    onSelect(action) {
      if (action.text === '退出登录') {
        localStorage.removeItem('isLogin');
        Toast("退出登录成功！")
        this.$router.replace({name: 'login'});
      }
    },
  }
};

</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  box-sizing: border-box;
}
body {
  background-color: #FCFEE2;
}
.TopBox {
  width: 100%;
  height: 60px;
  text-align: center;
  line-height: 60px;
  position: fixed;
  background-color: #80A281;
  z-index: 999;
}
.TitleBox {
  font-size: 24px;
  font-weight: 600;
  color: white;
  user-select: none;
}

*{
  margin: 0;
  padding: 0;
}
.topIcon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 30px;
  font-size: 28px;
  color: white;
}

.topIcon_right {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 30px;
  font-size: 28px;
  color: white;
}

@font-face {
  font-family: "iconfont"; /* Project id 4579859 */
  src: url('//at.alicdn.com/t/c/font_4579859_295zfny8u5m.woff2?t=1719298438984') format('woff2'),
  url('//at.alicdn.com/t/c/font_4579859_295zfny8u5m.woff?t=1719298438984') format('woff'),
  url('//at.alicdn.com/t/c/font_4579859_295zfny8u5m.ttf?t=1719298438984') format('truetype');
}

.iconfont {
  font-family: "iconfont" !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-baocun:before {
  content: "\e63b";
}

.icon-quxiaobaocun:before {
  content: "\e739";
}

.icon-xiala:before {
  content: "\e634";
}

.icon-ellipsis:before {
  content: "\e608";
}

.icon-geren:before {
  content: "\e657";
}

.icon-fanhui:before {
  content: "\e61e";
}

.icon-guangchang1:before {
  content: "\e600";
}

.icon-jiantou:before {
  content: "\e615";
}

.icon-chat:before {
  content: "\e66d";
}

.icon-tiaozhuan:before {
  content: "\e603";
}

.icon-a-037_zhuye32:before {
  content: "\e6c3";
}

.icon-tianjia:before {
  content: "\e68f";
}

.icon-fasong1:before {
  content: "\e670";
}

.icon-fasong:before {
  content: "\e60d";
}

.icon-jianpan1:before {
  content: "\e618";
}

.icon-jianpan:before {
  content: "\e6d8";
}

.icon-huatong:before {
  content: "\e67e";
}


</style>
