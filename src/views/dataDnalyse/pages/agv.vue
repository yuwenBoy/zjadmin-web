<template>
  <div>
    <el-row :gutter="24">
      <el-col :sm="12" :md="12" :xl="12" :lg="12" :xs="12">
        <div class="czy-home__widget">
          <div class="czy-home__widget-header">
            <i class="czy-home__widget-header-bullet"></i>
            <div class="czy-home__widget-title">AGV1</div>
            <div class="u-line-spacer no-left"></div>
            <div class="czy-home__widget-append"></div>
          </div>
          <div class="czy-home__widget-content">
            <!-- <div ref="echarts" :style="{width:width,height:height}"></div> -->
            <line-chart :index="acticeIndex" :seriesData="data1" />
          </div>
          <div class="czy-home__widget-footer">
            <div class="u-line-spacer"></div>
          </div>
        </div>
      </el-col>
      <el-col :sm="12" :md="12" :xl="12" :lg="12" :xs="12">
        <div class="czy-home__widget">
          <div class="czy-home__widget-header">
            <i class="czy-home__widget-header-bullet"></i>
            <div class="czy-home__widget-title">AGV2</div>
            <div class="u-line-spacer no-left"></div>
            <div class="czy-home__widget-append"></div>
          </div>
          <div class="czy-home__widget-content">
            <line-chart :index="acticeIndex" :seriesData="data2" />
          </div>
          <div class="czy-home__widget-footer">
            <div class="u-line-spacer"></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24" style="margin-top:15px;">
      <el-col :sm="12" :md="12" :xl="12" :lg="12" :xs="12">
        <div class="czy-home__widget">
          <div class="czy-home__widget-header">
            <i class="czy-home__widget-header-bullet"></i>
            <div class="czy-home__widget-title">AGV3</div>
            <div class="u-line-spacer no-left"></div>
            <div class="czy-home__widget-append"></div>
          </div>
          <div class="czy-home__widget-content">
            <line-chart :index="acticeIndex" :seriesData="data3" />
          </div>
          <div class="czy-home__widget-footer">
            <div class="u-line-spacer"></div>
          </div>
        </div>
      </el-col>
      <el-col :sm="12" :md="12" :xl="12" :lg="12" :xs="12">
        <div class="czy-home__widget">
          <div class="czy-home__widget-header">
            <i class="czy-home__widget-header-bullet"></i>
            <div class="czy-home__widget-title">AGV4</div>
            <div class="u-line-spacer no-left"></div>
            <div class="czy-home__widget-append"></div>
          </div>
          <div class="czy-home__widget-content">
            <line-chart :index="acticeIndex" :seriesData="data4" />
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
      acticeIndex: "agv",
      data1: [
        {
          name: "使用率",
          type: "line",
          data: [0.1, 0.2, 0.6, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.8]
        }
      ],
      data2: [
        {
          name: "使用率",
          type: "line",
          data: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1]
        }
      ],
      data3: [
        {
          name: "使用率",
          type: "line",
          data: [0.1, 0.2, 0.6, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.8]
        }
      ],
      data4: [
        {
          name: "使用率",
          type: "line",
          data: [0.1, 0.2, 0.6, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.5]
        }
      ]
    };
  }
};
</script>
<style>
@import url("../style/echrts.css");
</style>