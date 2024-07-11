<template>
<!--测试-->
  <div class="All">

    <!--      最右侧个人头像-->
    <van-popover
        v-model="showPopover"
        trigger="click"
        :actions="actions"
        @select="onSelect"
        placement="bottom-end"
        class="topIconChat"
        v-if="user_id"
    >
      <template #reference>
        <div class="iconfont icon-geren"></div>
      </template>
    </van-popover>

<!--    问候语-->
    <div class="greetings">
      {{greeting}}
      <router-link to="/voice">
        <van-button type="primary">主要按钮</van-button>
      </router-link>
    </div>
<!--    标签转化页-->
    <div class="ContentBox">

<!--      顶部标签-->
      <div class="tabs">
        <div @click="slideTo(1)" :class="{ active: currentSlide === 1 }">访谈室</div>
        <div @click="slideTo(2)" :class="{ active: currentSlide === 2 }">编辑部</div>
        <div @click="slideTo(3)" :class="{ active: currentSlide === 3 }">藏卷馆</div>
      </div>

      <div class="swiper-container" ref="swiperContainer">

        <div class="swiper-wrapper">

<!--          访谈室-->
          <div class="swiper-slide">

            <div v-for="(item, index) in TalkBoxBgi"
                 :key="index"
                 :style="{
                   backgroundImage: `url(${item.bgi})`,
                   margin: index > 2 ? '3vw 0 0 3.33%' : '0 0 0 3.33%'}"
                 class="talkBoxItem"
                 @touchmove="handleMove"
                 @touchstart="pressButton(index)"
                 @touchend="releaseButton(item.text)"
                 onselectstart="return false;"
                 :class="[
                    ((index + 1) % 4 === 1 || (index + 1) % 4 === 0) ? 'talkBoxItemLeft' : 'talkBoxItemRight',
                    index === activeIndex && isPressed ? 'small' : ''
                 ]" >
              <div class="talkBoxItem_Text">{{item.num}}</div>
              <div class="talkBoxItem_Text">{{item.text}}</div>
            </div>

          </div>

<!--          编辑部-->
          <div class="swiper-slide">
<!--            <van-pull-refresh class="pullRefresh" v-model="isLoading" @refresh="onRefresh">-->

            <div class="infoItemBox"
                   v-for="(item, index) in infoLists"
                   :key="index"
                   @click="goInfoPage(item._id)">
                <div class="infoItemBox_Title">童年印象</div>
                <div class="infoItemBox_TimeBox">
                  <div>{{truncatedTime(item.time,0,11)}}</div>
                  <div>{{truncatedTime(item.time,12,17)}}</div>
                </div>
                <div class="infoItemBox_Data">{{item.infoListItem[0].content}}</div>
                <div class="iconfont icon-tiaozhuan infoItemBox_Icon"></div>
              </div>
              <van-empty description="您还没有记录哦~" v-if="infoLists.length === 0"/>
<!--            </van-pull-refresh>-->

          </div>

<!--          藏卷馆-->
          <div class="swiper-slide">

            <div class="infoItemBox draftItemBox"
                 v-for="(item, index) in draftLists"
                 :key="index">
              <div class="infoItemBox_Title" v-if="!item.title">{{item.style}}</div>
              <div class="infoItemBox_Title">{{item.title}}</div>
              <div class="infoItemBox_TimeBox">
                <div>{{item.time}}</div>
              </div>
              <div class="infoItemBox_Data draftItemBox_Data">{{item.text}}</div>

<!--              藏卷馆草稿按钮-->
              <div class="draftItemBtnBox">
                <div class="draftItemBtnBox_Check" @click="ToEditStoryPage(item.chat_id)">查看</div>
                <div class="draftItemBtnBox_Go">
                  <i class="iconfont icon-fasong1"></i>
                </div>
              </div>

            </div>
            <van-empty description="您还没有生成故事哦~" v-if="draftLists.length === 0"/>

          </div>

        </div>
      </div>


    </div>

