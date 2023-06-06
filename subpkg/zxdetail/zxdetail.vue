<template>
  <view class="content" @touchstart="touchS" @touchmove="touchM" @touchend="touchE">
    <!-- 标题 -->
    <view class="subject">
      <text class="subject_text">{{ body['title'] }}</text>
    </view>
    <!-- 作者信息 -->
    <view class="metainfo" @click="golist(body['fid'])">
      <!-- 收藏功能、作者所在的那行 -->
      <view class="h-flex-x">
        <text class="metainfo_text" style="margin-right: 100rpx;">{{ body['user'] }} {{ langvars['v2'] }} {{
          formattedTime }}</text>
        <!-- 收藏功能 -->
        <view @tap="addFavorite">
          <view class="h-flex-x" v-if="body.issoucan">
            <uni-icons type="star-filled" size="18" color="#f2ce1b"></uni-icons>
            <text style="padding-left: 10rpx;">已收藏</text>
          </view>
          <view class="h-flex-x" v-else>
            <uni-icons type="star" size="18" color="#666"></uni-icons>
            <text style="padding-left: 10rpx;">收藏</text>
          </view>
        </view>
      </view>


    </view>

    <!-- 分类信息 -->
    <!-- <view class="fenlei" v-if="body['fenlei'] && body['fenlei'].length > 0">
      <view class="fenlei_item" v-for="(item, index) in body['fenlei']" :key="index">
        <text class="name">{{ item.name }}:</text>
        <text class="value">{{ item.value ? item.value : '-' }}</text>
      </view>
    </view> -->

    <!-- 正文文字 -->
    <view class="body">
      <text class="bodytext" style="text-indent: 2em;word-break: break-all;">{{ body.content }}</text>
    </view>
    <!-- 图片 -->
    <!-- <block v-if="body.tupian && body.tupian.length > 0">
      <view v-for="(item, index) in body.tupian" :key="index" class="imgwrap" :style="'width:' + (width - 10) + 'px'">
        <image @click="preview(item)" :src="item" mode="widthFix"></image>
      </view>
    </block> -->

    <view class="pinlun">
      <!-- 回复框 -->
      <view class="replytextarea">
        <textarea class="textarea" :disabled="vuex_uid < 1 ? true : false" placeholder-style="font-size:14px"
          v-model="message" @focus="islogin" :placeholder="vuex_uid > 0 ? langvars['v22'] : langvars['v1']" />
      </view>
      <view class="replybtn_wrap">
        <button class="replybtn" type="primary" @click="postReply()">
          <text class="replybtn_text">{{ vuex_uid > 0 ? langvars['v21'] : langvars['v1'] }}</text>
        </button>
      </view>
      <!-- 最新回复 -->
      <view class="list-item" v-if="newmessage">
        <text class="item-meta red">{{ langvars['v9'] }}</text>
        <text class="item-body bodytext">{{ newmessage }}</text>
      </view>
    </view>


    <!-- 评论列表 -->
    <view class="replylist" v-if="list.length > 0">
      <view class="list-item" v-for="(item, index) in list" :key="index">
        <text class="item-meta">{{ item.author }} {{ item.dateline }}</text>
        <view>
          <text class="bodytext">{{ item.message }}</text>
          <block v-if="item.tupian && item.tupian.length > 0">
            <image @click="preview(item)" v-for="(item, index) in item.tupian" :key="index" :src="item" mode="aspectFit">
            </image>
          </block>
        </view>
      </view>
      <text id="loading" class="loading" v-if="loading">{{ loadtext }}</text>
    </view>
    <u-back-top :scroll-top="scrollTop"></u-back-top>
  </view>
</template>

