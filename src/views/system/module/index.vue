<template>
  <div class="app-container">
    <div class="head-container">
      <div class="content-box box-shadow">
        <div class="text item">
          <el-row :gutter="24">
            <el-col :span="6.8">
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
            <el-col :span="1.2">
              <el-button
                  type="info"
                  round
                  icon="el-icon-sort"
                  size="mini"
                  @click="toggleExpandAll"
                  >展开/折叠</el-button
                >
            </el-col>
            <el-col :span="3.5" :push="9">
              <el-button
                v-if="crud.optShow.add"
                v-authority="['module:add']"
                class="filter-item"
                size="mini"
                type="primary"
                round
                icon="el-icon-plus"
                @click="crud.toAdd"
                >新增</el-button
              >
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
                >删除</el-button
              >
            </el-col>
          </el-row>
        </div>
        <!--表格渲染-->
        <el-table
          v-if="refreshTable"
          ref="table"
          :data="crud.data"
          row-key="id"
          :default-expand-all="isExpandAll"
          @select="crud.selectChange"
          @select-all="crud.selectAllChange"
          @selection-change="crud.selectionChangeHandler"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="50"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            label="菜单名称"
            align="center"
            prop="name"
            width="185"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            label="菜单编码"
            align="center"
            prop="code"
          />
          <el-table-column prop="icon" label="图标" align="center" width="60px">
            <template slot-scope="scope">
              <svg-icon :icon-class="scope.row.icon ? scope.row.icon : ''" />
            </template>
          </el-table-column>
          <el-table-column
            label="路径"
            show-overflow-tooltip
            align="center"
            prop="menuPath"
          />
          <el-table-column
            label="菜单类型"
            prop="menuType"
            align="center"
            width="85"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.menuType == 1">按钮</span>
              <span v-else-if="scope.row.menuType == 2">菜单</span>
              <span v-else>目录</span>
            </template>
          </el-table-column>
          <el-table-column
            label="是否可见"
            prop="hidden"
            align="center"
            width="105"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.hidden == 1">不可见</span>
              <span v-else>可见</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="indexNo"
            align="center"
            label="排序"
            width="85"
          />
          <el-table-column
            prop="create_time"
            label="创建时间"
            width="135"
            align="center" />
          <el-table-column label="操作" width="100px" align="left">
            <template slot-scope="scope">
              <el-link
                v-authority="['module:edit']"
                type="info"
                :underline="false"
                @click="crud.toEdit(scope.row)"
                >编辑</el-link
              >
              <el-link
                v-authority="['module:delete']"
                type="info"
                :underline="false"
                @click="remove(scope.row)"
                >删除</el-link
              >
            </template>
          </el-table-column>
        </el-table>
        <el-drawer
          append-to-body
          :wrapperClosable="false"
          :close-on-click-modal="false"
          :before-close="crud.cancelCU"
          direction="rtl"
          size="30%"
          :visible="crud.status.cu > 0"
          :title="crud.status.title"
        >
          <div class="xin-content">
            <el-form
              ref="form"
              :model="form"
              :rules="rules"
              label-position="top"
              size="small"
              label-width="80px"
            >
              <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item label="菜单类型">
                    <el-radio-group v-model="form.menuType">
                      <el-radio-button label="3">目录</el-radio-button>
                      <el-radio-button label="2">菜单</el-radio-button>
                      <el-radio-button label="1">按钮</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item
                    :label="
                      form.menuType == 2
                        ? '菜单名称'
                        : form.menuType == 3
                        ? '目录名称'
                        : '按钮名称'
                    "
                    prop="name"
                  >
                    <el-input
                      v-model="form.name"
                      clearable
                      placeholder="请输入菜单名称"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item
                    :label="
                      form.menuType == 2
                        ? '菜单编码'
                        : form.menuType == 3
                        ? '目录编码'
                        : '按钮编码'
                    "
                    prop="code"
                  >
                    <el-input
                      v-model="form.code"
                      clearable
                      placeholder="请输入菜单编码"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col v-show="form.menuType != 1" :span="24">
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
                        style="width: 480px"
                        placeholder="点击选择图标"
                        readonly
                      >
                        <svg-icon
                          v-if="form.icon"
                          slot="prefix"
                          :icon-class="form.icon"
                          class="el-input__icon"
                          style="height: 32px; width: 16px"
                        />
                        <i
                          v-else
                          slot="prefix"
                          class="el-icon-search el-input__icon"
                        />
                      </el-input>
                    </el-popover>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col v-show="form.menuType != 1" :span="24">
                  <el-form-item
                    label="菜单路径"
                    :prop="form.menuType == 2 ? 'menuPath' : ''"
                  >
                    <el-input
                      v-model="form.menuPath"
                      clearable
                      placeholder="格式如：system/commonent/index"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col v-show="form.menuType != 3" :span="24">
                  <el-form-item
                    label="权限标识"
                    :prop="form.menuType != 3 ? 'permission' : ''"
                  >
                    <el-input
                      v-model="form.permission"
                      clearable
                      placeholder="请输入菜单标识"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item label="排序" prop="indexNo">
                    <el-slider v-model="form.indexNo"></el-slider>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col v-show="form.menuType != 1" :span="24">
                  <el-form-item label="菜单可见">
                    <el-radio-group v-model="form.hidden">
                      <el-radio-button label="0">可见</el-radio-button>
                      <el-radio-button label="1">不可见</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col v-show="form.menuType != 3" :span="24">
                  <el-form-item label="上级菜单" ref="deptRef">
                    <tree-select
                      :data="deptEntity"
                      :value="form.parent_id"
                      v-model="form.parent_id"
                      @select="selectTree"
                      @clear="clearTree"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
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
      </div>
    </div>
  </div>
