<template>
  <el-drawer
    append-to-body
    :wrapperClosable="false"
    :close-on-click-modal="false"
    :before-close="handleClose"
    direction="rtl"
    size="60%"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
  >
    <div class="xin-content">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-position="top"
        label-width="120px"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="区域名称" prop="areaName">
              <el-input
                v-model="form.areaName"
                clearable
                placeholder="如：3公里内、老城区"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="范围类型" prop="shape">
              <el-radio-group v-model="form.shape" @change="handleShapeChange">
                <el-radio-button :label="1">圆形</el-radio-button>
                <el-radio-button :label="2">多边形</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 圆形参数 -->
        <el-row :gutter="24" v-if="form.shape === 1">
          <el-col :span="12">
            <el-form-item label="中心经度" prop="centerLng">
              <el-input-number
                v-model="form.centerLng"
                :precision="6"
                :step="0.000001"
                :min="-180"
                :max="180"
                style="width: 100%"
                placeholder="经度"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中心纬度" prop="centerLat">
              <el-input-number
                v-model="form.centerLat"
                :precision="6"
                :step="0.000001"
                :min="-90"
                :max="90"
                style="width: 100%"
                placeholder="纬度"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="配送半径（米）" prop="radius">
              <el-input-number
                v-model="form.radius"
                :min="100"
                :max="20000"
                :step="100"
                style="width: 100%"
                @change="drawPreviewShape"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 多边形参数 -->
        <el-row :gutter="24" v-if="form.shape === 2">
          <el-col :span="24">
            <el-form-item label="多边形顶点">
              <div class="polygon-tip">
                <i class="el-icon-warning-outline"></i>
                在地图上依次点击至少 3 个点围成多边形，双击或点击"完成绘制"结束。
              </div>
              <div class="polygon-actions">
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  icon="el-icon-edit"
                  @click="startDrawPolygon"
                  >开始绘制</el-button
                >
                <el-button
                  size="mini"
                  type="success"
                  plain
                  icon="el-icon-check"
                  @click="finishDrawPolygon"
                  >完成绘制</el-button
                >
                <el-button
                  size="mini"
                  type="warning"
                  plain
                  icon="el-icon-refresh-left"
                  @click="clearPolygon"
                  >清空</el-button
                >
                <span class="point-count" v-if="polygonPoints.length > 0">
                  已绘制 {{ polygonPoints.length }} 个点
                </span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 地图 -->
        <el-form-item label="配送范围地图">
          <div class="map-wrapper">
            <div id="delivery-map-container" class="map-box"></div>
            <div class="map-search-box">
              <el-input
                style="width: 280px"
                size="small"
                v-model="mapSearchKeyword"
                placeholder="搜索位置"
                suffix-icon="el-icon-search"
                @input="handleMapSearchInput"
                @focus="showMapSuggestions = true"
              />
              <div
                v-if="showMapSuggestions && mapSuggestions.length"
                class="map-suggestions-list"
              >
                <div
                  v-for="(item, index) in mapSuggestions"
                  :key="index"
                  class="map-suggestion-item"
                  @click="selectMapSuggestion(item)"
                >
                  <i class="el-icon-location-outline" />
                  <div class="suggestion-info">
                    <div class="name">{{ item.name }}</div>
                    <div class="address">{{ item.district }}{{ item.address }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>

        <el-divider content-position="left">配送规则</el-divider>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="配送费（元）" prop="deliveryFee">
              <el-input-number
                v-model="form.deliveryFee"
                :precision="2"
                :step="0.5"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="起送价（元）" prop="minOrderAmount">
              <el-input-number
                v-model="form.minOrderAmount"
                :precision="2"
                :step="1"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预计送达（分钟）" prop="estimatedTime">
              <el-input-number
                v-model="form.estimatedTime"
                :step="5"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="状态">
              <el-switch
                v-model="form.status"
                :active-value="1"
                :inactive-value="0"
                active-text="启用"
                inactive-text="禁用"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            v-model="form.remark"
            maxlength="100"
            show-word-limit
            placeholder="可选"
          />
        </el-form-item>
      </el-form>
    </div>
    <footer class="xin-footer">
      <el-button
        :loading="crud.status.cu === 2"
        type="success"
        size="mini"
        icon="el-icon-circle-plus"
        @click="crud.submitCU"
        >保存</el-button
      >
      <el-button
        type="default"
        size="mini"
        icon="el-icon-remove-outline"
        @click="crud.cancelCU"
        >关闭</el-button
      >
    </footer>
  </el-drawer>
</template>

<script>
import { form } from '@crud/crud'
import CRUD from '@crud/crud'
import { load } from '@amap/amap-jsapi-loader'

const defaultForm = {
  id: null,
  storeId: null,
  areaName: '',
  shape: 1,
  radius: 1000,
  centerLng: null,
  centerLat: null,
  polygonPath: '',
  deliveryFee: 0,
  minOrderAmount: 0,
  estimatedTime: 30,
  status: 1,
  remark: ''
}

export default {
  mixins: [form(defaultForm)],
  data() {
    return {
      rules: {
        areaName: [
          { required: true, message: '请输入区域名称', trigger: 'blur' }
        ],
        shape: [{ required: true, message: '请选择范围类型', trigger: 'change' }],
        deliveryFee: [{ required: true, message: '请输入配送费', trigger: 'blur' }],
        minOrderAmount: [{ required: true, message: '请输入起送价', trigger: 'blur' }]
      },
      map: null,
      AMap: null,
      autoComplete: null,
      placeSearch: null,
      // 圆形
      circleEditor: null,
      currentCircle: null,
      // 多边形
      polygonEditor: null,
      currentPolygon: null,
      polygonPoints: [],
      isDrawing: false,
      // 搜索
      mapSearchKeyword: '',
      showMapSuggestions: false,
      mapSuggestions: []
    }
  },
  beforeDestroy() {
    this.destroyMap()
  },
  methods: {
    // 新增/编辑前
    [CRUD.HOOK.afterToCU](crud, form) {
      if (!form.id) {
        // 新增时从查询条件中带出门店ID
        form.storeId = crud.query.storeId
        // 新增默认值
        form.shape = 1
        form.radius = 1000
        form.deliveryFee = 0
        form.minOrderAmount = 0
        form.estimatedTime = 30
        form.status = 1
        form.centerLng = null
        form.centerLat = null
        form.polygonPath = ''
      } else {
        // 编辑回显
        if (form.shape === 2 && form.polygonPath) {
          try {
            this.polygonPoints =
              typeof form.polygonPath === 'string'
                ? JSON.parse(form.polygonPath)
                : [...form.polygonPath]
          } catch (e) {
            this.polygonPoints = []
          }
        } else {
          this.polygonPoints = []
        }
      }
      // 初始化地图
      this.$nextTick(() => {
        this.initMap()
      })
    },
    // 提交前校验 storeId
    [CRUD.HOOK.beforeValidateCU](crud) {
      if (!crud.form.storeId) {
        this.$msg.alert('请先选择门店', 'warning')
        return false
      }
      return true
    },
    // 提交前
    [CRUD.HOOK.afterValidateCU](crud) {
      if (!crud.form.areaName) {
        this.$msg.alert('请输入区域名称', 'warning')
        return false
      }
      if (crud.form.shape === 1) {
        // 圆形
        if (!crud.form.centerLng || !crud.form.centerLat) {
          this.$msg.alert('请在地图上点击选择中心点', 'warning')
          return false
        }
        if (!crud.form.radius || crud.form.radius < 100) {
          this.$msg.alert('配送半径不能小于 100 米', 'warning')
          return false
        }
        crud.form.polygonPath = ''
      } else if (crud.form.shape === 2) {
        // 多边形
        if (this.polygonPoints.length < 3) {
          this.$msg.alert('多边形至少需要 3 个顶点', 'warning')
          return false
        }
        crud.form.polygonPath = JSON.stringify(this.polygonPoints)
        // 多边形中心取顶点平均
        const avgLng = this.polygonPoints.reduce((s, p) => s + p[0], 0) / this.polygonPoints.length
        const avgLat = this.polygonPoints.reduce((s, p) => s + p[1], 0) / this.polygonPoints.length
        crud.form.centerLng = Number(avgLng.toFixed(6))
        crud.form.centerLat = Number(avgLat.toFixed(6))
      }
      return true
    },
    async initMap() {
      try {
        if (!this.AMap) {
          this.AMap = await load({
            key: 'ab12bbcc48266078eb07384768c2e5c2',
            version: '2.0',
            plugins: [
              'AMap.AutoComplete',
              'AMap.PlaceSearch',
              'AMap.CircleEditor',
              'AMap.PolygonEditor',
              'AMap.Geocoder'
            ]
          })
        }
        this.destroyMap()
        // 初始中心点：编辑时用已有中心点，新增用默认（北京）
        const center =
          this.form.centerLng && this.form.centerLat
            ? [this.form.centerLng, this.form.centerLat]
            : [116.407173, 39.90469]
        this.map = new this.AMap.Map('delivery-map-container', {
          zoom: 14,
          center,
          resizeEnable: true
        })
        this.autoComplete = new this.AMap.AutoComplete({ city: '全国' })
        this.placeSearch = new this.AMap.PlaceSearch({ city: '全国' })

        // 地图点击事件
        this.map.on('click', (e) => {
          if (this.isDrawing) return // 多边形绘制中不响应
          if (this.form.shape === 1) {
            this.form.centerLng = Number(e.lnglat.getLng().toFixed(6))
            this.form.centerLat = Number(e.lnglat.getLat().toFixed(6))
            this.drawPreviewShape()
          }
        })

        // 回显
        this.drawPreviewShape()
        // 点击外部关闭搜索建议
        document.addEventListener('click', this.handleClickOutsideMap)
      } catch (err) {
        this.$msg.alert('地图加载失败', 'error')
      }
    },
    destroyMap() {
      if (this.circleEditor) {
        this.circleEditor.close()
        this.circleEditor = null
      }
      if (this.polygonEditor) {
        this.polygonEditor.close()
        this.polygonEditor = null
      }
      this.currentCircle = null
      this.currentPolygon = null
      this.isDrawing = false
      if (this.map) {
        this.map.destroy()
        this.map = null
      }
      document.removeEventListener('click', this.handleClickOutsideMap)
    },
    handleShapeChange() {
      this.polygonPoints = []
      this.isDrawing = false
      this.drawPreviewShape()
    },
    // 绘制已有形状
    drawPreviewShape() {
      if (!this.map || !this.AMap) return
      this.map.clearMap()
      if (this.circleEditor) {
        this.circleEditor.close()
        this.circleEditor = null
      }
      if (this.polygonEditor) {
        this.polygonEditor.close()
        this.polygonEditor = null
      }
      this.currentCircle = null
      this.currentPolygon = null

      if (this.form.shape === 1 && this.form.centerLng && this.form.centerLat) {
        const center = [this.form.centerLng, this.form.centerLat]
        this.currentCircle = new this.AMap.Circle({
          center,
          radius: this.form.radius || 1000,
          strokeColor: '#ff5000',
          strokeWeight: 2,
          fillColor: '#ff5000',
          fillOpacity: 0.15,
          cursor: 'move',
          editable: true
        })
        this.map.add(this.currentCircle)
        // 中心点标记
        new this.AMap.Marker({
          position: center,
          map: this.map
        })
        // 启用圆形编辑
        this.circleEditor = new this.AMap.CircleEditor(this.map, this.currentCircle)
        this.circleEditor.open()
        this.circleEditor.on('adjust', (e) => {
          this.form.radius = Math.round(e.radius)
        })
        this.circleEditor.on('move', (e) => {
          const lng = e.center.getLng()
          const lat = e.center.getLat()
          this.form.centerLng = Number(lng.toFixed(6))
          this.form.centerLat = Number(lat.toFixed(6))
        })
        this.map.setFitView()
      } else if (this.form.shape === 2 && this.polygonPoints.length >= 3) {
        this.currentPolygon = new this.AMap.Polygon({
          path: this.polygonPoints,
          strokeColor: '#ff5000',
          strokeWeight: 2,
          fillColor: '#ff5000',
          fillOpacity: 0.15
        })
        this.map.add(this.currentPolygon)
        this.polygonEditor = new this.AMap.PolygonEditor(this.map, this.currentPolygon)
        this.polygonEditor.open()
        this.polygonEditor.on('adjust', (e) => {
          this.polygonPoints = e.target.getPath().map(p => [
            Number(p.getLng().toFixed(6)),
            Number(p.getLat().toFixed(6))
          ])
        })
        this.map.setFitView()
      }
    },
    // 多边形绘制
    startDrawPolygon() {
      if (!this.map) return
      this.map.clearMap()
      this.polygonPoints = []
      this.isDrawing = true
      if (this.polygonEditor) {
        this.polygonEditor.close()
      }
      this.currentPolygon = new this.AMap.Polygon({
        path: [],
        strokeColor: '#ff5000',
        strokeWeight: 2,
        fillColor: '#ff5000',
        fillOpacity: 0.15
      })
      this.map.add(this.currentPolygon)
      this.polygonEditor = new this.AMap.PolygonEditor(this.map, this.currentPolygon)
      this.polygonEditor.open()
    },
    finishDrawPolygon() {
      if (!this.polygonEditor || !this.isDrawing) {
        this.$msg.alert('请先点击"开始绘制"', 'warning')
        return
      }
      const path = this.currentPolygon.getPath()
      if (!path || path.length < 3) {
        this.$msg.alert('多边形至少需要 3 个顶点', 'warning')
        return
      }
      this.polygonPoints = path.map(p => [
        Number(p.getLng().toFixed(6)),
        Number(p.getLat().toFixed(6))
      ])
      this.polygonEditor.close()
      this.isDrawing = false
      // 重新绘制为可调整状态
      this.drawPreviewShape()
      this.$msg.alert('绘制完成，可拖动顶点微调', 'success')
    },
    clearPolygon() {
      this.polygonPoints = []
      this.isDrawing = false
      if (this.polygonEditor) {
        this.polygonEditor.close()
      }
      if (this.map) {
        this.map.clearMap()
      }
    },
    // 搜索
    handleMapSearchInput() {
      if (!this.mapSearchKeyword) {
        this.mapSuggestions = []
        return
      }
      this.autoComplete.search(this.mapSearchKeyword, (status, res) => {
        if (status === 'complete') {
          this.mapSuggestions = res.tips.filter(t => t.location)
        }
      })
    },
    selectMapSuggestion(item) {
      this.showMapSuggestions = false
      const lng = item.location.lng
      const lat = item.location.lat
      this.map.setZoomAndCenter(15, [lng, lat])
      if (this.form.shape === 1) {
        this.form.centerLng = Number(lng.toFixed(6))
        this.form.centerLat = Number(lat.toFixed(6))
        this.drawPreviewShape()
      }
    },
    handleClickOutsideMap(e) {
      if (!this.$el || !this.$el.contains(e.target)) {
        this.showMapSuggestions = false
      }
    },
    handleClose() {
      this.destroyMap()
      this.crud.cancelCU()
    }
  }
}
</script>
<style scoped>
.xin-content {
  padding: 16px 20px 80px;
}
.xin-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 20px;
  border-top: 1px solid #eee;
  background: #fff;
  text-align: right;
}
.map-wrapper {
  position: relative;
  width: 100%;
}
.map-box {
  width: 100%;
  height: 420px;
  border-radius: 6px;
  border: 1px solid #ebeef5;
  overflow: hidden;
}
.map-search-box {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 100;
}
.map-suggestions-list {
  position: absolute;
  top: 42px;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  max-height: 280px;
  overflow-y: auto;
}
.map-suggestion-item {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}
.map-suggestion-item:hover {
  background: #f5f5f5;
}
.map-suggestion-item .suggestion-info {
  flex: 1;
}
.map-suggestion-item .name {
  font-size: 13px;
  color: #303133;
}
.map-suggestion-item .address {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}
.polygon-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  margin-bottom: 10px;
  background: #fff7e6;
  border-radius: 4px;
  color: #909399;
  font-size: 12px;
  line-height: 1.6;
}
.polygon-tip i {
  color: #e6a23c;
  font-size: 14px;
}
.polygon-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.point-count {
  color: #67c23a;
  font-size: 13px;
  margin-left: 8px;
}
.el-divider__text {
  font-size: 13px;
  color: #909399;
}
</style>
