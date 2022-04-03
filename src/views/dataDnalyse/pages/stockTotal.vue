<template>
  <div>
    <template>
      <div>
        <!-- 物料库存统计 -->
        <el-row :gutter="24">
          <el-col :sm="12" :md="12" :xl="12" :lg="12" :xs="12">
            <div class="czy-home__widget">
              <div class="czy-home__widget-header">
                <i class="czy-home__widget-header-bullet" />
                <div class="czy-home__widget-title">工序用料分析</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <column-chart :index="activeIndex" :x-data="xData1" :series-data="seriesData1" />
              </div>
              <div class="czy-home__widget-footer">
                <div class="u-line-spacer" />
              </div>
            </div>
          </el-col>
          <el-col :sm="12" :md="12" :xl="12" :lg="12" :xs="12">
            <div class="czy-home__widget">
              <div class="czy-home__widget-header">
                <i class="czy-home__widget-header-bullet" />
                <div class="czy-home__widget-title">齐套用料分析</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <column-chart :index="activeIndex" :x-data="xData2" :series-data="seriesData2" />
              </div>
              <div class="czy-home__widget-footer">
                <div class="u-line-spacer" />
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top:15px;">
          <el-col :sm="12" :md="12" :xl="12" :lg="12" :xs="12">
            <div class="czy-home__widget">
              <div class="czy-home__widget-header">
                <i class="czy-home__widget-header-bullet" />
                <div class="czy-home__widget-title">任务用料分析</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <div ref="div3" style="width:100%;height:300px" />
              </div>
              <div class="czy-home__widget-footer">
                <div class="u-line-spacer" />
              </div>
            </div>
          </el-col>
          <el-col :sm="12" :md="12" :xl="12" :lg="12" :xs="12">
            <div class="czy-home__widget">
              <div class="czy-home__widget-header">
                <i class="czy-home__widget-header-bullet" />
                <div class="czy-home__widget-title">未齐套{{ noMsg }}详情</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <div ref="div4" style="width:100%;height:300px" />
              </div>
              <div class="czy-home__widget-footer">
                <div class="u-line-spacer" />
              </div>
            </div>
          </el-col>
        </el-row>
        <!-- 物料库存统计 -->
      </div>
    </template>
  </div>
