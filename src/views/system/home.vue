<template>
  <div class="home">
    <div class="box flex">
      <div class="box-shadow left">
        <div class="title flex space-between">
          <span class="fs12">最新通知</span>
        </div>
        <div class="content">
            <ChatWindow chatType="private" :chatId="191" />
        </div>
      </div>
      <div class="box-shadow right">
        <div class="title flex space-between">
          <span class="fs12">系统当前时间</span>
          <i class="el-icon-alarm-clock" />
        </div>
        <div class="content">
          <Clock />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Clock from "@/components/Clock/index.vue"
import ChatWindow from "@/components/ChatWindow/index.vue"
import { getWeather } from '@/api/base';
export default {
  components: {
    Clock,
    ChatWindow,
  },
  data() {
    return {
      chooseNumberList: [],
      type: "",
      dialogFormVisible: false,
      emptList: [],
    };
  },
mounted(){
    // getWeather('Datong').then(res=>{
    //     console.log(res);
    // })
},

  methods: {
  },
};
</script>

<style lang="scss" scoped>
.home {
  margin: 10px;
  .box {
    align-items: self-start;
    border-radius: 5px;
    .left {
      width: 70%;
      margin: 5px;
      background-color: #ffffff;
    }
    .right {
      width: 30%;
      margin: 5px;
      background-color: #ffffff;
      .content {
        text-align: center;
      }
    }
  }
}
</style>
