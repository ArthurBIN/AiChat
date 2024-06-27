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

<!--      返回前一页 （故事编辑页）-->
      <div v-if="$route.path === '/editstory' || $route.path === '/login'"
           class="topIcon iconfont icon-fanhui"
           @click="goBack()"></div>



<!--      中心标题-->
      <div class="TitleBox">{{$route.meta.title}}</div>

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

    }
  },
  mounted() {
    const id = localStorage.getItem('user_id');
    if (id) {
      Toast("用户已登录")
    } else {
      Toast("用户未登录")
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
  z-index: 99;
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
