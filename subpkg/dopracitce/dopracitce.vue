<template>
  <!-- 页面 -->
  <view class="container">
    <!-- 题目 -->
    <view class="swiper-box">
      <swiper class="swiper" :duration="duration" :current="swiperIndex" :disable-programmatic-animation="true"
        @change="onChange" @animationfinish="onAnimationfinish">
        <!-- 每一道题目 -->
        <swiper-item v-for="(item, index) in swiperList" :key="index">
          <scroll-view scroll-y="true" class="swiper-scroll">
            <view class="swiper-item" @touchstart="clearAutoNextTopicTime">
              <view class="topic-content">
                <view>
                  <text style="padding-right: 20rpx;">
                    <text class="type-label">
                      {{ item.qtype | topicType }}
                    </text>
                  </text>
                  <text>{{ item.qtitle }}</text>
                </view>
                <!-- 选项 -->
                <view class="answer-sheet">
                  <!-- 每个选项 -->
                  <view class="item h-flex-x" v-for="(sheetItem, sheetIndex) in item.answerSheet" :key="sheetIndex"
                    @tap="onAnswerSheet(sheetIndex)">
                    <view class="icon h-flex-x h-flex-center" :class="{
                      'success': (item.done == sheetItem.value) && (item.answer == sheetItem.value),
                      'error': (item.done == sheetItem.value) && (item.answer != sheetItem.value)
                    }">
                      <block v-if="item.done == sheetItem.value">
                        <uni-icons type="checkmarkempty" size="12" color="#fff"
                          v-if="item.answer == sheetItem.value"></uni-icons>
                        <uni-icons type="closeempty" size="12" color="#fff" v-else></uni-icons>
                      </block>
                      <text v-else>{{ sheetItem.value }}</text>
                    </view>
                    <!-- 选项的内容 -->
                    <view>{{ sheetItem.name }}</view>
                  </view>
                </view>
                <!-- 答案 -->
                <view class="answer-result" v-if="item.done">
                  <text>答案</text>
                  <text style="color: #0089ff;font-weight: bold;padding: 0 20rpx;">{{ item.answer }}</text>
                  <text style="padding-right: 20rpx;">您选择</text>
                  <text style="color: #0089ff;font-weight: bold;" v-if="item.done == item.answer">{{
                    item.done }}</text>
                  <text style="color: #f84d27;font-weight: bold;" v-else>{{ item.done }}</text>
                </view>
                <view class="answer-doubt" v-if="item.done">
                  <text style="font-weight: bold;">题目解析：</text>
                  <text>{{ item.analysis }}</text>
                </view>
              </view>
            </view>
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
    <!-- 收藏、题目列表等功能区 -->
    <view class="panel-bottom">
      <view class="shade" v-if="showPopup" @tap="showPopup = !showPopup"></view>
      <view class="content">
        <view class="action-bar h-flex-x">
          <!-- 收藏 -->
          <view @tap="addFavorite">
            <view class="h-flex-x" v-if="isFavorite">
              <uni-icons type="star-filled" size="18" color="#f2ce1b"></uni-icons>
              <text style="padding-left: 10rpx;">已收藏</text>
            </view>
            <view class="h-flex-x" v-else>
              <uni-icons type="star" size="18" color="#666"></uni-icons>
              <text style="padding-left: 10rpx;">收藏</text>
            </view>
          </view>
          <!-- 正确和错误题目 -->
          <view class="h-flex-item-grow h-flex-x h-flex-center" @tap="showPopup = !showPopup">
            <view>
              <uni-icons type="checkbox-filled" size="18" color="#0089ff"></uni-icons>
            </view>
            <!-- 正确 -->
            <view class="success-num" style="padding-left: 10rpx;margin-right: 30rpx;">{{ countResult.success }}</view>
            <view>
              <uni-icons type="clear" size="18" color="#f84d27"></uni-icons>
            </view>
            <!-- 错误 -->
            <view class="error-num" style="padding-left: 10rpx;">{{ countResult.error }}</view>
          </view>
          <!-- 列表按钮和做题进程 -->
          <view class="h-flex-x" @tap="showPopup = !showPopup">
            <uni-icons type="bars" size="18" color="#666"></uni-icons>
            <text style="padding-left: 10rpx;font-weight: bold;">{{ topicIndex + 1 }}</text>
            <text style="color: #999;padding: 0 5rpx;">/</text>
            <text style="color: #999;">{{ dataList.length }}</text>
          </view>
          <!-- 交卷 -->
          <view v-if="!collectfunction" class="btnbox_right">
            <view class="success_exam" @click="submit">交卷</view>
          </view>
        </view>
        <!-- 列表显示区 -->
        <scroll-view class="topic-list" v-if="showPopup" style="height: 700rpx;" scroll-y="">
          <view class="list-box h-flex-x h-flex-wrap h-flex-6">
            <view class="list-item" v-for="(item, index) in dataList" :key="index" @tap="pickerTopic(index)">
              <view class="h-flex-x h-flex-center" :class="{
                'active': index == topicIndex,
                'success': item.done && (item.answer == item.done),
                'error': item.done && (item.answer != item.done)
              }">{{ index + 1 }}</view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
