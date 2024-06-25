<template>

  <div class="All" style="box-sizing: border-box">

    <van-tabs class="TabsBox"
              background="#80A281"
              title-inactive-color="#666"
              sticky
              color="#e0c37b"
              v-model="active">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-tab title="" disabled>内容 1</van-tab>

        <!--      推荐页内容-->
        <van-tab class="recommendBox" title="推荐">

          <div class="recommendItem">
            <div v-for="item in dividedZpList[0]" class="recommendItem_Box" :key="item.id" @click="goContentInfoPage(item.id)">

              <div class="recommendItem_Img" v-if="item.bgi">
                <img :src="item.bgi[0]">
              </div>

              <div class="recommendItem_Content">
                <div class="recommendItem_title">{{ item.title }}</div>
                <div class="recommendItem_text">{{ item.content }}</div>
                <div class="recommendItem_dz"><van-icon name="good-job-o" />{{ item.dz }}</div>
              </div>

            </div>
          </div>

          <div class="recommendItem">
            <div v-for="item in dividedZpList[1]" class="recommendItem_Box" :key="item.id" @click="goContentInfoPage(item.id)">

              <div class="recommendItem_Img" v-if="item.bgi">
                <img :src="item.bgi[0]">
              </div>

              <div class="recommendItem_Content">
                <div class="recommendItem_title">{{ item.title }}</div>
                <div class="recommendItem_text">{{ item.content }}</div>
                <div class="recommendItem_dz"><van-icon name="good-job-o" />{{ item.dz }}</div>
              </div>

            </div>
          </div>

        </van-tab>

        <van-tab title="地图">内容 2</van-tab>
        <van-tab title="好友">内容 3</van-tab>
        <van-tab title="" disabled>内容</van-tab>

      </van-pull-refresh>

    </van-tabs>


  </div>

</template>

<script>
import {Toast} from "vant";

