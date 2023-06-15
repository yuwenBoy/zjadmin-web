<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :xs="19" :sm="18" :md="19" :lg="19" :xl="20">
        <div class="head-container">
          <div class="content-box box-shadow">
            <div class="text item">
              <el-row :gutter="24">
                <el-col :span="24">
                  <el-row :gutter="24">
                    <el-col :span="14">
                      <el-form label-width="0px" inline>
                        <el-form-item>
                          <el-input
                            v-model="crud.query.name"
                            clearable
                            size="small"
                            placeholder="请输入角色名称，编码"
                            class="filter-item"
                          />
                        </el-form-item>
                        <OPTOperation />
                      </el-form>
                    </el-col>
                    <el-col :push="2" :span="8.2">
                      <el-button
                        v-if="crud.optShow.add"
                        v-authority="['role:add']"
                        class="filter-item"
                        round
                        size="mini"
                        type="primary"
                        icon="el-icon-plus"
                        @click="crud.toAdd"
                        >新增</el-button
                      >
                      <el-button
                        v-authority="['role:delete']"
                        class="filter-item"
                        round
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        :loading="crud.delAllLoading"
                        :disabled="crud.selections.length === 0"
                        @click="toDelete(crud.selections)"
                        >删除</el-button
                      >
                      <el-button
                        v-authority="['role:save']"
                        type="success"
                        class="filter-item"
                        size="mini"
                        round
                        :disabled="!optInfo.btnStatus"
                        icon="el-icon-circle-plus"
                        :loading="optInfo.loading"
                        @click="saveRoleModule"
                        >授权资源</el-button
                      >
                    </el-col>
                  </el-row>
                  <el-table
                    ref="table"
                    :data="crud.data"
                    highlight-current-row
                    @selection-change="crud.selectionChangeHandler"
                    @current-change="handleCurrentChange"
                  >
                    <el-table-column
                      type="selection"
                      align="center"
                      width="55"
                    />
                    <el-table-column
                      type="index"
                      label="序号"
                      align="center"
                      width="50"
                    />
                    <el-table-column prop="name" label="角色名称" />
                    <el-table-column prop="code" label="角色编码" />
                    <el-table-column
                      prop="create_time"
                      label="创建时间"
                      width="145"
                    />
                    <el-table-column
                      prop="remark"
                      label="备注"
                      show-overflow-tooltip
                    />
                    <!--   编辑与删除   -->
                    <el-table-column label="操作" align="left" width="170">
                      <template slot-scope="scope">
                        <el-link
                          v-authority="['role:edit']"
                          type="info"
                          :underline="false"
                          @click="crud.toEdit(scope.row)"
                          >编辑</el-link
                        >
                        <el-link
                          v-authority="['role:delete']"
                          type="info"
                          :underline="false"
                          @click="remove(scope.row)"
                          >删除</el-link
                        >
                        <el-link
                          v-authority="['role:dataSave']"
                          type="info"
                          :underline="false"
                          @click="roleDataModal(scope.row)"
                          >数据权限</el-link
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <!--分页组件-->
                  <pagination />
                  <jForm />
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :lg="5" :xs="5" :sm="6" :md="4" :xl="4">
        <div style="padding-top: 10px">
          <dept-tree
            title="授权资源"
            showCheckBox
            checkStrictly
            :data="menuEntity"
            ref="deptTree"
            :checkValue="setCheckList"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import crudRole from "@/api/system/role";
