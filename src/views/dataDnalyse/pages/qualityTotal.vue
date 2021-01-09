<template>
  <div style="height:100%;">
    <!-- 质量数据统计 -->
    <el-carousel
      trigger="click"
      :autoplay="false"
      :loop="false"
      arrow="always"
      style="height:100%;"
    >
      <el-carousel-item style="height:100%;" label="1">
        <el-row :gutter="24">
          <el-col :sm="12" :md="12" :xl="12" :lg="12" :xs="12">
            <div class="czy-home__widget">
              <div class="czy-home__widget-header">
                <i class="czy-home__widget-header-bullet"></i>
                <div class="czy-home__widget-title">质量分析</div>
                <div class="u-line-spacer no-left"></div>
                <div class="czy-home__widget-append"></div>
              </div>
              <div class="czy-home__widget-content">
                <column-chart :xData="xData1" :index="activeIndex" :seriesData="seriesData1" />
              </div>
              <div class="czy-home__widget-footer">
                <div class="u-line-spacer"></div>
              </div>
            </div>
          </el-col>
          <el-col :sm="12" :md="12" :xl="12" :lg="12" :xs="12">
            <div class="czy-home__widget">
              <div class="czy-home__widget-header">
                <i class="czy-home__widget-header-bullet"></i>
                <div class="czy-home__widget-title">质量合格率</div>
                <div class="u-line-spacer no-left"></div>
                <div class="czy-home__widget-append"></div>
              </div>
              <div class="czy-home__widget-content">
                <line-chart :xData="xData1" :index="activeIndex" :seriesData="seriesData2" />
              </div>
              <div class="czy-home__widget-footer">
                <div class="u-line-spacer"></div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top:15px;">
          <el-col :sm="12" :md="12" :xl="12" :lg="12" :xs="12">
            <div class="czy-home__widget">
              <div class="czy-home__widget-header">
                <i class="czy-home__widget-header-bullet"></i>
                <div class="czy-home__widget-title">返修率</div>
                <div class="u-line-spacer no-left"></div>
                <div class="czy-home__widget-append"></div>
              </div>
              <div class="czy-home__widget-content">
                <line-chart :xData="xData1" :index="activeIndex" :seriesData="seriesData3" />
              </div>
              <div class="czy-home__widget-footer">
                <div class="u-line-spacer"></div>
              </div>
            </div>
          </el-col>
          <el-col :sm="12" :md="12" :xl="12" :lg="12" :xs="12">
            <div class="czy-home__widget">
              <div class="czy-home__widget-header">
                <i class="czy-home__widget-header-bullet"></i>
                <div class="czy-home__widget-title">质量问题对比</div>
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
        </el-row>
      </el-carousel-item>
      <el-carousel-item style="height:100%;" label="2">
        <el-row :gutter="24">
          <el-col :sm="24" :md="24" :xl="24" :lg="24" :xs="24">
            <div class="czy-home__widget">
              <div class="czy-home__widget-header">
                <i class="czy-home__widget-header-bullet"></i>
                <div class="czy-home__widget-title">不合格率统计</div>
                <div class="u-line-spacer no-left"></div>
                <div class="czy-home__widget-append"></div>
              </div>
              <div class="czy-home__widget-content">
                <el-table :data="tableData" :cell-style="tableCellStyle" :header-cell-style="tableHeaderStyle" :row-style="{height:'60px'}"  class="czy-log__table" style="width: 100%">
                  <el-table-column prop="name" label="名称" ></el-table-column>
                  <el-table-column prop="no" label="审理单"></el-table-column>
                  <el-table-column prop="desc" label="原因" ></el-table-column>
                </el-table>
              </div>
              <div class="czy-home__widget-footer">
                <div class="u-line-spacer"></div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-carousel-item>
    </el-carousel>
  </div>
  <!-- 质量数据统计 -->
</template>

<script>
import EConst from "@/api/datafx/dataConst.js";
import echarts from "echarts";
import ColumnChart from "@/components/Echarts/ColumnChart.vue";
import LineChart from "@/components/Echarts/LineChart.vue";
import PieChart from "@/components/Echarts/PieChart.vue";
export default {
  name: "qualityTotal",
  components: { ColumnChart, LineChart, PieChart },
  data() {
    return {
      activeIndex: "qualityTotal",
      // 装调工时统计 班组整体工时
      seriesData1: [
        {
          name: "返工量",
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
          name: "不合格量",
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
          name: "总产量",
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
      seriesData2: [
        {
          name: "合格率",
          type: "line",
          data: [0.1, 0.2, 0.6, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.8]
        }
      ],
      seriesData3: [
        {
          name: "合格率",
          type: "line",
          data: [0.1, 0.2, 0.6, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.8]
        }
      ],
      // x轴值
      xData1: EConst.EchartsBussBy.productName(),
      seriesData4: [
        {
          name: "同心度",
          value: "50",
          unit: "%"
          // desc: '金额',
          // selected: true
        },
        {
          name: "同轴度",
          value: "20",
          unit: "%"
        },
        {
          name: "光洁度",
          value: "20",
          unit: "%"
        },
        {
          name: "孔深度",
          value: "10",
          unit: "%"
        }
      ],
      tableData: [
        {
          name: "产品1",
          no: "5",
          desc: "原因1，原因2"
        },
        {
          name: "产品2",
          no: "4",
          desc: "原因1，原因2"
        },
        {
          name: "产品3",
          no: "15",
          desc: "原因1，原因2"
        },
        {
          name: "产品4",
          no: "5",
          desc: "原因1，原因2"
        }
      ],
      tableCellStyle(){
          return {border:'none',borderBottom:"1px dashed rgb(23, 129, 179)"}
      },tableHeaderStyle(){
          return {border:'none'}
      }
    };
  }
};
</script>
<style >
@import "../style/echrts.css";

</style>