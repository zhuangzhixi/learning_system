<template>
  <view>
    <!-- 将examname中的数据渲染用列表的形式展示出来 -->
    <view class="all" v-for="(item, index) in examname" :key="index" @click="toQuestion(item.examname)">
      <view>{{ item.examname }}</view>
    </view>
  </view>
</template>

<script>
import { getExamName } from '@/api/user.js';
export default {
  data() {
    return {
      examname: '',
    };
  },
  onLoad() {
    this.getExam();
  },
  methods: {
    toQuestion(item) {
      // 跳转到question页面
      uni.navigateTo({
        url: '/subpkg/dopracitce/dopracitce?examname=' + item
      });
    },
    async getExam() {
      let result = await getExamName();
      if (result.status !== 200) {
        return uni.showToast({
          title: '获取数据失败',
          icon: 'none'
        });
      }
      this.examname = result.message;
    }
  }
}
</script>

<style lang="scss">
/* 为直接子元素添加样式 */
body {
  background-color: #f4f4f4;
}

view {
  .all {
    display: block;
    padding: 10px;
    margin: 10px;
    border: 1px solid #0d8afd;
    background-color: #fff;
    border-radius: 5px;
  }

  /* 为整个列表添加样式 */
  &:first-child {
    margin-top: 10px;
  }

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
