<template>
  <view class="page">
    <template v-if="type == 2">
      <view class="video-wrap">
        <video class="video-wrap" :src="url1" :poster="thumb" controls="true"></video>
      </view>
    </template>
    <!-- <template v-else-if="type == 3">
      <view class="video-wrap3">
        <image :src="thumb" class="video-wrap">
        </image>
        <imt-audio autoplay class="imtaudio" :src="url"></imt-audio>
      </view>
    </template>
    <template v-else></template> -->
    <view class="cdetail-all-wrap">
      <view class="content-title">{{ name }}</view>
      <view class="content-des">{{ des }}</view>
      <view class="content-time">{{ adddtime }}</view>
      <view class="line"></view>
      <view class="content-wrap">
        <rich-text class="content" :nodes="content"></rich-text>
      </view>

    </view>
  </view>
</template>

<script>
const app = getApp();
export default {
  data() {
    return {
      live_info: {},
      name: '英文课1',
      adddtime: '2023-04-13',
      content: '广东工业大学大四综合英语课堂今日开课，主要讲四六级考试的听力，阅读，写作，口语等内容，欢12312312311213213213132迎大家来听课，欢12312312311213213213132迎大家来听课',
      des: '广东工业大学大四综合英语课堂',
      url1: app.globalData.site_h5url + 'video/video.mp4',
      type: 2,
      thumb: app.globalData.site_h5url + 'images/class/floor11.webp',
      duration: '',
      currentTime: 0,
      videoContext: '',
      buttonimage: '',
      status: 1,
      start: '',
      end: ''

    }
  },
  onLoad(option) {

  },
  methods: {
  }
}
</script>

<style>
.page {
  width: 100%;
}

.button {
  margin-top: 20rpx;
  width: 80rpx;
  height: 80rpx;

}

.mm {
  padding-left: 20rpx;
}

.ss {
  padding-right: 20rpx;
}

.hidden {
  position: fixed;
  z-index: -1;
  width: 1upx;
  height: 1upx;
}

.slider-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 26upx;
  color: #999;
}

.slider {
  padding-left: 20rpx;
  padding-right: 20rpx;
  width: 100%;
}


.live-all-wrap {
  background-color: #F4F5F6;
}

.video-wrap {
  text-align: center;
  width: 100%;
  height: 400rpx;
  background-color: #000000;
}

.video-wrap3 {
  text-align: center;
  width: 100%;
  height: 550rpx;
}

.audio {
  width: 92%;
  height: 40rpx;
  padding-left: 10rpx;
  padding-right: 10rpx;
}

.cdetail-all-wrap {
  width: 92%;
  padding-left: 10rpx;
  /* margin-top: 20rpx; */
}

.line {
  background-color: #F5F5F5;
  height: 1rpx;
  position: absolute;
  left: 20rpx;
  right: 20rpx;
  margin-top: -20rpx;

}

.content-title {
  height: 40rpx;
  font-weight: bold;
  margin-left: 20rpx;
}

.content-des {
  margin-top: 20rpx;
  margin-left: 20rpx;
  color: #969696;
  font-size: 20rpx;
}

.content-time {
  margin-left: 20rpx;
  font-size: 20rpx;
  color: #969696;
  margin-top: 10rpx;
  margin-bottom: 40rpx;
}

.content-wrap {
  margin-left: 20rpx !important;
}
</style>
