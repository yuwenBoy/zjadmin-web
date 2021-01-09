<template>
  <div style="height:100%;">
    <!-- 装调工时统计 -->
      <el-carousel
        trigger="click"
        :autoplay="false"
        :loop="false"
        arrow="always"
        style="height:100%;"
      >
        <el-carousel-item style="height:100%;" label="1">
          <el-row :gutter="24">
              <el-col :sm="8" :md="8" :xl="8" :lg="8" :xs="8">
              <div class="czy-home__widget">
                <div class="czy-home__widget-header">
                  <i class="czy-home__widget-header-bullet"></i>
                  <div class="czy-home__widget-title">各班组整体工时</div>
                  <div class="u-line-spacer no-left"></div>
                  <div class="czy-home__widget-append"></div>
                </div>
                <div class="czy-home__widget-content">
                  <column-chart :xData="xData1" :index="activeIndex" :seriesData="seriesData2" />
                </div>
                <div class="czy-home__widget-footer">
                  <div class="u-line-spacer"></div>
                </div>
              </div>
            </el-col>
            <el-col :sm="8" :md="8" :xl="8" :lg="8" :xs="8">
              <div class="czy-home__widget">
                <div class="czy-home__widget-header">
                  <i class="czy-home__widget-header-bullet"></i>
                  <div class="czy-home__widget-title">各型号整体工时</div>
                  <div class="u-line-spacer no-left"></div>
                  <div class="czy-home__widget-append"></div>
                </div>
                <div class="czy-home__widget-content">
                  <column-chart :xData="xData1" :index="activeIndex" :seriesData="seriesData2" />
                </div>
                <div class="czy-home__widget-footer">
                  <div class="u-line-spacer"></div>
                </div>
              </div>
            </el-col>
            <el-col :sm="8" :md="8" :xl="8" :lg="8" :xs="8">
              <div class="czy-home__widget">
                <div class="czy-home__widget-header">
                  <i class="czy-home__widget-header-bullet"></i>
                  <div class="czy-home__widget-title">工时趋势分析</div>
                  <div class="u-line-spacer no-left"></div>
                  <div class="czy-home__widget-append"></div>
                </div>
                <div class="czy-home__widget-content">
                  <column-chart :xData="xData1" :index="activeIndex" :seriesData="seriesData2" />
                </div>
                <div class="czy-home__widget-footer">
                  <div class="u-line-spacer"></div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24" style="margin-top:15px;">
            <el-col :sm="8" :md="8" :xl="8" :lg="8" :xs="8">
              <div class="czy-home__widget">
                <div class="czy-home__widget-header">
                  <i class="czy-home__widget-header-bullet"></i>
                  <div class="czy-home__widget-title">装配班组人员工时排行</div>
                  <div class="u-line-spacer no-left"></div>
                  <div class="czy-home__widget-append"></div>
                </div>
                <div class="czy-home__widget-content">
                  <bar-chart
                    :xData="personTask[0]"
                    :yData="personTask[1]"
                    :seriesData="personTask[2]"
                    :index="activeIndex"
                  />
                </div>
                <div class="czy-home__widget-footer">
                  <div class="u-line-spacer"></div>
                </div>
              </div>
            </el-col>
            <el-col :sm="8" :md="8" :xl="8" :lg="8" :xs="8">
              <div class="czy-home__widget">
                <div class="czy-home__widget-header">
                  <i class="czy-home__widget-header-bullet"></i>
                  <div class="czy-home__widget-title">调试1班组人员工时排行</div>
                  <div class="u-line-spacer no-left"></div>
                  <div class="czy-home__widget-append"></div>
                </div>
                <div class="czy-home__widget-content">
                  <bar-chart
                    :xData="classTask[0]"
                    :yData="classTask[1]"
                    :seriesData="classTask[2]"
                    :index="activeIndex"
                  />
                </div>
                <div class="czy-home__widget-footer">
                  <div class="u-line-spacer"></div>
                </div>
              </div>
            </el-col>
            <el-col :sm="8" :md="8" :xl="8" :lg="8" :xs="8">
              <div class="czy-home__widget">
                <div class="czy-home__widget-header">
                  <i class="czy-home__widget-header-bullet"></i>
                  <div class="czy-home__widget-title">调试2班组人员工时排行</div>
                  <div class="u-line-spacer no-left"></div>
                  <div class="czy-home__widget-append"></div>
                </div>
                <div class="czy-home__widget-content">
                  <bar-chart :xData="deptTask[0]" :yData="deptTask[1]" :index="activeIndex" :seriesData="deptTask[2]" />
                </div>
                <div class="czy-home__widget-footer">
                  <div class="u-line-spacer"></div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-carousel-item>
         <el-carousel-item style="height:100%;" label="2">
          <el-row :gutter="24">
            <el-col :sm="8" :md="8" :xl="8" :lg="8" :xs="8">
              <div class="czy-home__widget">
                <div class="czy-home__widget-header">
                  <i class="czy-home__widget-header-bullet"></i>
                  <div class="czy-home__widget-title">某型任务排行情况</div>
                  <div class="u-line-spacer no-left"></div>
                  <div class="czy-home__widget-append"></div>
                </div>
                <div class="czy-home__widget-content">
                  <bar-chart :xData="testTask[0]"  :index="activeIndex" :yData="testTask[1]" :seriesData="testTask[2]" />
                </div>
                <div class="czy-home__widget-footer">
                  <div class="u-line-spacer"></div>
                </div>
              </div>
            </el-col>
             <el-col :sm="8" :md="8" :xl="8" :lg="8" :xs="8">
              <div class="czy-home__widget">
                <div class="czy-home__widget-header">
                  <i class="czy-home__widget-header-bullet"></i>
                  <div class="czy-home__widget-title">车间工时统计情况</div>
                  <div class="u-line-spacer no-left"></div>
                  <div class="czy-home__widget-append"></div>
                </div>
                <div class="czy-home__widget-content">
                   <line-chart :index="activeIndex" :seriesData="data1" />
                </div>
                <div class="czy-home__widget-footer">
                  <div class="u-line-spacer"></div>
                </div>
              </div>
            </el-col>
            <el-col :sm="8" :md="8" :xl="8" :lg="8" :xs="8">
              <div class="czy-home__widget">
                <div class="czy-home__widget-header">
                  <i class="czy-home__widget-header-bullet"></i>
                  <div class="czy-home__widget-title">任务工时总数统计情况</div>
                  <div class="u-line-spacer no-left"></div>
                  <div class="czy-home__widget-append"></div>
                </div>
                <div class="czy-home__widget-content">
                   <line-chart :index="activeIndex" :seriesData="data2" />
                </div>
                <div class="czy-home__widget-footer">
                  <div class="u-line-spacer"></div>
                </div>
              </div>
            </el-col>
            <!-- <el-col :sm="8" :md="8" :xl="8" :lg="8" :xs="8">
              <div class="czy-home__widget">
                <div class="czy-home__widget-header">
                  <i class="czy-home__widget-header-bullet"></i>
                  <div class="czy-home__widget-title">班组补投工时情况</div>
                  <div class="u-line-spacer no-left"></div>
                  <div class="czy-home__widget-append"></div>
                </div>
                <div class="czy-home__widget-content">
                   <bar-chart :xData="classBuTou[0]" :index="activeIndex" :yData="classBuTou[1]" :seriesData="classBuTou[2]" />
                </div>
                <div class="czy-home__widget-footer">
                  <div class="u-line-spacer"></div>
                </div>
              </div>
            </el-col> -->
            <!-- <el-col :sm="8" :md="8" :xl="8" :lg="8" :xs="8">
              <div class="czy-home__widget">
                <div class="czy-home__widget-header">
                  <i class="czy-home__widget-header-bullet"></i>
                  <div class="czy-home__widget-title">事业部补投工时情况</div>
                  <div class="u-line-spacer no-left"></div>
                  <div class="czy-home__widget-append"></div>
                </div>
                <div class="czy-home__widget-content">
                  <bar-chart :xData="deptBuTou[0]" :index="activeIndex" :yData="deptBuTou[1]" :seriesData="deptBuTou[2]" />
                </div>
                <div class="czy-home__widget-footer">
                  <div class="u-line-spacer"></div>
                </div>
              </div>
            </el-col> -->
          </el-row>
          <el-row :gutter="24" style="margin-top:15px;">
            <!-- <el-col :sm="8" :md="8" :xl="8" :lg="8" :xs="8">
              <div class="czy-home__widget">
                <div class="czy-home__widget-header">
                  <i class="czy-home__widget-header-bullet"></i>
                  <div class="czy-home__widget-title">某型任务补投工时情况</div>
                  <div class="u-line-spacer no-left"></div>
                  <div class="czy-home__widget-append"></div>
                </div>
                <div class="czy-home__widget-content">
                  <bar-chart
                    :xData="testTeskBuTou[0]"
                    :yData="testTeskBuTou[1]"
                    :seriesData="testTeskBuTou[2]"
                    :index="activeIndex"
                  />
                </div>
                <div class="czy-home__widget-footer">
                  <div class="u-line-spacer"></div>
                </div>
              </div>
            </el-col> -->
          </el-row>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 装调工时统计 -->