import { getQuestion, saveScore, collectQuestion, answerQuestion } from '@/api/user.js'
import dataApi from './optimized-swiper-data.js'
export default {
  data() {
    return {
      dataList: [],	// 数据源
      swiperList: [],	// 轮播图数据列表，包括当前题止和前后题目
      swiperIndex: 0,	// 轮播图当前位置
      isChange: false,	// 是否切换
      topicIndex: 0,	// 题目位置
      duration: 200,	// 动画过渡时长
      showPopup: false,//弹窗是否显示
      startTime: 0, //开始时间
      endTime: 0, //结束时间
      timecost: 0,	// 耗时
      datatime: 0,	// 交卷时间
      content: '试卷1',	// 交卷内容
      collectfunction: 0, //收藏或错题功能,当为1时不显示交卷按钮
    }
  },
  computed: {
    // 结果统计
    countResult() {
      let [success, error] = [0, 0];
      this.dataList.forEach((item) => {
        if (item.done) {
          if (item.done == item.answer) {
            success++;
          } else {
            error++;
          }
        }
      })
      return {
        success,
        error
      }
    },
    // 是否收藏
    isFavorite() {
      let item = this.dataList[this.topicIndex];
      if (item && item.collect) {
        return true;
      }
      return false;
    },
    currentData() {
      // 计算当前题目的数据
      return this.dataList[this.topicIndex];
    }
  },
  filters: {
    topicType(type) {
      if (type == 1) {
        return '选择题';
      }
      if (type == 2) {
        return '判断题';
      }
      return ''
    }
  },
  async onLoad(options) {
    if (options.examname) {
      this.content = options.examname;
      var result = await getQuestion({ examname: options.examname });
    }
    else if (options.zxname) {
      this.content = options.zxname;
      var result = await getQuestion({ zxname: options.zxname });
    }
    else if (options.collectfunction) {
      this.collectfunction = options.collectfunction;
      var result = await getQuestion({ collectfunction: 1 });
    }
    else if (options.worsequestion) {
      this.collectfunction = options.worsequestion;//错题和收藏一样，都是隐藏交卷按钮，就不用再写一个了
      var result = await getQuestion({ worsequestion: options.worsequestion });
    }
    else {
      var result = await getQuestion();
    }
    if (result.status !== 200) return uni.$showMsg()
    this.dataList = result.message;
    this.renderSwiper(0);
    this.startTime = new Date().getTime();
  },
  methods: {
    // 渲染 swiper
    renderSwiper(index) {
      let list = [];
      let current = 1;
      if (this.dataList[index - 1]) {
        list.push(this.dataList[index - 1]);
      } else {
        current = 0;
      }

      list.push(this.dataList[index])

      if (this.dataList[index + 1]) {
        list.push(this.dataList[index + 1]);
      }

      this.duration = 0;

      setTimeout(() => {
        this.swiperList = list;
        this.swiperIndex = current;

        setTimeout(() => {
          this.duration = 200;
        }, 100)
      }, 50)
    },
    // 轮播图切换
    onChange(e) {
      // 非触摸事件不做轮播图状态更新
      if (e.detail.source != "touch") return;

      // 标识已切换
      this.isChange = true;
      // 轮播图当前位置大于原来时则表示为下一题
      if (e.detail.current > this.swiperIndex) {
        this.topicIndex++;
      } else {
        // 轮播图当前位置小于原来时则表示为上一题
        this.topicIndex--;
      }

      // 更新轮播图位置数值，为更新时让 Vue 能监听到数据有改变
      this.swiperIndex = e.detail.current;
    },
    // 轮播图动画结束
    onAnimationfinish(e) {
      if (!this.isChange) return;

      this.isChange = false;
      setTimeout(() => {
        this.renderSwiper(this.topicIndex);
      }, 10);

    },
    // 选择题目
    pickerTopic(index) {
      this.topicIndex = index;
      this.renderSwiper(index);
      this.showPopup = false;
    },
    // 监听答题
    async onAnswerSheet(index) {
      if (this.swiperList[this.swiperIndex].done) {
        // 不能重复答题
        return;
      }

      // 当前已选答案
      let seelctedValue = this.swiperList[this.swiperIndex].answerSheet[index].value;
      this.$set(this.swiperList[this.swiperIndex], "done", seelctedValue);
      //存储答案
      let result = await answerQuestion({ id: this.swiperList[this.swiperIndex].id, done: seelctedValue });
      if (result.status !== 200) return uni.$showMsg()

      // 答题完成后自动进入下一题
      this.autoNextTopicTime = setTimeout(() => {
        let pickerIndex = this.topicIndex + 1;
        this.pickerTopic(pickerIndex);
      }, 800);
    },
    // 清除自动跳到下一页延时器
    clearAutoNextTopicTime() {
      clearTimeout(this.autoNextTopicTime);
    },
    // 添加收藏
    async addFavorite() {
      let favorite = this.dataList[this.topicIndex].collect;
      this.$set(this.dataList[this.topicIndex], "collect", 1 - favorite);
      let result = await collectQuestion({ id: this.dataList[this.topicIndex].id, collect: 1 - favorite });
      if (result.status !== 200) return uni.$showMsg()
    },
    //交卷,并跳转到pages/practise/practise页面，并传递正确题数的个数countResult.success
    async submit() {
      this.endTime = new Date().getTime();
      this.timecost = this.endTime - this.startTime;
      this.datatime = this.endTime / 1000;//交卷时间,以秒为单位
      let data = {
        score: this.countResult.success / this.dataList.length * 100,
        timecost: this.timecost,
        datatime: this.datatime,
        content: this.content,
      }
      let result = await saveScore(data);
      if (result.status !== 200) return uni.$showMsg()
      uni.switchTab({
        url: '/pages/practise/practise',
      })
    },
  },
}
</script>

