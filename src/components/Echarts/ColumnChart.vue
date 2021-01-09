<template>
  <div>
    <div ref="echars" :style="{width:width,height:height}"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import { debounce } from "@/utils";
export default {
  name: "ColumnChart",
  props: {
    seriesData: {
      type: Array,
      default: null
    },
    xData: {
      type: Array,
      default: () => [
        "AGV",
        "氦吹中央控制系统",
        "导通绝缘测试仪",
        "总成测试仪",
        "地面能源",
        "地面电源",
        "喷管工位",
        "自动化压装设备"
      ]
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "300px"
    },
    index: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      chart: null,
      series: [],
      //   xData: []
      viewName: null
    };
  },
  watch: {
    viewName() {
      console.log("开始监听viewName=================");
      this.initEcharts();
      console.log("结束监听viewName=================");
    },
    xData() {
      this.initEcharts();
    },
    seriesData(){
       this.initEcharts();
    }
  },
  activated(){
    this.viewName = this.index;
    this.series = this.seriesData;
    this.xData = this.xData;
    this.$nextTick(() => {
      this.initEcharts();
    });
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHandler);
  },
  // mounted() {
  //   this.viewName = this.index;
  //   this.series = this.seriesData;
  //   this.xData = this.xData;
  //   this.$nextTick(() => {
  //     this.initEcharts();
  //   });
  //   this.__resizeHandler = debounce(() => {
  //     if (this.chart) {
  //       this.chart.resize();
  //     }
  //   }, 100);
  //   window.addEventListener("resize", this.__resizeHandler);
  // },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHandler);
    this.chart.dispose();
    this.chart = null;
  },

  methods: {
    initEcharts() {
      this.chart = echarts.init(this.$refs.echars, "macarons");
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          textStyle: {
            align: "left"
          }
        },
        legend: {
          show: true,
          icon: "circle",
          orient: "horizontal",
          top: "2.5%",
          right: "0",
          itemWidth: 15,
          itemHeight: 15,
          itemGap: 10,
          textStyle: {
            color: "#FFFFFF"
          }
        },
         

        xAxis: [
          {
            data: this.xData,
            axisLine: {
              lineStyle: {
                color: "rgba(0, 0, 0, 0)"
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: "#FFFFFF",
              fontSize: 12,
              interval: 0
            }
          },
          {
            type: "category",
            show: true,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0,
              margin: 10,
              color: "#fff",
              fontSize: "10"
            }
          }
        ],
        yAxis: [
          {
            max: 24,
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "rgba(0, 0, 0, 0)"
              }
            },
            axisLabel: {
              textStyle: {
                color: "#FFFFFF"
              }
            }
          }
        ],
        series: this.series
      });
       
      this.chart.resize();
    }
  }
};
</script>