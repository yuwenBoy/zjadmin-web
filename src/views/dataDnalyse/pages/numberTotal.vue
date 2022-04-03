<template>
  <div>
    <!-- 产量统计 -->
    <el-row :gutter="24">
      <el-col :sm="12" :md="12" :xl="12" :lg="12" :xs="12">
        <div class="czy-home__widget">
          <div class="czy-home__widget-header">
            <i class="czy-home__widget-header-bullet" />
            <div class="czy-home__widget-title">事业部各班组产量统计</div>
            <div class="u-line-spacer no-left" />
            <div class="czy-home__widget-append" />
          </div>
          <div class="czy-home__widget-content">
            <div ref="div1" style="width:100%;height:300px" />
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
            <div class="czy-home__widget-title">{{ divMsg }}型号任务产量统计</div>
            <div class="u-line-spacer no-left" />
            <div class="czy-home__widget-append" />
          </div>
          <div class="czy-home__widget-content">
            <div ref="div2" style="width:100%;height:300px" />
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
            <div class="czy-home__widget-title">各型号任务产量统计</div>
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
            <div class="czy-home__widget-title">{{ noMsg }}产量统计</div>
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
    <!-- 产量统计 -->
  </div>
</template>
<script>
import EConst from '@/api/datafx/dataConst.js'
import echarts from 'echarts'
import { debounce } from '@/utils'
export default {
  name: 'NumberTotal',
  data() {
    return {
      activeIndex: 'numberTotal',
      divMsg: '班组1',
      noMsg: '班组1',
      chart: null,
      chart2: null,
      chart3: null,
      chart4: null,
      xAxis2: EConst.EchartsBussBy.testNo(),
      xAxis4: EConst.EchartsBussBy.testNo(),
      series: [
        {
          name: '产量',
          type: 'pictorialBar',
          symbol: 'rect',
          itemStyle: {
            color: '#1cd9b4'
          },
          symbolRepeat: true,
          symbolSize: [14, 4],
          symbolMargin: 0.5,
          symbolPosition: 'start',
          z: -20,
          data: [53, 55, 41, 45, 85, 60],
          label: {
            normal: {
              show: false,
              position: 'top',
              verticalAlign: 'top'
            }
          }
        }
      ],
      series3: [{
        name: '产量',
        type: 'pictorialBar',
        symbol: 'rect',
        itemStyle: {
          color: '#1cd9b4'
        },
        symbolRepeat: true,
        symbolSize: [14, 4],
        symbolMargin: 0.5,
        symbolPosition: 'start',
        z: -20,
        data: [30, 55, 61, 45, 35, 20],
        label: {
          normal: {
            show: false,
            position: 'top',
            verticalAlign: 'top'
          }
        }
      }],
      series2: [
        {
          name: '产量',
          type: 'pictorialBar',
          symbol: 'rect',
          itemStyle: {
            color: '#1cd9b4'
          },
          symbolRepeat: true,
          symbolSize: [14, 4],
          symbolMargin: 0.5,
          symbolPosition: 'start',
          z: -20,
          data: [13, 15, 11, 10, 3],
          label: {
            normal: {
              show: false,
              position: 'top',
              verticalAlign: 'top'
            }
          }
        }
      ],
      series4: [
        {
          name: '产量',
          type: 'pictorialBar',
          symbol: 'rect',
          itemStyle: {
            color: '#1cd9b4'
          },
          symbolRepeat: true,
          symbolSize: [14, 4],
          symbolMargin: 0.5,
          symbolPosition: 'start',
          z: -20,
          data: [13, 15, 11, 10, 3],
          label: {
            normal: {
              show: false,
              position: 'top',
              verticalAlign: 'top'
            }
          }
        }
      ],
      timmerOneAnim: null,
      timmerOneAnim2: null
    }
  },
  watch: {
    divMsg() {
      this.draw()
    },
    noMsg() {
      this.draw4()
    }
  },
  activated() {
    this.$nextTick(() => {
      this.initEcharts()
      this.draw()
      this.draw3()
      this.draw4()
    })
    this.__resizeHandler = debounce(() => {
      if (this.chart || this.chart2 || this.chart3 || this.chart4) {
        this.chart.resize()
        this.chart2.resize()
        this.chart3.resize()
        this.chart4.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
    console.log('activated***************')
  },
  beforeDestroy() {
    if (!this.chart || this.chart2 || this.chart3 || this.chart4) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
    this.chart2.dispose()
    this.chart2 = null
    this.chart3.dispose()
    this.chart3 = null
    this.chart4.dispose()
    this.chart4 = null
  },
  methods: {
    draw() {
      this.chart2 = echarts.init(this.$refs.div2)
      this.chart2.setOption({
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
            data: this.xAxis2,
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
            max: 20,
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
        series: this.series2
      })
      this.chart2.resize()
    },
    getDrawByclassName() {
      if (this.divMsg === '班组2') {
        this.xAxis2 = ['某型1', '某型2', '某型3', '某型4', '某型5', '某型6']
        this.series2[0].data = [1, 4, 3, 5, 6, 14]
      } else if (this.divMsg === '班组3') {
        this.xAxis2 = ['某型3', '某型4']
        this.series2[0].data = [3, 5, 6]
      } else if (this.divMsg === '班组4') {
        this.xAxis2 = ['某型1', '某型2']
        this.series2[0].data = [6, 14]
      } else if (this.divMsg === '班组5') {
        this.xAxis2 = ['某型2', '某型3', '某型4']
        this.series2[0].data = [5, 6, 14]
      } else if (this.divMsg === '班组6') {
        this.xAxis2 = ['某型1', '某型2', '某型3']
        this.series2[0].data = [3, 5, 6]
      } else {
        this.divMsg = '班组1'
        this.xAxis2 = EConst.EchartsBussBy.testNo()
        this.series2[0].data = [13, 15, 11, 10, 3]
      }
    },
    getDrawByclassName2() {
      if (this.noMsg === '班组2') {
        this.xAxis4 = ['某型1', '某型2', '某型3', '某型4', '某型5', '某型6']
        this.series4[0].data = [1, 4, 3, 5, 6, 14]
      } else if (this.noMsg === '班组3') {
        this.xAxis4 = ['某型3', '某型4']
        this.series4[0].data = [3, 5, 6]
      } else if (this.noMsg === '班组4') {
        this.xAxis4 = ['某型1', '某型2']
        this.series4[0].data = [6, 14]
      } else if (this.noMsg === '班组5') {
        this.xAxis4 = ['某型2', '某型3', '某型4']
        this.series4[0].data = [5, 6, 14]
      } else if (this.noMsg === '班组6') {
        this.xAxis4 = ['某型1', '某型2', '某型3']
        this.series2[0].data = [3, 5, 6]
      } else {
        this.noMsg = '班组1'
        this.xAxis4 = EConst.EchartsBussBy.testNo()
        this.series4[0].data = [13, 15, 11, 10, 3]
      }
    },
    initEcharts() {
      this.chart = echarts.init(this.$refs.div1)
      this.chart.setOption({
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
            data: EConst.EchartsBussBy.className(),
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
            max: 100,
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
        series: this.series
      })
      this.chart.resize()
      this.chart.on('click', params => {
        this.divMsg = params.name
        this.getDrawByclassName()
      })
      var count = 0
      if (this.timmerOneAnim) {
        clearInterval(this.timmerOneAnim)
      }
      this.timmerOneAnim = setInterval(() => {
        this.chart.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: count % EConst.EchartsBussBy.className().length
        })
        this.divMsg = EConst.EchartsBussBy.className()[count]
        this.getDrawByclassName()
        if (count < EConst.EchartsBussBy.className().length) {
          count++
        } else {
          count = 0
        }
      }, 2000)
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
            data: EConst.EchartsBussBy.className(),
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
            max: 100,
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
          dataIndex: count % EConst.EchartsBussBy.className().length
        })
        this.noMsg = EConst.EchartsBussBy.className()[count]
        this.getDrawByclassName2()
        if (count < EConst.EchartsBussBy.className().length) {
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
            max: 20,
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
