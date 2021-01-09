<template>
  <div>
    <div ref="echars" :style="{width:width,height:height}"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import { debounce } from "@/utils";
export default {
  name: "BarChart",
  props: {
    xData: {
      type: Object,
      default: null
    },
    yData: {
      type: Object,
      default: null
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
    },
    index: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      chart: null,
      viewName:null
    };
  },
  watch: {
   viewName(){
       console.log("开始监听viewName=================");
      this.initEcharts();
      console.log("结束监听viewName=================");
    }
  },
  activated(){
     this.viewName=this.index;
    this.xData = this.xData;
    this.yData = this.yData;
    this.series = this.seriesData;
    this.initEcharts();
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHandler);
  },
  // mounted() {
  //   this.viewName=this.index;
  //   this.xData = this.xData;
  //   this.yData = this.yData;
  //   this.series = this.seriesData;
  //   this.initEcharts();
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
        // grid: {
        //   top: 5,
        //   right: 5,
        //   left: 5,
        //   bottom: 5
        // },

        xAxis:this.xData,
        yAxis:this.yData,
        series:this.seriesData
      });
      this.chart.resize();
    }
  }
};
</script>