<template>
  <div class="app-container">
    <div class="head-container">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>部门列表</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            v-model="queryInfo.open"
            @click="isOpen"
            :icon="
              queryInfo.isQueryOpen == true
                ? 'el-icon-arrow-down'
                : 'el-icon-arrow-up'
            "
            >{{ queryInfo.queryMsg }}</el-button
          >
        </div>
        <div class="text item">
          <el-form label-width="100px" label-position="right">
            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item label="部门名称：">
                  <el-input
                    clearable
                    size="small"
                    v-model="crud.query.DepartmentName"
                    placeholder="请输入部门名称"
                    class="filter-item"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-button
                  class="filter-item"
                  size="mini"
                  type="success"
                  @click="crud.toQuery"
                  icon="el-icon-search"
                  round
                  >搜索</el-button
                >
                <el-button
                  class="filter-item"
                  size="mini"
                  type="warning"
                  icon="el-icon-refresh-left"
                  @click="crud.resetQuery"
                  round
                  >重置</el-button
                >
                <el-button
                  class="filter-item"
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  round
                  @click="crud.toAdd"
                  v-if="crud.optShow.add"
                  v-authority="['dept:add']"
                  >新增</el-button
                >
                <el-button
                  class="filter-item"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  :loading="crud.delAllLoading"
                  :disabled="crud.selections.length === 0"
                  @click="toDelete(crud.selections)"
                  v-authority="['dept:delete']"
                  round
                  >删除</el-button
                >
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!--表格渲染-->
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
          <el-table-column type="selection" width="55" />
          <el-table-column
            :show-overflow-tooltip="true"
            label="部门名称"
            prop="departmentName"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            label="部门编码"
            prop="departmentCode"
          />
          <el-table-column prop="createtime" label="创建日期" width="135">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createtime) }}</span>
            </template>
          </el-table-column>
          <!--   编辑与删除   -->
          <el-table-column label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  更多
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="beforeHandleCommand('edit', scope.row)"
                    icon="el-icon-edit"
                    v-authority="['dept:edit']"
                    >编辑</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="beforeHandleCommand('delete', scope.row)"
                    icon="el-icon-delete"
                    v-authority="['dept:delete']"
                    >删除</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
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
                <el-form-item label="部门名称" prop="departmentName">
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
                <el-form-item label="部门编码" prop="departmentCode">
                  <el-input
                    v-model="form.departmentCode"
                    clearable
                    placeholder="请输入部门编码"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12" v-show="type == 0">
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
            <el-row> </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
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
              @click="crud.cancelCU"
              size="mini"
              icon="el-icon-remove-outline"
              >关闭</el-button
            >
          </div>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>
<script>
import crudDepartment from "@/api/system/department";
import CRUD, { presenter, form } from "@crud/crud";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
const defaultForm = {
  id: null,
  departmentName: "",
  departmentCode: "",
  pid: 0,
};
export default {
  components: { Treeselect },
  cruds() {
    return CRUD({
      title: "部门",
      url: "/api/department/getByCondition?pid=0",
      crudMethod: { ...crudDepartment },
      sort: "id",
    });
  },
  mixins: [presenter(), form(defaultForm)],
  data() {
    return {
      queryInfo: {
        isQueryOpen: false,
        queryMsg: "收起",
        open: "close",
      },
      type: 1,
      rules: {
        departmentName: [
          { required: true, message: "请输入部门名称", trigger: "blur" },
        ],
        departmentCode: [
          { required: true, message: "请输入部门编码", trigger: "blur" },
        ],
        pid: [{ required: true, message: "请选择上级部门", trigger: "change" }],
      },
      menus: [],
    };
  },
  methods: {
      // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.menus = [];
      if (form.id != null) {
        if (form.pid === null) {
          form.pid = 0;
        }
      } else {
        this.menus.push({ id: 0, label: "上级部门", children: null });
      }
    },
    isOpen() {
      if (this.queryInfo.open == "open") {
        this.queryInfo.isQueryOpen = false;
        this.queryInfo.queryMsg = "收起";
        this.queryInfo.open = "close";
      } else if (this.queryInfo.open === "close") {
        this.queryInfo.isQueryOpen = true;
        this.queryInfo.queryMsg = "展开";
        this.queryInfo.open = "open";
      }
    },
    getMenus(tree, treeNode, resolve) {
      const params = { pid: tree.id };
      setTimeout(() => {
        crudDepartment.getModulePager(params).then((res) => {
          resolve(res.result.content);
        });
      }, 100);
    },
    toDelete(datas) {
      this.$confirm(`确认删除选中的${datas.length}条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.crud.delAllLoading = true;
          this.crud.doDelete(datas);
        })
        .catch(() => {});
    },
    handleCommand(command) {
      switch (command.command) {
        case "edit":
          this.crud.toEdit(command.obj);
          break;
        case "delete":
          this.$confirm(`确认删除此条数据吗，删除后不可恢复`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.crud.delAllLoading = true;
              this.crud.doDelete(command.obj);
            })
            .catch(() => {});
          break;
      }
    },
    beforeHandleCommand(item, obj) {
      return {
        command: item,
        obj: obj,
      };
    },
    updateLyDeptId(data) {
      this.defaultForm.pid = data;
    },
    loadMenus({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        const params = { id: parentNode.id };
        crudDepartment.getDeptTree(params).then((res) => {
          parentNode.children = res.result.map(function (obj) {
            if (!obj.leaf) {
              obj.children = null;
            }
            return obj;
          });
          setTimeout(() => {
            callback();
          }, 100);
        });
      }
    },
  },
};
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