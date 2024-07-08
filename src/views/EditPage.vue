<template>

  <div class="EditAll">

<!--    对话记录详情，不可编辑-->
    <div class="DialogBox">
      <div class="DialogBox_Item" v-for="item in dataList" :key="item.id">
        {{item.content}}
      </div>
    </div>

<!--    生成草稿按钮选择框-->
    <div class="Generate_Box_Big">
      <van-popover
          v-model="showPopover"
          trigger="click"
          :actions="actions"
          @select="onSelect"
          class="Generate_Box"
      >
        <template #reference>
          风格 <span style="margin-left: 5px; color: #80A281;font-weight: 500;">{{style}}</span>
          <i class="icon-xiala iconfont Generate_Icon"></i>
        </template>
      </van-popover>
    </div>

<!--    生成草稿按钮-->
    <div class="Generate_Btn"
         @touchstart.stop="pressGenerateButton"
         @touchend.stop="releaseGenerateButton"
         :class="{ 'small': isGeneratePressed }"
         ontouchstart="return false;"
         onselectstart="return false;">
      生成草稿
    </div>

<!--    生成的草稿，可编辑-->
    <div class="DraftBox">
      <textarea class="DraftArea" v-model="draftText">

      </textarea>
    </div>

<!--    保存草稿、重置按钮-->
    <div class="bottomBox">
      <div class="SaveDraftBox"
           @touchstart.stop="pressSaveButton"
           @touchend.stop="releaseSaveButton"
           :class="{ 'small': isSavePressed }"
           ontouchstart="return false;"
           onselectstart="return false;">保存草稿</div>
      <div class="ResetDraftBox"
           @touchstart.stop="pressResetButton"
           @touchend.stop="releaseResetButton"
           :class="{ 'small': isResetPressed }"
           ontouchstart="return false;"
           onselectstart="return false;">重置</div>
    </div>

  </div>

</template>

<script>
// import {Toast} from "vant";

import {Dialog, Toast} from "vant";

export default {
  name: "EditPage",
  data() {
    return {
      dataList: [],
      style: "", //风格内容
      showPopover: false, //点击下拉框进行展示
      draftLists: [],
      actions: [
        { text: '默认' },
        { text: '童年印象' },
        { text: '儿时玩伴' },
        { text: '家庭记忆' }
      ],  //下拉框内容
      isGeneratePressed: false, //生成草稿按钮是否被按压
      isSavePressed: false,
      isResetPressed: false,
      draftText: "", //调用后端接口生成的文本

    }
  },
  mounted() {
    this.dataList = this.$route.query.data.infoListItem
    this.style = this.actions[0].text

    // 获取信息
    const cachedDraftList = localStorage.getItem('draftLists');
    if (cachedDraftList) {
      this.draftLists = JSON.parse(cachedDraftList)
      console.log(this.draftLists)
    } else {
      console.log('未找到藏卷馆信息');
    }
  },
  methods: {
    onSelect(action) {
      this.style = action.text
    },
    // 生成一个id
    generateRandomId() {
      return Math.random().toString(36).substr(2, 9);
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

    // 按下生成草稿按钮
    pressGenerateButton() {
      this.isGeneratePressed = true
    },
    releaseGenerateButton() {
      this.isGeneratePressed = false
      this.dataList.forEach(item => {
        this.draftText += item.content;
      })
    },
    //按下保存草稿按钮
    pressSaveButton() {
      this.isSavePressed = true
    },
    releaseSaveButton() {
      this.isSavePressed = false
      if (this.draftText) {
        Dialog.confirm({
          message: '确定保存草稿吗？',
        }).then(() => {
          // 展示加载图标
          Toast.loading({
            message: '正在保存',
            duration: 0,
            forbidClick: true
          })
          // 将DraftData先存放在数组中，再存放在缓存中
          const DraftData = {
            chat_id: this.generateRandomId(),
            text: this.draftText,
            style: this.style,
            time: this.getCurrentDateTime(),
            title: ""
          }
          this.draftLists.push(DraftData)
          localStorage.setItem('draftLists', JSON.stringify(this.draftLists));
          // 加载图标关闭
          Toast.clear();
          this.$router.replace("/")
        }).catch(() => {

        });
      } else {
        Toast.fail("请先生成草稿！")
      }
    },
    //按下重置按钮
    pressResetButton() {
      this.isResetPressed = true
    },
    releaseResetButton() {
      this.isResetPressed = false
      // 风格还原
      this.style = this.actions[0].text
      // 生成的内容还原
      this.draftText = ""
      Toast.success('重置完成！');
    }

  }
}
</script>

<style scoped>
.EditAll {
  width: 83%;
  margin: 0 auto;
  padding-bottom: 30px;
}
.DialogBox {
  width: 100%;
  height: 40vh;
  margin-top: 30px;
  border-radius: 15px;
  background-color: #fff;
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: scroll;
}
.Generate_Box_Big {
  width: 190px;
  height: 40px;
  margin: 10px auto 0;
}
.Generate_Box {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  background-color: #ffffff;
  line-height: 40px;
  padding-left: 15px;
  box-sizing: border-box;
  position: relative;
  font-weight: 700;
}
.Generate_Icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 20px;
}
.Generate_Btn {
  width: 170px;
  height: 45px;
  line-height: 45px;
  background-color: #466449;
  text-align: center;
  margin: 10px auto 0;
  color: white;
  border-radius: 15px;
  font-weight: 700;
  transition: transform 0.2s;
}
.small {
  transform: scale(0.9) !important;
}
.DraftBox {
  width: 100%;
  height: 40vh;
  margin-top: 20px;
  border-radius: 15px;
  overflow: hidden;
  box-sizing: border-box;
}
.DraftArea {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  border: 0;
}
.bottomBox {
  width: 260px;
  height: 45px;
  display: flex;
  text-align: center;
  line-height: 45px;
  margin: 10px auto 0;
  font-weight: 700;
}
.SaveDraftBox {
  width: 65%;
  border-radius: 15px;
  background-color: #466449;
  color: white;
  transition: transform 0.2s;
}
.ResetDraftBox {
  width: 30%;
  border-radius: 15px;
  background-color: #B29639;
  margin-left: 5%;
  transition: transform 0.2s;
}
</style>