<style lang="scss">
/*
 *  uni-app flex 布局盒子
 *  作者:helang
 *  邮箱:helang.love@qq.com
*/

/* 分列式弹性盒子，以X轴从左到右排列 */
.h-flex-x {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  align-content: center;

  /* 水平左对齐 */
  &.h-flex-left {
    justify-content: flex-start;
  }

  /* 水平居中对齐 */
  &.h-flex-center {
    justify-content: center;
  }

  /* 水平右对齐 */
  &.h-flex-right {
    justify-content: flex-end;
  }

  /* 水平两端对齐 */
  &.h-flex-space {
    justify-content: space-between;
  }

  /* 垂直顶部对齐 */
  &.h-flex-top {
    align-items: flex-start;
    align-content: flex-start;
  }

  /* 垂直底部对齐 */
  &.h-flex-bottom {
    align-items: flex-end;
    align-content: flex-end;
  }

  /* 允许换行 */
  &.h-flex-wrap {
    flex-wrap: wrap;
  }

  /* 等比分列，2-6列 */
  @for $i from 2 through 6 {
    &.h-flex-#{$i} {
      &>view {
        width: (100% / $i);
      }
    }
  }

  /* 弹性元素 */
  &>.h-flex-item-grow {
    flex-grow: 1;
    width: 0;
  }
}

/* 分行式弹性盒子，以Y轴从上到下排列 */
.h-flex-y {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;

  /* 垂直居中对齐 */
  &.h-flex-center {
    justify-content: center;
    align-items: center;
    align-content: center;
  }

  /* 水平左对齐 */
  &.h-flex-left {
    align-items: flex-start;
    align-content: flex-start;
  }

  /* 水平右对齐 */
  &.h-flex-right {
    align-items: flex-end;
    align-content: flex-end;
  }

  /* 垂直两端对齐 */
  &.h-flex-space {
    justify-content: space-between;
  }

  /* 垂直顶部对齐 */
  &.h-flex-top {
    justify-content: flex-start;
  }

  /* 垂直底部对齐 */
  &.h-flex-bottom {
    justify-content: flex-end;
  }

  /* 等比分行，2-6行 */
  @for $i from 2 through 6 {
    &.h-flex-#{$i} {
      &>view {
        height: (100% / $i);
      }
    }
  }

  /* 弹性元素 */
  &>.h-flex-item-grow {
    flex-grow: 1;
    height: 0;
  }
}

