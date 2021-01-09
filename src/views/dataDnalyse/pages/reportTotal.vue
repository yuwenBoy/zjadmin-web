<template>
  <div style="height:100%;">
    <!-- 告警数据统计 -->
    <el-row :gutter="24">
      <el-col :sm="8" :md="8" :xl="8" :lg="8">
        <div class="czy-home__widget">
          <div class="czy-home__widget-header">
            <i class="czy-home__widget-header-bullet"></i>
            <div class="czy-home__widget-title">设备状态</div>
            <div class="u-line-spacer no-left"></div>
            <div class="czy-home__widget-append"></div>
          </div>
          <div class="czy-home__widget-content">
            <el-table
              :data="tableData"
              :cell-style="tableCellStyle"
              :header-cell-style="tableHeaderStyle"
              :row-style="{height:'60px'}"
              class="czy-log__table"
              style="width: 100%"
              :cell-class-name="rowClass"
            >
              <el-table-column prop="name" align="center" label="设备名称"></el-table-column>
              <el-table-column prop="no" align="center" label="是否异常">
                <!-- <template slot-scope="scope">
                      <span :style="{background:scope.row.no==='异常'?'red':''}">{{scope.row.no}}</span>
                </template>-->
              </el-table-column>
              <el-table-column prop="desc" align="center" label="异常状态"></el-table-column>
            </el-table>
          </div>
          <div class="czy-home__widget-footer">
            <div class="u-line-spacer"></div>
          </div>
        </div>
      </el-col>
      <el-col :sm="8" :md="8" :xl="8" :lg="8">
        <div class="czy-home__widget">
          <div class="czy-home__widget-header">
            <i class="czy-home__widget-header-bullet"></i>
            <div class="czy-home__widget-title">物料质量管理</div>
            <div class="u-line-spacer no-left"></div>
            <div class="czy-home__widget-append"></div>
          </div>
          <div class="czy-home__widget-content">
            <column-chart
              :xData="['工序1','工序2','工序3','工序4','工序5']"
              :index="activeIndex"
              :seriesData="seriesData1"
            />
          </div>
          <div class="czy-home__widget-footer">
            <div class="u-line-spacer"></div>
          </div>
        </div>
      </el-col>
      <el-col :sm="8" :md="8" :xl="8" :lg="8">
        <div class="czy-home__widget">
          <div class="czy-home__widget-header">
            <i class="czy-home__widget-header-bullet"></i>
            <div class="czy-home__widget-title">缺料状态</div>
            <div class="u-line-spacer no-left"></div>
            <div class="czy-home__widget-append"></div>
          </div>
          <div class="czy-home__widget-content">
            <column-chart :xData="xData1" :index="activeIndex" :seriesData="seriesData3" />
          </div>
          <div class="czy-home__widget-footer">
            <div class="u-line-spacer"></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24" style="margin-top:15px;">
      <el-col :sm="8" :md="8" :xl="8" :lg="8">
        <div class="czy-home__widget">
          <div class="czy-home__widget-header">
            <i class="czy-home__widget-header-bullet"></i>
            <div class="czy-home__widget-title">工艺状态</div>
            <div class="u-line-spacer no-left"></div>
            <div class="czy-home__widget-append"></div>
          </div>
          <div class="czy-home__widget-content">
            <column-chart
              :xData="['工序1','工序2','工序3','工序4','工序5']"
              :index="activeIndex"
              :seriesData="seriesData2"
            />
          </div>
          <div class="czy-home__widget-footer">
            <div class="u-line-spacer"></div>
          </div>
        </div>
      </el-col>
      <el-col :sm="8" :md="8" :xl="8" :lg="8">
        <div class="czy-home__widget">
          <div class="czy-home__widget-header">
            <i class="czy-home__widget-header-bullet"></i>
            <div class="czy-home__widget-title">告警占比分析</div>
            <div class="u-line-spacer no-left"></div>
            <div class="czy-home__widget-append"></div>
          </div>
          <div class="czy-home__widget-content">
            <pie-chart :seriesData="seriesData4" :index="activeIndex" />
          </div>
          <div class="czy-home__widget-footer">
            <div class="u-line-spacer"></div>
          </div>
        </div>
      </el-col>
      <el-col :sm="8" :md="8" :xl="8" :lg="8">
        <div class="czy-home__widget">
          <div class="czy-home__widget-header">
            <i class="czy-home__widget-header-bullet"></i>
            <div class="czy-home__widget-title">实时信息</div>
            <div class="u-line-spacer no-left"></div>
            <div class="czy-home__widget-append"></div>
          </div>
          <div class="czy-home__widget-content"></div>
          <div class="czy-home__widget-footer">
            <div class="u-line-spacer"></div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
  <!-- 装调工时统计 -->
</template>

<script>
import EConst from "@/api/datafx/dataConst.js";
import echarts from "echarts";
import ColumnChart from "@/components/Echarts/ColumnChart.vue";
import PieChart from "@/components/Echarts/PieChart.vue";
export default {
  name: "reportTotal",
  components: { ColumnChart, PieChart },
  data() {
    return {
      activeIndex: "qualityTotal",
      // 装调工时统计 班组整体工时
      seriesData1: [
        {
          name: "物料1",
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
          data: [10, 10, 20, 20, 20]
        },
        {
          name: "物料2",
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
          data: [10, 20, 20, 10, 15]
        },
        {
          name: "物料3",
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
          data: [10, 20, 20, 10, 10]
        }
      ],
      seriesData2: [
        {
          name: "工序1",
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
          data: [10, 10, 20, 20, 20]
        },
        {
          name: "工序2",
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
          data: [10, 20, 20, 10, 15]
        },
        {
          name: "工序3",
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
          data: [10, 20, 20, 10, 10]
        }
      ],
      seriesData3: [
        {
          name: "缺失数量",
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
          data: [10, 10, 20, 20, 20]
        }
      ],
      // x轴值
      xData1: EConst.EchartsBussBy.wuliaoName(),
      seriesData4: [
        {
          name: "设备状态",
          value: "13.64",
          unit: "%"
          // desc: '金额',
          // selected: true
        },
        {
          name: "物料质量",
          value: "9.09",
          unit: "%"
        },
        {
          name: "缺料状态",
          value: "18.18",
          unit: "%"
        },
        {
          name: "工艺状态",
          value: "22.73",
          unit: "%"
        },
        {
          name: "人员状态",
          value: "31.82",
          unit: "%"
        }
      ],
      tableData: [
        {
          name: "设备1",
          no: "正常",
          desc: ""
        },
        {
          name: "设备2",
          no: "正常",
          desc: ""
        },
        {
          name: "设备3",
          no: "异常",
          desc: "漏液"
        },
        {
          name: "设备4",
          no: "正常",
          desc: ""
        }
      ],
      tableCellStyle() {
        return { border: "none", borderBottom: "1px dashed rgb(23, 129, 179)" };
      },
      tableHeaderStyle() {
        return { border: "none" };
      }
    };
  },
  methods: {
    rowClass({row, rowIndex, columnIndex}) {
      if(rowIndex===2&&columnIndex==1&row.no === "异常"){
           return "bgColor";
      }
    }
  }
};
</script>
<style >
@import "../style/echrts.css";
.bgColor {
  background: red;
}
</style>