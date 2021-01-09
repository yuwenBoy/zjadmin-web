<template>
  <div style="height:100%">
    <el-carousel
      trigger="click"
      :autoplay="false"
      :loop="false"
      arrow="always"
      ref="cardShow"
      style="height:100%;"
    >
      <el-carousel-item style="height:100%;" label="1">
        <el-row :gutter="24" style="margin-top:50px">
          <el-col :sm="12" :md="12" :xl="12" :lg="12" :xs="12">
            <div class="czy-home__widget">
              <div class="czy-home__widget-header">
                <i class="czy-home__widget-header-bullet"></i>
                <div class="czy-home__widget-title">导通绝缘测试仪1</div>
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
          <el-col :sm="12" :md="12" :xl="12" :lg="12" :xs="12">
            <div class="czy-home__widget">
              <div class="czy-home__widget-header">
                <i class="czy-home__widget-header-bullet"></i>
                <div class="czy-home__widget-title">导通绝缘测试仪2</div>
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
        </el-row>
        <el-row :gutter="24" style="margin-top:15px;">
          <el-col :sm="12" :md="12" :xl="12" :lg="12" :xs="12">
            <div class="czy-home__widget">
              <div class="czy-home__widget-header">
                <i class="czy-home__widget-header-bullet"></i>
                <div class="czy-home__widget-title">导通绝缘测试仪3</div>
                <div class="u-line-spacer no-left"></div>
                <div class="czy-home__widget-append"></div>
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :seriesData="data3" />
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
                <div class="czy-home__widget-title">导通绝缘测试仪4</div>
                <div class="u-line-spacer no-left"></div>
                <div class="czy-home__widget-append"></div>
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :seriesData="data4" />
              </div>
              <div class="czy-home__widget-footer">
                <div class="u-line-spacer"></div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-carousel-item>
      <el-carousel-item label="2">
        <el-row :gutter="24" style="margin-top:50px">
          <el-col :sm="12" :md="12" :xl="12" :lg="12" :xs="12">
            <div class="czy-home__widget">
              <div class="czy-home__widget-header">
                <i class="czy-home__widget-header-bullet"></i>
                <div class="czy-home__widget-title">导通绝缘测试仪5</div>
                <div class="u-line-spacer no-left"></div>
                <div class="czy-home__widget-append"></div>
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :seriesData="data5" />
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
                <div class="czy-home__widget-title">导通绝缘测试仪6</div>
                <div class="u-line-spacer no-left"></div>
                <div class="czy-home__widget-append"></div>
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :seriesData="data6" />
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
                <div class="czy-home__widget-title">导通绝缘测试仪7</div>
                <div class="u-line-spacer no-left"></div>
                <div class="czy-home__widget-append"></div>
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :seriesData="data7" />
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
</template>
<script>
import LineChart from "@/components/Echarts/LineChart.vue";
export default {
  components: { LineChart },
  data() {
    return {
      activeIndex: "privateTest",
      data1: [
        {
          name: "使用率",
          type: "line",
          data: [0.1, 0.2, 0.6, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.5]
        }
      ],
      data2: [
        {
          name: "使用率",
          type: "line",
          data: [0.1, 0.2, 0.6, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.5]
        }
      ],
      data3: [
        {
          name: "使用率",
          type: "line",
          data: [0.1, 0.2, 0.6, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.5]
        }
      ],
      data4: [
        {
          name: "使用率",
          type: "line",
          data: [0.1, 0.2, 0.6, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.5]
        }
      ],
      data5: [
        {
          name: "使用率",
          type: "line",
          data: [0.1, 0.2, 0.6, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.5]
        }
      ],
      data6: [
        {
          name: "使用率",
          type: "line",
          data: [0.1, 0.2, 0.6, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.5]
        }
      ],
      data7: [
        {
          name: "使用率",
          type: "line",
          data: [0.1, 0.2, 0.6, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.5]
        }
      ]
    };
  },
  methods:{
    clickChange(val){
      if(val === 'right') {
        this.$refs.cardShow.next()
      } else {
        this.$refs.cardShow.prev()
      }
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

/* .el-carousel__indicators {
    position: absolute;
    list-style: none;
    margin: 0;
    padding: 0;
    z-index: 2;
    top: 0;
}*/

.el-carousel__indicators--labels .el-carousel__button {
  height: auto;
  width: auto;
  padding: 6px 24px;
  font-size: 14px;
  background-color: transparent;
  border:1px solid transparent;
  color:rgba(255, 255, 255, 0.3);
}
/* .el-carousel__indicator.is-active button{
   background-color: transparent;
   color:#fff;
} */
</style>