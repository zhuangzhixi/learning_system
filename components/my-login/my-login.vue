<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- 登录按钮 -->
    <button type="primary" class="btn-login" bindtap="getUserProfile" @click="getUserProfile()">一键登录</button>
    <!-- 登录提示 -->
    <view class="tips-text">登录后尽享更多权益</view>
  </view>
</template>
<script>
import {
  mapMutations
} from 'vuex'
import {
  userLogin
} from '@/api/user.js'
export default {
  name: "my-login",
  data() {
    return {

    };
  },
  mounted() {
    let that = this;
    //获取code
    uni.login({
      success: (res) => {
        that.code = res.code;
        // console.log("wx.login的code");
        // console.log(that.code);
      },
    });
  },
  methods: {
    ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),

    //获取用户信息
    getUserProfile(e) {
      // console.log("获取用户信息");
      // console.log(e);
      let that = this;
      uni.getUserProfile({
        desc: "用于完善会员资料",
        success: async (res) => {
          // console.log("获取用户信息成功");
          // console.log(res);
          //展示手机号获取授权
          // this.show = true;
          // 获取token
          // console.log("获取code");
          // console.log(that.code);
          const query = {
            code: that.code,
          }
          let result = await userLogin(that.code);
          // const result = await uni.$http.post('/api/user/token', query)
          // console.log("获取token");
          // console.log(result);
          // 保存用户信息到本地
          res.userInfo.birth = "";
          that.updateUserInfo(res.userInfo);
          that.updateToken(result.token);
          uni.navigateBack({
            delta: 1
          });
        },
        fail: err => {
          uni.$showMsg('您取消了登录授权！')
        }
      })
    },
  }
}
</script>

<style lang="scss">
.login-container {
  // 登录盒子的样式
  height: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  position: relative;
  overflow: hidden;

  // 绘制登录盒子底部的半椭圆造型
  &::after {
    content: ' ';
    display: block;
    position: absolute;
    width: 100%;
    height: 40px;
    left: 0;
    bottom: 0;
    background-color: white;
    border-radius: 100%;
    transform: translateY(50%);
  }

  // 登录按钮的样式
  .btn-login {
    width: 90%;
    border-radius: 100px;
    margin: 15px 0;
    background-color: #c00000;
  }

  // 按钮下方提示消息的样式
  .tips-text {
    font-size: 12px;
    color: gray;
  }
}
</style>