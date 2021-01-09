<template>
  <!-- 计划完成率 -->
  <el-carousel
    trigger="click"
    :autoplay="false"
    :loop="false"
    arrow="always"
    ref="cardShow"
    style="height:100%;"
  >
    <el-carousel-item style="height:100%;" label="1">
      <el-row :gutter="24">
        <el-col :sm="8" :md="8" :xl="8" :lg="8" :xs="8">
          <div class="czy-home__widget">
            <div class="czy-home__widget-header">
              <i class="czy-home__widget-header-bullet"></i>
              <div class="czy-home__widget-title">事业部工序工单完成率</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
              <line-chart :index="activeIndex" :xData="x1" :seriesData="series1" />
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
              <div class="czy-home__widget-title">事业部新增延期工单</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
              <column-chart :index="activeIndex" :xData="xData1" :seriesData="seriesData2" />
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
              <div class="czy-home__widget-title">事业部延期率</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
              <line-chart :index="activeIndex" :seriesData="seriesData3" :xData="['产品1','产品2','产品3','产品4','产品5']" />
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
              <div class="czy-home__widget-title">补投计划标准工时</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
              <line-chart :index="activeIndex" :xData="xData6" :seriesData="seriesData7" />
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
              <div class="czy-home__widget-title">事业部新增延期工单</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
              <column-chart :index="activeIndex" :xData="xData2" :seriesData="seriesData5" />
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
              <div class="czy-home__widget-title">事业部延期率</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
             <line-chart :index="activeIndex" :seriesData="seriesData4" :xData="xData2" />
            </div>
            <div class="czy-home__widget-footer">
              <div class="u-line-spacer"></div>
            </div>
          </div>
        </el-col>

        <!-- <el-col :sm="6" :md="6" :xl="6" :lg="6" :xs="6">
        <div class="czy-home__widget">
          <div class="czy-home__widget-header">
            <i class="czy-home__widget-header-bullet"></i>
            <div class="czy-home__widget-title">班组工单完成率情况</div>
            <div class="u-line-spacer no-left"></div>
            <div class="czy-home__widget-append"></div>
          </div>
          <div class="czy-home__widget-content">
            <line-chart :index="activeIndex" :seriesData="seriesData4" :xData="xData5" />
          </div>
          <div class="czy-home__widget-footer">
            <div class="u-line-spacer"></div>
          </div>
        </div>
      </el-col>
      <el-col :sm="6" :md="6" :xl="6" :lg="6" :xs="6">
        <div class="czy-home__widget">
          <div class="czy-home__widget-header">
            <i class="czy-home__widget-header-bullet"></i>
            <div class="czy-home__widget-title">班组新增延期工单情况</div>
            <div class="u-line-spacer no-left"></div>
            <div class="czy-home__widget-append"></div>
          </div>
          <div class="czy-home__widget-content">
            <column-chart :xData="xData2" :seriesData="seriesData5" />
          </div>
          <div class="czy-home__widget-footer">
            <div class="u-line-spacer"></div>
          </div>
        </div>
      </el-col>
      <el-col :sm="6" :md="6" :xl="6" :lg="6" :xs="6">
        <div class="czy-home__widget">
          <div class="czy-home__widget-header">
            <i class="czy-home__widget-header-bullet"></i>
            <div class="czy-home__widget-title">班组延期率情况</div>
            <div class="u-line-spacer no-left"></div>
            <div class="czy-home__widget-append"></div>
          </div>
          <div class="czy-home__widget-content">
            <line-chart :index="activeIndex" :seriesData="seriesData3" :xData="xData2" />
          </div>
          <div class="czy-home__widget-footer">
            <div class="u-line-spacer"></div>
          </div>
        </div>
        </el-col>-->
      </el-row>
    </el-carousel-item>
    <el-carousel-item style="height:100%;" label="2">
      <el-row :gutter="24">
        <el-col :sm="8" :md="8" :xl="8" :lg="8" :xs="8">
          <div class="czy-home__widget">
            <div class="czy-home__widget-header">
              <i class="czy-home__widget-header-bullet"></i>
              <div class="czy-home__widget-title">装配班组工序工单完成率</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
              <line-chart :index="activeIndex" :xData="x1" :seriesData="series1" />
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
              <div class="czy-home__widget-title">装配班组新增延期工单</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
              <column-chart :index="activeIndex" :xData="xData1" :seriesData="seriesData2" />
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
              <div class="czy-home__widget-title">装配班组延期率</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
              <!-- <column-chart :index="activeIndex" :xData="xData4" :seriesData="seriesData3" /> -->
               <line-chart :index="activeIndex" :seriesData="seriesData3" :xData="['产品1','产品2','产品3','产品4','产品5']" />
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
              <div class="czy-home__widget-title">补投计划标准工时</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
              <line-chart :index="activeIndex" :xData="xData6" :seriesData="seriesData7" />
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
              <div class="czy-home__widget-title">装配班组新增延期工单</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
              <column-chart :index="activeIndex" :xData="xData2" :seriesData="seriesData5" />
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
              <div class="czy-home__widget-title">装配班组延期率</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
              <!-- <column-chart :index="activeIndex" :xData="xData2" :seriesData="seriesData5" /> -->
               <line-chart :index="activeIndex" :seriesData="seriesData4" :xData="xData2" />
            </div>
            <div class="czy-home__widget-footer">
              <div class="u-line-spacer"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-carousel-item>
    <el-carousel-item style="height:100%;" label="3">
      <el-row :gutter="24">
        <el-col :sm="8" :md="8" :xl="8" :lg="8" :xs="8">
          <div class="czy-home__widget">
            <div class="czy-home__widget-header">
              <i class="czy-home__widget-header-bullet"></i>
              <div class="czy-home__widget-title">调试1组工序工单完成率</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
              <line-chart :index="activeIndex" :xData="x1" :seriesData="series1" />
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
              <div class="czy-home__widget-title">调试1组新增延期工单</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
              <column-chart :index="activeIndex" :xData="xData1" :seriesData="seriesData2" />
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
              <div class="czy-home__widget-title">调试1组延期率</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
               <line-chart :index="activeIndex" :seriesData="seriesData3" :xData="['产品1','产品2','产品3','产品4','产品5']" />
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
              <div class="czy-home__widget-title">补投计划标准工时</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
              <line-chart :index="activeIndex" :xData="xData6" :seriesData="seriesData7" />
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
              <div class="czy-home__widget-title">调试1组新增延期工单</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
              <column-chart :index="activeIndex" :xData="xData2" :seriesData="seriesData5" />
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
              <div class="czy-home__widget-title">调试1组延期率</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
               <line-chart :index="activeIndex" :seriesData="seriesData4" :xData="xData2" />
            </div>
            <div class="czy-home__widget-footer">
              <div class="u-line-spacer"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-carousel-item>
    <el-carousel-item style="height:100%;" label="4">
      <el-row :gutter="24">
        <el-col :sm="8" :md="8" :xl="8" :lg="8" :xs="8">
          <div class="czy-home__widget">
            <div class="czy-home__widget-header">
              <i class="czy-home__widget-header-bullet"></i>
              <div class="czy-home__widget-title">调试2组工序工单完成率</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
              <line-chart :index="activeIndex" :xData="x1" :seriesData="series1" />
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
              <div class="czy-home__widget-title">调试2组新增延期工单</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
              <column-chart :index="activeIndex" :xData="xData1" :seriesData="seriesData2" />
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
              <div class="czy-home__widget-title">调试2组延期率</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
               <line-chart :index="activeIndex" :seriesData="seriesData3" :xData="['产品1','产品2','产品3','产品4','产品5']" />
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
              <div class="czy-home__widget-title">补投计划标准工时</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
              <line-chart :index="activeIndex" :xData="xData6" :seriesData="seriesData7" />
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
              <div class="czy-home__widget-title">调试2组新增延期工单</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
              <column-chart :index="activeIndex" :xData="xData2" :seriesData="seriesData5" />
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
              <div class="czy-home__widget-title">调试2组延期率</div>
              <div class="u-line-spacer no-left"></div>
              <div class="czy-home__widget-append"></div>
            </div>
            <div class="czy-home__widget-content">
               <line-chart :index="activeIndex" :seriesData="seriesData4" :xData="xData2" />
            </div>
            <div class="czy-home__widget-footer">
              <div class="u-line-spacer"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-carousel-item>
  </el-carousel>
  <!-- 计划完成率 -->
