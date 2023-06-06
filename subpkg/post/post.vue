<template>
  <view class="index1">
    <!-- 导航栏 -->
    <u-navbar :safeAreaInsetTop="true" title="发布主题" :fixed="false" :autoBack="true" left-text=" "></u-navbar>
    <!-- 选择考试类别 -->
    <view class="form-area" style="height: auto;">
      <text class="label">选择考试类别</text>
      <picker mode="selector" :range="array" @change="bindPickerChange">
        <view class="picker">
          {{ array[index] }}
        </view>
      </picker>
    </view>
    <!-- 标题框 -->
    <view class="title">
      <input class="title-input" type="text" v-model="title" placeholder="标题" />
    </view>
    <!-- 内容框 -->
    <view class="form-area">
      <textarea class="textarea" placeholder-style="font-size:14px" v-model="message" placeholder="输入主题内容" />
    </view>
    <!-- 提交发布按钮 -->
    <view class="post-area">
      <text class="btn" @click="post">提交发布</text>
    </view>
  </view>
</template>

<script>
import { saveNews } from '@/api/user.js';
export default {
  data() {
    return {
      title: "",
      message: "",
      forumfid: 0,
      index: 0,
      array: ['请选择', '英文', '计算机', '经济']
    }
  },
  onLoad() {
    // this.getForums()
    // this.refresh();
  },
  methods: {
    refresh() {
      try {
        //读取本地缓存
        let t = JSON.parse(uni.getStorageSync('lifeData'));
        if (t && t.vuex_uid > 0) {
          this.vuex_uid = t.vuex_uid;
          this.vuex_access_token = t.vuex_access_token;
          this.vuex_userinfo = t.vuex_userinfo;
        } else {
          uni.navigateBack({});
        }
      } catch (e) {
        uni.navigateBack({});
      }
    },
    //发布
    async post() {
      if (!this.title || !this.message) {
        uni.showToast({
          title: "填写标题和内容",
          icon: 'error'
        })
        return;
      }
      if (this.index == 0) {
        uni.showToast({
          title: "必须选择主题",
          icon: 'error'
        })
        return;
      }
      let result = await saveNews({
        type: this.array[this.index],
        title: this.title,
        content: this.message,
        user: 'Team',
        time: new Date().getTime() / 1000,
      });
      uni.navigateBack({
        delta: 1
      });

    },

    bindPickerChange(e) {
      this.index = e.detail.value
    },
  }
}
</script>

<style lang="scss">
.picker-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: #f5f5f5;
}

.picker {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 18px;
  color: #333;
}

view {
  display: flex;
  flex-direction: column;
}

.title {
  margin: 8px;
}

.title-input {
  height: 35px;
  padding-left: 8px;
  border: 1px solid #f1f1f1;
  font-size: 14px;
}

.form-area {
  margin: 10px 8px;
  padding: 8px;
  height: 200px;
  font-size: 14px;
  line-height: 1.5;
  border: 1px solid #f1f1f1;
}



.post-area {
  flex-direction: row;
  justify-content: center;
}

.btn {
  text-align: center;
  width: 150px;
  padding: 8px;
  background-color: #07C160;
  justify-content: center;
  align-items: center;
  color: #ffffff;
}
</style>