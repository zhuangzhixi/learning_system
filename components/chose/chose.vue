<template>
  <view>
    <u-row customStyle="margin: 10px" gutter="10">
      <u-col span="6">
        <u-button @click="clickbutton('英文')" type="primary" text="英文"></u-button>
      </u-col>
      <u-col span="6">
        <u-button @click="clickbutton('经济')" type="primary" text="经济"></u-button>
      </u-col>
    </u-row>
    <u-row customStyle="margin: 10px" gutter="10">
      <u-col span="6">
        <u-button @click="clickbutton('计算机')" type="primary" text="计算机"></u-button>
      </u-col>
    </u-row>
  </view>
</template>

<script>
import { setSubject } from "@/api/user.js";

export default {
  name: "chose",
  data() {
    return {
      chose: '',
    };
  },
  // onLoad() {
  //   this.setSubject();
  // },
  computed: {

  },
  methods: {
    async setSubject() {
      const result = await setSubject(this.chose);
      if (result.status !== 200) console.log("设置课程失败");
    },
    //获取按钮上的文字给chose变量
    clickbutton(data) {
      this.chose = data;
      this.setSubject();
      uni.redirectTo({
        url: "/pages/class/class"
      });
    }
  }
}
</script>

<style lang="scss" scoped></style>