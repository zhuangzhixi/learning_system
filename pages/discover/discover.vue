<template>
  <view>
    <!-- 导航栏 -->
    <u-navbar :safeAreaInsetTop="true" leftIcon="plus" @leftClick="publish" title="论坛" :fixed="true"
      left-text=" "></u-navbar>
    <!-- 电池电量等信息的区域 -->
    <view class="navbarheight"></view>
    <!-- 轮播图 -->
    <u-swiper :list="bannerlist2" keyName="src" showTitle circular indicator indicatorMode="line"
      @click="openpage"></u-swiper>
    <!-- 标签栏 -->
    <u-sticky bgColor="#fff" :offsetTop="htop"><u-tabs :list="tablist" @click="changetabitem"></u-tabs></u-sticky>
    <!-- 内容主体区域 -->
    <view class="listitem" v-for="(page, index) in tablist" :key="index">
      <newsPage v-show="tabIndex == page.id - 1" class="page-item" :nowindex="nowindex" :nid="page.id" ref="page">
      </newsPage>
    </view>
    <!-- 一键回到顶部 -->
    <u-back-top :scroll-top="scrollTop"></u-back-top>

  </view>
</template>

<script>
import { getNotice, getOtherNews } from '@/api/user.js';
import newsPage from './news-page.vue';
const app = getApp();
export default {
  components: {
    newsPage
  },
  data() {
    return {
      nowindex: 1,
      //轮播图数据，后面要从后台获取
      myUrl: app.globalData.site_h5url,
      bannerlist: [],
      htop: 50,
      tablist: [
        {
          id: 1,
          name: '最新帖子', //最后回复时间 lastpost 倒序
        },
        {
          id: 2,
          name: '最多访问', //views 倒序 精华收藏时间
        },
        {
          id: 3,
          name: '最多回复', //replies 倒序
        },
        {
          id: 4,
          name: '最多收藏', //favtimes倒序
        }
      ],
      scrollTop: 0,
      tabIndex: 0,
    };
  },
  computed: {
    bannerlist2() {
      return this.bannerlist.map(item => {
        return {
          title: item.title,
          src: this.myUrl + 'images/discover/' + item.image,
          id: item.id
        }
      })
    }
  },
  onLoad() {
    this.getNotice();
  },

  // onReady() {
  //   this.pageList = this.$refs.page;
  //   this.switchTab(this.tabIndex);
  // },
  // 原无幻灯之前的右上角
  onPageScroll(e) {//在页面滚动时触发
    this.scrollTop = e.scrollTop;
  },
  // onReachBottom(e) {//在页面上拉触底事件的处理函数
  //   this.loadTabData(this.tabIndex);
  // },
  methods: {
    publish() {
      uni.navigateTo({
        url: '/subpkg/post/post'
      });
    },
    openpage(index) {
      uni.navigateTo({
        url: '/subpkg/zxdetail/zxdetail?id=' + this.bannerlist2[index].id
      });
    },
    async getNotice() {
      let result = await getNotice();
      if (result.status !== 200) {
        return uni.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
      }
      this.bannerlist = result.message;
    },
    changetabitem(index) {
      this.nowindex = index.id;
    },
  }
}
</script>

<style lang="scss">
.navbarheight {
  height: 44px;
  padding-top: var(--status-bar-height); //状态栏是显示信号强度、电池电量等信息的区域
}

.listitem {
  width: 100%;
  height: 100%;
}
</style>
