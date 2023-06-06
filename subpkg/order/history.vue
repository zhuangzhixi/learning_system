<template>
  <view>
    <!-- 课程列表 -->
    <view @click="viewLiveInfo(item.id)" class="live-list" v-for="(item, index) in course_info" :key="index">
      <!-- 课程图片 -->
      <view class="live-list-img-wrap">
        <image class="live-list-img" :src="myUrl + 'images/class/' + item.image" mode="aspectFill"></image>
      </view>
      <!-- 课程信息 -->
      <view class="live-list-info">
        <!-- 课程名称 -->
        <view class="live-c-title">{{ item.classname }}</view>
        <view class="live-teacher-price">
          <!-- 课程老师图片 -->
          <image class="live-teacher-avatar" :src="myUrl + 'images/teacher/' + item.teacherimage" mode="aspectFill">
          </image>
          <!-- 课程老师名称 -->
          <text class="teacher-name">{{ item.teachername }}</text>
        </view>
      </view>
      <!-- 浏览时间 -->
      <view class="live-list-time">
        <text class="live-list-time-txt">{{ item.time }}</text>
      </view>
    </view>
    <!-- 无数据时显示 -->
    <template v-if="kongkong == true">
      <view class="xiangziwrap">
        <image class="xiangzi" src="../../static/images/xiangzi.png" mode="aspectFill"></image>
        <text class="xiangzi_txt">暂无相关课程</text>
      </view>
    </template>
  </view>
</template>

<script>
import { gethistory } from '@/api/user.js';
const app = getApp();
export default {
  data() {
    return {
      myUrl: app.globalData.site_h5url,
      course_info: [],
      kongkong: false,
    };
  },
  onLoad() {
    this.GetCourseList();
  },
  methods: {
    async GetCourseList() {
      let that = this;
      let result = await gethistory();
      if (result.status != 1) {
        that.kongkong = false;
        that.course_info = result.message;

        if (that.course_info.length == 0) {
          that.kongkong = true;
        }
      } else {
        that.kongkong = true;
      }
    },
    viewLiveInfo(id) {
      uni.navigateTo({
        url: '/subpkg/class_detail/class_detail?id=' + id,
      });
    },
  }

}
</script>

<style lang="scss">
.live-list {
  width: 90%;
  height: 190rpx;
  margin: 30rpx auto;
  border-radius: 8rpx;
  background-color: #FFFFFF;

  .live-list-img-wrap {
    position: relative;
    width: 31%;
    height: 160rpx;
    float: left;
    margin-right: 6rpx;
    margin-top: 20rpx;

    .live-list-img {
      width: 100%;
      height: 100%;
      border-radius: 8rpx;
    }
  }

  .live-list-info {
    float: left;
    width: 30%;
    height: 160rpx;
    margin-left: 15rpx;

    .live-c-title {
      font-weight: bold;
      overflow: hidden;
      height: 70rpx;
      line-height: 1.3em;
      -webkit-line-clamp: 2;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      margin-top: 20rpx;
    }

    .live-teacher-price {
      display: flex;

      .live-teacher-avatar {
        width: 35rpx;
        height: 35rpx;
        border-radius: 50%;
        margin-top: 20rpx;
      }

      .teacher-name {

        margin-left: 15rpx;
        font-size: 20rpx;
        color: #323232;
        width: auto;
        margin-top: 22rpx;
      }

    }

  }

  .live-list-time {
    float: left;
    width: 34%;
    height: 160rpx;
    margin-top: 20rpx;

    .live-list-time-txt {
      line-height: 160rpx;
      font-weight: bold;
      font-size: 20rpx;
      color: #323232;
      text-align: right;
    }

  }
}

.xiangziwrap {
  position: absolute;
  left: calc(50% - 50px);
  top: calc(50% - 170px);
  width: 200rpx;
  height: 100rpx;

  .xiangzi {
    margin-left: 50rpx;
    width: 100rpx;
    height: 100rpx;
  }

  .xiangzi_txt {
    width: 100%;
    display: block;
    text-align: center;
    font-size: 18rpx;
    color: #C7C7C7;
  }


}
</style>
