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
        <div v-for="(item, index) in infoLists" :key="index" @click="GoDataPage(item._id)">
          <div v-if="item.infoListItem && item.infoListItem.length > 0" class="popupBox_InfoItem_FirstLine">
            <div class="popupBox_InfoItem_Title">童年印象</div>
            <div class="popupBox_InfoItem_Time">{{truncatedTime(item.time, 0, 11)}}</div>
          </div>
          <div v-if="item.infoListItem && item.infoListItem[0]" class="popupBox_InfoItem_Text popupBox_InfoItem_inText">{{item.infoListItem[0].content}}</div>
          <div v-if="item.infoListItem && item.infoListItem[1]" class="popupBox_InfoItem_Text">{{item.infoListItem[1].content}}</div>
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

          <div class="DataItemBox" :class="{ 'align-right': item.role === 'user', 'align-left': item.role === 'assistant' }">
            <div :class="{ 'DataItem1': item.role === 'user', 'DataItem2': item.role === 'assistant' }">
              {{ item.content }}
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
      <div class="NewContentBox_Text" v-html="newText"></div>
    </van-pull-refresh>

    <!--    语音识别动画-->
    <div class="container" v-if="isPressed">
      <div class="Link">
        <i class="icon-a-6Ahuatong iconfont"></i>
      </div>
      <div class='circle'></div>
      <div class='circle'></div>
      <div class='circle'></div>
      <div class='circle'></div>
    </div>

    <!--    按住说话按钮-->
    <div class="speakBigBox" v-if="!isPull">

      <!--      文本框-->
      <textarea class="speakText"
                v-if="istext"
                v-model="combinedText">

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
             :style="combinedText ? { backgroundColor: '#4fabe5' } : { backgroundColor: 'gray' }"
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
import {Dialog, Toast} from "vant";
import Cookies from "js-cookie";
import {v4 as uuidv4} from 'uuid';
import CryptoJS from 'crypto-js';
import axios from "axios";
// import axios from "axios";


