<template>
  <div class="app-container">
    <div class="head-container">
      <div class="content-box box-shadow">
        <div class="text item">
          <el-row :gutter="24">
            <el-col :xs="15" :sm="14" :md="12" :lg="7" :xl="7">
              <el-form label-width="0px" inline>
                <el-form-item>
                  <el-input
                    v-model="crud.query.name"
                    clearable
                    size="small"
                    placeholder="请输入分类名称"
                    class="filter-item round-left"
                  />
                </el-form-item>
                <OPTOperation />
              </el-form>
            </el-col>
            <el-col :xs="15" :sm="14" :md="12" :lg="3" :xl="9">
              <el-button
                type="info"
                round
                icon="el-icon-sort"
                size="mini"
                @click="toggleExpandAll"
                >展开/折叠</el-button
              >
            </el-col>
            <el-col
              :xs="15"
              :sm="14"
              :md="14"
              :lg="14"
              :xl="9"
              style="text-align: right"
            >
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
          v-if="refreshTable"
          ref="table"
          :data="crud.data"
          row-key="id"
          :default-expand-all="isExpandAll"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          @select="crud.selectChange"
          @select-all="crud.selectAllChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
            :reserve-selection="true"
          />
          <el-table-column prop="id" label="分类ID" align="center" width="80" />
          <el-table-column
            :show-overflow-tooltip="true"
            label="分类名称"
            prop="name"
            align="center"
          />
          <el-table-column
            prop="avatar"
            label="分类图片"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              <el-image
                style="
                  object-fit: cover;
                  max-width: 35px;
                  max-height: 35px;
                  border-radius: 5px;
                "
                :src="scope.row.pic"
                :preview-src-list="[scope.row.pic]"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column label="排序" prop="sort" width="80" align="center" />
          <el-table-column prop="create_time" label="创建时间" width="145" />
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
              <el-form-item label="品类名称" prop="name">
                <el-input
                  v-model="form.name"
                  clearable
                  placeholder="请输入品类名称"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="是否父级:" prop="is_parent">
                <el-radio-group v-model="form.is_parent">
                  <el-radio-button label="0">是</el-radio-button>
                  <el-radio-button label="1">否</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24" v-show="form.is_parent == 1">
            <el-col :span="24">
              <el-form-item label="上级品类名称" ref="deptRef">
                <tree-select
                  :data="treeEntity"
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
              <el-form-item label="品类图片">
                <pic-upload v-model="form.pic" style="width: 500px" />
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
</template>
  <script>
import crudCategory from "@/api/shop/category";
import { getCategoryAll } from "@/api/shop/category";
import CRUD, { presenter, form } from "@crud/crud";
import OPTOperation from "@crud/OPT.operation";
import treeSelect from "@/components/tree-select/tree-select.vue";
import picUpload from "@/components/file";
const defaultForm = {
  id: null,
  name: "",
  is_parent: 0,
  sort: 99,
  parent_id: 0,
  pic: "",
};
export default {
  components: { treeSelect, OPTOperation, picUpload },
  cruds() {
    return CRUD({
      title: "品类",
      url: "/category/getByCondition",
      crudMethod: { ...crudCategory },
      sort: "sort",
    });
  },
  mixins: [presenter(), form(defaultForm)],
  data() {
    return {
      // type: 1,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      rules: {
        name: [{ required: true, message: "请输入品类名称", trigger: "blur" }],
        sort: [{ required: true, message: "请选择排序", trigger: "blur" }],
      },
      treeEntity: [],
    };
  },
  mounted() {
    this.crud.query.pid = 0;
  },
  methods: {
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.treeEntity = [];
      this.getTreeAllApi();
    },
    getMenus(tree, treeNode, resolve) {
      const params = { pid: tree.id, sort: "sort" };
      setTimeout(() => {
        crudDepartment.getByCondition(params).then((res) => {
          resolve(res.result.content);
        });
      }, 100);
    },
    async getTreeAllApi() {
      let response_data = {};
      response_data = await getCategoryAll();
      this.treeEntity = response_data.result;
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
      this.$msg.confirm(`确认删除选中的${datas.length}条数据?`, {
        ok: () => {
          this.crud.delAllLoading = true;
          this.crud.doDelete(datas);
        },
      });
    },
    remove(row) {
      this.$msg.confirm(`确认删除此条数据吗，删除后不可恢复?`, {
        ok: () => {
          this.crud.delAllLoading = true;
          this.crud.doDelete(row);
        },
      });
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
  