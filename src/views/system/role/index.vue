<template>
  <div class="app-container">
    <div class="head-container">
      <div class="content-box box-shadow">
        <div class="text item">
          <el-row :gutter="24">
            <el-col :span="18">
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-button v-if="crud.optShow.add" v-authority="['role:add']" class="filter-item" round size="mini" type="primary" icon="el-icon-plus" @click="crud.toAdd">新增</el-button>
                  <el-button v-authority="['role:delete']" class="filter-item" round type="danger" icon="el-icon-delete" size="mini" :loading="crud.delAllLoading" :disabled="crud.selections.length === 0" @click="toDelete(crud.selections)">删除</el-button>
                </el-col>
                <el-col :span="12" :push="7">
                  <el-form label-width="0px" inline>
                    <el-form-item>
                      <el-input v-model="crud.query.name" clearable size="small" placeholder="请输入角色名称，编码" class="filter-item" />
                    </el-form-item>
                    <OPTOperation />
                  </el-form>
                </el-col>
              </el-row>
              <el-table ref="table" :data="crud.data" highlight-current-row @selection-change="crud.selectionChangeHandler" @current-change="handleCurrentChange">
                <el-table-column type="selection" align="center" width="55" />
                <el-table-column type="index" label="序号" align="center" width="50" />
                <el-table-column prop="name" label="角色名称" />
                <el-table-column prop="code" label="角色编码" />
                <el-table-column prop="createtime" label="创建日期" width="145">
                  <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.createtime) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip />
                <!--   编辑与删除   -->
                <el-table-column label="操作" align="left" width="170">
                  <template slot-scope="scope">
                    <el-link v-authority="['role:edit']" type="info" :underline="false" @click="crud.toEdit(scope.row)">编辑</el-link>
                    <el-link v-authority="['role:delete']" type="info" :underline="false" @click="remove(scope.row)">删除</el-link>
                    <el-link v-authority="['role:dataSave']" type="info" :underline="false" @click="roleDataModal(scope.row)">数据权限</el-link>
                  </template>
                </el-table-column>
              </el-table>
              <!--分页组件-->
              <pagination />
              <jForm />
            </el-col>
            <el-col :span="6">
              <el-card>
                <div slot="header" class="clearfix">
                  <span>分配功能权限</span>
                </div>
                <el-row :gutter="24">
                  <el-col :span="24">
                    <el-button
                      v-authority="['role:save']"
                      type="success"
                      size="mini"
                      round
                      :disabled="!optInfo.btnStatus"
                      icon="el-icon-circle-plus"
                      :loading="optInfo.loading"
                      @click="saveRoleModule"
                    >保存</el-button>&nbsp;&nbsp;&nbsp;
                    <tools-open :ttext="tText" :ftext="fText" @open="open($event)" />
                  </el-col>
                </el-row>
                <el-row :gutter="24" style="margin-top: 20px">
                  <el-col :span="24">
                    <el-input v-model="optInfo.filterText" placeholder="输入关键字进行过滤" clearable prefix-icon="el-icon-search" />
                    <el-tree
                      ref="tree"
                      :data="optInfo.menuList"
                      show-checkbox
                      check-strictly
                      :default-checked-keys="optInfo.defaultCheck"
                      node-key="id"
                      :props="optInfo.defaultProps"
                      :filter-node-method="filterNode"
                    />
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
      <el-drawer title="分配数据权限" append-to-body :close-on-click-modal="false" :visible.sync="roleData.status > 0" :before-close="handleClose" width="300px">
        <el-form ref="form" label-width="80px">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="角色名称:">
                {{ roleData.roleName }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="角色编码:">
                {{ roleData.roleCode }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="备注:">
                {{ roleData.roleRemark }}</el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="数据范围:">
                <el-select v-model="roleData.value" placeholder="请选择">
                  <el-option v-for="item in dataAuthorityList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col v-show="roleData.value == 2" :span="24">
              <el-form-item label="数据权限">
                <el-tree
                  :data="deptInfo.depts"
                  show-checkbox
                  check-strictly
                  :load="lazyLoad"
                  lazy
                  :default-checked-keys="deptInfo.defaultCheck"
                  node-key="id"
                  :props="deptInfo.defaultProps"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="demo-drawer__footer" style="text-align: center">
          <el-button type="success" size="mini" icon="el-icon-circle-plus">确定</el-button>
          <el-button type="default" size="mini" icon="el-icon-remove-outline" @click="handleClose">取消</el-button>
        </div>
      </el-drawer>
    </div>
  </div>
</template>
<script>
import crudRole from '@/api/system/role'
import CRUD, { presenter } from '@crud/crud'
import pagination from '@crud/Pagination'
import jForm from './roleEdit'
import api from '@/api/system/module'
import { Notification } from 'element-ui'
import { getDepartmentByid } from '@/api/system/department'
import OPTOperation from '@crud/OPT.operation'
import ToolsOpen from '@/components/ToolsOpen/index'
export default {
  components: { OPTOperation, pagination, jForm, ToolsOpen },
  cruds() {
    return CRUD({
      title: '角色',
      url: '/api/role/getByCondition',
      crudMethod: { ...crudRole }
    })
  },
  mixins: [presenter()],
  data() {
    return {
      tText: '展开所有',
      fText: '收起所有',
      optInfo: {
        filterText: null,
        menuList: [],
        btnStatus: false,
        loading: false,
        defaultCheck: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      },
      deptInfo: {
        depts: [],
        defaultCheck: [],
        defaultProps: {
          children: 'children',
          label: 'label',
          isLeaf: 'leaf'
        }
      },
      currentRoleId: null,
      roleData: {
        status: 0,
        roleName: null,
        roleCode: null,
        roleRemark: null,
        value: 1,
        deptId: 0
      },
      dataAuthorityList: [
        { value: 1, label: '全部数据权限' },
        { value: 2, label: '自定义数据权限' },
        { value: 3, label: '本部门及以下数据权限' },
        { value: 4, label: '本部门数据权限' }
      ]
    }
  },
  watch: {
    'optInfo.filterText'(val) {
      this.$refs.tree.filter(val)
    },
    'roleData.value'(val) {
      if (val == 2) {
        this.lazyLoad()
      }
    }
  },
  mounted() {
    this.loadModuleAll()
  },
  methods: {
    open(obj) {
      this.nodeExpand(obj)
    },
    loadModuleAll() {
      api.getModuleTreeAll().then((res) => {
        if (res.success) {
          this.optInfo.menuList = res.result
        }
      }).catch((err) => {})
    },
    lazyLoad(node, resolve) {
      setTimeout(() => {
        getDepartmentByid({
          id: node === undefined ? 0 : node.value
        }).then((res) => {
          if (res.success) {
            const nodes = res.result.map((item) => ({
              id: item.value,
              label: item.label,
              leaf: true // node.level >= 10,
            }))
            resolve(nodes)
          } else {
            alert(res.message)
          }
        })
      }, 1000)
    },
    toDelete(datas) {
      this.$confirm(`确认删除选中的${datas.length}条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.crud.delAllLoading = true
        this.crud.doDelete(datas)
      })
        .catch(() => {})
    },
    handleCommand(command) {
      switch (command.command) {
        case 'edit':
          this.crud.toEdit(command.obj)
          break
        case 'delete':
          this.delete(command.obj)
          break
        case 'data':
          this.roleDataModal(command.obj)
          break
      }
    },
    beforeHandleCommand(item, obj) {
      return {
        command: item,
        obj: obj
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    nodeExpand(expend) {
      for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
        this.$refs.tree.store._getAllNodes()[i].expanded = expend
      }
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

    handleCurrentChange(val) {
      if (val) {
        const that = this
        this.optInfo.btnStatus = true
        this.currentRoleId = val.id
        // 清空菜单的选中
        this.$refs.tree.setCheckedKeys([])
        api.getModuleIdsByRoleId({ roleId: val.id }).then((res) => {
          if (res.success) {
            that.optInfo.defaultCheck = []
            for (var i = 0; i < res.result.length; i++) {
              that.optInfo.defaultCheck.push(res.result[i].moduleId)
            }
          }
        }).catch((err) => {})
      }
    },

    /**
     * author：zhao.jian
     * date:2020年9月24日11:14:26
     * description：保存权限
     */
    saveRoleModule() {
      var roleModule = { roleId: this.currentRoleId, moduleId: [] }
      var nodeList = this.$refs.tree.store.getCheckedNodes()
      for (var i = 0; i < nodeList.length; i++) {
        roleModule.moduleId.push(nodeList[i].id)
      }
      this.optInfo.loading = true
      api.saveRoleModuleId(roleModule).then((res) => {
        if (res.success) {
          Notification.success({
            title: '设置成功',
            duration: 5000
          })
          this.optInfo.loading = false
        }
      }).catch((err) => {
        Notification.success({
          title: err,
          duration: 5000
        })
      })
    },
    /**
     * author：zhao.jian
     * createtime:2020年9月29日14:06:06
     * desc:数据权限弹出层
     */
    roleDataModal(row) {
      this.roleData.roleRemark = row.remark
      this.roleData.roleName = row.name
      this.roleData.roleCode = row.code
      this.roleData.status = 1
    },
    /**
     * author：zhao.jian
     * createtime:2020年9月29日14:06:06
     * desc:数据权限取消
     */
    resetRoleDataModal() {
      this.roleData.title = null
      this.roleData.status = 0
    },
    handleClose() {
      this.resetRoleDataModal()
    }
  }
}
</script>
<style>
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