export default {
  name: 'ChatPage',
  data() {
    return {
      isPressed: false, //语音键的状态
      isJpPressed: false,  //键盘按钮的状态
      isFsPressed: false,  //发送按钮的状态
      istext: false,   //输入框的状态
      text: "",  //输入框中的数据
      tempText: "",  //输入框中动态变化的数据
      recognition: null,  //处理语音识别
      infoList: [],  //但钱页面聊天内容
      infoLists: [],  //缓存中的所有聊天内容
      id: 0,  //编辑部传来参数的id
      infoNum: 0,  //编辑部传来数据聊天内容的初始数量
      isLoading: false,
      newText: "",  //机器返回的语言
      oldText: "",
      isPull: false,  //检测是否下拉刷新
      show: false,
      token: "",
      signature: null,
      isLogin: true,  //判断当前token是否合法
      mediaRecorder: null,  //语音识别
      audioContext: null,
      mediaStreamSource: null,
      scriptProcessor: null,
      audioUrl: null,
      secretId: 'AKIDJZjgvxsbCaml6Nes3JYs4A9ujQvCG6zo',
      secretKey: 'w2vqiYClHckhihW80pSvpfO0jRYedZP4',
      textTest: "",
      textArr: [],
      num: 0
    }
  },
  computed: {
    combinedText: {
      get() {
        return this.text + this.tempText;
      },
      set(value) {
        const lengthOfText = this.text.length;
        this.text = value.substring(0, lengthOfText);
        this.tempText = value.substring(lengthOfText);
      },
    },
  },
  mounted() {
    // localStorage.removeItem('infoLists');
    this.getCachedData();

    // 滑倒页面最底端
    this.scrollToBottom();

    this.id = this.$route.query.id

    // 获取token值
    this.token = Cookies.get('token')

    // 如果是编辑部传来的，有id，则获取该id对应的信息放到infoList中
    if (this.id) {
      this.getIdInfo();
    }

    // 测试文字转语音
    // this.synthesizeSpeech()
  },

  methods: {
    // 按下说话按钮
    pressButton() {
      if (!this.istext) {
        this.istext = true;
      }
      this.isPressed = true;
      const unixTimestamp = Math.floor(new Date().getTime() / 1000);
      const expiredTimestamp = unixTimestamp + 50 * 24 * 60 * 60;
      const uuid = uuidv4();
      const nonce = this.generateRandomInteger();
      const secretId = 'AKIDqolWFxgL9ta9leRQI6mLmGf9aCykgkjm';
      const secretKey = 'IjKqFZ0Pjy8DFJMSXZQBykR7iHk9Tk4M';

      const params = {
        engine_model_type: '16k_zh',
        expired: expiredTimestamp,
        needvad: 1,
        nonce: nonce,
        secretid: secretId,
        timestamp: unixTimestamp,
        voice_format: 1,
        voice_id: uuid
      };

      const sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
      const signatureOriginal = `asr.cloud.tencent.com/asr/v2/1324680690?${sortedParams}`;

      const signature = CryptoJS.HmacSHA1(signatureOriginal, secretKey);
      const signatureBase64 = CryptoJS.enc.Base64.stringify(signature);
      console.log("生成的签名：" + signature)

      const url = `wss://asr.cloud.tencent.com/asr/v2/1324680690?${sortedParams}&signature=${encodeURIComponent(signatureBase64)}`;

      try {
        this.signature = new WebSocket(url);
        console.log(this.signature);

        this.signature.onopen = () => {
          console.log('WebSocket连接开启');
          this.startSendingAudio();
        };

        this.signature.onmessage = (event) => {

          const data = JSON.parse(event.data);
          if (data.result) {
            console.log(data.result)
            if (data.result.slice_type === 0 || data.result.slice_type === 1) {
              this.tempText = data.result.voice_text_str
            } else if (data.result.slice_type === 2) {
              this.tempText = ""
              this.text += data.result.voice_text_str
            }
          }

        };

        this.signature.onclose = () => {
          console.log('WebSocket连接关闭');
          this.stopSendingAudio();
        };

        this.signature.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.stopSendingAudio();
        };
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        Toast.fail("启动语音失败！")
      }
    },
    startSendingAudio() {
      navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream);

            const desiredSampleRate = 16000;
            this.scriptProcessor = this.audioContext.createScriptProcessor(4096, 1, 1);

            this.scriptProcessor.onaudioprocess = (event) => {
              const inputData = event.inputBuffer.getChannelData(0);
              const resampledData = this.resample(inputData, this.audioContext.sampleRate, desiredSampleRate);

              if (this.signature.readyState === WebSocket.OPEN) {
                const buffer = new ArrayBuffer(resampledData.length * 2);
                const view = new DataView(buffer);
                resampledData.forEach((sample, index) => {
                  view.setInt16(index * 2, sample * 0x7FFF, true);
                });
                this.signature.send(buffer);
              }
            };

            this.mediaStreamSource.connect(this.scriptProcessor);
            this.scriptProcessor.connect(this.audioContext.destination);
          })
          .catch(error => {
            console.error('获取用户媒体失败:', error);
            Toast.fail("获取用户媒体失败！")
            this.releaseButton()
          });
    },
    resample(inputData, sourceSampleRate, targetSampleRate) {
      const sampleRateRatio = sourceSampleRate / targetSampleRate;
      const newLength = Math.round(inputData.length / sampleRateRatio);
      const resampledData = new Float32Array(newLength);

      for (let i = 0; i < newLength; i++) {
        const originalIndex = i * sampleRateRatio;
        const lowerIndex = Math.floor(originalIndex);
        const upperIndex = Math.ceil(originalIndex);
        const interpolation = originalIndex - lowerIndex;
        resampledData[i] = inputData[lowerIndex] + (inputData[upperIndex] - inputData[lowerIndex]) * interpolation;
      }

      return resampledData;
    },
    releaseButton() {
      this.isPressed = false;
      this.stopSendingAudio();
    },
    stopSendingAudio() {
      if (this.scriptProcessor) {
        this.scriptProcessor.disconnect();
        this.scriptProcessor = null;
      }
      if (this.mediaStreamSource) {
        this.mediaStreamSource.disconnect();
        this.mediaStreamSource = null;
      }
      if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
      }
      if (this.signature && this.signature.readyState === WebSocket.OPEN) {
        this.signature.send(JSON.stringify({ type: 'end' }));
      }
    },

    // 生成随机正整数，最大不超过10位
    generateRandomInteger() {
      const maxDigits = 10;
      return Math.floor(Math.random() * (Math.pow(10, maxDigits) - 1)) + 1;
    },

    // 处理翻译功能的逻辑
    async handleTranslate() {
      Toast.loading({
        message: '正在生成',
        duration: 0,
        forbidClick: true
      });

      const dataitem = this.combinedText;
      const newItem = {
        role: "user",
        content: dataitem
      };

      this.newText = ""; // 在生成新的前，先清空之前的对话
      this.combinedText = "";
      this.oldText = "";
      this.textTest = "";
      this.textArr = [];
      this.istext = false;
      this.scrollToBottom();
      this.infoList.push(newItem);
      const userid = localStorage.getItem('user_id');

      try {
        const response = await fetch('http://192.168.4.1:5010/chat/text?token=' + this.token, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;utf-8'
          },
          body: JSON.stringify({
            user_id: userid,
            topic_name: "童年印象",
            topic_type: "standard_topic",
            chat_id: "01",
            conv_history: this.infoList
          })
        });

        const newItem = {
          role: "assistant",
          content: ""
        };
        this.infoList.push(newItem);

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let textAccumulator = ''; // 用于累积文本

        const process = async ({ done, value }) => {
          if (done) {
            Toast.clear();
            // this.handleTalk()
            return;
          }

          const decodedValue = decoder.decode(value, { stream: true });
          textAccumulator += decodedValue;

          // 移除 "data: " 前缀（假设存在），并根据换行符拆分
          const responseArray = textAccumulator.split('\n');

          // 处理responseArray的后端返回的数组，将数组中的text连成一个句子
          for (const item of responseArray) {
            if (item.trim() !== "" && item.trim() !== "null") {
              try {
                // 移除前面的 "data: " 部分（如果有）
                const jsonString = item.replace(/^data:\s*/, '');
                const parsedItem = JSON.parse(jsonString);
                if (parsedItem.text) {
                  // 解析 JSON 数组并将其拼接成字符串
                  const textArray = JSON.parse(parsedItem.text);
                  const currentText = textArray.join('');

                  if (currentText.length > this.oldText.length) {
                    this.oldText = currentText;
                  }
                }
              } catch (error) {
                // 处理不能被解析为 JSON 格式的 item
              }
            }
          }

          // 得到新数据和旧数据之间的差值
          this.textTest += this.oldText.split(this.newText).join('');


          await this.processChunk(this.textTest);

          // 将处理后的句子中的最长的值赋值给newText和另一个
          this.newText = this.oldText;
          this.infoList[this.infoList.length - 1].content = this.oldText;

          // 继续读取
          const result = await reader.read();
          await process(result);
        };

        const initialResult = await reader.read();
        await process(initialResult);

      } catch (error) {
        console.error(error);
        // 当前token不合法，所以修改状态
        this.isLogin = false;
        Dialog.confirm({
          message: '登录已失效，请重新登录！',
        })
            .then(() => {
              this.$router.push("/login");
            })
            .catch(() => {});

        Toast.clear(); // 清除加载提示
      }
    },

    async handleTalk() {
      for (let i = 0; i < this.textArr.length; i++) {
        await this.fetchData(this.textArr[i])
      }
    },

    async processChunk(chunk) {
      // 使用正则表达式分割缓冲区中的数据
      const sentences = chunk.split(/([。！？])/);

      // 逐句输出
      for (let i = 0; i < sentences.length; i += 2) {
        const sentence = sentences[i] + (sentences[i + 1] || ''); // 加上标点符号
        if ((sentences[i + 1] === '。' || sentences[i + 1] === '！' || sentences[i + 1] === '？') && !this.textArr.includes(sentence)) {
          this.textArr.push(sentence);
          console.log(sentence)
        }
      }
      // await this.fetchData(this.textArr[0])

    },

    // 语音合成
    async fetchData(text) {
      return new Promise((resolve, reject) => {
        const service = 'tts';
        const host = 'tts.tencentcloudapi.com';
        const region = 'ap-beijing';
        const action = 'TextToVoice';
        const version = '2019-08-23';
        const algorithm = 'TC3-HMAC-SHA256';
        const timestamp = Math.floor(Date.now() / 1000);
        const date = new Date(timestamp * 1000).toISOString().substr(0, 10);
        const uuid = uuidv4();
        const requestPayload = {
          Text: text,
          SessionId: uuid,
          Volume: 1,
          ProjectId: 0,
          ModelType: 1,
          VoiceType: 0,
          PrimaryLanguage: 1,
        };
        const payloadHash = CryptoJS.SHA256(JSON.stringify(requestPayload)).toString();

        const canonicalHeaders = `content-type:application/json\nhost:${host}\n`;
        const signedHeaders = 'content-type;host';
        const canonicalRequest = `POST\n/\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

        const credentialScope = `${date}/${service}/tc3_request`;
        const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${CryptoJS.SHA256(canonicalRequest).toString()}`;

        const kDate = CryptoJS.HmacSHA256(date, 'TC3' + this.secretKey);
        const kService = CryptoJS.HmacSHA256(service, kDate);
        const kSigning = CryptoJS.HmacSHA256('tc3_request', kService);
        const signature = CryptoJS.HmacSHA256(stringToSign, kSigning).toString();

        const authorization = `${algorithm} Credential=${this.secretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
        axios.post(`/api`, requestPayload, {
          headers: {
            'Content-Type': 'application/json',
            'X-TC-Action': action,
            'X-TC-Version': version,
            'X-TC-Timestamp': timestamp,
            'X-TC-Region': region,
            'Authorization': authorization,
          },
        })
            .then(response => {
              Toast("语音被触发" + this.num);
              this.num++
              console.log(response.data)
              const audioBase64 = response.data.Response.Audio;
              this.audioUrl = `data:audio/wav;base64,${audioBase64}`;

              const audio = new Audio(this.audioUrl);
              audio.play();

              audio.onended = () => {
                this.audioUrl = null;
                resolve(); // 语音播放结束后解析Promise
              };
            })
            .catch(error => {
              console.error('Error synthesizing voice:', error);
              reject(error); // 处理错误情况
            });
      });
    },




    // 获取聊天开场语
    getTextInit() {
    },
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

    // 展示弹出层
    showPopup() {
      this.show = true;
    },

    // 下拉刷新
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
      if (this.combinedText) {
        this.isFsPressed = true;
      }
    },

    // 松开发送按钮
    releaseFsButton() {
      if (this.combinedText) {
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

  },

  beforeDestroy() {
    // 如果当前的infoList长度和刚进入页面时的长度不一致，且当前token合法则执行
    if (this.infoList.length !== this.infoNum && this.isLogin) {
      this.saveInfoToCache();
    }

    if (this.signature) {
      this.signature.close();
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

/*打开语音识别*/
.container{
  margin: 0 auto;
  width: 80px;
  height: 80px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  display:flex;
  justify-content:center;
  align-items:center;
}

.circle{
  position:absolute;
  width:100%;
  height:100%;
  border-radius:50%;
  background-color:rgb(28, 230, 179);
}

.circle:nth-child(2){
  animation:anim 3s linear infinite;
}

.circle:nth-child(3){
  animation:anim 3s linear 0.8s infinite;
}

.circle:nth-child(4){
  animation:anim 3s linear 1.6s infinite;
}
.Link {
  position: absolute;
  z-index: 999;
  color: #fff;
  font-size: 25px;
}
@keyframes anim {
  0% {
    opacity: 1;
    transform: scale(0);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.5);
  }
  100% {
    opacity: 0;
    transform: scale(3);
  }
}

</style>
