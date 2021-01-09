<template>
  <div>
    <div ref="echars" :style="{width:width,height:height}"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import { debounce } from "@/utils";
export default {
  name: "GaugeChart",
  props: {
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "80px"
    },
     valData: {
      type: Number,
      default: null
    },
  },
  data() {
    return {
      chart: null,
      val:null
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
    seriesData() {
      this.initEcharts();
    }
  },
  activated() {
    this.viewName = this.index;
    this.val = this.valData;
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
        series: [
        {
          //背景刻度
          name: "背景刻度",
          type: "gauge",

          min: 0,
          max: 100,

          endAngle: -45,
          zlevel: 20,
          axisLine: {
            show: false,
            lineStyle: {
              width: 0,
              shadowBlur: 0,
              color: [[1, "#ccc"]]
            }
          },
          axisTick: {
            show: false,
            lineStyle: {
              color: "red",
              width: 1
            },
            length: 10,
            splitNumber: 3
          },
          splitLine: {
            show: false,
            length: 20,
            lineStyle: {
              color: "#aaa"
            }
          },
          axisLabel: {
            show: false
          },
          detail: {
            show: false
          }
        },
        {
          //进度轴线
          name: "进度",
          type: "gauge",
          radius: "90%", //进度轴尺寸略大
          endAngle: -45,
          zlevel: 20,
          animationEasing: "bounceInOut",
          animationDelay: function(idx) {
            return idx * 1000;
          },
          axisLine: {
            show: false,
            lineStyle: {
              width: 0,
              shadowBlur: 0,
              color: [[1, "#fff"]]
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          detail: {
            show: false,
            offsetCenter: ["-90%", "-50%"], // x, y，单位px
            textStyle: {
              fontWeight: 700,
              color: "#00d5d1",
              fontSize: 26
            },
            formatter: "{value}%"
          },
          pointer: {
            show: true,
            length: "60%",
            width: 6
          }, // 其他演示在itemStyle中调试
          // 不是整个canvas的title
          title: {
            color: "#fff",
            fontSize: 22,
            fontWeight: 700,
            offsetCenter: ["-85%", "-70%"]
          },
          data: [
            // data数据为实时数据
            {
              name: "",
              value:this.val
            }
          ]
        },
        {
          name: "进度展示条",
          type: "pie",
          radius: ["71%", "79%"],
          avoidLabelOverlap: false,
          silent: true,
          startAngle: 225,
          zlevel: 1,
          animationEasing: "bounceIn",
          animationDelay: function(idx) {
            return idx * 1000;
          },
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            {
              // 展示数据
              value: this.val * 1, //270(度数)*80(展示数据具体值)*0.01(百分占比常数)
              name: "显示进度条",
              itemStyle: {
                normal: {
                  color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: "#f84fa6" // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "#f88a4e" // 100% 处的颜色
                      }
                    ],
                    globalCoord: false // 缺省为 false
                  },
                  shadowColor: "rgba(0, 0, 0, 0.2)",
                  shadowBlur: 10
                }
              }
            },
            {
              // 空白数据
              value: 100 * (1 - this.val * 0.01), //270*(1-80*0.01)
              name: "隐藏进度条",
              itemStyle: {
                normal: {
                  color: "rgba(2,45,73,.5)",
                  shadowColor: "rgba(0, 0, 0, 0.1)",
                  shadowBlur: 10
                }
              }
            },
            {
              // 占位数据(写死)
              value: 30,
              name: "空白部分",
              itemStyle: {
                normal: {
                  color: "#000"
                }
              }
            }
          ]
        }
      ]
      });

      this.chart.resize();
    }
  }
};
</script>