<template>
  <view class="container">
    <view class="title">
      离考试{{ year1 }}年{{ month1 }}月{{ day1 }}日
      还有{{ day }}天
    </view>
  </view>
</template>

<script>
import { getExamTime } from '@/api/user.js'
export default {
  data() {
    return {
      day: 0,
      year1: 0,
      month1: 0,
      day1: 0,
    };
  },
  onLoad() {
    this.getExamTime();
  },
  methods: {
    async getExamTime() {
      let result = await getExamTime();
      if (result.status !== 200) {
        uni.showToast({
          title: '获取考试时间失败',
          icon: 'none',
        });
        return;
      }
      let year = result.message[0].y;
      let month = result.message[0].m;
      let day = result.message[0].d;
      this.year1 = year;
      this.month1 = month;
      this.day1 = day;

      //获取当前时间
      let now = new Date();
      let nowYear = now.getFullYear();
      let nowMonth = now.getMonth() + 1;
      let nowDay = now.getDate();
      //计算时间差，单位天
      let time = new Date(year, month - 1, day) - new Date(nowYear, nowMonth - 1, nowDay);
      let dayTime = 24 * 60 * 60 * 1000;
      this.day = Math.floor(time / dayTime);

    },
  },
}
</script>

<style lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.title {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  color: #333333;
  padding: 20px;
  border-radius: 10px;
  background-color: #FFFFFF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
