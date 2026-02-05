<template>
   <div>
     <div>商家后台首页</div>
     <!-- 给平台admin（用户ID=19）用户发送私聊消息 -->
     <!-- <ChatWindow chatType="private" :chatId="19" /> -->
   </div>
</template>
<script> 
// import ChatWindow from "@/components/ChatWindow/index.vue";
// import { mapGetters } from 'vuex';
export default {
  name: "Home",
  components: {
    // ChatWindow
  },
   computed: {
    // ...mapGetters(["user"]),
  },
};
</script>
