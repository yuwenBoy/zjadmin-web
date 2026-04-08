<template>
  <div class="avatar">
    <el-avatar :src="imageUrl" :size="40" />
  </div>
</template>
<script>
import Avatar from "@/assets/images/avatar.png";
export default {
  name: "UserAvatar",
  props: {
    src: {
      type: String,
      default: Avatar,
    },
  },
  computed: {
    imageUrl() {
      return this.src || Avatar;
    },
  },
};
</script>