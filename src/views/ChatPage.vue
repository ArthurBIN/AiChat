<template>
  <div class="All">

    <div class="topIconChat">
      <van-icon name="ellipsis" @click="showPopup" />
    </div>

    <!--      弹出层-->
    <van-popup v-model="show"
               round
               position="bottom"
               closeable
               :style="{ height: '60%' }"
               class="popupBox">
      <div class="popupBox_Title">聊天记录</div>
      <div class="popupBox_InfoBox">
        <div class="popupBox_InfoItem" v-for="(item, index) in infoLists" :key="index" @click="GoDataPage(item._id)">
          <div class="popupBox_InfoItem_FirstLine">
            <div class="popupBox_InfoItem_Title">童年印象</div>
            <div class="popupBox_InfoItem_Time">{{truncatedTime(item.time,0,11)}}</div>
          </div>
          <div class="popupBox_InfoItem_Text popupBox_InfoItem_inText">{{item.infoListItem[0].data}}</div>
          <div class="popupBox_InfoItem_Text">{{item.infoListItem[1].data}}</div>
        </div>
      </div>
    </van-popup>

    <!--    背景图片-->
    <div class="bgiBox">
      <img src="../images/bgc1.png" alt="">
    </div>

    <!--    所有信息栏-->
    <div class="MiddleBox" ref="scrollArea" v-if="isPull">

        <div class="DataBox"
             v-for="(item, index) in infoList"
             :key="index"
             style="overflow-y: scroll;">

          <div class="DataItemBox" :class="{ 'align-right': item.id === 1, 'align-left': item.id === 2 }">
            <div :class="{ 'DataItem1': item.id === 1, 'DataItem2': item.id === 2 }">
              {{ item.data }}
            </div>
          </div>
        </div>

    </div>

    <!--    下拉查看历史记录栏-->
    <van-divider
        v-if="!isPull"
        :style="{ color: '#8A9189', borderColor: '#8A9189', padding: '0 16px' }">
      下拉查看历史记录</van-divider>

    <van-pull-refresh v-if="!isPull" v-model="isLoading" @refresh="onRefresh" class="NewContentBox" ref="scrollArea">
      <div class="NewContentBox_Text">
        {{newText}}
      </div>
    </van-pull-refresh>

    <!--    按住说话按钮-->
    <div class="speakBigBox" v-if="!isPull">

      <!--      文本框-->
      <textarea class="speakText"
                v-if="istext"
                v-model="text">

      </textarea>

      <div class="speakBox_Two">
        <div class="jianPan"
             :style="istext ? { backgroundColor: '#4fabe5' } : { backgroundColor: 'gray' }"
             @touchstart.stop="pressJpButton"
             @touchend.stop="releaseJpButton"
             :class="{ 'small': isJpPressed }"
             ontouchstart="return false;"
             onselectstart="return false;">
          <i class="iconfont icon-jianpan1"></i>
        </div>
        <div class="SpeakBox"
             @touchstart.stop="pressButton"
             @touchend.stop="releaseButton"
             :class="{ 'small': isPressed }"
             ontouchstart="return false;"
             onselectstart="return false;"
        >
          <i class="ht iconfont icon-huatong"></i>
          按住说话
        </div>
        <div class="faSong"
             :style="text ? { backgroundColor: '#4fabe5' } : { backgroundColor: 'gray' }"
             @touchstart.stop="pressFsButton"
             @touchend.stop="releaseFsButton"
             :class="{ 'small': isFsPressed }"
             ontouchstart="return false;"
             onselectstart="return false;">
          <i class="iconfont icon-fasong1"></i>
        </div>
      </div>
    </div>
    
<!--    返回当前聊天-->
    <div class="BackToChatBox" v-if="isPull" @click="BackToChat()">
      <van-icon name="replay" />
      返回聊天
    </div>
    
  </div>
</template>

<script>
// import axios from "axios";
import Vue from "vue";
import {Toast} from "vant";

