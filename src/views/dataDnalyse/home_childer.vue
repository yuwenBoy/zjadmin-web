<template>
  <div class="mainContent">
    <div class="header-left">
      <!-- <el-row :gutter="24">
        <el-col :sm="4" :md="4" :lg="4">
          <div class="data-gauge__label-text">
            <span class="header-left-label">周进度</span>
          </div>
          <div class="data-gauge__value u-small-digit">35%</div>
            <gauge-chart :valData="35" />

        </el-col>
        <el-col :sm="4" :md="4" :lg="4">
          <div class="data-gauge__label-text">
            <span class="header-left-label">月进度</span>
          </div>
          <div class="data-gauge__value u-small-digit">15%</div>
          <gauge-chart :valData="15" />
        </el-col>
        <el-col :sm="4" :md="4" :lg="4">
          <div class="data-gauge__label-text">
            <span class="header-left-label">年进度</span>
          </div>
          <div class="data-gauge__value u-small-digit">75%</div>
          <gauge-chart :valData="75" />
        </el-col>
        <el-col :sm="4" :md="4" :lg="4">
          <div class="data-gauge__label-text">
            <span class="header-left-label">温度</span>
          </div>
          <div class="data-gauge__value u-small-digit">38℃</div>
        </el-col>
        <el-col :sm="4" :md="4" :lg="4">
          <div class="data-gauge__label-text">
            <span class="header-left-label">湿度</span>
          </div>
          <div class="data-gauge__value u-small-digit">50%</div>
        </el-col>
        <el-col :sm="4" :md="4" :lg="4">
          <div class="data-gauge__label-text">
            <span class="header-left-label">气压</span>
          </div>
          <div class="data-gauge__value u-small-digit">101.325kPa</div>
        </el-col>
      </el-row>-->
    </div>
    <div class="play">
      <el-carousel
        indicator-position="outside"
        :interval="5000"
        style="height:73%;overflow-y:hidden;"
      >
        <el-carousel-item style="height:100%;">
          <img src="../../assets/images/159.jpg" style="width:100%;">
        </el-carousel-item>
        <el-carousel-item style="height:100%;">
          <img src="../../assets/images/168-1.jpg" style="width:100%;">
        </el-carousel-item>
        <el-carousel-item style="height:100%;">
          <img src="../../assets/images/169.jpg" style="width:100%;">
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="layout-table-grid czy-home-grid">
      <table class="layout-table-grid__table">
        <tr>
          <td>
            <div class="layout-table-grid__cell-content">
              <div class="czy-home__widget">
                <div class="czy-home__widget-header">
                  <i class="czy-home__widget-header-bullet" />
                  <div class="czy-home__widget-title">工序计划工单</div>
                  <div class="u-line-spacer no-left" />
                  <div class="czy-home__widget-append" />
                </div>
                <div class="czy-home__widget-content">
                  <bar-chart
                    :x-data="classTask[0]"
                    :y-data="classTask[1]"
                    :series-data="classTask[2]"
                    :height="height"
                    :index="activeIndex"
                  />
                </div>
                <div class="czy-home__widget-footer">
                  <div class="u-line-spacer" />
                </div>
              </div>
            </div>
          </td>
          <td />
          <td />
          <td>
            <div class="layout-table-grid__cell-content">
              <div class="czy-home__widget">
                <div class="czy-home__widget-header">
                  <i class="czy-home__widget-header-bullet" />
                  <div class="czy-home__widget-title">物料库存统计</div>
                  <div class="u-line-spacer no-left" />
                  <div class="czy-home__widget-append" />
                </div>
                <div class="czy-home__widget-content">
                  <column-chart
                    :index="activeIndex"
                    :x-data="xData1"
                    :height="height"
                    :series-data="seriesData2"
                  />
                </div>
                <div class="czy-home__widget-footer">
                  <div class="u-line-spacer" />
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="layout-table-grid__cell-content">
              <div class="czy-home__widget">
                <div class="czy-home__widget-header">
                  <i class="czy-home__widget-header-bullet" />
                  <div class="czy-home__widget-title">班组工单</div>
                  <div class="u-line-spacer no-left" />
                  <div class="czy-home__widget-append" />
                </div>
                <div class="czy-home__widget-content">
                  <bar-chart
                    :x-data="classTask2[0]"
                    :y-data="classTask2[1]"
                    :series-data="classTask2[2]"
                    :index="activeIndex"
                    :height="height"
                  />
                </div>
                <div class="czy-home__widget-footer">
                  <div class="u-line-spacer" />
                </div>
              </div>
            </div>
          </td>
          <td />
          <td />
          <td>
            <div class="layout-table-grid__cell-content">
              <div class="czy-home__widget">
                <div class="czy-home__widget-header">
                  <i class="czy-home__widget-header-bullet" />
                  <div class="czy-home__widget-title">生产处任务物料齐套统计</div>
                  <div class="u-line-spacer no-left" />
                  <div class="czy-home__widget-append" />
                </div>
                <div class="czy-home__widget-content">
                  <column-chart
                    :index="activeIndex"
                    :x-data="xData2"
                    :height="height"
                    :series-data="seriesData2"
                  />
                </div>
                <div class="czy-home__widget-footer">
                  <div class="u-line-spacer" />
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="layout-table-grid__cell-content">
              <div class="czy-home__widget">
                <div class="czy-home__widget-header">
                  <i class="czy-home__widget-header-bullet" />
                  <div class="czy-home__widget-title">准时交付率</div>
                  <div class="u-line-spacer no-left" />
                  <div class="czy-home__widget-append" />
                </div>
                <div class="czy-home__widget-content">
                  <line-chart :index="activeIndex" :height="height" :series-data="seriesData7" />
                </div>
                <div class="czy-home__widget-footer">
                  <div class="u-line-spacer" />
                </div>
              </div>
            </div>
          </td>
          <td />
          <td />
          <td>
            <div class="layout-table-grid__cell-content">
              <div class="czy-home__widget">
                <div class="czy-home__widget-header">
                  <i class="czy-home__widget-header-bullet" />
                  <div class="czy-home__widget-title">质量数据统计</div>
                  <div class="u-line-spacer no-left" />
                  <div class="czy-home__widget-append" />
                </div>
                <div class="czy-home__widget-content">4</div>
                <div class="czy-home__widget-footer">
                  <div class="u-line-spacer" />
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="layout-table-grid__cell-content">
              <div class="czy-home__widget">
                <div class="czy-home__widget-header">
                  <i class="czy-home__widget-header-bullet" />
                  <div class="czy-home__widget-title">产量统计</div>
                  <div class="u-line-spacer no-left" />
                  <div class="czy-home__widget-append" />
                </div>
                <div class="czy-home__widget-content">
                  <bar-chart
                    :x-data="classTask2[0]"
                    :y-data="classTask2[1]"
                    :series-data="classTask2[2]"
                    :index="activeIndex"
                  />
                </div>
                <div class="czy-home__widget-footer">
                  <div class="u-line-spacer" />
                </div>
              </div>
            </div>
          </td>
          <td>
            <div class="layout-table-grid__cell-content">
              <div class="czy-home__widget">
                <div class="czy-home__widget-header">
                  <i class="czy-home__widget-header-bullet" />
                  <div class="czy-home__widget-title">工时统计</div>
                  <div class="u-line-spacer no-left" />
                  <div class="czy-home__widget-append" />
                </div>
                <div class="czy-home__widget-content">2</div>
                <div class="czy-home__widget-footer">
                  <div class="u-line-spacer" />
                </div>
              </div>
            </div>
          </td>
          <td>
            <div class="layout-table-grid__cell-content">
              <div class="czy-home__widget">
                <div class="czy-home__widget-header">
                  <i class="czy-home__widget-header-bullet" />
                  <div class="czy-home__widget-title">设备使用率</div>
                  <div class="u-line-spacer no-left" />
                  <div class="czy-home__widget-append" />
                </div>
                <div class="czy-home__widget-content">3</div>
                <div class="czy-home__widget-footer">
                  <div class="u-line-spacer" />
                </div>
              </div>
            </div>
          </td>
          <td>
            <div class="layout-table-grid__cell-content">
              <div class="czy-home__widget">
                <div class="czy-home__widget-header">
                  <i class="czy-home__widget-header-bullet" />
                  <div class="czy-home__widget-title">报警日历</div>
                  <div class="u-line-spacer no-left" />
                  <div class="czy-home__widget-append" />
                </div>
                <div class="czy-home__widget-content">4</div>
                <div class="czy-home__widget-footer">
                  <div class="u-line-spacer" />
                </div>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import EConst from '@/api/datafx/dataConst.js'
