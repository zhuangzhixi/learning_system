<template>
  <view>
    <!-- 轮播图的区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, i) in swiperList" :key="i">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 楼层的容器 -->
    <view class="floor-list">
      <!-- 每一个楼层的 item 项 -->
      <view class="floor-item" v-for="(item, i) in floorList" :key="i">
        <!-- 楼层的标题 -->
        <rich-text nodes="<h3>{{item.floor_title}}</h3>"></rich-text>
        <!-- 楼层的图片区域 -->
        <view class="floor-img-box">
          <!-- 每一个图片的 item 项 -->
          <navigator class="floor-img-item" v-for="(item2, i2) in item.product_list" :key="i2" :url="item2.image">
            <image :src="item2.image"></image>
            <text>{{ item2.classname }}</text>
          </navigator>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 这是轮播图的数据列表
      swiperList: [],
      // 楼层的数据
      floorList: [],
    };
  },
  onLoad() {
    // 调用方法，获取轮播图的数据
    this.getSwiperList();
    this.getFloorList()
  },
  methods: {
    async getSwiperList() {
      const { data: res } = await uni.$http.get(
        "/api/public/v1/home/swiperdata"
      );
      if (res.meta.status !== 200) return uni.$showMsg();
      this.swiperList = res.message;
    },
    // 获取首页楼层数据的方法
    async getFloorList() {
      const { data: res } = await uni.$http.get('/api/public/v1/home/floordata')
      if (res.meta.status !== 200) return uni.$showMsg()
      this.floorList = res.message
    },
  },
};
</script>

<style lang="scss">
swiper {
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
