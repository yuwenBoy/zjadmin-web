<template>
  <div class="app-container">
    <div class="head-container">
      <div class="content-box box-shadow">
        <div class="text item">
          <el-row :gutter="24">
            <el-col :span="4">
              <el-button
                v-if="crud.optShow.add"
                v-authority="['module:add']"
                class="filter-item"
                size="mini"
                type="primary"
                round
                icon="el-icon-plus"
                @click="crud.toAdd"
              >新增</el-button>
              <el-button
                v-authority="['module:delete']"
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
                  <el-input
                    v-model="crud.query.name"
                    clearable
                    size="small"
                    placeholder="请输入菜单名称"
                    class="filter-item round-left"
                  />
                </el-form-item>
                <OPTOperation />
              </el-form>
            </el-col>
          </el-row>
        </div>
        <!--表格渲染-->
        <el-table
          ref="table"
          :data="crud.data"
          row-key="id"
          lazy
          :load="getMenus"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          @select="crud.selectChange"
          @select-all="crud.selectAllChange"
          @selection-change="crud.selectionChangeHandler"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column type="index" label="序号" align="center" width="50" />
          <el-table-column :show-overflow-tooltip="true" label="菜单名称" prop="name" width="185" />
          <el-table-column :show-overflow-tooltip="true" label="菜单编码" prop="code" />
          <el-table-column prop="icon" label="图标" align="center" width="60px">
            <template slot-scope="scope">
              <svg-icon :icon-class="scope.row.icon ? scope.row.icon : ''" />
            </template>
          </el-table-column>
          <el-table-column label="路径" show-overflow-tooltip prop="menuPath" />
          <el-table-column label="菜单类型" prop="menuType">
            <template slot-scope="scope">
              <span v-if="scope.row.menuType==1">按钮</span>
              <span v-else-if="scope.row.menuType==2">菜单</span>
              <span v-else>目录</span>
            </template>
          </el-table-column>
          <el-table-column prop="index" align="center" label="排序">
            <template slot-scope="scope">{{ scope.row.index }}</template>
          </el-table-column>
          <el-table-column prop="createtime" label="创建日期" width="135">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createtime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100px" align="left">
            <template slot-scope="scope">
              <el-link v-authority="['module:edit']" type="info" :underline="false" @click="crud.toEdit(scope.row)">编辑</el-link>
              <el-link v-authority="['module:delete']" type="info" :underline="false" @click="remove(scope.row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          append-to-body
          :close-on-click-modal="false"
          :before-close="crud.cancelCU"
          :visible="crud.status.cu > 0"
          :title="crud.status.title"
          width="600px"
        >
          <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="菜单类型">
                  <el-radio-group v-model="form.menuType">
                    <el-radio-button label="3">目录</el-radio-button>
                    <el-radio-button label="2">菜单</el-radio-button>
                    <el-radio-button label="1">按钮</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="form.menuType==2?'菜单名称':form.menuType==3?'目录名称':'按钮名称'"
                  prop="name"
                >
                  <el-input v-model="form.name" clearable placeholder="请输入菜单名称" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item
                  :label="form.menuType==2?'菜单编码':form.menuType==3?'目录编码':'按钮编码'"
                  prop="code"
                >
                  <el-input v-model="form.code" clearable placeholder="请输入菜单编码" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="系统编码">
                  <el-input v-model="form.systemCode" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="菜单图标">
                  <el-popover
                    placement="bottom-start"
                    width="480"
                    trigger="click"
                    @show="$refs['iconSelect'].reset()"
                  >
                    <IconSelect ref="iconSelect" @selected="selected" />
                    <el-input
                      slot="reference"
                      v-model="form.icon"
                      style="width: 480px;"
                      placeholder="点击选择图标"
                      readonly
                    >
                      <svg-icon
                        v-if="form.icon"
                        slot="prefix"
                        :icon-class="form.icon"
                        class="el-input__icon"
                        style="height: 32px;width: 16px;"
                      />
                      <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                    </el-input>
                  </el-popover>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col v-show="form.menuType!=1" :span="12">
                <el-form-item label="菜单路径" :prop="form.menuType==2?'menuPath':''">
                  <el-input
                    v-model="form.menuPath"
                    clearable
                    placeholder="格式如：system/commonent/index"
                  />
                </el-form-item>
              </el-col>
              <el-col v-show="form.menuType!=3" :span="12">
                <el-form-item label="权限标识" :prop="form.menuType!=3?'permission':''">
                  <el-input v-model="form.permission" clearable placeholder="请输入菜单标识" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="排序">
                  <el-input-number
                    v-model.number="form.index"
                    :min="0"
                    :max="999"
                    controls-position="right"
                    style="width: 178px;"
                  />
                </el-form-item>
              </el-col>
              <el-col v-show="form.menuType!=3" :span="12">
                <el-form-item label="上级目录">
                  <treeselect
                    v-model="form.parentId"
                    :options="menus"
                    :load-options="loadMenus"
                    placeholder="选择上级类目"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button
              :loading="crud.status.cu === 2"
              type="success"
              size="mini"
              icon="el-icon-circle-plus"
              @click="crud.submitCU"
            >提交</el-button>
            <el-button
              type="default"
              size="mini"
              icon="el-icon-remove-outline"
              @click="crud.cancelCU"
            >关闭</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import crudMenu from '@/api/system/module'

import IconSelect from '@/components/IconSelect'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import CRUD, { presenter, form } from '@crud/crud'
import OPTOperation from '@crud/OPT.operation'
const defaultForm = {
  id: null,
  name: '',
  code: '',
  menuType: '3',
  icon: '',
  index: 1,
  menuPath: '',
  parentId: 0,
  permission: ''
}
export default {
  components: { Treeselect, IconSelect, OPTOperation },
  cruds() {
    return CRUD({
      title: '菜单',
      url: '/api/module/getByCondition?parentId=0',
      crudMethod: { ...crudMenu },
      sort: 'index'
    })
  },
  mixins: [presenter(), form(defaultForm)],
  data() {
    return {
      rules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        menuPath: [{ required: true, message: '请输入路径', trigger: 'blur' }],
        permission: [
          { required: true, message: '请输入权限标识', trigger: 'blur' }
        ]
      },
      menus: []
    }
  },
  methods: {
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.menus = []
      if (form.id != null) {
        if (form.pid === null) {
          form.pid = 0
        }
        debugger
        // this.getSupDepts(form.id);
      } else {
        this.menus.push({ id: 0, label: '顶级类目', children: null })
      }
    },
    getMenus(tree, treeNode, resolve) {
      const params = { parentId: tree.id }
      setTimeout(() => {
        crudMenu.getModulePager(params).then((res) => {
          resolve(res.result.content)
        })
      }, 100)
    },
    getSupDepts(id) {
      crudMenu.getMenuSuperior(id).then((res) => {
        const children = res.map(function(obj) {
          if (!obj.leaf && !obj.children) {
            obj.children = null
          }
          return obj
        })
        this.menus = [{ id: 0, label: '顶级类目', children: children }]
      })
    },
    loadMenus({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        const params = { id: parentNode.id }
        crudMenu.getMenusTree(params).then((res) => {
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
    },
    selected(name) {
      this.form.icon = name
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
      })
        .catch(() => {})
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
