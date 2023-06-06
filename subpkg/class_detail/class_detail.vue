<template>
    <view>
        <template v-if="kongkong == false">
            <!-- 课程背景 -->
            <view class="live_course_bg_wrap">
                <image class="live_course_img" :src="myUrl + 'images/class/' + classInfo.image" mode="aspectFill"></image>
            </view>
            <view class="course-bottom">
                <!-- tab标签 -->
                <view class="flex align-center justify-center font-weight-bold course-info-tab">
                    <view class="mx-5 c-info-tabbar" @click="changeTab(index)" v-for="(item, index) in tabBars" :key="index"
                        :class="tabIndex === index ? 'text-main font-lg' : 'font-md text-light-muted'">
                        {{ item.name }}
                    </view>
                </view>
                <swiper :current="tabIndex" class="swiper-box" :style="{ height: scrollH + 'rpx' }" @change="onChangeTab">
                    <!-- 简历 -->
                    <swiper-item class="course-info-item">
                        <scroll-view scroll-y :style="'height:' + scrollH + 'rpx;'">
                            <!-- 标题标签区域 -->
                            <view>
                                <text class="course-title">{{ classInfo.classname }}</text>
                                <text class="course_tag">{{ classInfo.category }}</text>
                            </view>
                            <text>{{ classInfo.describtion }}</text>

                            <!-- 价格时间学习人数信息 -->
                            <view class="price-time-stunum">
                                <text v-if="paytype == 0" class="free">免费</text>

                                <text class="time-wrap">{{ classInfo.lesson }}</text>
                                <!-- <text class="stunum-wrap">{{ views }}人在学</text> -->
                            </view>
                            <!-- f5f5f5的横线 -->
                            <view class="new_line"></view>
                            <!-- 讲师介绍 -->
                            <view class="about-teacher-wrap">
                                <text class="about-title ateacher-title">讲师介绍</text>
                                <view class="ateacher-list">

                                    <view class="ateacher-item">
                                        <image class="ateacher-img"
                                            :src="`${myUrl}images/teacher/${classInfo.teacherimage}`" mode="">
                                        </image>
                                        <view class="ateacher-info">
                                            <text class="at-info-item at-info-name">{{ classInfo.teachername }}</text>
                                            <text class="at-info-item">主讲老师</text>
                                        </view>
                                        <text class="teacher-arow iconfont icon-jinrujiantou"></text>
                                    </view>
                                </view>
                            </view>

                            <!-- 内容介绍 -->
                            <view class="about-live-wrap">
                                <text class="about-title alive-title">内容介绍</text>
                                <view class="alive-info">
                                    <rich-text :nodes="classInfo.content"></rich-text>
                                </view>
                            </view>

                        </scroll-view>
                    </swiper-item>

                    <!-- 评价 -->
                    <!-- <swiper-item class="course-info-item">
                        <scroll-view :scroll-y="kongkong == true ? false : true" :style="'height:' + scrollH + 'rpx;'">
                            <view class="xiepingjia">
                                <view class="pingjia-all-star">
                                    <text v-for="(item, index) in stararr"
                                        v-if="index < Math.floor(parseInt(com_data.star))" :key="index"
                                        class="pingjia-star iconfont icon-pingfenxingxing checkstar"></text>
                                    <text class="score checkstar">{{ com_data.star }}</text>
                                </view>
                                <view class="pingjia-title" @click="openpinglun">写评价</view>
                            </view>
                        </scroll-view>
                    </swiper-item> -->
                </swiper>


                <!-- 底部按钮区域 -->
                <view class="btn_tem">
                    <view v-if="classInfo.star == 0" @click="starclass()" class="inlive-btn">
                        收藏
                    </view>
                    <view @click="enterContent()" class="inlive-btn">
                        查看详情
                    </view>
                </view>

            </view>
        </template>
    </view>
</template>

