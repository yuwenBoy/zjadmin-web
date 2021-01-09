<template>
  <div>
    <div ref="echars" :style="{width:width,height:height}"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import { debounce } from "@/utils";
export default {
  name: "PieChart",
  props: {
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
      viewName: null
    };
  },
  watch: {
    viewName() {
      console.log("开始监听viewName=================");
      this.initEcharts();
      console.log("结束监听viewName=================");
    }
  },
  // mounted(){
  //    this.viewName = this.index;
  //   this.series = this.seriesData;
  //   this.initEcharts();
  //   this.__resizeHandler = debounce(() => {
  //     if (this.chart) {
  //       this.chart.resize();
  //     }
  //   }, 100);
  //   window.addEventListener("resize", this.__resizeHandler);
  // },
  activated() {
    this.viewName = this.index;
    this.series = this.seriesData;
    this.initEcharts();
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHandler);
  },
  deactivated() {
    console.log("deactivated=================");
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
      this.chart = echarts.init(this.$refs.echars, "macarons");
      this.chart.setOption({
        color: [
          "#2AC9FD",
          "#76FBC0",
          "#35C96E",
          "#FCC708",
          "#48B188",
          "#5957C2",
          "#4A5D73"
        ],
        series: [
          {
            type: "pie",
            radius: ["0", "50%"],
            selectedMode: "single",
            selectedOffset: 10,
            labelLine: {
              normal: {
                length: 25,
                length2: 15,
                lineStyle: {
                  type: "dashed"
                }
              }
            },
            label: {
              normal: {
                formatter: params => {
                  let desc = params.data.desc || "";
                  let unit = params.data.unit || "";
                  return (
                    "{a|" +
                    params.name +
                    "}{a|" +
                    desc +
                    ": " +
                    params.value +
                    // unit +
                    // " " +
                    // params.percent +
                    "%}"
                  );
                },
                rich: {
                  a: {
                    color: "#ffffff",
                    fontSize: 14 * 1,
                    height: 16 * 1,
                    align: "center"
                  }
                }
              }
            },
            data: this.seriesData
          }
        ]
      });
      this.chart.resize();
    }
  }
};
</script>