<template>
  <div class="app-container">
    <div class="head-container">
      <div class="content-box box-shadow">
        <!-- 顶部说明 -->
        <div class="page-tip">
          <i class="el-icon-info"></i>
          <span>设置门店的配送范围与配送费规则。圆形范围按半径画圆，多边形范围可手动圈定区域。下单时系统会按收货地址自动判断是否在配送范围内。</span>
        </div>

        <div class="text item">
          <el-row :gutter="24">
            <el-col :xs="15" :sm="14" :md="18" :lg="18" :xl="14">
              <el-form label-width="0px" inline>
                <el-form-item>
                  <el-select
                    v-model="currentStoreId"
                    placeholder="选择门店"
                    size="mini"
                    class="wt120"
                    :disabled="isBusiness && storeList.length <= 1"
                    @change="handleStoreChange"
                  >
                    <el-option v-if="!isBusiness" label="全部门店" :value="''" />
                    <el-option
                      v-for="store in storeList"
                      :key="store.id"
                      :label="store.storeName"
                      :value="store.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input
                    v-model="crud.query.areaName"
                    clearable
                    size="mini"
                    autofocus
                    placeholder="区域名称"
                    class="filter-item"
                  />
                </el-form-item>
                <el-form-item>
                  <el-select
                    v-model="crud.query.status"
                    clearable
                    placeholder="状态"
                    size="mini"
                    class="wt100"
                  >
                    <el-option label="启用" :value="1" />
                    <el-option label="禁用" :value="0" />
                  </el-select>
                </el-form-item>
                <OPTOperation />
              </el-form>
            </el-col>
            <el-col
              :xs="9"
              :sm="8"
              :md="6"
              :lg="6"
              :xl="4"
              style="text-align: right"
            >
              <el-button
                v-if="crud.optShow.add"
                class="filter-item"
                size="mini"
                round
                type="primary"
                icon="el-icon-plus"
                @click="crud.toAdd"
                >新增</el-button
              >
              <el-button
                class="filter-item"
                size="mini"
                round
                type="danger"
                icon="el-icon-delete"
                :loading="crud.delAllLoading"
                :disabled="crud.selections.length === 0"
                @click="toDelete(crud.selections)"
                >删除</el-button
              >
            </el-col>
          </el-row>
        </div>

        <el-table
          ref="table"
          :data="crud.data"
          stripe
          @selection-change="crud.selectionChangeHandler"
          :max-height="tableMaxHeight"
        >
          <el-table-column type="selection" align="center" width="55" />
          <el-table-column prop="id" label="ID" align="center" width="80" />
          <el-table-column
            prop="storeName"
            label="所属门店"
            align="center"
            min-width="140"
            show-overflow-tooltip
          />
          <el-table-column
            prop="areaName"
            label="区域名称"
            align="center"
            min-width="140"
            show-overflow-tooltip
          />
          <el-table-column prop="shape" label="范围类型" align="center" width="110">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.shape === 1" size="mini">圆形</el-tag>
              <el-tag v-else-if="scope.row.shape === 2" size="mini" type="success">多边形</el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            label="配送范围"
            align="center"
            min-width="180"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span v-if="scope.row.shape === 1">
                半径 {{ scope.row.radius }} 米
              </span>
              <span v-else-if="scope.row.shape === 2">
                {{ polygonPointCount(scope.row.polygonPath) }} 个顶点
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="deliveryFee" label="配送费" align="center" width="100">
            <template slot-scope="scope">
              <span class="price">¥{{ scope.row.deliveryFee || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="minOrderAmount"
            label="起送价"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              ¥{{ scope.row.minOrderAmount || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="estimatedTime"
            label="预计送达"
            align="center"
            width="110"
          >
            <template slot-scope="scope">
              {{ scope.row.estimatedTime ? scope.row.estimatedTime + ' 分钟' : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" align="center" width="100">
            <template slot-scope="scope">
              <el-switch
                :value="scope.row.status === 1"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="handleToggleStatus(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="left"
            width="140"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-link
                class="op-link"
                :underline="false"
                @click="crud.toEdit(scope.row)"
                >编辑</el-link
              >
              <el-link
                class="op-link"
                :underline="false"
                @click="previewArea(scope.row)"
                >预览</el-link
              >
              <el-link
                class="op-link op-delete"
                :underline="false"
                @click="remove(scope.row)"
                >删除</el-link
              >
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination />
        <!-- 新增/编辑抽屉 -->
        <jForm />
        <!-- 地图预览弹窗 -->
        <el-dialog
          title="配送范围预览"
          :visible.sync="previewVisible"
          width="700px"
          append-to-body
        >
          <div id="preview-map-container" class="preview-map"></div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import CRUD, { presenter } from '@crud/crud'
import curdDeliveryArea from '@/api/business/deliveryArea'
import { toggleDeliveryAreaStatus } from '@/api/business/deliveryArea'
import { getStoreList } from '@/api/business/store'
import OPTOperation from '@crud/OPT.operation'
import pagination from '@crud/Pagination'
import jForm from './deliveryAreaEdit'
import tableHeightMixin from '@/layout/mixin/tableHeightMixin'
import { load } from '@amap/amap-jsapi-loader'

window._AMapSecurityConfig = {
  securityJsCode: '01e416bbc5b83fe7bb77e5d648407d65'
}

export default {
  components: {
    OPTOperation,
    pagination,
    jForm
  },
  cruds() {
    return CRUD({
      title: '配送区域',
      url: '/deliveryArea/getByCondition',
      idField: 'id',
      sort: 'id',
      order: 'desc',
      crudMethod: {
        add: curdDeliveryArea.addDeliveryArea,
        edit: curdDeliveryArea.editDeliveryArea,
        del: curdDeliveryArea.delDeliveryArea
      }
    })
  },
  mixins: [presenter(), tableHeightMixin],
  data() {
    return {
      storeList: [],
      currentStoreId: null,
      previewVisible: false,
      previewMap: null,
      previewAMap: null,
      isBusiness: false
    }
  },
  computed: {
    // 判断是否是商家账号
    isBusinessUser() {
      const user = this.$store.state.user.user
      return user && user.userType == 2
    }
  },
  created() {
    this.isBusiness = this.isBusinessUser
    this.initStoreId()
  },
  beforeDestroy() {
    if (this.previewMap) {
      this.previewMap.destroy()
      this.previewMap = null
    }
  },
  methods: {
    async initStoreId() {
      // 加载门店列表
      try {
        const res = await getStoreList()
        if (res.success && res.result) {
          this.storeList = res.result
        }
      } catch (e) {
        console.error('获取门店列表失败', e)
      }
      // 优先从路由参数获取 storeId
      const routeStoreId = this.$route.query.storeId
      if (routeStoreId) {
        this.currentStoreId = Number(routeStoreId)
        this.crud.query.storeId = Number(routeStoreId)
      } else if (this.isBusiness && this.storeList.length > 0) {
        // 商家账号：默认绑定第一个门店
        this.currentStoreId = this.storeList[0].id
        this.crud.query.storeId = this.storeList[0].id
      } else {
        // 管理员账号：默认查询全部门店
        this.currentStoreId = ''
        this.crud.query.storeId = null
      }
      this.crud.toQuery()
    },
    handleStoreChange(storeId) {
      this.currentStoreId = storeId
      this.crud.query.storeId = storeId || null
      this.crud.toQuery()
    },
    polygonPointCount(polygonPath) {
      if (!polygonPath) return 0
      try {
        const arr = typeof polygonPath === 'string' ? JSON.parse(polygonPath) : polygonPath
        return Array.isArray(arr) ? arr.length : 0
      } catch (e) {
        return 0
      }
    },
    handleToggleStatus(row) {
      const newStatus = row.status === 1 ? 0 : 1
      const action = newStatus === 1 ? '启用' : '禁用'
      this.$msg.confirm(`确认${action}区域【${row.areaName}】吗？`, {
        ok: async () => {
          try {
            const res = await toggleDeliveryAreaStatus({ id: row.id, status: newStatus })
            if (res.success) {
              this.$msg.alert(`${action}成功`)
              this.crud.refresh()
            }
          } catch (e) {
            this.$msg.alert(`${action}失败`, 'error')
          }
        }
      })
    },
    toDelete(datas) {
      this.$msg.confirm(`确认删除选中的${datas.length}条数据?`, {
        ok: () => {
          this.crud.delAllLoading = true
          this.crud.doDelete(datas)
        }
      })
    },
    remove(row) {
      this.$msg.confirm(`确认删除区域【${row.areaName}】吗，删除后不可恢复`, {
        ok: () => {
          this.crud.delAllLoading = true
          this.crud.doDelete(row)
        },
        cancel: () => {}
      })
    },
    async previewArea(row) {
      this.previewVisible = true
      this.$nextTick(async () => {
        try {
          if (!this.previewAMap) {
            this.previewAMap = await load({
              key: 'ab12bbcc48266078eb07384768c2e5c2',
              version: '2.0',
              plugins: ['AMap.Circle', 'AMap.Polygon']
            })
          }
          if (this.previewMap) {
            this.previewMap.destroy()
          }
          const center = [row.centerLng || 116.407173, row.centerLat || 39.90469]
          this.previewMap = new this.previewAMap.Map('preview-map-container', {
            zoom: 14,
            center
          })
          if (row.shape === 1) {
            // 圆形
            new this.previewAMap.Circle({
              center,
              radius: row.radius || 1000,
              strokeColor: '#ff5000',
              strokeWeight: 2,
              fillColor: '#ff5000',
              fillOpacity: 0.15,
              map: this.previewMap
            })
            new this.previewAMap.Marker({
              position: center,
              map: this.previewMap
            })
          } else if (row.shape === 2) {
            // 多边形
            let path = row.polygonPath
            if (typeof path === 'string') {
              path = JSON.parse(path)
            }
            if (Array.isArray(path) && path.length > 0) {
              new this.previewAMap.Polygon({
                path,
                strokeColor: '#ff5000',
                strokeWeight: 2,
                fillColor: '#ff5000',
                fillOpacity: 0.15,
                map: this.previewMap
              })
              this.previewMap.setFitView()
            }
          }
        } catch (e) {
          this.$msg.alert('地图加载失败', 'error')
        }
      })
    }
  }
}
</script>
<style scoped>
.op-link.op-delete {
  color: #f56c6c !important;
}
.el-form-item__label {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
  font-weight: 500;
}
.wt100 {
  width: 140px;
}
.wt120 {
  width: 160px;
}
.price {
  color: #f56c6c;
  font-weight: 600;
}
.page-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  margin-bottom: 12px;
  background: #fff7e6;
  border-left: 3px solid #e6a23c;
  border-radius: 4px;
  color: #606266;
  font-size: 13px;
  line-height: 1.6;
}
.page-tip i {
  color: #e6a23c;
  font-size: 16px;
}
.preview-map {
  width: 100%;
  height: 450px;
  border-radius: 6px;
  overflow: hidden;
}
</style>
