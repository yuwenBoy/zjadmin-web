<template>
  <div class="processing-contrainer">
    <el-tabs
      v-model="activeStatus"
      @tab-click="handleTabChange"
      style="margin-bottom: 0"
    >
      <el-tab-pane
        :label="item.label"
        :name="item.value"
        v-for="(item, index) in statusList"
        :key="index"
      >
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: "Processing",
  data() {
    return {
      activeStatus: "1,2,3,4",
      statusList: [
        { label: "进行中", value: "1,2,3,4" },
        { label: "待接单", value: "1" },
        // { label: '预订单提醒', value: 'unshipped' },
        { label: "待出餐", value: "2" },
        { label: "待配送", value: "3" },
        { label: "顾客退款", value: "8" },
        // { label: '顾客催单', value: 'cancelled' },
        // { label: '食安', value: 'completed' },
        // { label: '补发', value: 'cancelled' }
      ],
    };
  },
  methods: {
    handleTabChange(){
        console.log(this.activeStatus)
    }
  },
};
</script>
<style scoped>
.processing-contrainer {
  background-color: #ffffff;
  margin-top: 20px;
  padding: 15px;
}
</style>