export default {
  name: 'ChatPage',
  data() {
    return {
      isPressed: false, //语音键的状态
      isJpPressed: false,  //键盘按钮的状态
      isFsPressed: false,  //发送按钮的状态
      istext: false,   //输入框的状态
      text: "",  //输入框中的数据
      recognition: null,  //处理语音识别
      infoList: [],  //但钱页面聊天内容
      infoLists: [],  //缓存中的所有聊天内容
      id: 0,  //编辑部传来参数的id
      infoNum: 0,  //编辑部传来数据聊天内容的初始数量
      isLoading: false,
      newText: "",  //机器返回的语言
      isPull: false,  //检测是否下拉刷新
      show: false,
    }
  },

  mounted() {
    // localStorage.removeItem('infoLists');
    this.getCachedData();
    console.log(this.infoLists)

    // 滑倒页面最底端
    this.scrollToBottom();

    this.id = this.$route.query.id

    // 如果是编辑部传来的，有id，则获取该id对应的信息放到infoList中
    if (this.id) {
      this.getIdInfo();
    }
  },

  methods: {
    GoDataPage(id) {
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
    showPopup() {
      this.show = true;
    },
    onRefresh() {
      setTimeout(() => {
        Toast('刷新成功');
        this.isLoading = false;
        if (this.infoList.length !== 0) {
          this.isPull = true
          this.scrollToBottom();
        } else {
          Toast.fail("暂无聊天记录！")
        }
      }, 1000);
    },
    BackToChat() {
      this.isPull = false
    },
    getIdInfo() {
      const parsedId = parseInt(this.id);
      this.infoList = this.infoLists.find(item => item._id === parsedId).infoListItem;
      this.infoNum = this.infoList.length
    },

    // 获取当前日期
    getCurrentDateTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${year}年${month}月${day}日 ${hours}:${minutes}`;
    },

    // 返回当前时间
    generateUniqueId() {
      return Date.now() + Math.floor(Math.random() * 1000);
    },

    // 如果infoList中有数据执行将infoList中的数据添加到infoLists中并将infoLists存入缓存
    saveInfoToCache() {
      if (this.infoList.length !== 0) {
        const dateTime = this.getCurrentDateTime();
        const uniqueId = this.generateUniqueId();
        const info = {
          time: dateTime,
          _id: uniqueId,
          infoListItem: [...this.infoList]
        };
        this.infoLists.push(info);
        localStorage.setItem('infoLists', JSON.stringify(this.infoLists));
      }
    },

    // 将页面下拉至最底端
    scrollToBottom() {
      Vue.nextTick(() => {
        this.$refs.scrollArea.scrollTop = this.$refs.scrollArea.scrollHeight;
      });
    },

    // 获取缓存中的infoLists
    getCachedData() {
      // this.$localStorage.clear();

      // 从 localStorage 获取数据
      const cachedInfoList = localStorage.getItem('infoLists');

      // 检查是否存在缓存数据
      if (cachedInfoList) {
        this.infoLists = JSON.parse(cachedInfoList);
      } else {
        console.log('没有找到缓存数据');
      }
    },

    // 按下语音按钮
    pressButton() {
      if (!this.istext) {
        this.istext = true
      }
      this.isPressed = true;
      // this.istext = true;
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        this.recognition.lang = 'zh-CN'; // 设置语言为汉语
        this.recognition.interimResults = true; // 启用中间结果
        this.recognition.continuous = true; // 持续识别

        this.recognition.onresult = (event) => {
          this.$data.text = event.results[event.results.length - 1][0].transcript;
          for (let i = 0; i < event.results.length; i++) {
            console.log(event.results[i][0].transcript);
          }
        };

        this.recognition.onend = () => {
          console.log("结束");
        };
      } else {
        console.error('SpeechRecognition is not supported in this browser.');
      }

      this.recognition.start();
    },

    // 松开语音按钮
    releaseButton() {
      if (this.recognition) {
        this.recognition.stop();
        this.recognition = null;
      }
      // if (this.text === "") {
      //   this.istext = false;
      // }
      this.isPressed = false;
    },

    // 按下键盘按钮
    pressJpButton() {
      this.isJpPressed = true;
    },

    // 松开键盘按钮
    releaseJpButton() {
      // this.istext = true;
      this.isJpPressed = false;
      this.istext = !this.istext;
    },

    // 按下发送按钮
    pressFsButton() {
      if (this.text) {
        this.isFsPressed = true;
      }
    },

    // 松开发送按钮
    releaseFsButton() {
      if (this.text) {
        this.isFsPressed = false;
        this.handleTranslate();

        // 如果是编辑部继续聊过来的，点击发送后就把之前的该条数据删除
        const id = parseInt(this.id)
        const index = this.infoLists.findIndex(item => item._id === id);
        if (index !== -1) {
          this.infoLists.splice(index, 1);
        }

      }
    },

    // 处理翻译功能的逻辑
    handleTranslate() {
      const dataitem = this.$data.text;
      const newItem = {
        id: 1,
        data: dataitem
      };
      this.newText = ""  //在生成新的前，先清空之前的对话
      this.$data.text = "";
      this.istext = false;
      this.scrollToBottom();
      this.infoList.push(newItem);

      fetch('http://39.107.54.246/v1/chat-messages', {
        method: 'POST',
        headers: {
          "Authorization": "Bearer app-g5IfxXzOvdq0IqLHptr8CroV",
          "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify({
          inputs: {},
          query: dataitem,
          response_mode: "streaming",
          conversation_id: "",
          user: "abc-123"
        })
      })
          .then(response => {
            Toast.loading({
              message: '正在生成',
              duration: 0,
              forbidClick: true
            })
            const newItem = {
              id: 2,
              data: ""
            };
            this.infoList.push(newItem);

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            reader.read().then(function processText({ done, value }) {
              if (done) {
                Toast.clear();
                return;
              }
              let decodedValue = decoder.decode(value, { stream: true });
              const jsonString = decodedValue.replace(/data: \s*/g, '');
              let responseArray = jsonString.split('\n');
              responseArray.forEach(item => {
                if (item.trim() !== "" && item.trim() !== "null") {
                  try {
                    const parsedItem = JSON.parse(item.trim());
                    if (parsedItem.answer) {
                      this.infoList[this.infoList.length - 1].data += parsedItem.answer;
                      this.newText += parsedItem.answer;
                    }
                  } catch (error) {
                    console.error("Failed to parse item:", item.trim(), error);
                    // 处理不能被解析为 JSON 格式的 item
                  }
                }
              });
              this.scrollToBottom();

              // 继续读取
              return reader.read().then(processText.bind(this));
            }.bind(this));
          })
          .catch(error => {
            console.error(error);
          });
    }

  },

  beforeDestroy() {

    // 如果当前的infoList长度和刚进入页面时的长度不一致则执行

    if (this.infoList.length !== this.infoNum) {
      this.saveInfoToCache();
    }

  }
}
</script>

<style scoped>

.All {
  box-sizing: border-box;
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
.popupBox {

}
.popupBox_Title {
  width: 100%;
  height: 60px;
  text-align: center;
  line-height: 60px;
  font-size: 25px;
  font-weight: 700;
}
.popupBox_InfoBox {
  width: 100%;
  height: calc(100% - 60px);
  overflow-y: scroll;
  padding-bottom: 20px;
  box-sizing: border-box;
}
.popupBox_InfoItem {
  width: 93%;
  border-radius: 15px;
  background-color: #f8f8f8;
  padding: 5px 0 15px 0;
  margin: 10px auto 0;
}
.popupBox_InfoItem_Title {
  width: 55%;
  color: #80A281;
  font-weight: 700;
}
.popupBox_InfoItem_Text {
  width: 95%;
  font-size: 18px;
  box-sizing: border-box;
  margin: 10px auto 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #737373;
}
.popupBox_InfoItem_FirstLine {
  width: 95%;
  font-size: 20px;
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
  display: flex;
  margin: 10px auto 0;
}
.popupBox_InfoItem_inText {
  font-weight: 700;
  color: #000;
}
.popupBox_InfoItem_Time {
  text-align: right;
  width: 40%;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  box-sizing: border-box;
  color: #b2b2b2;
  margin-left: 3%;
  margin-right: 2%;
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

.speakBigBox {
  width: 90%;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 30px;
}
.speakText {
  width: 100%;
  height: 200px;
  position: absolute;
  left: 0;
  bottom: 70px;
  border-radius: 20px;
  box-sizing: border-box;
  padding: 15px;
  font-size: 20px;
  border: 2px solid #CDD3AE;
}
.speakBox_Two {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  display: flex;
}
.jianPan {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  color: #ffffff;
  font-size: 25px;
  text-align: center;
  line-height: 60px;
  transition: transform 0.2s;
}
.faSong {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  color: #ffffff;
  font-size: 25px;
  text-align: center;
  line-height: 60px;
  transition: transform 0.2s;
}
.SpeakBox {
  margin-left: 2.5%;
  margin-right: 2.5%;
  width: calc(95% - 120px);
  text-align: center;
  height: 60px;
  line-height: 60px;
  border-radius: 30px;
  color: #807F7A;
  font-size: 20px;
  font-weight: 700;
  background-color: #CDD3AE;
  -webkit-user-select: none; /* Safari 3.1+ */
  -moz-user-select: none; /* Firefox 2+ */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Standard syntax */
  transition: transform 0.2s;
}
.ht {
  margin-right: 5px;
}
.small {
  transform: scale(0.9) !important;
}

/*中间部分*/
.MiddleBox {
  width: 100%;
  height: calc(100vh - 60px);
  overflow: auto;
  margin: 0 auto;
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

.NewContentBox {
  width: 100%;
  height: calc(100vh - 216px);
  overflow: auto;
  margin: 0 auto;
  box-sizing: border-box;
  z-index: 999;
}
.NewContentBox_Text {
  width: 95%;
  margin: 0 auto;
  font-size: 6vw;
}
.BackToChatBox {
  position: fixed;
  width: 50%;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  height: 60px;
  font-size: 20px;
  line-height: 60px;
  text-align: center;
  border-radius: 30px;
  background-color: #80A281;
}
</style>