</template>

<script>
import echarts from "echarts";
// import Api from "@/api/datafx/index.js";
import EConst from "@/api/datafx/dataConst.js";
import ColumnChart from "@/components/Echarts/ColumnChart.vue";
import LineChart from "@/components/Echarts/LineChart.vue";
export default {
  name: "numberTotal",
  components: { ColumnChart, LineChart },
  data() {
    return {
      activeIndex: "numberTotal",

      // 车间新增延期工单
      seriesData2: [
        {
          name: "延期中",
          type: "bar",
          barWidth: "18%",
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#66FF66"
                },
                {
                  offset: 1,
                  color: "#00CA98"
                }
              ]),
              barBorderRadius: 11
            }
          },
          data: [10, 10, 20, 20, 20]
        },
        {
          name: "总工单",
          type: "bar",
          barWidth: "18%",
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#0CEBEA"
                },
                {
                  offset: 1,
                  color: "#368BFF"
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
          name: "延期率",
          type: "line",
          data: [0.4,0.6,0.3,0.5,0.2]
        } 
      ],
      seriesData5: [
        {
          name: "延期中",
          type: "bar",
          barWidth: "18%",
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#66FF66"
                },
                {
                  offset: 1,
                  color: "#00CA98"
                }
              ]),
              barBorderRadius: 11
            }
          },
          data: [
            
          ]
        },
        {
          name: "总工单",
          type: "bar",
          barWidth: "18%",
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#0CEBEA"
                },
                {
                  offset: 1,
                  color: "#368BFF"
                }
              ]),
              barBorderRadius: 12
            }
          },
          data: [
            
          ]
        }
      ],
      seriesData4: [
        {
          name: "延期率",
          type: "line",
          data: [0.5, 0.1, 0.6, 0.8, 0.4, 0.3, 0.1, 0.7, 0.4, 0.6, 0.4, 0.8,0.5, 0.1, 0.6, 0.8, 0.4, 0.3, 0.1, 0.7, 0.4, 0.6]
        }
      ],
      seriesData7: [
        {
          name: "补投工时",
          type: "bar",
          stack: "总量",
          barWidth: "60%",
          data: [0.1, 0.7, 0.9, 0.13, 0.21, 0.9, 0.12, 0.11]
        },
        {
          name: "计划工时",
          type: "bar",
          stack: "总量",
          barWidth: "70%",
          data: [0.12, 0.14, 0.16, 0.13, 0.14, 0.11, 0.7, 0.9]
        }
      ],
      xData1: EConst.EchartsBussBy.productName(),
      xData2: EConst.EchartsDateBy.day(),
      xData3: EConst.EchartsDateBy.day(),
      xData4: EConst.EchartsBussBy.productName(),
      xData5: EConst.EchartsBussBy.deviceName(),
      xData6: EConst.EchartsBussBy.planName(),
      // 工序工单完成率
      x1: [],
      series1: [
        {
          name: "所有任务",
          type: "line",
          data: []
        },
        {
          name: "装配任务",
          type: "line",
          data: []
        },
        {
          name: "调试任务",
          type: "line",
          data: []
        }
      ]
    };
  },
  watch: {
    $route(data) {
      if (data.name === "计划完成率") {
        let jd = data.query.timeParameter;
        if (jd.includes("4季度")) {
          this.xData2 = EConst.EchartsDateBy.quarterFour(); 
          this.seriesData5[0].data = [5, 10, 15];
          this.seriesData5[1].data = [15, 10, 5];
        } else if (jd.includes("3季度")) {
          this.xData2 = EConst.EchartsDateBy.quarterThree(); 
          this.seriesData5[0].data = [5, 10, 15];
          this.seriesData5[1].data = [15, 10, 5];
        } else if (jd.includes("2季度")) {
          this.xData2 = EConst.EchartsDateBy.quarterTwo();
          this.seriesData5[0].data = [5, 10, 15];
          this.seriesData5[1].data = [15, 10, 5];
        } else if (jd.includes("1季度")) {
          this.xData2 = EConst.EchartsDateBy.quarterOne();
          this.seriesData5[0].data = [5, 10, 15];
          this.seriesData5[1].data = [15, 10, 5];
        } else if (data.query.type === "2") {
          this.xData2 = EConst.EchartsDateBy.month();
          this.seriesData5[0].data = [
            5,
            10,
            15,
            5,
            10,
            15,
            5,
            10,
            15,
            5,
            10,
            15
          ];
          this.seriesData5[1].data = [
            15,
            10,
            5,
            5,
            10,
            15,
            5,
            10,
            15,
            5,
            10,
            15
          ];
        }else if(data.query.type==="1"){
 this.xData2 = EConst.EchartsDateBy.day();
          this.seriesData5[0].data = [
           20,
            10,
            10,
            10,
            15,
            20,
            10,
            10,
            10,
            15,
            20,
            10,
            10,
            10,
            15,
            20,
            10,
            10,
            10,
            15,
            20,
            10,
            10,
            10,
            15,
            20,
            10,
            10,
            10,
            15
          ];
          this.seriesData5[1].data = [
             10,
            20,
            20,
            10,
            10,
            10,
            20,
            20,
            10,
            10,
            10,
            20,
            20,
            10,
            10,
            10,
            20,
            20,
            10,
            10,
            10,
            20,
            20,
            10,
            10,
            10,
            20,
            20,
            10,
            10
          ];
        }
      }
    }
  },
  activated() {
    console.log("activated=====================");
    var dateType = this.$route.query.type,
      dateRang = this.$route.query.timeParameter;
    //this.getCompletionRate(dateType, dateRang);
    //this.getWorkshopAdd(dateType, dateRang);
  },
  methods: {
    getCompletionRate(type, datetime) {
      Api.PlanTotal.getCompletionRate(type, datetime).then(res => {
        if (res.length > 0) {
          this.x1 = [];
          this.series1[0].data = [];
          this.series1[1].data = [];
          this.series1[2].data = [];
          for (let i = 0; i < res.length; i++) {
            if (i < 10) {
              this.x1.push(res[i].name);
              this.series1[0].data.push(res[i].total_lv);
              this.series1[1].data.push(res[i].zp_lv);
              this.series1[2].data.push(res[i].ts_lv);
            }
          }
          this.x1 = JSON.parse(JSON.stringify(this.x1));
        } else {
          // this.$notify({
          //   title: `暂无数据`,
          //   type: "warning"
          // });
          this.x1 = [];
          this.series1[0].data = [];
          this.series1[1].data = [];
          this.series1[2].data = [];
        }
      });
    },
    getWorkshopAdd(type, datetime) {
      Api.PlanTotal.getWorkshopAdd(type, datetime).then(res => {
        console.log("getWorkshopAdd==========" + res);
      });
    }
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