</template>
<script>
import crudMenu from "@/api/system/module";

import IconSelect from "@/components/IconSelect";
import treeSelect from "@/components/tree-select/tree-select.vue";
import CRUD, { presenter, form } from "@crud/crud";
import OPTOperation from "@crud/OPT.operation";
const defaultForm = {
  id: null,
  name: "",
  code: "",
  menuType: "3",
  icon: "",
  indexNo: 0,
  menuPath: "",
  parent_id: 0,
  permission: "",
  hidden: 0, // 菜单可见
};
export default {
  components: { treeSelect, IconSelect, OPTOperation },
  cruds() {
    return CRUD({
      title: "菜单",
      url: "/module/getByCondition?pid=0",
      crudMethod: { ...crudMenu },
      sort: "indexNo",
    });
  },
  mixins: [presenter(), form(defaultForm)],
  data() {
    return {
      rules: {
        name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        menuPath: [{ required: true, message: "请输入路径", trigger: "blur" }],
        indexNo: [{ required: true, message: "请排序", trigger: "blur" }],
        permission: [
          { required: true, message: "请输入权限标识", trigger: "blur" },
        ],
      },
      deptEntity: [],
      // 是否展开，默认全部展开
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
    };
  },
  mounted() {
    this.crud.query.pid = 0;
  },
  methods: {
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.deptEntity = [];
      this.getDoduleAllApi();
      if (form.id != null) {
        if (form.pid === null) {
          form.pid = 0;
        }
      } else {
      }
    },
    async getDoduleAllApi() {
      let response_data = {};
      response_data = await crudMenu.getModuleList();
      this.deptEntity = response_data.result;
    },
    // 切换上级菜单
    async selectTree(data) {
      this.crud.form.parent_id = parseInt(data.id);
    },
    // 清空上级菜单
    clearTree(data) {
      this.crud.form.parent_id = data;
      this.$refs.deptRef.$emit("el.form.change", data); // 重点！自定义组件使用element的form表单校验
    },
    selected(name) {
      this.form.icon = name;
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
    remove(row) {
      this.$confirm(`确认删除此条数据吗，删除后不可恢复`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.crud.delAllLoading = true;
          this.crud.doDelete(row);
        })
        .catch(() => {});
    },
     /** 展开/折叠操作 */
     toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
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