export default {
  name: "ActivityPage",
  data() {
    return {
      active: 0,
      isLoading: false,
      recommendList: [
        {
          "id": 1,
          "title": "12项涉税服务措施落地 小微企业向“新”而行",
          "content": "“6万元的税费‘红包’从‘纸上’落到企业账上，政策提振了企业的发展信心。”近日，在安徽芜湖无为市，一家经营液压机、粉碎机等机械制造和销售的制造业小微企业收到了税费政策“礼包”。\n" +
              "记者了解到，当地税务部门通过与退役军人事务局交换信息数据，发现该机械制造公司招录10名退役士兵，随即辅导企业享受自主就业退役士兵创业就业税收政策优惠政策。\n" +
              "政策红利变助力企业发展的“真金白银”，这是税费支持政策支持小微企业发展的生动实践。\n" +
              "小微企业是吸纳就业的主力军、经济发展的生力军。近年来，税务部门为支持小微企业发展出台了一系列措施，取得了积极成效。国家税务总局数据显示，去年中国新办涉税经营主体达到1687.6万户，同比增长28.3%。这些首次到税务部门办理税种认定、发票领用、申报纳税等涉税事项的经营主体，不少是小微企业。\n" +
              "近日，税务总局和全国工商联发布《2024年助力小微经营主体发展“春雨润苗”专项行动方案》(以下简称《方案》)，在延续并深化以往三年“春雨润苗”行动10大类系列活动36项服务措施基础上，2024年重点推出12项服务措施，核心内容是提高小微经营主体办税效率，压缩办税成本，解决“急难愁盼”问题，以推动优化民营经济发展环境。",
          "dz": 123,
          "bgi": [
              "https://img1.artron.net/artist/A0000013/brt00001300105.jpg",
              "https://img.zcool.cn/community/0135075e4fe43ba80120a8954f2869.jpg@1280w_1l_2o_100sh.jpg"
          ]
        },
        {
          "id": 2,
          "title": "全国超70个城市推行住房“以旧换新” 助力美好安居、激活房地产市场",
          "content": "我们看到，各地住房“以旧换新”的模式主要是中介优先卖和国企收旧换新两种。其中，对于很多想换房的人来说，国企收购是一种比较新鲜的模式，到底是如何进行的？我们下面就通过武汉的做法来具体了解一下。\n" +
              "\n" +
              "在武汉硚口区，通过政府搭建的平台，相关国有企业将老房子收购。目前，当地刚刚对“以旧换新”的项目库进行了扩容，筹集了8个开发商，包含10个在售新房项目。同时还对相关政策进行了进一步调整，旧房面积由最初的120平方米以下调整为140平方米以下，老旧房屋价格从不得高于所购新房总价的70%，调整为不得高于所购新房总价。此外，原来的一套存量房只能置换一套新房，现在调整为最多允许三套房源置换一套新房。假如购房人选中了一套总价210万元的新房，他的操作流程应该是这样的。",
          "dz": 123,
          "bgi": [
            "https://th.bing.com/th/id/R.d761768122c59c824548af9a319b2a9b?rik=aT6CTHLSGXlbHw&riu=http%3a%2f%2fseopic.699pic.com%2fphoto%2f50017%2f0763.jpg_wh1200.jpg&ehk=a9yqHVMDyyNnX7eIrDspUnGgDaUdUPRIRB1hXCbaiJU%3d&risl=&pid=ImgRaw&r=0",
          ]
        },
        {
          "id": 3,
          "title": "央广财评|韧性强、底气足！多组数据折射中国经济提“质”向“新”",
          "content": "近日，世界银行上调对中国经济的增长预期。外交部发言人回应：“面对复杂多变的国际环境，中国经济有底气、有力量破浪前行。”\n" +
              "中国经济何以有底气、有力量破浪前行？近期公布的多份5月经济运行数据绘就中国经济运行之“势”。随着各项支持政策加力显效，消费潜力加速释放，外贸向好势头不减，国内国际双循环相互促进，投资、消费、出口“三驾马车”持续发力，持续释放出经济运行提质向好的积极信号。",
          "dz": 123,
          "bgi": []
        },
        {
          "id": 4,
          "title": "中国的新发展是世界的大机遇（和音）",
          "content": "“出口增长强劲”“制造业增速超出预期”“宏观数据一直很稳固”……国际机构近期纷纷对中国经济做出乐观分析并上调增长预期，充分表明国际社会对中国经济充满信心。中国经济回升向好态势持续巩固增强，不仅给世界带来信心的提升，也意味着各方将从中国的新发展中获得更多新机遇。\n" +
              "看好中国经济，这是国际社会的主流声音。世界银行日前发布的最新一期《全球经济展望》报告，将2024年中国经济增速预期较今年1月上调0.3个百分点至4.8%。国际货币基金组织将今年中国经济增速预期上调至5%，较此前预测值提升0.4个百分点。联合国5月中旬发布报告，对中国经济增长率的预测由今年1月的4.7%上调至4.8%。亚洲开发银行、摩根士丹利、高盛、瑞银等国际金融机构也纷纷上调对中国经济增速的预期。这些都表明，中国仍是世界经济增长最重要的稳定器和动力源。",
          "dz": 123,
          "bgi": [
            "https://img.shetu66.com/2022/08/31/1661927053957755.jpg",
            "https://img.zcool.cn/community/0135075e4fe43ba80120a8954f2869.jpg@1280w_1l_2o_100sh.jpg"
          ]
        },
        {
          "id": 5,
          "title": "5月70大中城市二手房价全部下跌，楼市底部或已不远",
          "content": "国家统计局周一公布的70大中城市房价数据显示，5月，全国房价延续下跌态势，其中，新房价格环比上涨的城市只有2个，较上月减少4个；二手房市场继去年12月后再度全军覆没，无一城市环比上涨。\n" +
              "根据分析师测算，5月，全国70城新房价格指数环比下跌0.7%，连续12个月下跌，跌幅比4月扩大0.1个百分点；二手房价格指数环比下跌1.0%，连续14个月下跌，跌幅比4月扩大0.1个百分点，且创近十年新低。",
          "dz": 123,
          "bgi": [
            "https://img.shetu66.com/2023/06/28/1687934812326957.jpg",
            "https://img.zcool.cn/community/0135075e4fe43ba80120a8954f2869.jpg@1280w_1l_2o_100sh.jpg"
          ]
        },
        {
          "id": 6,
          "title": "与涉黄经营老板起冲突，小伙被扔下楼受伤反被拘押，警方11年后立案",
          "content": "2013年的6月15日，27岁的杨银宝在西安的一家会馆被人从6楼扔下，侥幸捡得一条命。然而，没等来西安警方追究加害者的责任，自己却被以涉嫌诽谤犯罪为由拘押失去自由，他的女朋友也未能幸免。后来，办理了取保候审的杨银宝拖着伤残的身体离开西安到银川打工。\n" +
              "11年来，杨银宝在银川结婚生子，逐渐从伤痛中走了出来，但是一想起自己从受害者变成嫌疑人，脑海里全是苦涩的记忆。近日，收到西安市公安局经济技术开发区分局的立案告知书，他再次满心疑虑返回西安：“11年了才立案，还能查得清吗？”",
          "dz": 123,
          "bgi": [
            "https://img.shetu66.com/2023/07/28/1690508060414737.png",
            "https://img.zcool.cn/community/0135075e4fe43ba80120a8954f2869.jpg@1280w_1l_2o_100sh.jpg"
          ]
        },
      ]
    }
  },
  mounted() {

  },
  computed: {
    dividedZpList() {
      // 计算每个子数组的理想大小，使得内容均匀地分布在三列中
      const chunkSize = Math.ceil(this.recommendList.length / 2);

      // 使用 slice 方法将原始数组拆分成三个子数组
      // 第一个子数组包含原始数组的前 chunkSize 个元素
      // 第二个子数组包含原始数组的第 chunkSize 个到第 2*chunkSize 个元素
      // 第三个子数组包含原始数组的第 2*chunkSize 个到最后一个元素
      return [
        this.recommendList.slice(0, chunkSize),
        this.recommendList.slice(chunkSize, chunkSize * 2),
      ];
    },
  },
  methods: {
    goContentInfoPage(id) {
      this.$router.push({
        path: "/contentinfo",
        query: {
          id: id
        }
      })
    },
    onRefresh() {
      setTimeout(() => {
        Toast('刷新成功');
        this.isLoading = false;
        this.count++;
      }, 1000);
    },
  }
}
</script>

<style scoped>
.TabsBox {
}
::v-deep .van-tabs__wrap {
  height: 60px !important; /* 自定义标签栏高度 */
}
::v-deep .van-tabs {
}
::v-deep .van-tab {
  height: 60px !important; /* 自定义单个标签高度 */
  line-height: 60px !important; /* 垂直居中 */
  font-size: 20px !important; /* 字体大小 */
  font-weight: 700 !important;
}
.recommendBox {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  font-family: '楷体';
}
.recommendItem {
  width: 47%;
  overflow: hidden;
  margin-left: 2%;
}

.recommendItem_Box {
  margin-top: 10px;
}
.recommendItem_Img {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.recommendItem_Img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.recommendItem_Content {
  width: 100%;
  background-color: #fff;
  padding: 10px;
  box-sizing: border-box;
}
.recommendItem_text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 18px;
  text-overflow: ellipsis;
  margin-top: 5px;
}
.recommendItem_title {
  font-size: 16px;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.recommendItem_dz {
  font-size: 17px;
  margin-top: 12px;
}
</style>