// *****************************
page {
  height: 100%;
}

// 容器
.container {
  height: 100%;
  background-color: #fff;
  position: relative;
  color: #333;
  font-size: 28rpx;
}

// 轮播盒子
.swiper-box {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 100rpx;
  height: auto;
  width: auto;
  z-index: 1;
}

.swiper {
  height: 100%;

  .swiper-scroll {
    height: 100%;
  }

  .swiper-item {
    background-color: #fff;
    box-sizing: border-box;
    height: 100%;



    .topic-content {
      padding: 30rpx;
      font-size: 32rpx;
      color: #333;
      line-height: 1.6;

      // 题目类型标签
      .type-label {
        background-color: #0089ff;
        color: #fff;
        border-radius: 6rpx;
        padding: 4rpx 10rpx;
        font-size: 24rpx;
      }

      // 答题卡
      .answer-sheet {
        margin: 40rpx -30rpx;

        .item {
          padding: 20rpx 30rpx;

          &:active {
            background-color: #f3f3f3;
          }

          +.item {
            margin-top: 0;
          }

          .icon {
            margin-right: 20rpx;
            box-shadow: 0 0 5px #999;
            width: 40rpx;
            height: 40rpx;
            border-radius: 50%;
            font-size: 26rpx;

            &.success {
              background-color: #0089ff;
            }

            &.error {
              background-color: #f84d27;
            }
          }


        }

      }

      // 答题结果
      .answer-result {
        background-color: #f3f3f3;
        border-radius: 8rpx;
        padding: 20rpx 30rpx;
        font-size: 28rpx;
      }

      // 题目解析
      .answer-doubt {
        font-size: 28rpx;
        color: #8a6d3b;
        background-color: #fcf8e3;
        border: #faebcc solid 1px;
        margin-top: 40rpx;
        padding: 20rpx 30rpx;
        border-radius: 8rpx;
        word-break: break-all
      }
    }
  }
}



// 底部面板
.panel-bottom {
  position: absolute;
  left: 0;
  bottom: 0;
  height: auto;
  width: 100%;
  z-index: 2;

  // 遮罩
  .shade {
    position: fixed;
    z-index: 9;
    background-color: rgba(33, 33, 33, 0.5);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  // 内容
  .content {
    position: absolute;
    z-index: 10;
    bottom: 0;
    left: 0;
    width: 100%;
    height: auto;
    background-color: #fff;
  }

  // 操作栏
  .action-bar {
    height: 100rpx;
    width: 100%;
    box-sizing: border-box;
    border-top: #ddd solid 1px;
    font-size: 28rpx;
    padding: 0 20rpx;

    .success-num {
      color: #0089ff;
    }

    .error-num {
      color: #f84d27;
    }

    .btnbox_right {
      width: 20%;
      display: flex;
      align-items: center;
      padding-right: 10rpx;
      padding-left: 40rpx;

      .success_exam {
        width: 100%;
        text-align: center;
        background: #0e8afd;
        color: #ffffff;
        border-radius: 10rpx;
        padding: 10rpx 0 10rpx 0;
      }
    }
  }

  // 题目列表
  .topic-list {
    height: 600rpx;

    .list-box {
      padding: 20rpx 20rpx 0 20rpx;
      font-size: 28rpx;
      color: #666;

      .list-item {
        padding-bottom: 20rpx;

        >view {
          width: 80rpx;
          height: 80rpx;
          background-color: #fff;
          border: #ddd solid 1px;
          border-radius: 50%;
          margin: 0 auto;

          &.active {
            border: #0089ff solid 1px;
          }

          &.success {
            background-color: #dbf2ff;
            color: #0089ff;
            border: none;

            &.active {
              border: #0089ff solid 1px;
            }
          }

          &.error {
            background-color: #ffeceb;
            color: #f84d27;
            border: none;

            &.active {
              border: #f84d27 solid 1px;
            }
          }
        }
      }
    }
  }
}
</style>