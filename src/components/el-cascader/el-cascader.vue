<template>
  <el-cascader
    style="width: 100%"
    :options="options"
    :props="{ checkStrictly: true }"
    clearable
  ></el-cascader>
</template>
  <script>
export default {
  name: "cascader",
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      options: [],
    };
  },
  watch: {
    data(val, oldVal) {
      this.options = val;
    },
    deep: true, // 深度监听
    immediate: true, // 第一次改变就执行
  },
};
</script>