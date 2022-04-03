<template>
  <div style="height:100%">
    <el-carousel
      trigger="click"
      :autoplay="false"
      :loop="false"
      arrow="always"
      style="height:100%;"
    >
      <el-carousel-item style="height:100%;">
        <el-row :gutter="24" style="margin-top:50px">
          <el-col :sm="12" :md="12" :xl="12" :lg="12" :xs="12">
            <div class="czy-home__widget">
              <div class="czy-home__widget-header">
                <i class="czy-home__widget-header-bullet" />
                <div class="czy-home__widget-title">总成测试仪1</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :series-data="data1" />
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
                <div class="czy-home__widget-title">总成测试仪2</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :series-data="data2" />
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
                <div class="czy-home__widget-title">总成测试仪3</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :series-data="data3" />
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
                <div class="czy-home__widget-title">总成测试仪4情况</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :series-data="data4" />
              </div>
              <div class="czy-home__widget-footer">
                <div class="u-line-spacer" />
              </div>
            </div>
          </el-col>
        </el-row>
      </el-carousel-item>
      <el-carousel-item style="height:100%;">
        <el-row :gutter="24" style="margin-top:50px">
          <el-col :sm="12" :md="12" :xl="12" :lg="12" :xs="12">
            <div class="czy-home__widget">
              <div class="czy-home__widget-header">
                <i class="czy-home__widget-header-bullet" />
                <div class="czy-home__widget-title">总成测试仪5情况</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :series-data="data1" />
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
                <div class="czy-home__widget-title">总成测试仪6情况</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :series-data="data2" />
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
                <div class="czy-home__widget-title">总成测试仪7情况</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :series-data="data3" />
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
                <div class="czy-home__widget-title">总成测试仪8情况</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :series-data="data4" />
              </div>
              <div class="czy-home__widget-footer">
                <div class="u-line-spacer" />
              </div>
            </div>
          </el-col>
        </el-row>
      </el-carousel-item>
      <el-carousel-item style="height:100%;">
        <el-row :gutter="24" style="margin-top:50px">
          <el-col :sm="12" :md="12" :xl="12" :lg="12" :xs="12">
            <div class="czy-home__widget">
              <div class="czy-home__widget-header">
                <i class="czy-home__widget-header-bullet" />
                <div class="czy-home__widget-title">总成测试仪9情况</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :series-data="data1" />
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
                <div class="czy-home__widget-title">总成测试仪10情况</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :series-data="data2" />
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
                <div class="czy-home__widget-title">总成测试仪11情况</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :series-data="data3" />
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
                <div class="czy-home__widget-title">总成测试仪12情况</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :series-data="data4" />
              </div>
              <div class="czy-home__widget-footer">
                <div class="u-line-spacer" />
              </div>
            </div>
          </el-col>
        </el-row>
      </el-carousel-item>
      <el-carousel-item style="height:100%;">
        <el-row :gutter="24" style="margin-top:50px">
          <el-col :sm="12" :md="12" :xl="12" :lg="12" :xs="12">
            <div class="czy-home__widget">
              <div class="czy-home__widget-header">
                <i class="czy-home__widget-header-bullet" />
                <div class="czy-home__widget-title">总成测试仪13情况</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :series-data="data1" />
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
                <div class="czy-home__widget-title">总成测试仪14情况</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :series-data="data2" />
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
                <div class="czy-home__widget-title">总成测试仪15情况</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :series-data="data3" />
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
                <div class="czy-home__widget-title">总成测试仪16情况</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :series-data="data4" />
              </div>
              <div class="czy-home__widget-footer">
                <div class="u-line-spacer" />
              </div>
            </div>
          </el-col>
        </el-row>
      </el-carousel-item>
      <el-carousel-item style="height:100%;">
        <el-row :gutter="24" style="margin-top:50px">
          <el-col :sm="12" :md="12" :xl="12" :lg="12" :xs="12">
            <div class="czy-home__widget">
              <div class="czy-home__widget-header">
                <i class="czy-home__widget-header-bullet" />
                <div class="czy-home__widget-title">总成测试仪17情况</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :series-data="data1" />
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
                <div class="czy-home__widget-title">总成测试仪18情况</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :series-data="data2" />
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
                <div class="czy-home__widget-title">总成测试仪19情况</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :series-data="data3" />
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
                <div class="czy-home__widget-title">总成测试仪20情况</div>
                <div class="u-line-spacer no-left" />
                <div class="czy-home__widget-append" />
              </div>
              <div class="czy-home__widget-content">
                <line-chart :index="activeIndex" :series-data="data4" />
              </div>
              <div class="czy-home__widget-footer">
                <div class="u-line-spacer" />
              </div>
            </div>
          </el-col>
        </el-row>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
import LineChart from '@/components/Echarts/LineChart.vue'
export default {
  components: { LineChart },
  data() {
    return {
      activeIndex: 'countTest',
      data1: [
        {
          name: '使用率',
          type: 'line',
          data: [0.1, 0.2, 0.6, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.5]
        }
      ],
      data2: [
        {
          name: '使用率',
          type: 'line',
          data: [0.1, 0.2, 0.6, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.5]
        }
      ],
      data3: [
        {
          name: '使用率',
          type: 'line',
          data: [0.1, 0.2, 0.6, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.5]
        }
      ],
      data4: [
        {
          name: '使用率',
          type: 'line',
          data: [0.1, 0.2, 0.6, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.5]
        }
      ],
      data5: [
        {
          name: '使用率',
          type: 'line',
          data: [0.1, 0.2, 0.6, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.5]
        }
      ],
      data6: [
        {
          name: '使用率',
          type: 'line',
          data: [0.1, 0.2, 0.6, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.5]
        }
      ],
      data7: [
        {
          name: '使用率',
          type: 'line',
          data: [0.1, 0.2, 0.6, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.5]
        }
      ]
    }
  }
}
</script>
<style scoped>
.el-carousel__container {
  position: relative;
  height: 100%;
}
.el-carousel__arrow--left {
  border: none;
  top: 20px;
  left:0px;
  outline: none;
  padding: 0;
  margin: 0;
  right: 0;
  height: 40px;
  width: 90px;
  cursor: pointer;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  background-color: rgba(0, 217, 255, 0.15);
  color: #fff;
  position: absolute;
  z-index: 10;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  text-align: center;
  font-size: 14px;
  border-radius: 0;
}
.el-carousel__arrow--right {
  border: none;
  top: 20px;
  outline: none;
  padding: 0;
  margin: 0;
  height: 40px;
  width: 90px;
  cursor: pointer;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  background-color: rgba(0, 217, 255, 0.15);
  color: #fff;
  position: absolute;
  z-index: 10;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  text-align: center;
  font-size: 14px;
  border-radius: 0;
}
.el-carousel__arrow--left:hover {
  color: #fff;
  background: #0bd6d0;
  border: 0;
  border-radius: 0;
}

.el-carousel__arrow--right:hover {
  color: #fff;
  background: #0bd6d0;
  border: 0;
  border-radius: 0;
}
.el-carousel__arrow--left::before {
  content: "上一页";
}
.el-carousel__arrow--right::before {
  content: "下一页";
}
</style>
