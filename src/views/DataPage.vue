<template>

  <div class="All">


<!--    时间栏-->
    <div class="TimeBox">
      <div class="Time">
        <div>{{truncatedTime(dataList.time,0,11)}}</div>
        <div>{{truncatedTime(dataList.time,12,17)}}</div>
      </div>
      <div class="Title">童年印象</div>
    </div>

<!--    内容栏-->
    <div class="MiddleBox" ref="scrollArea">
      <div class="DataBox"
           v-for="(item, index) in dataList.infoListItem"
           :key="index"
           style="overflow-y: scroll;">

        <div class="DataItemBox"
             :class="{ 'align-right': item.role === 'user', 'align-left': item.role === 'assistant' }"
        >
          <div :class="{ 'DataItem1': item.role === 'user', 'DataItem2': item.role === 'assistant' }"
          >{{item.content}}</div>
        </div>

      </div>
    </div>

<!--    操作栏-->
    <div class="bottomBox">

      <div class="bottomBox_Item continuouTalk"
           @touchstart.stop="pressButton"
           @touchend.stop="releaseButton"
           ontouchstart="return false;"
           onselectstart="return false;"
           :class="{ 'small': isPressed }">
        接着聊
        <i class="iconfont icon-chat" style="color: #7B8F43"></i>
      </div>

      <div class="bottomBox_Item continuouStory"
           @touchstart.stop="pressStoryButton"
           @touchend.stop="releaseStoryButton"
           ontouchstart="return false;"
           onselectstart="return false;"
           :class="{ 'small': isStoryPressed }">
        生成故事
        <i class="iconfont icon-jiantou" style="color:#1C4511;"></i>
      </div>

      <!--    删除按钮-->
      <div class="delIcon"
           @touchstart.stop="pressDelButton"
           @touchend.stop="releaseDelButton"
           ontouchstart="return false;"
           onselectstart="return false;"
           :class="{ 'small': isDelPressed }">
        <van-icon name="delete-o" />
      </div>

    </div>



  </div>

</template>

<script>
import {Dialog} from "vant";

export default {
  name: "DataPage",
  data() {
    return {
      isPressed: false,
      isStoryPressed: false,
      isDelPressed: false,
      dataList: {},
      infoLists: [],
      timeData: ""
    }
  },
  mounted() {
    this.getCachedData();
    const id = parseInt(this.$route.query.id)
    if (id) {
      this.dataList = this.infoLists.find(item => item._id === id);
    }
    // this.$data.timeData = this.$route.query.data.time
  },
  methods: {
    getCachedData() {
      // localStorage.removeItem('infoLists');

      // 从 localStorage 获取数据
      const cachedInfoList = localStorage.getItem('infoLists');

      // 检查是否存在缓存数据
      if (cachedInfoList) {
        this.infoLists = JSON.parse(cachedInfoList);
      } else {
        console.log('没有找到缓存数据');
      }
    },
    saveInfoToCache() {
        localStorage.setItem('infoLists', JSON.stringify(this.infoLists));
    },
    // 删除该内容
    DelInfo() {
      Dialog.confirm({
        message: '确认删除该条记录吗？',
      })
          .then(() => {
            const id = parseInt(this.dataList._id)
            console.log(this.infoLists)
            const index = this.infoLists.findIndex(item => item._id === id);
            if (index !== -1) {
              this.infoLists.splice(index, 1);
            }
            console.log(this.infoLists)
            this.saveInfoToCache(); //更新缓存
            console.log(this.infoLists)
            this.$router.push("/")
          })
          .catch(() => {
            // on cancel
          });
    },

    pressButton() {
      this.isPressed = true;
    },
// 松开键盘按钮
    releaseButton() {
      this.isPressed = false;
      this.$router.replace({
        path: "/chat",
        query: {
          id: this.dataList._id
        }
      })
    },

    // 松开故事按钮
    releaseStoryButton() {
      this.isStoryPressed = false;
      this.$router.replace({
        path: "/edit",
        query: {
          data: this.dataList
        }
      })
    },

    pressStoryButton() {
        this.isStoryPressed = true;
    },

    pressDelButton() {
      this.isDelPressed = true
    },

    // 松开删除按钮
    releaseDelButton() {
      this.isDelPressed = false
      this.DelInfo();
    },

    truncatedTime(time,n,x) {
      return time.substring(n, x);
    },
  }
}
</script>

<style scoped>
.MiddleBox {
  width: 100%;
  overflow: auto;
  margin: 0 auto;
  padding-top: 60px;
  box-sizing: border-box;
  padding-bottom: 100px;
}
.DataBox {
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}
.DataItemBox {
  width: 100%;
  font-size: 4.5vw;
}
.DataItem1 {
  max-width: 70%;
  padding: 2vw 3vw;
  border-radius: 25px;
  margin: 10px 0;
  background-color: #CAD5AC;
  word-wrap: break-word;
  display: inline-block;
  text-align: left;
}
.DataItem2 {
  max-width: 70%;
  padding: 2vw 3vw;
  border-radius: 25px;
  margin: 10px 0;
  word-wrap: break-word;
  display: inline-block;
  background-color: #E1E5DF;
  text-align: left;
}

.align-right {
  text-align: right;
}

.align-left {
  text-align: left;
}

/*顶部时间栏*/
.TimeBox {
  position: fixed;
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  padding: 10px;
  z-index: 999;
  background-color: rgba(252,254,228, .3);
  backdrop-filter: blur(10px);
}
.Time {
  box-sizing: border-box;
  color: #a2a2a2;
  font-size: 17px;
}
.Title {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 19px;
  color: #839B84;
}

/*底部栏*/
.bottomBox {
  position: fixed;
  width: 90%;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  height: 55px;
  display: flex;
}
.bottomBox_Item {
  width: 35%;
  height: 100%;
  background-color: #fff;
  border-radius: 20px;
  text-align: center;
  font-weight: 700;
  line-height: 55px;
  font-size: 18px;
  margin-left: 3.75%;
  -webkit-user-select: none; /* Safari 3.1+ */
  -moz-user-select: none; /* Firefox 2+ */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Standard syntax */
  box-shadow: 0 0 10px 2px rgba(0,0,0, .2);
  transition: transform 0.2s;
}

/*删除按钮样式*/
.delIcon {
  width: 15%;
  line-height: 55px;
  text-align: center;
  border-radius: 20px;
  background-color: #ff2525;
  font-size: 20px;
  margin-left: 3.75%;
  color: #ffffff;
  box-shadow: 0 0 10px 2px rgba(0,0,0, .2);
  transition: transform 0.2s;
}

.continuouTalk {
  background-color: #BDCC98;
}
.continuouStory {
  background-color: #80A281;
}
.small {
  transform: scale(0.9) !important;
}


</style>