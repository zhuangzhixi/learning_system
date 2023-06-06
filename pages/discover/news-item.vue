<template>
	<view class="media-item" v-if="newsItem.title" @click="click">
		<!-- 标题 -->
		<view>
			<text class="media-title">{{ newsItem.title }}</text>
		</view>
		<!-- 图片和文字 -->
		<view class="view-img">
			<text class="intro">{{ newsItem.content }}</text>
			<image :fade-show="false" class="image-list1" mode="aspectFill" v-if="newsItem.image"
				:src="myUrl + 'images/discover/' + newsItem.image">
			</image>
		</view>
		<view class="media-foot flex-row">
			<view class="media-info flex-row">
				<text class="info-text">{{ newsItem.type }}</text>
				<text class="info-text">{{ newsItem.huifu }} / {{ newsItem.fw }}</text>
				<text class="info-text">{{ newsItem.user }}</text>
				<text class="info-text">{{ formattedTime }}</text>
			</view>
		</view>
		<u-divider text=" "></u-divider>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			myUrl: app.globalData.site_h5url,
			formattedTime: '',
		};
	},
	props: {
		newsItem: {
			type: Object,
			default: function (e) {
				return {
				};
			}
		}
	},

	created() {
		if (this.newsItem.cover) {
			let self = this;
			let url = this.newsItem.cover;
			let covername = this.newsItem.cover.substr(this.newsItem.cover.lastIndexOf('/') + 1);
			console.log(covername);
			// #ifdef APP-PLUS
			this.newsItem.cover = '/static/images/fm.gif';

			plus.io.resolveLocalFileSystemURL(
				'_downloads/' + covername,
				function (entry) {
					let cover = 'file://' + plus.io.convertLocalFileSystemURL('_downloads/' + covername);
					self.$set(self.newsItem, 'cover', cover);
				},
				function (e) {
					// 需要先下载
					self.download(url, covername);
				}
			);
			// #endif
		}
		// 把this.newsItem.time * 1000这一字符戳转换为时间格式, 不使用moment库
		let date = new Date(this.newsItem.time * 1000);
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		let hour = date.getHours();
		let minute = date.getMinutes();
		let second = date.getSeconds();
		this.formattedTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
	},
	computed: {
		// 返回属于该页面的语言对应的标识{标识:语言}
		langvars() {
			return {
				v1: '最新帖子',
				v2: '最多访问',
				v3: '最多回复',
				v4: '最多收藏',
				v5: '热度',
				v6: '推荐',
				v7: '发布于',
				v8: '最后回复'
			};
		}
	},
	methods: {
		click() {
			this.$emit('click');
		},
		close(e) { },
		download(url, name) {
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
						var cur_precent = parseInt((100 * task.downloadedSize) / task.totalSize); //Math.round(task.downloadedSize * 100 / task.totalSize)
						if (self.percent != cur_precent) {
							self.percent = cur_precent;

							self.onProgress(url, 4, self.percent);
						}
						break;

					case 4: // 下载完成
						let cover = 'file://' + plus.io.convertLocalFileSystemURL(task.filename);
						self.$set(self.newsItem, 'cover', cover);
						console.log('下载完成');
						break;
				}
			});
			dtask.start();
			// #endif
		}
	}
};
</script>

<style scoped>
.media-item {
	padding: 0px 8px;
}

.flex-row {
	flex-direction: row;
}

.view-img {
	display: flex;
	flex-direction: row;
	margin: 5px 0;
}

.image-list1 {
	height: 50px;
	flex: 1;
}

.intro {
	margin-right: 8px;
	flex: 3;
	color: #aaa;
	font-size: 12px;
	font-weight: 400;
	text-overflow: ellipsis;
	height: 32px;
	overflow: hidden;
	flex: 1;
}

.media-info {
	flex-direction: row;
	align-items: center;
}

.info-text {
	margin-right: 10px;
	color: #999999;
	font-size: 12px;
}

.media-foot {
	margin-top: 12px;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
}
</style>
