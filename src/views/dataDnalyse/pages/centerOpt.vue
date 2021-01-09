<template>
  <div>
    <el-row :gutter="24">
      <el-col :sm="24" :md="24" :xl="24" :lg="24" :xs="24">
        <div class="czy-home__widget">
          <div class="czy-home__widget-header">
            <i class="czy-home__widget-header-bullet"></i>
            <div class="czy-home__widget-title">氦吹中央控制系统</div>
            <div class="u-line-spacer no-left"></div>
            <div class="czy-home__widget-append"></div>
          </div>
          <div class="czy-home__widget-content">
            <line-chart :index="activeIndex" :seriesData="data5" />
          </div>
          <div class="czy-home__widget-footer">
            <div class="u-line-spacer"></div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import LineChart from "@/components/Echarts/LineChart.vue";
export default {
  components: { LineChart },
  data() {
    return {
      activeIndex: "centerOpt",
      data5: [
        {
          name: "使用率",
          type: "line",
          data: [0.1, 0.2, 0.6, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.5]
        }
      ],
    };
  }
};
</script>
<style>
@import "../style/echrts.css";
</style>