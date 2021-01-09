<template>
  <div>
    <div ref="echars" :style="{width:width,height:height}"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import { debounce } from "@/utils";
export default {
  name: "LineChart",
  props: {
    index: {
      type: String,
      default: null
    },
    xData: {
      type: Array,
      default: () => [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月"
      ]
    },
    seriesData: {
      type: Array,
      default: null
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "300px"
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
      this.initEcharts();
      console.log("监听viewName=================");
    },
    seriesData(val){
       console.log("父组件传过来的seriesData值："+val);
        this.initEcharts();
    },
    xData(val) {
        console.log("父组件传过来的xData值："+val);
         this.initEcharts();
    }
  },
  // mounted(){
  //   console.log("activated========柱状图==========")
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
  activated(){
    console.log("activated========柱状图==========")
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
      this.chart = echarts.init(this.$refs.echars);
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
        // grid: [{x:"5%",y:"5%"}],
        color: ["#9b52ff", "#73e2e2", "#ff7e85"], // 折线颜色
        xAxis: [
          {
            axisLine: { lineStyle: { color: "rgba(0, 0, 0, 0)" } },
            offset: 0,
            axisLabel: { interval: 0,//控制坐标轴刻度标签的显示间隔.设置成 0 强制显示所有标签。
            show: true, color: "#fff" },
            type: "category",
            axisTick: { show: false },
            data: this.xData
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLine: { lineStyle: { color: "rgba(0, 0, 0, 0)" } },
            axisLabel: { formatter: "{value}", color: "#fff", fontSize: 16 },
            axisTick: { show: false },
            splitLine: { show: false },
            min: 0,
            max: 1
          }
        ],
        series: this.series
      });
      this.chart.resize();
    }
  }
};
</script>