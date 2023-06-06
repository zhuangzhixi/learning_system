<template>
  <view>
    <view class="line"></view>
    <scroll-view class="s-all-wrap" scroll-y :style="'height:' + scrollH + 'rpx;'">
      <view class="search-all-wrap">
        <view class="search-wrap">
          <!-- 搜索框 -->
          <image class="search_home" src="@/static/images/search_home.png"></image>
          <input v-model="sdata" class="uni-input" @input="onInput" focus confirm-type="search" placeholder="搜索课程, 老师"
            placeholder-style="color:#C7C7C7;" />
        </view>
        <text @click="resetSearch" class="reset-search">取消</text>
      </view>
      <!-- 搜索结果 -->
      <view v-if="kongkong == false" class="search-history" :class="{ showsearch: (isShowHis == true) }">
        <template v-if="teacherList">
          <template v-if="teacherList.length > 0">
            <view class="teacher">
              <view class="search-title-wrap search-title-wrap2">
                <text class="s-teacher-title">相关老师</text>
                <text @click="viewmoreteacher" class="s-more-view">查看更多</text>
                <image mode="aspectFit" class="back_image back_image2" src="../../static/navi_backImg@2xxx.png"></image>
              </view>
              <view class="search-teacher-info">
                <view @click="viewTeacherInfo(item.id)" class="search-teacher-item" v-for="(item, index) in teacherList"
                  :key="item.id">
                  <view class="row">
                    <image class="teacher-avatar" :src="item.avatar" mode="aspectFill"></image>
                    <text class="teachername">{{ item.user_nickname }}</text>
                    <image mode="aspectFit" class="back_image" src="../../static/navi_backImg@2xxx.png"></image>
                  </view>
                  <view class="line"></view>
                </view>
              </view>
            </view>
          </template>
        </template>

        <template v-if="courseList">
          <template v-if="courseList.length > 0">
            <view class="course">
              <view class="search-title-wrap">
                <text class="s-course-title">相关课程</text>
              </view>
              <!-- 课程列表 -->
              <view class="search-course-info">
                <!-- 每一课程item项 -->
                <view @click="viewLiveInfo(item.id)" class="live-list" v-for="(item, index) in courseList" :key="index">
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
                      <image class="live-teacher-avatar" :src="myUrl + 'images/teacher/' + item.teacherimage"
                        mode="aspectFill">
                      </image>
                      <!-- 课程老师名称 -->
                      <text class="teacher-name">{{ item.teachername }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </template>
        </template>
      </view>
      <template v-else>
        <view :class="{ xiangziwrap: (kongkong == true) }">
          <image class="xiangzi" src="../../static/images/xiangzi.png" mode="aspectFill"></image>
          <text class="xiangzi_txt">空空如也</text>
        </view>
      </template>
    </scroll-view>
  </view>
</template>

<script>
import { getSearchDetail } from '@/api/user.js';
const app = getApp();
export default {
  data() {
    return {
      myUrl: app.globalData.site_h5url,
      scrollH: 0,//滚动高度
      isShowHis: false,//支不支持查看更多
      kongkong: true,//是否显示空空如也
      sdata: '',//搜索框的内容
      teacherList: {},//老师列表
      courseList: {},//课程列表
    };
  },
  onLoad() {
    // this.GetCourseList('1');
  },
  onReady() {
    var that = this;
    uni.getSystemInfo({
      success: function (res) {
        that.scrollH = res.windowHeight * 750 / res.windowWidth;
      }
    });
  },
  methods: {
    async GetCourseList(data) {
      let that = this;
      let result = await getSearchDetail(data);
      if (result.status !== 1) {
        that.kongkong = false;
        that.courseList = result.message;
        if (that.courseList.length == 0) {
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
    resetSearch() {
      this.sdata = '';
      // this.searchKeyword = '';
      this.teacherList = {};
      this.courseList = {};
      this.isShowHis = false;
      // this.getHomeSearch(this.searchKeyword);
      uni.navigateBack({
        delta: 1
      });
      // this.getHomeSearch(this.searchKeyword);
    },
    onInput(e) {
      if (e.detail.value == '' || e.detail.value == null) {
        this.teacherList = {};
        this.courseList = {};
        this.isShowHis = false;
        this.kongkong = true;
      }
      // this.searchKeyword = e.detail.value;
      // 搜索方法
      else {
        this.GetCourseList(e.detail.value);//也可以用this.sdata
      }
    },
  }
}
</script>

<style lang="scss">
//最上文的横条
.line {
  width: 100%;
  height: 1rpx;
  background-color: #F5F5F5;
  position: relative;
}

//搜索页面
.s-all-wrap {
  position: relative;

  //搜索框
  .search-all-wrap {
    margin-top: 10rpx;
    width: 100%;
    height: 65rpx;
    line-height: 65rpx;

    //搜索框
    .search-wrap {
      width: 80%;
      height: 100%;
      line-height: 65rpx;
      border-radius: 30rpx;
      margin-left: 20rpx;
      padding-left: 20rpx;
      background-color: #F5F5F5;
      float: left;

      //搜索框里的图标/图片
      .search_home {
        float: left;
        margin-left: 5rpx;
        margin-top: 16rpx;
        width: 35rpx;
        height: 35rpx;
      }

      //搜索框里的input
      input {
        float: left;
        background-color: #F5F5F5;
        height: 100%;
        padding: 0;
      }
    }

    //取消按钮
    .reset-search {
      width: 10%;
      margin-left: 20rpx;
      float: left;
      color: #2C62EF;
    }
  }

  //显示搜索结果区域
  .search-history {
    margin-top: 70rpx;
    // display: none;

    //"相关课程"字样
    .search-title-wrap {
      width: 95%;
      margin: 0 auto;
      padding-left: 5%;
      height: 80rpx;
    }

    //"相关课程"字样
    .search-title-wrap .s-course-title {
      font-weight: bold;
      font-size: 28rpx;
    }

    //课程列表
    .search-course-info {
      margin-left: calc(2%);
      width: 96%;
      margin-top: 20rpx;

      /* margin: 0 auto; */
      // 每个课程的item
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
          width: 65%;
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
      }
    }


  }

  //显示搜索结果区域类2
  .showsearch {
    display: block;
  }

  .xiangziwrap {
    margin-top: calc(50%);
    position: relative;
    left: calc(50% - 80px);
    /* top: calc(50%); */
    width: 300rpx;
    height: 100rpx;

    .xiangzi {
      margin-left: 100rpx;
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
}


.dav {
  position: absolute;
  width: 30rpx;
  height: 30rpx;
  margin-top: 60rpx;
  left: 95rpx;
}

page {
  width: 100%;
  height: 100%;
  overflow: hidden;
}


.s-more-view {
  position: relative;
  left: -30rpx;
}

.back_image2 {
  margin-top: 16rpx;
}
</style>
