<template>
  <div class="app-container">
    <div class="head-container">
      <div class="content-box box-shadow">
        <div class="text item">
          <el-row :gutter="24">
            <el-col :span="4">
              <el-button
                v-if="crud.optShow.add"
                v-authority="['dept:add']"
                class="filter-item"
                size="mini"
                round
                type="primary"
                icon="el-icon-plus"
                @click="crud.toAdd"
              >新增</el-button>
              <el-button
                v-authority="['dept:delete']"
                class="filter-item"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                round
                :loading="crud.delAllLoading"
                :disabled="crud.selections.length === 0"
                @click="toDelete(crud.selections)"
              >删除</el-button>
            </el-col>
            <el-col :span="16" :push="4" style="text-align:right;">
              <el-form label-width="0px" inline>
                <el-form-item>
                  <el-input v-model="crud.query.DepartmentName" clearable size="small" placeholder="请输入部门名称" class="filter-item round-left" />
                </el-form-item>
                <OPTOperation />
              </el-form>
            </el-col>
          </el-row>
        </div>
        <el-table
          ref="table"
          :data="crud.data"
          row-key="id"
          lazy
          :load="getMenus"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          @select="crud.selectChange"
          @select-all="crud.selectAllChange"
          @selection-change="crud.selectionChangeHandler"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          />
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="50"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            label="部门名称"
            prop="departmentName"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            label="部门编码"
            prop="departmentCode"
            width="235"
          />
          <el-table-column
            prop="createtime"
            label="创建日期"
            width="135"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createtime) }}</span>
            </template>
          </el-table-column>
          <!--   编辑与删除   -->
          <el-table-column label="操作" width="100px" align="left">
            <template slot-scope="scope">
              <el-link v-authority="['dept:edit']" type="info" :underline="false" @click="crud.toEdit(scope.row)">编辑</el-link>
              <el-link v-authority="['dept:delete']" type="info" :underline="false" @click="remove(scope.row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible="crud.status.cu > 0"
      :title="crud.status.title"
      width="600px"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="是否顶级">
              <el-radio-group v-model="type">
                <el-radio-button label="1">是</el-radio-button>
                <el-radio-button label="0">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="部门名称"
              prop="departmentName"
            >
              <el-input
                v-model="form.departmentName"
                clearable
                placeholder="请输入部门名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              label="部门编码"
              prop="departmentCode"
            >
              <el-input
                v-model="form.departmentCode"
                clearable
                placeholder="请输入部门编码"
              />
            </el-form-item>
          </el-col>
          <el-col v-show="type == 0" :span="12">
            <el-form-item label="上级部门">
              <treeselect
                v-model="form.pid"
                :options="menus"
                :load-options="loadMenus"
                placeholder="选择上级部门"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="crud.status.cu === 2" type="success" size="mini" icon="el-icon-circle-plus" @click="crud.submitCU">提交</el-button>
        <el-button type="default" icon="el-icon-remove-outline" @click="crud.cancelCU">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import crudDepartment from '@/api/system/department'
import CRUD, { presenter, form } from '@crud/crud'
import OPTOperation from '@crud/OPT.operation'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
const defaultForm = {
  id: null,
  departmentName: '',
  departmentCode: '',
  pid: 0
}
export default {
  components: { Treeselect, OPTOperation },
  cruds() {
    return CRUD({
      title: '部门',
      url: '/dept/getByCondition?pid=0',
      crudMethod: { ...crudDepartment },
      sort: 'id'
    })
  },
  mixins: [presenter(), form(defaultForm)],
  data() {
    return {
      type: 1,
      rules: {
        departmentName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        departmentCode: [
          { required: true, message: '请输入部门编码', trigger: 'blur' }
        ],
        pid: [{ required: true, message: '请选择上级部门', trigger: 'change' }]
      },
      menus: []
    }
  },
  methods: {
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.menus = []
      if (form.pid > 0) {
        this.type = '0'
      } else {
        this.type = '1'
      }
      if (form.id != null) {
        // this.loadMenus()
        if (form.pid === null) {
          form.pid = 0
        }
      } else {
        this.menus.push({ id: 0, label: '上级部门', children: null })
      }
    },
    getMenus(tree, treeNode, resolve) {
      const params = { pid: tree.id }
      setTimeout(() => {
        crudDepartment.getModulePager(params).then((res) => {
          resolve(res.result.content)
        })
      }, 100)
    },
    toDelete(datas) {
      this.$confirm(`确认删除选中的${datas.length}条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.crud.delAllLoading = true
          this.crud.doDelete(datas)
        })
        .catch(() => {})
    },
    remove(row) {
      this.$confirm(`确认删除此条数据吗，删除后不可恢复`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.crud.delAllLoading = true
        this.crud.doDelete(row)
      }).catch(() => {})
    },
    updateLyDeptId(data) {
      this.defaultForm.pid = data
    },
    loadMenus({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        const params = { id: parentNode.id }
        crudDepartment.getDeptTree(params).then((res) => {
          parentNode.children = res.result.map(function(obj) {
            if (!obj.leaf) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 100)
        })
      }
    }
  }
}
</script>

<style>
.el-card__header {
  padding: 8px 20px;
  border-bottom: 1px solid #e6ebf5;
  box-sizing: border-box;
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
</style>
