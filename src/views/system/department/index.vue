<template>
  <div class="app-container">
    <div class="head-container">
      <div class="content-box box-shadow">
        <div class="text item">
          <el-row :gutter="24">
            <el-col :span="10" style="text-align: left">
              <el-form label-width="0px" inline>
                <el-form-item>
                  <el-input
                    v-model="crud.query.DepartmentName"
                    clearable
                    size="small"
                    placeholder="请输入部门名称"
                    class="filter-item round-left"
                  />
                </el-form-item>
                <OPTOperation />
              </el-form>
            </el-col>
            <el-col :push="10" :span="4">
              <el-button
                v-if="crud.optShow.add"
                v-authority="['dept:add']"
                class="filter-item"
                size="mini"
                round
                type="primary"
                icon="el-icon-plus"
                @click="crud.toAdd"
                >新增</el-button
              >
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
                >删除</el-button
              >
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
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="50"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            label="组织名称"
            prop="department_name"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            label="组织编码"
            prop="department_code"
            width="235"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            label="分类"
            prop="typeName"
            width="135"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            label="排序"
            prop="sort"
            width="135"
          />
          <!--   编辑与删除   -->
          <el-table-column label="操作" width="100px" align="left">
            <template slot-scope="scope">
              <el-link
                v-authority="['dept:edit']"
                type="info"
                :underline="false"
                @click="crud.toEdit(scope.row)"
                >编辑</el-link
              >
              <el-link
                v-authority="['dept:delete']"
                type="info"
                :underline="false"
                @click="remove(scope.row)"
                >删除</el-link
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
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
              <el-form-item label="上级组织" ref="deptRef">
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
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="组织名称" prop="department_name">
                <el-input
                  v-model="form.department_name"
                  clearable
                  placeholder="请输入组织名称"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="组织编码" prop="department_code">
                <el-input
                  v-model="form.department_code"
                  clearable
                  placeholder="请输入组织编码"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="组织分类" prop="department_type">
                <el-select
                  v-model="form.department_type"
                  placeholder="请选择组织分类"
                  clearable
                >
                  <el-option
                    v-for="item in department_typeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="排序" prop="sort">
                <el-slider v-model="form.sort"></el-slider>
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
          >提交</el-button
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
</template>
<script>
import crudDepartment from "@/api/system/department";
import { getDeptTree } from "@/api/system/department";
import CRUD, { presenter, form } from "@crud/crud";
import OPTOperation from "@crud/OPT.operation";
import treeSelect from "@/components/tree-select/tree-select.vue";
const defaultForm = {
  id: null,
  department_name: "",
  department_code: "",
  department_type:'',
  sort:0,
  parent_id: 0,
};
export default {
  components: { treeSelect, OPTOperation },
  cruds() {
    return CRUD({
      title: "组织",
      url: "/dept/getByCondition",
      crudMethod: { ...crudDepartment },
      sort: "sort",
    });
  },
  mixins: [presenter(), form(defaultForm)],
  data() {
    return {
      type: 1,
      rules: {
        department_name: [
          { required: true, message: "请输入部门组织名称", trigger: "blur" },
        ],
        department_type: [
          { required: true, message: "请输入组织类型", trigger: "blur" },
        ],
        sort: [{ required: true, message: "请选择排序", trigger: "blur" }],
      },
      deptEntity: [],
      department_typeList:[{
        label:'机构',
        value:1
      },{
        label:'部门',
        value:2
      }]
    };
  },
  mounted() {
    this.crud.query.pid = 0;
  },
  methods: {
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.deptEntity = [];
      this.getDeptAll();
    },
    getMenus(tree, treeNode, resolve) {
      const params = { pid: tree.id };
      setTimeout(() => {
        crudDepartment.getByCondition(params).then((res) => {
          resolve(res.result.content);
        });
      }, 100);
    },
    async getDeptAll() {
      let response_data = {};
      response_data = await getDeptTree();
      this.deptEntity = response_data.result;
    },

    // 根据机构查询职位
    async selectTree(data) {
      this.crud.form.parent_id = parseInt(data.id);
    },
    // 根据机构查询职位
    clearTree(data) {
      this.crud.form.parent_id = data;
      this.$refs.deptRef.$emit("el.form.change", data); // 重点！自定义组件使用element的form表单校验
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
