<template>
<!--  尝试git-->
  <div class="All">
    <!--    背景图片-->
    <div class="bgiBox">
      <img src="../images/bgc3.png" alt="">
    </div>

<!--    上次编辑栏-->
    <div class="LastEditBox">
      上次编辑：{{storyItem.time}}
    </div>

<!--    给故事起名字栏-->
    <input class="AddTitleBox" v-model="storyItem.title" placeholder="给这个故事起个名字吧">

<!--    故事编辑文本域-->
    <textarea class="EditTextBox" v-model="storyItem.text"></textarea>

<!--    底部按钮栏-->
    <div class="bottomBtnBox">
      <div class="cancelSave" @click="cancelSave()">
        放弃修改 <i class="icon-quxiaobaocun iconfont"></i>
      </div>
      <div class="Save" @click="Save()">
        保存进度 <i class="icon-baocun iconfont"></i>
      </div>
      <div class="Go">
        <i class="iconfont icon-fasong1"></i>
      </div>
    </div>

  </div>

</template>

<script>
export default {
  name: "EditStoryPage",
  data() {
    return {
      storyItem: {},
      draftLists: [],
    }
  },
  mounted() {
    // 先获取缓存中的所有值
    this.getDraftLists();

    const chat_id = this.$route.query.chat_id;
    if (chat_id) {
      this.storyItem = this.draftLists.find(item => item.chat_id === chat_id);
    }
    console.log(this.storyItem)
  },
  methods: {
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
    // 获取缓存中的draftLists
    getDraftLists() {
      const cachedDraftList = localStorage.getItem('draftLists');
      if (cachedDraftList) {
        this.draftLists = JSON.parse(cachedDraftList)
      } else {
        this.draftLists = [];
      }
    },
    // 取消保存，不进行任何操作，直接返回主页面
    cancelSave() {
      this.$router.replace({name: 'index'})
    },
    Save() {
      // 先把之前的给删除
      const id = this.storyItem.chat_id
      console.log(id)
      const index = this.draftLists.findIndex(item => item.chat_id === id);
      if (index !== -1) {
        this.draftLists.splice(index, 1);
      }
      // 再添加新的
      this.storyItem.time = this.getCurrentDateTime();
      console.log(this.storyItem)
      this.draftLists.push(this.storyItem)
      localStorage.setItem('draftLists', JSON.stringify(this.draftLists));
      this.$router.replace({name: 'index'})

    }
  }
}
</script>

<style scoped>
.All {
  width: 85%;
  margin: 0 auto;
  height: 100px;
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
.LastEditBox {
  width: 100%;
  height: 50px;
  line-height: 50px;
  color: #999;
}
.AddTitleBox {
  border: 0;
  width: 100%;
  height: 35px;
  background-color: #fff;
  border-radius: 10px;
  padding: 0 10px;
  box-sizing: border-box;
}
.EditTextBox {
  width: 100%;
  height: 500px;
  margin-top: 10px;
  border-radius: 10px;
  border: 0;
  padding: 10px;
  box-sizing: border-box;
}
.bottomBtnBox {
  width: 100%;
  height: 50px;
  margin: 20px auto 0;
  display: flex;
}
.cancelSave {
  width: calc((100% - 70px) / 2);
  height: 100%;
  line-height: 50px;
  text-align: center;
  background-color: #cecece;
  border-radius: 15px;
}
.Save {
  width: calc((100% - 70px) / 2);
  height: 100%;
  line-height: 50px;
  text-align: center;
  background-color: #80A281;
  margin-left: 10px;
  border-radius: 15px;
}
.Go {
  width: 50px;
  height: 100%;
  line-height: 50px;
  border-radius: 15px;
  background-color: #80A281;
  margin-left: 10px;
  text-align: center;
}
</style>