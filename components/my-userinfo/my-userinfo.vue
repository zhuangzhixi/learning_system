<template>
  <view class="my-userinfo-container">

    <!-- 头像昵称区域 -->
    <view class="top-box">
      <image :src="userInfo.avatarUrl" class="avatar"></image>
      <view class="nickname">{{ userInfo.nickName }}</view>
    </view>
    <!-- 功能区域 -->
    <view class="order">
      <view class="order-item" @click="navigateTo('/subpkg/order/myOrder')">
        <view class="bag bag2">
          <u-icon name="calendar-fill" size="30" color="#fff"></u-icon>
        </view>
        <view class="item-name">我的课程</view>
        <uni-icons class="ar" type="arrowright" size="15"></uni-icons>
      </view>
      <view class="order-item" @click="navigateTo('/subpkg/dopracitce/dopracitce?worsequestion=1')">
        <view class="bag bag3">
          <u-icon name="bookmark-fill" size="30" color="#fff"></u-icon>
        </view>
        <view class="item-name">错题</view>
        <uni-icons class="ar" type="arrowright" size="15"></uni-icons>
      </view>
      <view class="order-item" @click="navigateTo('/subpkg/dopracitce/dopracitce?collectfunction=1')">
        <view class="bag bag4">
          <u-icon name="star-fill" size="30" color="#fff"></u-icon>
        </view>
        <view class="item-name">收藏</view>
        <uni-icons class="ar" type="arrowright" size="15"></uni-icons>
      </view>
      <view class="order-item" @click="navigateTo('/subpkg/backtime/backtime')">
        <view class="bag bag5">
          <u-icon name="hourglass-half-fill" size="30" color="#fff"></u-icon>
        </view>
        <view class="item-name">倒计时</view>
        <uni-icons class="ar" type="arrowright" size="15"></uni-icons>
      </view>
      <view class="order-item" @click="navigateTo('/subpkg/order/history')">
        <view class="bag bag1">
          <u-icon name="clock-fill" size="30" color="#fff"></u-icon>
        </view>
        <view class="item-name">历史足迹</view>
        <uni-icons class="ar" type="arrowright" size="15"></uni-icons>
      </view>
      <view class="order-item" @click="logout">
        <view class="bag bag6">
          <u-icon name="more-dot-fill" size="30" color="#fff"></u-icon>
        </view>
        <view class="item-name">退出登录</view>
        <uni-icons class="ar" type="arrowright" size="15"></uni-icons>
      </view>
    </view>

  </view>
</template>

<script>
// 按需导入辅助函数
import { mapState, mapMutations } from 'vuex'

export default {
  name: "my-userinfo",
  data() {
    return {

    };
  },
  computed: {
    // 将 m_user 模块中的 userinfo 映射到当前页面中使用
    ...mapState('m_user', ['userInfo']),
  },
  methods: {
    ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateAddress']),
    // 退出登录
    async logout() {
      // 询问用户是否退出登录
      const [err, succ] = await uni.showModal({
        title: '提示',
        content: '确认退出登录吗？'
      }).catch(err => err)

      if (succ && succ.confirm) {
        // 用户确认了退出登录的操作
        // 需要清空 vuex 中的 userinfo、token 和 address
        this.updateUserInfo({})
        this.updateToken('')
        this.updateAddress({})
      }
    },
    navigateTo(url) {
      uni.navigateTo({
        url
      })
    }
  }
}
</script>

<style lang="scss">
.my-userinfo-container {
  height: 100%;
  // 为整个组件的结构添加浅灰色的背景
  background-color: #f4f4f4;

  .top-box {
    height: 400rpx;
    // background-color: #c00000;
    background-color: #73ade3;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .avatar {
      display: block;
      width: 90px;
      height: 90px;
      border-radius: 45px;
      border: 2px solid white;
      box-shadow: 0 1px 5px black;
    }

    .nickname {
      color: white;
      font-weight: bold;
      font-size: 16px;
      margin-top: 10px;
    }
  }

  .order {
    border-radius: 20rpx;
    background: #fff;
    margin: -40rpx 20rpx 40rpx 20rpx;
    // height: 200rpx;
    text-align: center;
    font-size: 40rpx;

    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    padding: 0 3%;
    color: #999;

    .order-item {
      display: flex;
      // flex-direction: column;
      position: relative;
      align-items: center;
      // width: 96rpx;
      width: 100%;
      height: 100rpx;
      border-bottom: 1px solid #eee;

      .bag {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        // margin: 20rpx auto;
        margin: auto 20rpx;
      }

      .ar {
        position: absolute;
        right: 0;
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

  .bag6 {
    background: #565857;
  }
}
</style>