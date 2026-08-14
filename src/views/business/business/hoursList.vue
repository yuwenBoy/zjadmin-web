<template>
  <div class="app-container">
    <div class="head-container">
      <div class="content-box box-shadow">
        <!-- 顶部说明 -->
        <div class="page-tip">
          <i class="el-icon-info"></i>
          <span>用于管理节假日等特殊日期的营业时间，优先级高于常规周营业时间。当天为"全天休息"则不接单。</span>
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
                  <el-date-picker
                    v-model="crud.query.specialDate"
                    clearable
                    size="mini"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    class="filter-item"
                  />
                </el-form-item>
                <el-form-item>
                  <el-select
                    v-model="crud.query.type"
                    clearable
                    placeholder="类型"
                    size="mini"
                    class="wt100"
                  >
                    <el-option label="全天休息" :value="1" />
                    <el-option label="特殊营业时段" :value="2" />
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
            prop="specialDate"
            label="特殊日期"
            align="center"
            width="140"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.specialDate }}</span>
              <el-tag
                size="mini"
                type="warning"
                v-if="isFuture(scope.row.specialDate)"
                style="margin-left: 6px"
                >未生效</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型" align="center" width="140">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.type === 1">全天休息</el-tag>
              <el-tag type="success" v-else-if="scope.row.type === 2"
                >特殊营业时段</el-tag
              >
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            label="营业时段"
            align="center"
            min-width="220"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span v-if="scope.row.type === 1" style="color: #909399"
                >当日不营业</span
              >
              <div v-else-if="scope.row.businessHours">
                <div
                  v-for="(h, idx) in scope.row.businessHours"
                  :key="idx"
                  style="line-height: 22px"
                >
                  {{ h.startTime }} ~ {{ h.endTime }}
                </div>
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            align="center"
            min-width="180"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.remark || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="createdAt"
            label="创建时间"
            align="center"
            width="160"
          />
          <el-table-column
            label="操作"
            align="left"
            width="160"
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
      </div>
    </div>
  </div>
</template>
<script>
import CRUD, { presenter } from '@crud/crud'
import curdSpecialHours, { getStoreList } from '@/api/business/store'
import OPTOperation from '@crud/OPT.operation'
import pagination from '@crud/Pagination'
import jForm from './hoursEdit'
import tableHeightMixin from '@/layout/mixin/tableHeightMixin'

export default {
  components: {
    OPTOperation,
    pagination,
    jForm
  },
  cruds() {
    return CRUD({
      title: '特殊营业时间',
      url: '/specialHours/getByCondition',
      idField: 'id',
      sort: 'specialDate',
      order: 'asc',
      crudMethod: {
        add: curdSpecialHours.addSpecialHours,
        edit: curdSpecialHours.editSpecialHours,
        del: curdSpecialHours.delSpecialHours
      }
    })
  },
  mixins: [presenter(), tableHeightMixin],
  data() {
    return {
      storeList: [],
      currentStoreId: null,
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
    isFuture(dateStr) {
      if (!dateStr) return false
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const target = new Date(dateStr.replace(/-/g, '/'))
      return target > today
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
      this.$msg.confirm(`确认删除【${row.specialDate}】的特殊营业时间吗，删除后不可恢复`, {
        ok: () => {
          this.crud.delAllLoading = true
          this.crud.doDelete(row)
        },
        cancel: () => {}
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
.page-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  margin-bottom: 12px;
  background: #ecf5ff;
  border-left: 3px solid #409eff;
  border-radius: 4px;
  color: #606266;
  font-size: 13px;
  line-height: 1.6;
}
.page-tip i {
  color: #409eff;
  font-size: 16px;
}
</style>
