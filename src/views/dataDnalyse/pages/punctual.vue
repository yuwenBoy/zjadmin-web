<template>
  <div>
    <!-- 准时交付率 -->
    <el-row :gutter="24">
      <el-col :sm="24" :md="24" :xl="24" :lg="24" :xs="24">
        <div class="czy-home__widget">
          <div class="czy-home__widget-header">
            <i class="czy-home__widget-header-bullet"></i>
            <div class="czy-home__widget-title">任务工单分析</div>
            <div class="u-line-spacer no-left"></div>
            <div class="czy-home__widget-append"></div>
          </div>
          <div class="czy-home__widget-content">
            <line-chart :index="activeIndex"  :seriesData="seriesData7" />
          </div>
          <div class="czy-home__widget-footer">
            <div class="u-line-spacer"></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24" style="margin-top:15px;">
      <el-col :sm="24" :md="24" :xl="24" :lg="24" :xs="24">
        <div class="czy-home__widget">
          <div class="czy-home__widget-header">
            <i class="czy-home__widget-header-bullet"></i>
            <div class="czy-home__widget-title">型号工单分析</div>
            <div class="u-line-spacer no-left"></div>
            <div class="czy-home__widget-append"></div>
          </div>
          <div class="czy-home__widget-content">
             <line-chart :index="activeIndex"  :seriesData="seriesData7" />
          </div>
          <div class="czy-home__widget-footer">
            <div class="u-line-spacer"></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 准时交付率 -->
  </div>
</template>

<script>
import LineChart from "@/components/Echarts/LineChart.vue";
export default {
  name: "punctual",
  components: {  LineChart },
  data() {
    return {
      activeIndex: "punctual",
      seriesData7: [
        {
          name: "已超出",
          type: "bar",
          stack: "总量",
          barWidth: "18%",
          data: [
            0.11,
            0.7,
            0.9,
            0.13,
            0.21,
            0.9,
            0.12,
            0.12,
            0.11,
            0.7,
            0.9,
            0.13
          ]
        },
        {
          name: "执行中",
          type: "bar",
          stack: "总量",
          barWidth: "18%",
          data: [
            0.7,
            0.9,
            0.13,
            0.21,
            0.9,
            0.12,
            0.12,
            0.11,
            0.7,
            0.9,
            0.13,
            0.19,
          ]
        },
        {
          name: "已完成",
          type: "bar",
          stack: "总量",
          barWidth: "18%",
          data: [
            0.7,
            0.9,
            0.13,
            0.21,
            0.9,
            0.12,
            0.12,
            0.11,
            0.7,
            0.9,
            0.13,
            0.9
          ]
        }
      ]
    };
  }
};
</script>
<style>
@import "../style/echrts.css";
</style>