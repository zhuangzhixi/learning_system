<template>
  <view>

    <view>
      <view class="box-bg">
        <uni-nav-bar leftWidth="230rpx" :border="false" rightWidth="0rpx">
          <!-- 备考冲刺系统字体 -->
          <block slot="left">
            <view class="city">
              <view class="check_class">
                <text class="uni-nav-bar-text" @click="changechose">备考冲刺系统</text>
              </view>
            </view>
          </block>
          <!-- 输入框 -->
          <view v-if="chose" class="input-view" @click="search">
            <uni-icons class="input-uni-icon" type="search" size="18" color="#999" />
            <input confirm-type="search" class="nav-bar-input" type="text" placeholder="搜索课程/老师" @confirm="confirm" />
          </view>
        </uni-nav-bar>
      </view>
      <chose v-if="!chose"></chose>
      <scroll-view v-else class="index-all-wrap" scroll-y="true" :style="'height:' + scrollH + 'rpx;'">
        <!-- 轮播图的区域 -->
        <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
          <swiper-item v-for="(item, i) in floorList" :key="i">
            <navigator class="swiper-item" :url="'/subpkg/class_detail/class_detail?id=' + item.product_list[0].id">
              <image :src="myUrl + 'images/class/' + item.product_list[0].image"></image>
            </navigator>
          </swiper-item>
        </swiper>
        <!-- 楼层的容器 -->
        <view class="floor-list">
          <!-- 每一个楼层的 item 项 -->
          <view class="floor-item" v-for="(item, i) in floorList" :key="i">
            <!-- 楼层的标题 -->
            <rich-text :nodes="`<h3>${item.floor_title}</h3>`"></rich-text>
            <!-- 楼层的图片区域 -->
            <view class="floor-img-box">
              <!-- 每一个图片的 item 项 -->
              <navigator class="floor-img-item" v-for="(item2, i2) in item.product_list" :key="i2"
                :url="'/subpkg/class_detail/class_detail?id=' + item2.id">
                <!-- encodeURIComponent(JSON.stringify(item2)) -->
                <image :src="myUrl + 'images/class/' + item2.image"></image>
                <text>{{ item2.classname }}</text>
              </navigator>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
const app = getApp();
export default {
  data() {
    return {
      //域名
      myUrl: app.globalData.site_h5url,
      scrollH: 0,
      // 这是轮播图的数据列表
      swiperList: [],
      // 楼层的数据
      floorList: [],
      chose: '',
    };
  },
  onLoad() {
    // 调用方法，获取轮播图的数据
    this.getSwiperList();
    this.getFloorList()
  },
  onReady() {
    let that = this;
    uni.getSystemInfo({
      success: function (res) {
        that.scrollH = res.windowHeight * 750 / res.windowWidth;
        // #ifdef MP-WEIXIN
        that.scrollH = res.windowHeight * 750 / res.windowWidth - parseInt(res.safeArea.top) - 30;
        // #endif
      }
    });
  },
  methods: {
    async getSwiperList() {
      const { data: res } = await uni.$http.get(
        "/api/home/swiperdata"
      );
      if (res.meta.status !== 200) return uni.$showMsg();
      this.swiperList = res.message;
    },
    // 获取首页楼层数据的方法
    async getFloorList() {
      const { data: res1 } = await uni.$http.get('/api/question/get_subject')
      this.chose = res1.message[0].chose;
      const { data: res } = await uni.$http.get('/api/home/floordata')
      if (res.meta.status !== 200) return uni.$showMsg()
      this.floorList = res.message
    },
    search() {
      uni.navigateTo({
        url: "/subpkg/search/search"
      });
    },
    changechose() {
      this.chose = !this.chose;
    }
  },
};
</script>

<style lang="scss">
$nav-height: 30px; //$nav-height是变量名，而30px是变量的值，以便在整个样式表中轻松重用它们

.box-bg {
  width: 96%;
  height: 100rpx;
  padding-top: 30rpx;
  // position: fixed;
  top: 0;
  left: 6rpx;
  z-index: 999;
  background-color: #fff;
}

.check_class {
  color: #2C62EF !important;
  font-size: 34rpx;
  font-weight: bold;
  display: inline-block;
  width: 230rpx;
}

.city {
  /* #ifndef APP-PLUS-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  // width: 160rpx;
  margin-left: 4px;
}

.input-view {
  /* #ifndef APP-PLUS-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  // width: 500rpx;
  flex: 1;
  background-color: #f8f8f8;
  height: $nav-height;
  border-radius: 15px;
  padding: 0 15px;
  flex-wrap: nowrap;
  margin: 7px 0;
  line-height: $nav-height;
}

.input-uni-icon {
  line-height: $nav-height;
}

.nav-bar-input {
  height: $nav-height;
  line-height: $nav-height;
  /* #ifdef APP-PLUS-NVUE */
  width: 370rpx;
  /* #endif */
  padding: 0 5px;
  font-size: 12px;
  background-color: #f8f8f8;
}

.index-all-wrap {
  width: 94%;
  margin: 0 auto;
}

swiper {
  // margin-top: 120rpx;
  height: 330rpx;

  .swiper-item,
  image {
    width: 100%;
    height: 100%;
  }
}

.floor-item {
  margin-top: 25rpx;

  .floor-title {
    // 楼层的标题
    width: 100%;
    height: 60rpx;
  }

  .floor-img-box {
    // 楼层的图片区域
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 10rpx;

    .floor-img-item {
      // 每一个图片外的链接
      position: relative;
      width: 48%;
      height: 200rpx;

      image {
        width: 100%;
        height: 100%;
      }

      text {
        position: absolute;
        font-weight: bold;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        color: red;
        z-index: 999;
      }
    }
  }
}
</style>