</template>
<script>
import echarts from 'echarts'
import EConst from '@/api/datafx/dataConst.js'
import ColumnChart from '@/components/Echarts/ColumnChart.vue'
import { debounce } from '@/utils'
export default {
  name: 'StockTotal',
  components: { ColumnChart },
  data() {
    return {
      activeIndex: 'stockTotal',
      xData1: EConst.EchartsBussBy.wuliaoName(),
      xData2: EConst.EchartsBussBy.ljName(),
      chart3: null,
      chart4: null,
      timmerOneAnim2: null,
      noMsg: '任务1',
      xAxis4: EConst.EchartsBussBy.wuliaoName(),
      seriesData1: [
        {
          name: '工序用料',
          type: 'bar',
          barWidth: '18',
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
          data: [10, 10, 20, 20, 20, 10, 10, 20]
        },
        {
          name: '库存物料',
          type: 'bar',
          barWidth: '18',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#0CEBEA'
                },
                {
                  offset: 1,
                  color: '#368BFF'
                }
              ]),
              barBorderRadius: 12
            }
          },
          data: [10, 20, 20, 10, 10, 10, 10, 20]
        }
      ],
      seriesData2: [
        {
          name: '齐套用料',
          type: 'bar',
          barWidth: '18',
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
          data: [10, 10, 20, 20, 20, 10, 10, 20]
        },
        {
          name: '库存物料',
          type: 'bar',
          barWidth: '18',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#0CEBEA'
                },
                {
                  offset: 1,
                  color: '#368BFF'
                }
              ]),
              barBorderRadius: 12
            }
          },
          data: [10, 20, 20, 10, 10, 10, 10, 20]
        }
      ],
      series3: [
        {
          name: '已齐套',
          type: 'bar',
          barWidth: '18',
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
          data: [10, 10, 20, 20, 20, 10, 10, 20]
        },
        {
          name: '未齐套',
          type: 'bar',
          barWidth: '18',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#0CEBEA'
                },
                {
                  offset: 1,
                  color: '#368BFF'
                }
              ]),
              barBorderRadius: 12
            }
          },
          data: [10, 20, 20, 10, 10, 10, 10, 20]
        }
      ],
      series4: [
        {
          name: '物料',
          type: 'bar',
          barWidth: '18',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#0CEBEA'
                },
                {
                  offset: 1,
                  color: '#368BFF'
                }
              ]),
              barBorderRadius: 12
            }
          },
          data: [10, 20, 20, 10, 10, 10, 10, 20]
        }
      ]
    }
  },
  watch: {
    noMsg() {
      this.draw4()
    }
  },
  activated() {
    this.$nextTick(() => {
      this.draw3()
      this.draw4()
    })
    this.__resizeHandler = debounce(() => {
      if (this.chart3 || this.chart4) {
        this.chart3.resize()
        this.chart4.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
    console.log('activated***************')
  },
  beforeDestroy() {
    if (!this.chart3 || this.chart4) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart3.dispose()
    this.chart3 = null
    this.chart4.dispose()
    this.chart4 = null
  },
  methods: {
    getDrawByclassName2() {
      if (this.noMsg === '任务2') {
        this.xAxis4 = ['物料1', '物料2', '物料3', '物料4', '物料5']
        this.xAxis4 = EConst.EchartsBussBy.wuliaoName()
        this.series4[0].data = [23, 35, 36, 14, 17, 15]
      } else if (this.noMsg === '任务3') {
        EConst.EchartsBussBy.wuliaoName().pop()
        this.xAxis4 = ['物料1', '物料2', '物料3', '物料4', '物料5', '物料6', '物料7']
        this.series4[0].data = [10, 14, 13, 25, 36, 14, 27]
      } else if (this.noMsg === '任务4') {
        EConst.EchartsBussBy.wuliaoName().pop()
        this.xAxis4 = ['物料1', '物料2', '物料3', '物料4', '物料5', '物料6']
        this.series4[0].data = [10, 14, 33, 15, 16, 14]
      } else if (this.noMsg === '任务5') {
        this.xAxis4 = ['物料1', '物料2', '物料3', '物料4', '物料5']
        this.series4[0].data = [10, 14, 13, 15, 16]
      } else if (this.noMsg === '任务6') {
        this.xAxis4 = ['物料1', '物料2', '物料3', '物料4']
        this.series4[0].data = [10, 14, 13, 15]
      } else if (this.noMsg === '任务7') {
        this.xAxis4 = ['物料1', '物料2', '物料3']
        this.series4[0].data = [13, 15, 16]
      } else if (this.noMsg === '任务8') {
        this.xAxis4 = ['物料1', '物料2']
        this.series4[0].data = [43, 15]
      } else {
        this.noMsg = '任务1'
        this.xAxis4 = EConst.EchartsBussBy.wuliaoName()
        this.series4[0].data = [10, 20, 20, 10, 10, 10, 10, 20]
      }
    },

    draw3() {
      this.chart3 = echarts.init(this.$refs.div3)
      this.chart3.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          textStyle: {
            align: 'left'
          }
        },
        legend: {
          show: true,
          icon: 'circle',
          orient: 'horizontal',
          top: '2.5%',
          right: '0',
          itemWidth: 15,
          itemHeight: 15,
          itemGap: 10,
          textStyle: {
            color: '#FFFFFF'
          }
        },
        xAxis: [
          {
            data: EConst.EchartsBussBy.jobName(),
            axisLine: {
              lineStyle: {
                color: 'rgba(0, 0, 0, 0)'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#FFFFFF',
              fontSize: 12,
              interval: 0
            }
          },
          {
            type: 'category',
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
              color: '#fff',
              fontSize: '10'
            }
          }
        ],
        yAxis: [
          {
            max: 50,
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
          }
        ],
        series: this.series3
      })
      this.chart3.resize()
      this.chart3.on('click', params => {
        this.noMsg = params.name
        this.getDrawByclassName2()
      })

      var count = 0
      if (this.timmerOneAnim2) {
        clearInterval(this.timmerOneAnim2)
      }
      this.timmerOneAnim2 = setInterval(() => {
        this.chart3.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: count % EConst.EchartsBussBy.jobName().length
        })
        this.noMsg = EConst.EchartsBussBy.jobName()[count]
        this.getDrawByclassName2()
        if (count < EConst.EchartsBussBy.jobName().length) {
          count++
        } else {
          count = 0
        }
      }, 3000)
    },
    draw4() {
      this.chart4 = echarts.init(this.$refs.div4)
      this.chart4.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          textStyle: {
            align: 'left'
          }
        },
        legend: {
          show: true,
          icon: 'circle',
          orient: 'horizontal',
          top: '2.5%',
          right: '0',
          itemWidth: 15,
          itemHeight: 15,
          itemGap: 10,
          textStyle: {
            color: '#FFFFFF'
          }
        },
        xAxis: [
          {
            data: this.xAxis4,
            axisLine: {
              lineStyle: {
                color: 'rgba(0, 0, 0, 0)'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#FFFFFF',
              fontSize: 12,
              interval: 0
            }
          },
          {
            type: 'category',
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
              color: '#fff',
              fontSize: '10'
            }
          }
        ],

        yAxis: [
          {
            max: 50,
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
          }
        ],
        series: this.series4
      })
      this.chart4.resize()
    }
  }
}
</script>