<script>
import config from '@/common/config.js';
import { getNewsDetail, collectNews } from '@/api/user.js';
export default {
  data() {
    return {
      tid: 0,
      fid: 0,
      title: '',
      vuex_uid: 0,
      width: 0,
      timeid: null,
      startX: 0,
      startY: 0,
      vuex_access_token: '',
      vuex_userinfo: {},
      langvars: {},
      body: {
        // pid: '1',
        // fid: '1',
        // tid: '1',
        // first: '1',
        // author: 'admin',
        // authorid: '1',
        // isFavorite: 1,
        // subject: '2023年考研英语时间通知',
        // dateline: '2023-02-05 15:05:36',
        // message: '2023年考研英语时间通知2023年考研英语时间通知2023年考研英语时间通知2023年考研英语时间通知2023年考研英语时间通知',
        // useip: 'useip',
        // port: 'port',
        // invisible: '0',
        // anonymous: '0',
        // usesig: '1',
        // htmlon: '0',
        // bbcodeoff: '0',
        // smileyoff: '-1',
        // parseurloff: '0',
        // attachment: '2',
        // rate: '13',
        // ratetimes: '11',
        // status: '0',
        // tags: '',
        // comment: '0',
        // replycredit: '0',
        // position: '1',
        // hasfavore: '0',
        // fenlei: [],
        // fujian: [],
        // tupian: []
      }, //正文信息
      list: [], //评论列表
      page: 1,
      loading: false,
      loadtext: '...',
      message: '', //回复输入框
      newmessage: '',
      percent: 0,
      showprogress: false,
      img: {
        mode: 'aspectFit',
        padding: 5
      },
      scrollTop: 0
    };
  },
  computed: {
    formattedTime() {
      let date = new Date(this.body.time * 1000);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();
      let result = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
      return result;
    }
  },
  onShareAppMessage(res) {
    return {
      title: title,
      path: '/pages/detail/detail?title=' + decodeURIComponent(this.title) + '&tid=' + this.tid
    }
  },
  onShow() {

    this.langvars = {
      // "v1": "请登录后回复",
      "v1": "回复",
      "v2": "发布于",
      "v3": "已收藏",
      "v4": "保存到相册",
      "v5": "取消",
      "v6": "回复至少大于",
      "v7": "发布中请稍等",
      "v8": "发布成功",
      "v9": "我刚刚发布的",
      "v10": "开始下载",
      "v11": "下载完成",
      "v12": "没有回复了",
      "v13": "出错了请重试",
      "v14": "年前",
      "v15": "月前",
      "v16": "天前",
      "v17": "小时前",
      "v18": "分钟前",
      "v19": "秒前",
      "v20": "收藏",
      "v21": "回复",
      "v22": "点评一下"
    };
    this.refresh();
    // uni.setNavigationBarTitle({
    //   title: this.title
    // });
  },
  onLoad(options) {
    this.tid = options.id;
    // this.title = decodeURIComponent(obj.title);
    this.getDetail();
    this.getList();
  },
  onUnload() {
    uni.$off('login');
  },
  onReachBottom() {
    this.getList();
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  methods: {
    // 添加收藏
    async addFavorite() {
      let favorite = this.body.issoucan;
      this.$set(this.body, "issoucan", 1 - favorite);
      let result = await collectNews({ id: this.tid, issoucan: 1 - favorite });
      if (result.status !== 200) return uni.$showMsg()
    },

    golist(fid, name) {
      uni.navigateTo({
        url: '../forum/forum-page?fid=' + fid + '&name=' + name
      });
    },
    touchS: function (e) {
      //判断是否只有一个触摸点
      if (e.touches.length == 1) {
        this.startX = e.touches[0].screenX;
        this.startY = e.touches[0].screenY;
      }
    },
    //触摸时触发，手指在屏幕上每移动一次，触发一次
    touchM: function (e) {
      if (e.changedTouches.length == 1) {
        //手指移动结束后触摸点位置的X坐标
        var endX = e.changedTouches[0].screenX; //触摸开始与结束，手指移动的距离
        var endY = e.changedTouches[0].screenY; //触摸开始与结束，手指移动的距离

        var disX = this.startX - endX;
        var disY = this.startY - endY;
        if (disX > 100 && disY < 100) {
          clearTimeout(this.timeid);
          this.timeid = setTimeout(() => {
            console.log('可以后退了');
            uni.navigateBack({
              delta: 1
            });
          }, 100);
        }
      }
    },
    touchE: function (e) {
      if (e.changedTouches.length == 1) {
        //手指移动结束后触摸点位置的X坐标
        var endX = e.changedTouches[0].screenX; //触摸开始与结束，手指移动的距离
        var endY = e.changedTouches[0].screenY; //触摸开始与结束，手指移动的距离

        var disX = this.startX - endX;
        var disY = this.startY - endY;

        if (disX > 100 && disY < 100) {
          clearTimeout(this.timeid);
          this.timeid = setTimeout(() => {
            uni.navigateBack({
              delta: 1
            });
          }, 100);
        }
      }
    },
    refresh() {
      try {
        let t = JSON.parse(uni.getStorageSync('lifeData'));
        if (t && t.vuex_uid > 0) {
          this.vuex_uid = t.vuex_uid;
          this.vuex_access_token = t.vuex_access_token;
          this.vuex_userinfo = t.vuex_userinfo;
        }
      } catch (e) {
      }
    },
    shuru(e) {
      this.message = e.value;
    },
    preview(url) {
      // #ifndef APP-PLUS
      uni.previewImage({
        urls: url,
        longPressActions: {
          // itemList: ['发送给朋友', '保存图片', '收藏'],
          success: function (data) {
            console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
          },
          fail: function (err) {
            console.log(err.errMsg);
          }
        }
      });
      // #endif
      // #ifdef APP-PLUS			
      clearTimeout(this.timeid);
      let self = this;
      plus.nativeUI.previewImage([url], {
        onLongPress: function (e) {
          // 预览界面长按显示ActionSheet

          var bts = [{ title: self.langvars['v4'] }];
          plus.nativeUI.actionSheet({ cancel: self.langvars['v5'], buttons: bts }, function (evt) {
            if (evt.index > 0) {
              plus.gallery.save(e.url, function () { }, function (err) { });
            }
          });
        }
      });
      // #endif
    },
    onProgress() { },
    islogin() {
      if (this.vuex_uid < 1) {
        uni.navigateTo({
          url: '../login/login'
        });
        return false;
      }
      return true;
    },
    download(url, name, index) {
      // #ifdef APP-PLUS
      let option = {
        method: 'GET',
        filename: '_downloads/' + name
      };

      let dtask = plus.downloader.createDownload(url, option, null);

      let self = this;
      dtask.addEventListener('statechanged', function (task, status) {
        if (!dtask) {
          return;
        }
        switch (task.state) {
          case 1: // 开始
            self.percent = 0;
            break;
          case 2: // 已连接到服务器
            self.percent = 0;
            break;
          case 3: // 已接收到数据
            break;

          case 4: // 下载完成
            let cover = 'file://' + plus.io.convertLocalFileSystemURL(task.filename);
            self.$set(self.body.tupian, index, cover);
            console.log('下载完毕:' + cover);
            break;
        }
      });
      dtask.start();
      // #endif
    },
    friendlyDate(timestamp) {
      var formats = {
        year: '%n% ' + this.langvars['v14'],
        month: '%n% ' + this.langvars['v15'],
        day: '%n% ' + this.langvars['v16'],
        hour: '%n% ' + this.langvars['v17'],
        minute: '%n% ' + this.langvars['v18'],
        second: '%n% ' + this.langvars['v19']
      };

      var now = Date.now();
      var seconds = Math.floor((now - timestamp) / 1000);
      var minutes = Math.floor(seconds / 60);
      var hours = Math.floor(minutes / 60);
      var days = Math.floor(hours / 24);
      var months = Math.floor(days / 30);
      var years = Math.floor(months / 12);

      var diffType = '';
      var diffValue = 0;
      if (years > 0) {
        diffType = 'year';
        diffValue = years;
      } else {
        if (months > 0) {
          diffType = 'month';
          diffValue = months;
        } else {
          if (days > 0) {
            diffType = 'day';
            diffValue = days;
          } else {
            if (hours > 0) {
              diffType = 'hour';
              diffValue = hours;
            } else {
              if (minutes > 0) {
                diffType = 'minute';
                diffValue = minutes;
              } else {
                diffType = 'second';
                diffValue = seconds === 0 ? (seconds = 1) : seconds;
              }
            }
          }
        }
      }
      return formats[diffType].replace('%n%', diffValue);
    },
    //获取帖子详情
    async getDetail() {
      // uni.request({
      //   url: config.apidomain + '/app/api.php?action=getBodyByTid',
      //   data: {
      //     tid: this.tid,
      //     uid: this.vuex_uid,
      //     access_token: this.vuex_access_token
      //   },
      //   success: result => {
      //     console.log(result.data);
      //     let res = result.data;
      //     if (res.code > 0) {
      //       uni.showToast({
      //         title: res.msg,
      //         icon: "none"
      //       })
      //     }

      //     res = res.data;
      //     res['dateline'] = this.friendlyDate(res['dateline'] * 1000);
      //     res['message'] = res['message'];
      //     this.fid = res['fid'];
      //     this.body = res;
      //     console.log(this.body.message);
      //   },
      //   fail: err => { }
      // });
      let result = await getNewsDetail(this.tid);
      this.body = result.message;

    },

    //应该是获取评论列表
    getList() {
      // return
      clearTimeout(this.timeid);
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.loadtext = '...';
      uni.request({
        url: config.apidomain + '/app/api.php?action=getPostByTid',
        data: {
          tid: this.tid,
          uid: this.vuex_uid,
          access_token: this.vuex_access_token,
          page: this.page
        },
        success: result => {
          let res = result.data;
          // console.log(res);
          // return;
          if (res.code > 0 || res.data.length < 1) {
            this.loadtext = this.langvars['v12'];
            return;
          }

          for (let i = 0, len = res.data.length; i < len; i++) {
            res.data[i]['dateline'] = this.friendlyDate(res.data[i]['dateline'] * 1000);
          }
          this.list = this.list.concat(res.data);
          this.page++;
          this.loading = false;
        },
        fail: err => {
          this.loading = false;
        }
      });
    },
    postReply(e) {
      clearTimeout(this.timeid);
      if (this.vuex_uid < 1) {
        uni.navigateTo({
          url: '../login/login'
        });
        return;
      }
      if (!this.message || this.message.length < 6) {
        return uni.showToast({
          title: this.langvars['v6'] + '6',
          icon: "none"
        });
      }
      uni.request({
        url: config.apidomain + '/app/api.php?action=postReply',
        data: {
          tid: this.tid,
          uid: this.vuex_uid,
          access_token: this.vuex_access_token,
          message: this.message,
          fid: this.fid
        },
        success: result => {
          let res = result.data;
          console.log(res);
          if (res.code > 0) {
            uni.showToast({
              title: res.msg,
              icon: "none"
            })
          }
          this.newmessage = this.message;
          this.message = '';
          uni.showToast({
            title: this.langvars['v8'],
            icon: "none"
          })
        },
        fail: err => { }
      });
    },
    setFavore() {
      clearTimeout(this.timeid);
      // if(this.vuex_uid<1){
      if (!this.islogin()) {
        return;
      }
      // }
      if (this.body.hasfavore > 0) {
        // 是收藏，则取消
        this.body.hasfavore = 0;
        uni.showToast({
          title: this.langvars['v3'],
          icon: "none"
        });
        return
      }
      uni.request({
        url: config.apidomain + '/app/api.php?action=setFavore',
        data: {
          tid: this.tid,
          uid: this.vuex_uid,
          access_token: this.vuex_access_token
        },
        success: result => {
          let res = result.data;
          if (res.code > 0) {
            uni.showToast({
              title: res.msg,
              icon: "none"
            })
            return;
          }
          this.body.hasfavore = 1;
          uni.showToast({
            title: this.langvars['v3'],
            icon: "none"
          });
        },
        fail: err => { }
      });
    }
  }
};
</script>

<style lang="scss">
view {
  display: flex;
  flex-direction: column;
}

.content {
  flex-direction: column;
  padding: 10px;
}

.loading {
  justify-content: center;
  flex-direction: row;
  text-align: center;
  color: #777;
  margin: 20px;
  font-size: 14px;
}

.subject {
  margin-top: 15px;
  margin-bottom: 10px;
  font-size: 26px;
  font-weight: 700;
}

.bodytext {
  font-size: 16px;
  color: #666;
  line-height: 30px;
}

.imgwrap {
  margin-bottom: 8px;
  /* flex-direction: row;
	justify-content: center;
	align-items: center; */
}

.metainfo {
  margin: 10px;

  .metainfo_text {
    font-size: 12px;
    color: #999;
  }
}



.fenlei {
  border: 1px dotted #f1f1f1;
  /* display: flex; */
  flex-direction: column;
  margin: 15px 8px;
}

.fenlei_item {
  /* display: flex; */
  padding: 8px;
  border-bottom: 1px solid #f1f1f1;
  flex-direction: row;
}

.name {
  font-weight: 700;
}

.name,
.value {
  flex: 1;
  font-size: 14px;
}

.body {
  margin-bottom: 10px;
}

.pinlun {
  position: fixed;
  bottom: 20rpx;
  left: 20rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .replytextarea {
    width: 270px;
    // margin: 25px 10px;
    height: 50rpx;
    border: 1px solid #f1f1f1;
    padding: 8px;
    flex-direction: column;
  }

  .replybtn_wrap {
    width: 150rpx;
    height: 50rpx;
    padding: 8px;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

}

.replybtn {
  background: #07c160;
  justify-content: center;
  width: 150px;
  margin-right: 15px;
  flex-direction: row;
  border: 0;
}

.replybtn_text {
  font-size: 14px;
  height: 40px;
  color: #fff;
  line-height: 40px;
}

.replylist {
  margin-bottom: 10px;
}

.list-item {
  flex-direction: column;
  border: 1px solid #f1f1f1;
  padding: 8px;
  margin-bottom: 15px;
}

.item-meta {
  padding: 5px;
  font-size: 14px;
  color: #999;
}

.red {
  color: #ff5053;
}

.item-body {
  font-size: 14px;
  color: #333;
}

.bodycontent {
  line-height: 1.8;
}

.attachment_wrap {
  background: #f9f9f9;
  padding: 8px;
  margin: 5px 0;
  border: 1px dotted #f1f1f1;
}

.attachment_name {
  font-size: 14px;
}

.btngroup {
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 15px;
}

.default,
.warn {
  width: 130px;
  height: 40px;
  justify-content: center;
  align-items: center;
  background: #ddd;
  border-radius: 5px;
}

.warn {
  background: #07c160;
}

.default_text,
.warn_text {
  line-height: 40px;
  color: #777;
  font-size: 14px;
  background: rgba(0, 0, 0, 0);
}

.warn_text {
  color: #fff;
}

.h-flex-x {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  align-content: center;

  /* 水平左对齐 */
  &.h-flex-left {
    justify-content: flex-start;
  }

  /* 水平居中对齐 */
  &.h-flex-center {
    justify-content: center;
  }

  /* 水平右对齐 */
  &.h-flex-right {
    justify-content: flex-end;
  }

  /* 水平两端对齐 */
  &.h-flex-space {
    justify-content: space-between;
  }

  /* 垂直顶部对齐 */
  &.h-flex-top {
    align-items: flex-start;
    align-content: flex-start;
  }

  /* 垂直底部对齐 */
  &.h-flex-bottom {
    align-items: flex-end;
    align-content: flex-end;
  }

  /* 允许换行 */
  &.h-flex-wrap {
    flex-wrap: wrap;
  }

  /* 等比分列，2-6列 */
  @for $i from 2 through 6 {
    &.h-flex-#{$i} {
      &>view {
        width: (100% / $i);
      }
    }
  }

  /* 弹性元素 */
  &>.h-flex-item-grow {
    flex-grow: 1;
    width: 0;
  }
}
</style>
