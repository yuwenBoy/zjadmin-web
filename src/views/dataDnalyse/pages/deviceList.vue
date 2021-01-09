<template>
    <div>
         <el-row :gutter="24">
        <el-col :sm="24" :md="24" :xl="24" :lg="24" :xs="24">
          <div class="czy-home__widget">
            <div class="czy-home__widget-header">
              <i class="czy-home__widget-header-bullet"></i>
              <div class="czy-home__widget-title">全部设备使用率情况</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
              <line-chart :index="activeIndex" :xData="xdata" :seriesData="data1" />
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
              <div class="czy-home__widget-title">故障维修时间</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
              <column-chart :index="activeIndex" :seriesData="series" />
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
import ColumnChart from "@/components/Echarts/ColumnChart.vue";
export default {
  
  components: { LineChart, ColumnChart},
  
  data() {
    return {
      activeIndex: "deviceList",
      xdata: [
        "AGV",
        "氦吹中央控制系统",
        "导通绝缘测试仪",
        "总成测试仪",
        "地面能源",
        "地面电源",
        "喷管工位",
        "自动化压装设备"
      ],
      series: [
        {
          name: "故障时间",
          type: "pictorialBar",
          symbol: "rect",
          itemStyle: {
            color: "#1cd9b4"
          },
          symbolRepeat: true,
          symbolSize: [14, 4],
          // symbolBoundingData: 100,
          //symbolMargin: 0.5,
          symbolPosition: "start",
          z: -20,
          data: [1, 3, 4, 6, 12, 13, 15, 21],
          label: {
            normal: {
              show: false,
              position: "top",
              verticalAlign: "top"
              // formatter: function(value){
              //   return value && (value.data * 100).toFixed(1) + '%'
              // }
            }
          }
        }
      ],
      data1: [
        {
          name: "使用率",
          type: "line",
          data: [0.1, 0.2, 0.6, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.8]
        }
      ]
    };
  }
};
</script> 
<style>
@import "../style/echrts.css";
</style>