</template>

<script>
import EConst from "@/api/datafx/dataConst.js";
import echarts from "echarts";
import ColumnChart from "@/components/Echarts/ColumnChart.vue";
import BarChart from "@/components/Echarts/BarChart.vue";
import LineChart from "@/components/Echarts/LineChart.vue"
export default {
  name: "jobTimeTotal",
  components: { ColumnChart, BarChart,LineChart },
  data() {
    return {
      activeIndex: "jobTimeTotal",
      // 装调工时统计 班组整体工时
      seriesData2: [
        {
          name: "实际生产工时",
          type: "bar",
          barWidth: "18%",
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#8bd46e"
                },
                {
                  offset: 1,
                  color: "#09bcb7"
                }
              ]),
              barBorderRadius: 11
            }
          },
          data: [10, 10, 20, 20, 20, 10, 10]
        },
        {
          name: "标准工时",
          type: "bar",
          barWidth: "18%",
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#248ff7"
                },
                {
                  offset: 1,
                  color: "#6851f1"
                }
              ]),
              barBorderRadius: 12
            }
          },
          data: [10, 20, 20, 10, 10, 20, 10]
        },
        {
          name: "返修工时",
          type: "bar",
          barWidth: "18%",
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#fccb05"
                },
                {
                  offset: 1,
                  color: "#f5804d"
                }
              ]),
              barBorderRadius: 12
            }
          },
          data: [10, 20, 20, 10, 10, 20, 10]
        }
      ],
      // x轴值
      xData1: EConst.EchartsDateBy.week(),
      // 装调工时统计 班组整体工时 x轴值
      xData2: EConst.EchartsBussBy.className(),
      // 装调工时统计 事业部工时 x轴值
      xData3:EConst.EchartsBussBy.deptName(),
       // 人员任务排行
      personTask: [
        {
          max: 100, // x轴刻度0~100
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
        },
        {
          type: "category",
          inverse: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#FFFFFF"
            }
          },
          data: [
            "人员1",
            "人员2",
            "人员3",
            "人员4",
            "人员5",
            "人员6",
            "人员7",
            "人员8"
          ]
        },
        [
          {
            name: "任务1",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [20, 11, 6, 18, 16, 19, 10, 60],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#FFF0A0"
                    },
                    {
                      offset: 1,
                      color: "#FFD355"
                    }
                  ],
                  false
                )
              }
            }
          },
          {
            name: "任务2",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [10, 11, 6, 8, 6, 9, 10],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#FFABAC"
                    },
                    {
                      offset: 1,
                      color: "#FF6772"
                    }
                  ],
                  false
                )
              }
            }
          },
          {
            name: "任务3",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [10, 11, 6, 8, 6, 9, 10],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#90BEFF"
                    },
                    {
                      offset: 1,
                      color: "#5EA1FF"
                    }
                  ],
                  false
                )
              }
            }
          },
          {
            name: "任务4",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [10, 11, 6, 8, 6, 9, 10],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#90BEFF"
                    },
                    {
                      offset: 1,
                      color: "#5EA1FF"
                    }
                  ],
                  false
                )
              }
            }
          }
        ]
      ], 
      // 班组任务排行
      classTask: [
        {
          max: 100, // x轴刻度0~100
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
        },
        {
          type: "category",
          inverse: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#FFFFFF"
            }
          },
          data: [
            "班组1",
            "班组2",
            "班组3",
            "班组4",
            "班组5",
            "班组6",
            "班组7",
            "班组8"
          ]
        },
        [
          {
            name: "任务1",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [20, 11, 6, 18, 16, 19, 10, 60],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#FFF0A0"
                    },
                    {
                      offset: 1,
                      color: "#FFD355"
                    }
                  ],
                  false
                )
              }
            }
          },
          {
            name: "任务2",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [10, 11, 6, 8, 6, 9, 10],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#FFABAC"
                    },
                    {
                      offset: 1,
                      color: "#FF6772"
                    }
                  ],
                  false
                )
              }
            }
          },
          {
            name: "任务3",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [10, 11, 6, 8, 6, 9, 10],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#90BEFF"
                    },
                    {
                      offset: 1,
                      color: "#5EA1FF"
                    }
                  ],
                  false
                )
              }
            }
          },
          {
            name: "任务4",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [10, 11, 6, 8, 6, 9, 10],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#90BEFF"
                    },
                    {
                      offset: 1,
                      color: "#5EA1FF"
                    }
                  ],
                  false
                )
              }
            }
          }
        ]
      ],
       // 事业部任务排行
      deptTask: [
        {
          max: 100, // x轴刻度0~100
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
        },
        {
          type: "category",
          inverse: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#FFFFFF"
            }
          },
          data: ["事业部1", "事业部2", "事业部3"]
        },
        [
          {
            name: "任务1",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [20, 11, 6],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#FFF0A0"
                    },
                    {
                      offset: 1,
                      color: "#FFD355"
                    }
                  ],
                  false
                )
              }
            }
          },
          {
            name: "任务2",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [10, 11, 6],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#FFABAC"
                    },
                    {
                      offset: 1,
                      color: "#FF6772"
                    }
                  ],
                  false
                )
              }
            }
          },
          {
            name: "任务3",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [10, 11, 6],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#90BEFF"
                    },
                    {
                      offset: 1,
                      color: "#5EA1FF"
                    }
                  ],
                  false
                )
              }
            }
          },
          {
            name: "任务4",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [10, 11, 6],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#90BEFF"
                    },
                    {
                      offset: 1,
                      color: "#5EA1FF"
                    }
                  ],
                  false
                )
              }
            }
          }
        ]
      ],
      // 【某型任务排行情况】
      testTask:[ 
          {
          max: 100, // x轴刻度0~100
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
        },
        {
          type: "category",
          inverse: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#FFFFFF"
            }
          },
          data: ["某型1", "某型2", "某型3","某型4", "某型5", "某型6","某型7", "某型8"]
        },
        [
          {
            name: "任务1",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [20, 11, 6,60,50,30,35,20],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#FFF0A0"
                    },
                    {
                      offset: 1,
                      color: "#FFD355"
                    }
                  ],
                  false
                )
              }
            }
          },
          {
            name: "任务2",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [10, 11, 6,93,85,56,80,40],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#FFABAC"
                    },
                    {
                      offset: 1,
                      color: "#FF6772"
                    }
                  ],
                  false
                )
              }
            }
          },
          {
            name: "任务3",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [10, 11, 6,50,80,65,60,55],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#90BEFF"
                    },
                    {
                      offset: 1,
                      color: "#5EA1FF"
                    }
                  ],
                  false
                )
              }
            }
          },
          {
            name: "任务4",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [10, 11, 6,40,15,55,65,45],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#90BEFF"
                    },
                    {
                      offset: 1,
                      color: "#5EA1FF"
                    }
                  ],
                  false
                )
              }
            }
          }
        ]
      ],
       // 【班组补投工时情况】
      classBuTou:[ 
          {
          max: 100, // x轴刻度0~100
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
        },
        {
          type: "category",
          inverse: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#FFFFFF"
            }
          },
          data: ["班组1", "班组2", "班组3","班组4", "班组5", "班组6","班组7", "班组8"]
        },
        [
          {
            name: "任务1",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [50, 70, 60,30,50,30,35,20],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#FFF0A0"
                    },
                    {
                      offset: 1,
                      color: "#FFD355"
                    }
                  ],
                  false
                )
              }
            }
          },
          {
            name: "任务2",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [20, 41, 66,93,85,56,80,40],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#FFABAC"
                    },
                    {
                      offset: 1,
                      color: "#FF6772"
                    }
                  ],
                  false
                )
              }
            }
          },
          {
            name: "任务3",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [50, 51, 46,50,80,65,60,55],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#90BEFF"
                    },
                    {
                      offset: 1,
                      color: "#5EA1FF"
                    }
                  ],
                  false
                )
              }
            }
          },
          {
            name: "任务4",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [30, 21, 16,40,15,55,65,45],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#90BEFF"
                    },
                    {
                      offset: 1,
                      color: "#5EA1FF"
                    }
                  ],
                  false
                )
              }
            }
          }
        ]
      ],
        // 【事业部补投工时情况】
      deptBuTou:[ 
          {
          max: 100, // x轴刻度0~100
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
        },
        {
          type: "category",
          inverse: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#FFFFFF"
            }
          },
          data: ["事业部1", "事业部2", "事业部3"]
        },
        [
          {
            name: "任务1",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [50, 70, 60],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#FFF0A0"
                    },
                    {
                      offset: 1,
                      color: "#FFD355"
                    }
                  ],
                  false
                )
              }
            }
          },
          {
            name: "任务2",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [20, 41, 66],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#FFABAC"
                    },
                    {
                      offset: 1,
                      color: "#FF6772"
                    }
                  ],
                  false
                )
              }
            }
          },
          {
            name: "任务3",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [50, 51, 46],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#90BEFF"
                    },
                    {
                      offset: 1,
                      color: "#5EA1FF"
                    }
                  ],
                  false
                )
              }
            }
          },
          {
            name: "任务4",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [30, 21, 16],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#90BEFF"
                    },
                    {
                      offset: 1,
                      color: "#5EA1FF"
                    }
                  ],
                  false
                )
              }
            }
          }
        ]
      ],
         // 【某型任务补投工时情况】
      testTeskBuTou:[ 
          {
          max: 100, // x轴刻度0~100
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
        },
        {
          type: "category",
          inverse: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#FFFFFF"
            }
          },
          data: ["某型1", "某型2", "某型3","某型4", "某型5", "某型6","某型7", "某型8"]
        },
        [
          {
            name: "任务1",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [20, 11, 6,60,50,30,35,20],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#FFF0A0"
                    },
                    {
                      offset: 1,
                      color: "#FFD355"
                    }
                  ],
                  false
                )
              }
            }
          },
          {
            name: "任务2",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [10, 11, 6,93,85,56,80,40],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#FFABAC"
                    },
                    {
                      offset: 1,
                      color: "#FF6772"
                    }
                  ],
                  false
                )
              }
            }
          },
          {
            name: "任务3",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [10, 11, 6,50,80,65,60,55],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#90BEFF"
                    },
                    {
                      offset: 1,
                      color: "#5EA1FF"
                    }
                  ],
                  false
                )
              }
            }
          },
          {
            name: "任务4",
            type: "bar",
            // 宽度
            barWidth: "16",
            // 堆叠
            stack: "总量",
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: "#EEF2F9"
            },
            data: [10, 11, 6,40,15,55,65,45],
            itemStyle: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 16
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#90BEFF"
                    },
                    {
                      offset: 1,
                      color: "#5EA1FF"
                    }
                  ],
                  false
                )
              }
            }
          }
        ]
      ],
      data1: [
        {
          name: "车间1",
          type: "line",
          data: [0.1, 0.2, 0.6, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.5]
        },
        {
          name: "车间2",
          type: "line",
          data: [0.1, 0.3, 0.5, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.5]
        },
        {
          name: "车间3",
          type: "line",
          data: [0.1, 0.3, 0.2, 0.8, 0.4, 0.8, 0.1, 0.9, 0.4, 0.6, 0.4, 0.5]
        }
      ],
      data2:[
         {
             name: '车间1',
             type: 'line',
             smooth: false,
             //  symbol: "none", //去掉折线点
             stack: 100,
             itemStyle: {
                 normal: { //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                         offset: 0,
                         color: '#0FDE88' // 0% 处的颜色
                     }, {
                         offset: 0.5,
                         color: '#24C47E' // 100% 处的颜色
                     }, {
                         offset: 1,
                         color: '#05DE5F' // 100% 处的颜色
                     }]), //背景渐变色
                     lineStyle: { // 系列级个性化折线样式
                         width: 2,
                         type: 'solid',
                         color: "#039339"
                     }
                 },
                 emphasis: {
                     color: '#02675f',
                     lineStyle: { // 系列级个性化折线样式
                         width: 0.5,
                         type: 'dotted',
                         color: "#02675f" //折线的颜色
                     }
                 }
             }, //线条样式
             symbolSize: 9, //折线点的大小
             areaStyle: {
                 normal: {}
             },
              data: [0.1, 0.3, 0.2, 0.8, 0.4, 0.8, 0.1, 0.9, 0.4, 0.6, 0.4, 0.5],
         },

     {
             name: '车间2',
             type: 'line',
             smooth: true,
             //  symbol: "none", //去掉折线点
             stack: 100,
             itemStyle: {
                 normal: { //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                         offset: 0,
                         color: 'red' // 0% 处的颜色
                     }, {
                         offset: 0.5,
                         color: 'red' // 100% 处的颜色
                     }, {
                         offset: 1,
                         color: 'red' // 100% 处的颜色
                     }]), //背景渐变色
                     lineStyle: { // 系列级个性化折线样式
                         width: 2,
                         type: 'solid',
                         color: "red"
                     }
                 },
                 emphasis: {
                     color: 'red',
                     lineStyle: { // 系列级个性化折线样式
                         width: 0.5,
                         type: 'dotted',
                         color: "red" //折线的颜色
                     }
                 }
             }, //线条样式
             symbolSize: 9, //折线点的大小
             areaStyle: {
                 normal: {}
             },
            data: [0.1, 0.3, 0.2, 0.8, 0.4, 0.8, 0.1, 0.9, 0.4, 0.6, 0.4, 0.5],
         },
         {
             name: '车间3',
             type: 'line',
             smooth: true,
             //  symbol: "none", //去掉折线点
             stack: 100,
             itemStyle: {
                 normal: { //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                         offset: 0,
                         color: '#64CAFA' // 0% 处的颜色
                     }, {
                         offset: 0.5,
                         color: '#64CAFA' // 100% 处的颜色
                     }, {
                         offset: 1,
                         color: '#0078D7' // 100% 处的颜色
                     }]), //背景渐变色
                     lineStyle: { // 系列级个性化折线样式
                         width: 2,
                         type: 'solid',
                         color: "#0078D7"
                     }
                 },
                 emphasis: {
                     color: '#02675f',
                     lineStyle: { // 系列级个性化折线样式
                         width: 0.5,
                         type: 'dotted',
                         color: "#02675f" //折线的颜色
                     }
                 }
             }, //线条样式
             symbolSize: 9, //折线点的大小
             areaStyle: {
                 normal: {}
             },
            data: [0.1, 0.3, 0.2, 0.8, 0.4, 0.8, 0.1, 0.9, 0.4, 0.6, 0.4, 0.5],
         },

     
     ]
    };
  }
};
</script>
<style>
@import "../style/echrts.css";
.el-carousel__container {
  position: relative;
  height: 100%;
}
</style>