import CRUD, { presenter } from "@crud/crud";
import pagination from "@crud/Pagination";
import jForm from "./roleEdit";
import api from "@/api/system/module";
import OPTOperation from "@crud/OPT.operation";
import DeptTree from "@/components/dept-tree/dept-tree.vue";
export default {
  components: { OPTOperation, pagination, jForm, DeptTree },
  cruds() {
    return CRUD({
      title: "角色",
      url: "role/getByCondition",
      crudMethod: { ...crudRole },
    });
  },
  mixins: [presenter()],
  data() {
    return {
      tText: "展开所有",
      fText: "收起所有",
      optInfo: {
        filterText: null,
        menuList: [],
        btnStatus: false,
        loading: false,
        defaultCheck: [],
        defaultProps: {
          children: "children",
          label: "label",
        },
      },
      deptInfo: {
        depts: [],
        defaultCheck: [],
        defaultProps: {
          children: "children",
          label: "label",
          isLeaf: "leaf",
        },
      },
      currentRoleId: null,
      roleData: {
        status: 0,
        roleName: null,
        roleCode: null,
        roleRemark: null,
        value: 1,
        deptId: 0,
      },
      dataAuthorityList: [
        { value: 1, label: "全部数据权限" },
        { value: 2, label: "自定义数据权限" },
        { value: 3, label: "本部门及以下数据权限" },
        { value: 4, label: "本部门数据权限" },
      ],
      menuEntity: [],
      setCheckList: [],
    };
  },
  watch: {
    "roleData.value"(val) {
      if (val == 2) {
        this.lazyLoad();
      }
    },
  },
  mounted() {
    this.loadModuleAll();
  },
  methods: {
    async loadModuleAll() {
      let response_data = {};
      response_data = await api.getModuleTreeAll();
      this.menuEntity = response_data.result;
    },
    toDelete(datas) {
      this.$msg.confirm(`确认删除选中的${datas.length}条数据?`, {
        ok: () => {
          this.crud.delAllLoading = true;
          this.crud.doDelete(datas);
        },
        cancel: () => {},
      });
    },
    nodeExpand(expend) {
      for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
        this.$refs.tree.store._getAllNodes()[i].expanded = expend;
      }
    },
    remove(row) {
      this.$msg.confirm(`确认删除此条数据吗，删除后不可恢复`, {
        ok: () => {
          this.crud.delAllLoading = true;
          this.crud.doDelete(row);
        },
        cancel: () => {},
      });
    },

    // 单击角色查找已赋值的权限菜单
    handleCurrentChange(val) {
      if (val) {
        const that = this;
        this.optInfo.btnStatus = true;
        this.currentRoleId = val.id;
        // 清空菜单的选中
        this.setCheckList = [];
        api
          .getModuleIdsByRoleId({ roleId: val.id })
          .then((res) => {
            if (res.success) {
              that.setCheckList = [];
              for (var i = 0; i < res.result.length; i++) {
                that.setCheckList.push(res.result[i].id);
              }
            }
          })
          .catch((err) => {});
      }
    },
    /**
     * author：zhao.jian
     * date:2020年9月24日11:14:26
     * description：保存权限
     */
    saveRoleModule() {
      var roleModule = { roleId: this.currentRoleId, moduleId: [] };
      var nodeList = this.$refs.deptTree.getCheckedNode();
      for (var i = 0; i < nodeList.length; i++) {
        roleModule.moduleId.push(nodeList[i].id);
      }
      this.optInfo.loading = true;
      api
        .saveOptionAuthority(roleModule)
        .then((res) => {
          if (res.success) {
            this.$msg.alert("资源授权成功");
            this.optInfo.loading = false;
          }
        })
        .catch((err) => {
          Notification.success({
            title: err,
            duration: 5000,
          });
        });
    },
    /**
     * author：zhao.jian
     * createtime:2020年9月29日14:06:06
     * desc:数据权限弹出层
     */
    roleDataModal(row) {
      this.roleData.roleRemark = row.remark;
      this.roleData.roleName = row.name;
      this.roleData.roleCode = row.code;
      this.roleData.status = 1;
    },
    /**
     * author：zhao.jian
     * createtime:2020年9月29日14:06:06
     * desc:数据权限取消
     */
    resetRoleDataModal() {
      this.roleData.title = null;
      this.roleData.status = 0;
    },
    handleClose() {
      this.resetRoleDataModal();
    },
  },
};
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