<!--    添加功能按钮-->
<!--    <div class="AddBox" v-if="currentSlide === 1" @click="addDiv">-->
<!--      <i class="iconfont icon-tianjia"></i>-->
<!--    </div>-->

<!--    编辑部清空-->
    <div class="DelBox" v-if="currentSlide === 2" @click="DelAll">
      <van-icon name="delete-o" />
    </div>

<!--    藏卷馆底部按钮-->
<!--    <div class="AddBox" v-if="currentSlide === 3" @click="ToActivity">-->
<!--      <i class="iconfont icon-guangchang1"></i>-->
<!--    </div>-->

  </div>

</template>

<script>
import Swiper from 'swiper';
import {Dialog, Toast} from "vant";
import Cookies from 'js-cookie';

export default {
  name: "IndexPage",
  data() {
    return {
      user_id: "",
      showPopover: false,
      // 通过 actions 属性来定义菜单选项
      // actions: [{ text: '个人信息' },{ text: '退出登录' }],
      actions: [{ text: '退出登录' }],
      greeting: "刘奶奶,早上好!",
      mySwiper: null,
      currentSlide: 1, //当前轮播图页数
      activeIndex: null,
      isPressed: false,
      isMove: true,
      infoLists: [],
      draftLists: [],
      isLoading: false,
      TalkBoxBgi: [
        {
          num: "第一篇",
          text: "童年印象",
          bgi: "https://s21.ax1x.com/2024/06/29/pkcEOsg.png"
        },
        {
          num: "第二篇",
          text: "童年玩伴",
          bgi: "https://s21.ax1x.com/2024/06/29/pkcV3Oe.png"
        },{
          num: "第三篇",
          text: "家庭记忆",
          bgi: "https://s21.ax1x.com/2024/06/29/pkcVGeH.png"
        },{
          num: "第四篇",
          text: "教育启蒙",
          bgi: "https://s21.ax1x.com/2024/06/30/pkcKLhd.png"
        },{
          num: "第五篇",
          text: "邻里乡情",
          bgi: "https://img.picui.cn/free/2024/06/29/66801d06f4086.png"
        },{
          num: "第六篇",
          text: "青春友谊",
          bgi: "https://img.picui.cn/free/2024/06/29/66801d3c93c78.png"
        },{
          num: "第七篇",
          text: "学生时代",
          bgi: "https://img.picui.cn/free/2024/06/29/66801e1232d09.png"
        },{
          num: "第八篇",
          text: "职场启程",
          bgi: "https://img.picui.cn/free/2024/06/29/66801e3b18825.png"
        },{
          num: "第九篇",
          text: "结婚成家",
          bgi: "https://img.picui.cn/free/2024/06/29/66801ed8ab3ed.png"
        },{
          num: "第十篇",
          text: "养育儿女",
          bgi: "https://img.picui.cn/free/2024/06/29/66801f0bbfa45.png"
        },{
          num: "第十一篇",
          text: "人生转折",
          bgi: "https://img.picui.cn/free/2024/06/29/66801f1b9d945.png"
        },{
          num: "第十二篇",
          text: "事业成就",
          bgi: "https://img.picui.cn/free/2024/06/29/66801f2b3fd95.png"
        }
      ]
    }
  },
  watch: {
    currentSlide() {
      localStorage.setItem('currentPage', this.$data.currentSlide);
    },
  },
  mounted() {

    // 获取用户id
    const id = localStorage.getItem('user_id');
    if (id) {
      this.user_id = id
      // 获取缓存中的编辑部信息
      this.getCachedData();
    } else {
      this.user_id = ""
    }
    console.log(this.user_id)

    var that = this;
    this.mySwiper = new Swiper(this.$refs.swiperContainer, {
      loop: false, // 循环模式选项
      on:{
        slideChange: function () {
          that.$data.currentSlide = this.realIndex+1  //真实的幻灯片索引
        },
      },
    });

    // 获取缓存中存储的轮播图页数
    const currentPage = localStorage.getItem('currentPage');

    if (currentPage) {
      this.$data.currentSlide = parseInt(currentPage)
      this.mySwiper.slideToLoop(currentPage - 1);
    }
  },
  methods: {

    // 点击右上角的个人头像
    onSelect(action) {
      if (action.text === '退出登录') {
        localStorage.removeItem('user_id');
        Cookies.remove('token')
        Toast("退出登录成功！")
        this.$router.push("/login");
      }
    },
    // 前往编辑故事页
    ToEditStoryPage(id) {
      this.$router.push({
        path: 'editstory',
        query: {
          chat_id: id
        }
      })
    },
    // 删除所有编辑部的信息
    DelAll() {
      Dialog.confirm({
        message: '确认删除所有记录吗？',
      })
          .then(() => {
            localStorage.removeItem('infoLists');
            this.getCachedData()
            Toast.success("删除成功！")
          })
          .catch(() => {
            // on cancel
          });
    },
    // 跳转至活动广场
    ToActivity() {
      this.$router.push("/active")
    },

    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        Toast('刷新成功');
        this.isLoading = false;
        this.count++;
      }, 1000);
    },

    addDiv() {

    },
    // 前往缓冲页
    goInfoPage(id) {
      this.$router.push({
        path: "/datapage",
        query: {
          id: id
        }
      })
    },

    // 截取前n个字符（这里是截取日期）
    truncatedTime(time,n,x) {
      return time.substring(n, x);
    },

    // 获取缓存中的数据（获取缓存中的编辑部信息）
    getCachedData() {
      // localStorage.removeItem('infoLists');

      // 从 localStorage 获取编辑部的数据
      const cachedInfoList = localStorage.getItem('infoLists');

      // 检查是否存在缓存数据
      if (cachedInfoList) {
        this.infoLists = JSON.parse(cachedInfoList);
      } else {
        this.infoLists = [];
      }

      const cachedDraftList = localStorage.getItem('draftLists');
      if (cachedDraftList) {
        this.draftLists = JSON.parse(cachedDraftList)
      } else {
        this.draftLists = [];
      }

    },

    // 点击标签进行轮播图的切换
    slideTo(index) {
      if (index < 1) {
        index = 1;
      } else if (index > 3) {
        index = 3;
      }
      this.mySwiper.slideToLoop(index - 1);
      this.currentSlide = index;
    },


    pressButton(index) {
      this.isMove = true
      this.activeIndex = index;
      this.isPressed = true;
    },

    releaseButton(text) {
      this.isPressed = false;
      if (this.isMove) {

        // 松开后检测用户是否登录，若未登录先前往登录页，否则无法使用对话功能
        if (this.user_id) {
          this.$router.push("/chat?style=" + text)
        } else {
          Dialog.confirm({
            message: '您还未登录，是否先去登录？',
          })
              .then(() => {
                this.$router.push("/login")
              })
              .catch(() => {
                // on cancel
              });
        }
      }
    },
    handleMove() {
      this.isMove = false
    },
  },

}
</script>

