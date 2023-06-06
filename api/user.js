import $http from '@/config/request.js'
import user from '../store/user';

// 登录
export function userLogin(code) {
	return $http.request({
		url: '/user/token',
		method: "post",
		data: {
			code: code,
		}
	})
}

//更新课堂信息，也就是收藏
export function classUpdate(calssInfo) {
	return $http.request({
		url: '/class_detail/update_class',
		method: "post",
		data: calssInfo
	})
}
//获取收藏的课堂信息
export function getMyOrder() {
	return $http.request({
		url: '/order/myorder',
	})
}
//获取指定id的课堂信息
export function getClassDetail(id) {
	return $http.request({
		url: '/class_detail/class_detail/' + id,
	})
}
//获取指定关键字的课堂信息
export function getSearchDetail(key) {
	return $http.request({
		url: '/search/search/' + key,
	})
}

//记录浏览该课程的时间戳
export function recordTime(id, time) {
	return $http.request({
		//发送id和时间戳time两个参数来记录浏览时间
		url: '/class_detail/record_time/' + id + '/' + time,
	})
}
//获取历史足迹
export function gethistory() {
	return $http.request({
		url: '/class_detail/get_history',
	})
}
//获取题库
export function getQuestion(data) {
	if (data) {
		if (data.examname) {
			return $http.request({
				url: '/question/get_question?examname=' + data.examname,
			})
		} else if (data.zxname) {
			return $http.request({
				url: '/question/get_question?zxname=' + data.zxname,
			})
		} else if (data.collectfunction) {
			return $http.request({
				url: '/question/get_question?collectfunction=' + data.collectfunction,
			})
		} else if (data.worsequestion) {
			return $http.request({
				url: '/question/get_question?worsequestion=' + data.worsequestion,
			})
		}
	}
	return $http.request({
		url: '/question/get_question',
	})
}

//保存考试成绩
export function saveScore(data) {
	return $http.request({
		url: '/question/save_score',
		method: "post",
		data: data
	})
}
//获取考试成绩
export function getScore() {
	return $http.request({
		url: '/question/get_score',
	})
}

//选择备考科目
export function setSubject(data) {
	return $http.request({
		url: '/question/set_subject',
		method: "post",
		data: { chose: data }
	})
}

//题目收藏
export function collectQuestion(data) {
	return $http.request({
		url: '/question/collect_question',
		method: "post",
		data,
	})
}
//回答题目
export function answerQuestion(data) {
	return $http.request({
		url: '/question/answer_question',
		method: "post",
		data,
	})
}
//获取考试时间
export function getExamTime() {
	return $http.request({
		url: '/question/get_time',
	})
}

//获取当前备考科目的历年试卷名字
export function getExamName() {
	return $http.request({
		url: '/question/get_examname',
	})
}

//获取当前备考科目的专项练习名字
export function getZxName() {
	return $http.request({
		url: '/question/get_zxname',
	})
}

//最新帖子
export function getNews() {
	return $http.request({
		url: '/news/get_news',
	})
}
//最多访问
export function getVisit() {
	return $http.request({
		url: '/news/get_visit',
	})
}
//最多回复
export function getReply() {
	return $http.request({
		url: '/news/get_reply',
	})
}
//最多收藏
export function getCollect() {
	return $http.request({
		url: '/news/get_collect',
	})
}

//保存发布的帖子
export function saveNews(data) {
	return $http.request({
		url: '/news/save_news',
		method: "post",
		data,
	})
}


//获取资讯模块的官方公告
export function getNotice() {
	return $http.request({
		url: '/news/get_gonggao',
	})
}
//根据资讯id获取资讯详情
export function getNewsDetail(id) {
	return $http.request({
		url: '/news/get_news_detail/' + id,
	})
}
//资讯详情功能中的收藏功能
export function collectNews(data) {
	return $http.request({
		url: '/news/collect_news',
		method: "post",
		data,
	})
}





export function setInfo(userInfo) {
	console.log("传给后台的数据");
	console.log(userInfo);

	return $http.request({
		url: '/user/info',
		method: "put",
		header: {
			token: true
		},
		data: {
			...userInfo
		}
	})
}