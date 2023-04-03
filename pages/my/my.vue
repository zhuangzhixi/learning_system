<template>
  <view class="user">
    <!-- 个人信息 -->
    <view class="header" @click="userDetail">
      <view class="head-left">
        <image :src="userInfo.avatarUrl || '/static/missing-face.png'"></image>
      </view>
      <view class="head-right" v-if="userInfo.nickName">
        <view class="user-name">{{ userInfo.nickName }}</view>
      </view>
      <view class="head-right" v-else>
        <view class="user-name">登录/注册</view>
      </view>
      <u-icon style="display: flex;align-items: flex-start;" name="arrow-right"></u-icon>
    </view>
    <tools></tools>
  </view>
</template>
<script>
import tools from '@/components/my-user-tools/my-user-tools.vue'
// 1. 从 vuex 中按需导入 mapState 辅助函数
export default {
  data() {
    return {
      userInfo: {},
    };
  },
  components: {
    tools,
  },
  mounted() {
    let that = this;
    //获取code
    uni.login({
      success: (res) => {
        that.code = res.code;
        console.log("wx.login的code");
        console.log(that.code);
      },
    });
  },
}
</script>

<style lang="scss" scoped>
.user {
  .header {
    max-width: 100%;
    height: 300rpx;
    background-size: cover;
    border-bottom-left-radius: 30rpx;
    border-bottom-right-radius: 30rpx;
    background-image: url("/static/img/main-bg.png");
    background-position: bottom;
    background-repeat: no-repeat;
    color: #ffffff;
    display: flex;
    justify-content: space-between;

    .head-left {
      margin-left: 50rpx;
      width: 152rpx;
      position: relative;
      display: flex;
      align-items: center;

      image {
        width: 152rpx;
        height: 144rpx;
        border-radius: 50%;
        margin-bottom: 30rpx;
        border: 3px solid #fff;
      }
    }

    .head-right {
      flex: 1;
      display: flex;
      align-items: center;
      margin-left: 50rpx;

    }
  }

  .order {
    border-radius: 20rpx;
    background: #fff;
    margin: -40rpx 20rpx 40rpx 20rpx;
    height: 200rpx;
    text-align: center;
    font-size: 25rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 3%;
    color: #999;

    .order-item {
      display: flex;
      flex-direction: column;
      position: relative;
      width: 96rpx;
      height: 140rpx;

      .bag {
        width: 70rpx;
        height: 70rpx;
        border-radius: 50%;
        margin: 20rpx auto;
      }
    }

  }
}

.bag1 {
  background: #ff4a48;
}

.bag2 {
  background: #ff992f;
}

.bag3 {
  background: #009ee0;
}

.bag4 {
  background: #00d5d5;
}

.bag5 {
  background: #28ccb0;
}
</style>