<script>
import {
    classUpdate, getClassDetail, recordTime
} from '@/api/user.js'
const app = getApp();
export default {
    data() {
        return {
            //域名
            myUrl: app.globalData.site_h5url,
            paytype: 0,
            scrollH: 0,
            ifbuy: 0,
            tabIndex: 0,
            tabBars: [{
                name: "介绍"
            },
                // {
                //     name: "评价"
                // }
            ],
            live_course_bg: '',
            hidefudao: '',
            views: 100,
            kongkong: true,
            classInfo: {},

            userpasswordkHidden: true, // 默认隐藏
            feedbackpassword: '', // 输入密码
            passwordcontent: '',
            getcourseid: '',
            nums: '',
            courseid: '', //内容id
            stararr: [1, 2, 3, 4, 5],
            com_data: {}, //评论数据
            kongkong: true, //空空如也
            webview: '',
            INFO: [],
            sort: '0',
            type: 1,
            animationData: [],
            ishidden: 1

        }
    },
    onReady: function () {
        //获取内容区域的高度
        var that = this;
        uni.getSystemInfo({
            success: function (res) {
                that.scrollH = res.windowHeight * 750 / res.windowWidth - 510 - 70;
            }
        });
    },
    onShow: function () {
    },

    onLoad(option) {
        //获取课程信息
        // this.classInfo = JSON.parse(decodeURIComponent(option.class));
        this.getInfo(option.id);
        //记录浏览该课程的时间戳
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;//以秒为单位
        this.setClassTime(option.id, timestamp);
    },
    methods: {
        //切换选项卡
        changeTab(index) {
            this.tabIndex = index
        },
        // 查看内容详情
        enterContent() {
            uni.navigateTo({
                url: '../class_detail_video/class_detail_video'
            });
        },
        async starclass() {
            this.classInfo.star = 1;
            let result = await classUpdate(this.classInfo);
            if (result.meta.status !== 200) return uni.$showMsg()
        },
        async getInfo(id) {
            let result = await getClassDetail(id);
            if (result.meta.status !== 200) return uni.$showMsg()
            this.classInfo = result.message[0];
            this.kongkong = false;
        },
        async setClassTime(id, time) {
            let result = await recordTime(id, time);
            if (result.meta.status !== 200) return uni.$showMsg()
        },
    }
}
</script>

<style>
/* 课程详情页公共样式 */
@import url("../../static/css/course_info/course_info.css");
@import url("../../static/common/css/pingjia.css");

.course-title {
    font-size: 30rpx;
    font-weight: bold;
}

.sub_jifen {
    position: absolute;
    right: 60rpx;
    margin-top: -10rpx;
    color: #FFFFFF;
    text-align: center;
    padding-bottom: 5rpx;
    width: 80rpx;
    height: 30rpx;
    border-radius: 15rpx;
    font-size: 20rpx;
    background-color: #FF3939;
}

.popup_overlay {
    position: fixed;
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    background-color: black;
    z-index: 1001;
    -moz-opacity: 0.8;
    opacity: .80;
    filter: alpha(opacity=88);
}

.popup_content {
    position: fixed;
    top: 50%;
    left: calc(50% - 120px);
    width: 400rpx;
    height: 200rpx;
    margin-top: -270rpx;
    border: 10px solid white;
    background-color: white;
    z-index: 1002;
    overflow: auto;
    border-radius: 10rpx;
}


.popup_title {
    width: 100%;
    text-align: center;
    font-size: 32rpx;
}

.popup_textarea_item {
    padding-top: 10rpx;
    height: 50rpx;
    width: 100%;
    background-color: #F1F1F1;
    margin-top: 20rpx;
}

.popup_textarea {
    width: 100%;
    font-size: 26rpx;
    margin-left: 20rpx;
}

.popup_button {
    color: #000000;
    width: 50%;
    text-align: center;

}

.popup_button2 {
    color: #2C62EF;
    width: 50%;
    text-align: center;

}

.buttons {
    display: flex;
    flex-direction: row;
    width: 100%;
    font-size: 32rpx;
    margin-top: 20rpx;

}

.new_gouwuche {
    margin-top: 10rpx;
    position: relative;
    width: 80rpx;
    height: 80rpx;
}

.gouwunums {
    position: absolute;
    background-color: #DC2929;
    width: 26rpx;
    height: 26rpx;
    border-radius: 13rpx;
    margin-left: 40rpx;
    margin-top: 10rpx;
}

.gowucheimage {
    position: absolute;
    width: 70upx;
    height: 50upx;
    left: 0rpx;
    margin-top: 10rpx;
}

.carView {
    display: flex;
    flex-direction: row;
    bottom: 0upx;
    background-color: #FFFFFF;
    height: 110upx;
    position: fixed;
    width: 100%;
}

.carnums {
    width: 26rpx;
    height: 26rpx;
    font-size: 20rpx;
    color: #FFFFFF;
    text-align: center;
    line-height: 26rpx;
}

.car {
    width: 30%;
    align-items: center;
    text-align: center;
    display: flex;
    flex-direction: column;

}

.cartitle {
    color: #333333;
    font-size: small;
}

.joincar {
    text-align: center;
    width: 40%;
    color: #FFFFFF;
    background-color: #FFAC4B;
    font-size: larger;
    padding-top: 25upx;
}

.joincar2 {
    text-align: center;
    width: 40%;
    color: #FFFFFF;
    background-color: #CCCCCC;
    font-size: larger;
    padding-top: 25upx;
}

.buy {
    padding-top: 25upx;
    text-align: center;
    font-size: larger;
    width: 40%;
    color: #FFFFFF;
    background-color: #FF623E;
}

.at-info-item {
    font-size: 20rpx !important;
}

.at-info-name {
    font-size: 35rpx !important;
    font-weight: bold;
}
</style>