<style scoped>
.All {
  width: 100%;
  overflow: hidden;
  position: relative;
}
.topIconChat {
  height: 60px;
  line-height: 60px;
  position: fixed;
  top: 0;
  right: 30px;
  z-index: 99;
  font-size: 28px;
  color: white;
}
.greetings {
  width: 100%;
  height: 23vw;
  line-height: 23vw;
  font-size: 6vw;
  text-align: center;
  color: #456c49;
}

/*轮播图*/
.ContentBox {
  margin: 0 auto;
}
.tabs {
  display: flex;
  width: 93%;
  margin: 0 auto;
}
.tabs div {
  width: 30%;
  margin-left: 2.5%;
  text-align: center;
  height: 12vw;
  line-height: 12vw;
  font-size: 5vw;
  transition: font-size 0.2s ease-out;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.tabs .active {
  /*border-bottom: 2px solid #000; !* 添加底部边线 *!*/
  box-sizing: border-box;
  border-bottom: 4px solid #80A281;
  font-size: 5.5vw; /* 增加字体大小 */
}
.swiper-container {
  width: 100%;
  margin-top: 20px;
}
.swiper-slide {
  position: relative;
  width: 100%;
  height: calc(100vh - 35vw - 80px);
  overflow-y: scroll;
  padding-bottom: 20px;
  box-sizing: border-box;
}
.pullRefresh {

}
.swiper-slide::-webkit-scrollbar {
  display: none;
}
.talkBoxItem {
  display: inline-block;
  height: 37vw;
  border-radius: 15px;
  background-position: center; /* 背景图片位置设置为中央 */
  background-repeat: no-repeat; /* 防止背景图片重复 */
  background-size: cover;
  position: relative;
  box-sizing: border-box;
  transition: transform 0.2s ease-out;
}
.talkBoxItemLeft {
  width: 50%;
  background-color: #5b5b5b;
}
.talkBoxItemRight {
  background-color: #212121;
  width: 40%;
}
.talkBoxItem_Text {
  position: absolute;
  color: white;
  font-size: 6vw;
  font-weight: 700;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.talkBoxItem_Text:nth-child(1) {
  top: 2vw;
  left: 2.5vw;
}
.talkBoxItem_Text:nth-child(2) {
  top: 9vw;
  left: 2.5vw;
}
/*添加按钮*/
.AddBox {
  position: fixed;
  right: 20px;
  bottom: 50px;
  z-index: 99;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  border-radius: 50%;
  overflow: hidden;
  font-size: 70px;
  color: #80A281;
  background-color: #4D7B50;
  box-shadow: 0 0 10px 3px rgba(0,0,0, .2);
}
.DelBox {
  position: fixed;
  right: 20px;
  bottom: 50px;
  z-index: 99;
  width: 70px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  border-radius: 50%;
  overflow: hidden;
  font-size: 30px;
  color: red;
  background-color: #fff;
  box-shadow: 0 0 10px 3px rgba(0,0,0, .2);
}
.small {
  transform: scale(0.9) !important;
}

/*编辑部样式*/
.infoItemBox {
  position: relative;
  width: 94%;
  margin: 10px auto;
  background-color: #EEEFE8;
  padding: 3vw;
  font-size: 4.5vw;
  box-sizing: border-box;
  border-radius: 3.5vw;
}
.infoItemBox:nth-child(1) {
  width: 94%;
  margin: 0 auto 10px;
}
.infoItemBox_TimeBox {

}
.infoItemBox_Data {
  margin-top: 3vw;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90%;
}
.infoItemBox_Title {
  position: absolute;
  top: 3vw;
  right: 4vw;
  color: #839B84;
  font-weight: 700;
}
.infoItemBox_Icon {
  position: absolute;
  bottom: 3vw;
  right: 4vw;
  color: #839B84;
  font-size: 7vw;
}

/*藏卷馆样式*/
.draftItemBox_Data {
  width: 100%;
  -webkit-line-clamp: 4;
}
.draftItemBtnBox {
  width: 70%;
  height: 11vw;
  line-height: 11vw;
  display: flex;
  margin: 2vw auto 0;
}
.draftItemBtnBox_Check {
  width: 72%;
  height: 100%;
  background-color: #BDCC98;
  border-radius: 10px;
  text-align: center;
  color: #1C4511;
  font-weight: 700;
}
.draftItemBtnBox_Go {
  width: 18%;
  height: 100%;
  margin-left: 10%;
  border-radius: 10px;
  background-color: #87A184;
  text-align: center;
}
</style>