import GaugeChart from '@/components/Echarts/GaugeChart.vue'
import BarChart from '@/components/Echarts/BarChart.vue'
import LineChart from '@/components/Echarts/LineChart.vue'
import ColumnChart from '@/components/Echarts/ColumnChart.vue'
export default {
  components: { GaugeChart, BarChart, LineChart, ColumnChart },
  data() {
    return {
      activeIndex: 'home',
      height: '200px',
      xData1: EConst.EchartsBussBy.ljName(),
      xData2: EConst.EchartsBussBy.wuliaoName(),
      seriesData2: [
        {
          name: '',
          type: 'bar',
          barWidth: '15',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#66FF66'
                },
                {
                  offset: 1,
                  color: '#00CA98'
                }
              ]),
              barBorderRadius: 11
            }
          },
          label: {
            normal: {
              show: true,
              lineHeight: 30,
              width: 80,
              height: 30,
              backgroundColor: 'rgba(0,160,221,0.1)',
              borderRadius: 200,
              position: ['-8', '-60'],
              distance: 1,
              formatter: ['    {d|●}', ' {a|{c}}     \n', '    {b|}'].join(','),
              rich: {
                d: {
                  color: '#3CDDCF'
                },
                a: {
                  color: '#fff',
                  align: 'center'
                },
                b: {
                  width: 1,
                  height: 30,
                  borderWidth: 1,
                  borderColor: '#234e6c',
                  align: 'left'
                }
              }
            }
          },
          data: [10, 10, 20, 20, 20]
        }
      ],
      classTask2: [
        {
          max: 1200, // x轴刻度0~100
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(0, 0, 0, 0)'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#FFFFFF'
            }
          }
        },
        {
          type: 'category',
          inverse: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#FFFFFF'
            }
          },
          data: ['设备1', '设备2', '设备3', '设备4', '设备5']
        },
        [
          {
            name: '班组工单',
            type: 'bar',
            // 宽度
            barWidth: '10',
            // 堆叠
            stack: '总量',
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: '#EEF2F9'
            },
            data: [520, 111, 116, 118, 116],
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
                      color: '#FFF0A0'
                    },
                    {
                      offset: 1,
                      color: '#FFD355'
                    }
                  ],
                  false
                )
              }
            }
          },
          {
            name: '总工单',
            type: 'bar',
            // 宽度
            barWidth: '10',
            // 堆叠
            stack: '总量',
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: '#EEF2F9'
            },
            data: [510, 511, 556, 548, 556],
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
                      color: '#FFABAC'
                    },
                    {
                      offset: 1,
                      color: '#FF6772'
                    }
                  ],
                  false
                )
              }
            }
          }
        ]
      ],
      classTask: [
        {
          max: 1000, // x轴刻度0~100
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(0, 0, 0, 0)'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#FFFFFF'
            }
          }
        },
        {
          type: 'category',
          inverse: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#FFFFFF'
            }
          },
          data: ['立体库', '装配线', '检测线', '机加1', '机加2']
        },
        [
          {
            name: '计划完成',
            type: 'bar',
            // 宽度
            barWidth: '10',
            // 堆叠
            stack: '总量',
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: '#EEF2F9'
            },
            data: [520, 111, 116, 118, 116],
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
                      color: '#FFF0A0'
                    },
                    {
                      offset: 1,
                      color: '#FFD355'
                    }
                  ],
                  false
                )
              }
            }
          },
          {
            name: '总工单',
            type: 'bar',
            // 宽度
            barWidth: '10',
            // 堆叠
            stack: '总量',
            showBackground: true,
            // 全部背景
            backgroundStyle: {
              color: '#EEF2F9'
            },
            data: [510, 511, 556, 548, 556],
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#66FF66'
                  },
                  {
                    offset: 1,
                    color: '#00CA98'
                  }
                ])
              }
            }
          }
        ]
      ],
      seriesData7: [
        {
          name: '总工单',
          type: 'bar',
          stack: '总量',
          barWidth: '18%',
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
          name: '完成工单',
          type: 'bar',
          stack: '总量',
          barWidth: '18%',
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
            0.19
          ]
        }
      ]
    }
  }
}
</script>
<style  scoped>
/* @import "./style/echrts.css"; */
.mainContent {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
.header-left {
  position: absolute;
  left: 5vw;
  top: 20px;
  z-index: 110;
  width: 100vw;
}
.header-left-label {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
}
.data-gauge__value {
  letter-spacing: 0.06em;
}
.u-small-digit {
  font-family: 思源黑体, Source Han Sans, 黑体, Hei, Heiti SC, sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: #00d5d1;
}
.data-gauge__label-text {
  font-size: 14px;
  line-height: 18px;
  color: #fff;
}
.play {
  width: 50%;
  height: 84%;
  margin-top: 8%;
  margin-left: 25%;
}
.czy-home-grid {
  position: absolute;
  top: 120px;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  padding: 10px;
}
.czy-home-grid .layout-table-grid__table {
  width: 100%;
  height: 100%;
  table-layout: fixed;
  border-spacing: 0;
  border-collapse: collapse;
}
.layout-table-grid__table tr td {
  width: 25vw;
}
</style>
