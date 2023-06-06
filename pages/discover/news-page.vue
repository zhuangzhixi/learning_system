<template>
	<view class="page-news">
		<uni-list ref="list" class="listview" :enableBackToTop="true" :scroll-y="true">
			<!-- 每一消息项 -->
			<uni-cell v-for="(item, index) in dataList" :key="item.id">
				<news-item :newsItem="item" :ref="'item' + index" @close="closeItem(index)"
					@click="openpage(item.id)"></news-item>
			</uni-cell>
			<!-- 省略... -->
			<uni-cell v-if="isLoading || dataList.length > 4">
				<view class="loading-more">
					<text class="loading-more-text">{{ loadingText }}</text>
				</view>
			</uni-cell>
		</uni-list>
		<no-data class="no-data" v-if="isNoData" @retry="loadMore"></no-data>
	</view>
</template>

<script>
// import uniList from '@/components/uni-list.vue';
// import uniCell from '@/components/uni-cell.vue';
// import uniRefresh from '@/components/uni-refresh.vue';
// import uniLoadMore from '@/components/uni-load-more.vue';
// import noData from '@/components/nodata.vue';
import { getNews, getVisit, getReply, getCollect } from '@/api/user.js';
import newsItem from './news-item.vue';
const app = getApp();

export default {
	components: {
		// 	uniList,
		// 	uniCell,
		// 	uniRefresh,
		// 	uniLoadMore,
		// 	noData,
		newsItem
	},
	props: ['nid', 'top', 'nowindex'],

	data() {
		return {
			// bannerlist:[],
			dataList: [],
			// dataList: [
			// 	{
			// 		tid: 1,
			// 		subject: '2023年考研英语时间通知',
			// 		summary: '123',//内容
			// 		cover: app.globalData.site_h5url + 'images/discover/notice1.png',
			// 		forumname: '考研英语',
			// 		replies: 0,//回复
			// 		views: 5,//查看
			// 		author: 'admin',//作者
			// 		lastpost: '2021-09-01 12:00:00',//发布时间
			// 	},
			// 	{
			// 		tid: 2,
			// 		subject: '2022年考研英语时间通知',
			// 		summary: '123',//内容
			// 		cover: app.globalData.site_h5url + 'images/discover/notice1.png',
			// 		forumname: '考研英语',
			// 		replies: 0,
			// 		views: 5,
			// 		author: 'admin',//作者
			// 		lastpost: '2021-09-01 12:00:00',//最后回复时间
			// 	},
			// 	{
			// 		tid: 3,
			// 		subject: '2023年考研英语时间通知',
			// 		summary: '123',//内容
			// 		cover: app.globalData.site_h5url + 'images/discover/notice1.png',
			// 		forumname: '考研英语',
			// 		replies: 0,
			// 		views: 5,
			// 		author: 'admin',//作者
			// 		lastpost: '2021-09-01 12:00:00',//最后回复时间
			// 	},
			// 	{
			// 		tid: 4,
			// 		subject: '2022年考研英语时间通知',
			// 		summary: '123',//内容
			// 		cover: app.globalData.site_h5url + 'images/discover/notice1.png',
			// 		forumname: '考研英语',
			// 		replies: 0,
			// 		views: 5,
			// 		author: 'admin',//作者
			// 		lastpost: '2021-09-01 12:00:00',//最后回复时间
			// 	},
			// 	{
			// 		tid: 5,
			// 		subject: '2022年考研英语时间通知',
			// 		summary: '123',//内容
			// 		cover: app.globalData.site_h5url + 'images/discover/notice1.png',
			// 		forumname: '考研英语',
			// 		replies: 0,
			// 		views: 5,
			// 		author: 'admin',//作者
			// 		lastpost: '2021-09-01 12:00:00',//最后回复时间
			// 	}
			// ],
			navigateFlag: false,
			pulling: false,
			refreshing: false,
			refreshFlag: false,
			refreshText: '',
			isLoading: false,
			loadingText: '...',
			isNoData: true,
			angle: 0,
			loadingMoreText: {
				contentdown: '',
				contentrefresh: '',
				contentnomore: ''
			},
			// refreshIcon:
			// 	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5QTFRFcHBw3Nzct7e39vb2ycnJioqK7e3tpqam29vb////D8oK7wAAAAp0Uk5T////////////ALLMLM8AAABxSURBVHja7JVBDoAgDASrjqj//7CJBi90iyYeOHTPMwmFZrHjYyyFYYUy1bwUZqtJIYVxhf1a6u0R7iUvWsCcrEtwJHp8MwMdvh2amHduiZD3rpWId9+BgPd7Cc2LIkPyqvlQvKxKBJ//Qwq/CacAAwDUv0a0YuKhzgAAAABJRU5ErkJggg=='
		};
	},
	watch: {
		nowindex: function (newVal, oldVal) {
			this.getdata();
		}
	},
	created() {
		this.pullTimer = null;
		this.requestParams = {
			type: this.nid,
			page: 1, //页码数
			size: 10,
			summary: 1
		};

		this._isWidescreen = false;
		this.getdata();
	},

	computed: {
		langvars() {
			return {
				v1: '年前',
				v2: '月前',
				v3: '天前',
				v4: '小时前',
				v5: '分钟前',
				v6: '秒前',
				v7: '释放立即刷新',
				v8: '下拉可以刷新',
				v9: '正在刷新',
				v10: '已刷新'
			};
		}
	},
	methods: {
		openpage(index) {
			uni.navigateTo({
				url: '/subpkg/zxdetail/zxdetail?id=' + index
			});
		},
		async getdata() {
			if (this.nowindex == 1) {
				var result = await getNews();
			} else if (this.nowindex == 2) {
				var result = await getVisit();
			} else if (this.nowindex == 3) {
				var result = await getReply();
			} else if (this.nowindex == 4) {
				var result = await getCollect();
			}
			if (result.status !== 200) {
				return uni.showToast({
					title: '获取数据失败',
					icon: 'none'
				})
			}
			this.dataList = result.message;


		},
		// 点击幻灯片图片

		loadData(refresh) {
			console.log('1111');
			if (this.isLoading) {
				return;
			}
			console.log('222');

			this.isLoading = true;
			this.isNoData = false;
			this.requestParams.time = new Date().getTime() + '';

			var startTime = new Date();

			console.log(config.apidomain + '/app/api.php?action=getIndex');
			uni.request({
				url: config.apidomain + '/app/api.php?action=getIndex',
				data: this.requestParams,
				success: result => {
					console.log(result);
					if (!result.data || !result.data.data) {
						setTimeout(() => {
							this.loadData();
						}, 500);
						return;
					}
					if (result.data.code > 0) {
						this.isNoData = true;
						return;
					}
					var endTime = new Date();
					const data = result.data.data;
					this.isNoData = data.length <= 0;
					let self = this;
					const data_list = data.map((news, i) => {
						news['lastpost'] = this.friendlyDate(news.lastpost * 1000);
						news['dateline'] = this.friendlyDate(news.dateline * 1000);

						return news;
					});

					if (refresh) {
						this.dataList = data_list;
						this.requestParams.page = 1;
					} else {
						this.dataList = this.dataList.concat(data_list);
						this.requestParams.page++;
					}
					console.log('this');
					console.log(this.dataList);
				},
				fail: err => {
					if (this.dataList.length == 0) {
						this.isNoData = true;
					}
				},
				complete: e => {
					this.isLoading = false;
				}
			});
		},
		loadMore(e) {
			console.log('load more');
			this.loadData();
		},
		clear() {
			this.dataList.length = 0;
			this.requestParams.page = 1;
		},
		goDetail(tid, name) {
			uni.navigateTo({
				url: '../detail/detail?tid=' + tid + '&title=' + encodeURIComponent(name)
			});
		},
		refreshData() {
			if (this.isLoading) {
				return;
			}
			this.requestParams.page = 1;
			this.pulling = true;
			this.refreshing = true;
			this.refreshText = this.langvars['v9'] + '...';
			this.loadData(true);
		},
		onrefresh(e) {
			this.refreshData();
			this.$refs.list.resetLoadmore();
		},
		onpullingdown(e) {
			if (this.refreshing) {
				return;
			}
			this.pulling = false;
			if (Math.abs(e.pullingDistance) > Math.abs(e.viewHeight)) {
				this.refreshFlag = true;
				this.refreshText = this.langvars['v7'];
			} else {
				this.refreshFlag = false;
				this.refreshText = this.langvars['v8'];
			}
		},
		newGuid() {
			let s4 = function () {
				return ((65536 * (1 + Math.random())) | 0).toString(16).substring(1);
			};
			return (s4() + s4() + '-' + s4() + '-4' + s4().substr(0, 3) + '-' + s4() + '-' + s4() + s4() + s4()).toUpperCase();
		},
		friendlyDate(timestamp) {
			let d = new Date(timestamp);
			return d.getFullYear() + '/' + d.getMonth() + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
		}
	}
};
</script>

<style scoped>
.page-news {
	padding-top: 8px;
}

.loading-icon {
	width: 28px;
	height: 28px;
	margin-right: 5px;
	color: gray;
}

.loading-text {
	margin-left: 2px;
	font-size: 16px;
	color: #999999;
}

.loading-more {
	align-items: center;
	justify-content: center;
	padding-top: 14px;
	padding-bottom: 14px;
	text-align: center;
}

.loading-more-text {
	font-size: 28upx;
	color: #999;
}
</style>
