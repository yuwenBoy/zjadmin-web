    
<template>
    <div class="app-container">
      <el-row :gutter="24">
          <div class="head-container">
            <div class="content-box box-shadow">
              <div class="text item">
                <el-row :gutter="24">
                  <el-col :xs="15" :sm="14" :md="18" :lg="18" :xl="1">
                    <el-form label-width="0px" inline>
                      <el-form-item>
                        <el-input
                          v-model="crud.query.cname"
                          clearable
                          size="mini"
                          autofocus
                          placeholder="姓名、手机、邮箱"
                          class="filter-item round-left"
                        />
                      </el-form-item>
                      <el-form-item>
                        <el-select
                          v-model="crud.query.disabled"
                          clearable
                          placeholder="用户状态"
                          class="wt100"
                        >
                          <el-option label="启用" value="1" />
                          <el-option label="锁定" value="2" />
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
                    :xl="2"
                    style="text-align: right"
                  >
                    <el-button
                      v-if="crud.optShow.add"
                      v-authority="['user:add']"
                      class="filter-item"
                      size="mini"
                      round
                      type="primary"
                      icon="el-icon-plus"
                      @click="addSpu"
                      >新增</el-button
                    >
                    <el-button
                      v-authority="['user:delete']"
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
              >
              <el-table-column
                  prop="id"
                  width="120"
                  label="ID"
                  align="center"
                />
                <el-table-column
                  prop="goods_name"
                  width="120"
                  label="商品名称"
                  align="center"
                />
                <el-table-column prop="cname" label="分类名称" align="center" />
                <el-table-column
                  prop="sex"
                  label="所属品牌"
                  width="50"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.sex == 1" class="text-primary">男</span>
                    <span v-else-if="scope.row.sex == 2" class="text-success"
                      >女</span
                    >
                    <span v-else class="text-primary">未识别</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  label="图片"
                  width="120"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.phone | fmt_phone }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="create_time"
                  width="145"
                  label="创建时间"
                  align="center"
                />
                <!--   编辑与删除   -->
                <el-table-column label="操作" align="left" width="170">
                  <template slot-scope="scope">
                    <el-link
                      v-authority="['user:edit']"
                      type="info"
                      :underline="false"
                      @click="crud.toEdit(scope.row)"
                      >编辑</el-link
                    >
                    <el-link
                      v-authority="['user:delete']"
                      type="info"
                      :underline="false"
                      :disabled="scope.row.id === user.id"
                      @click="remove(scope.row)"
                      >删除</el-link
                    >
                    <el-link
                      v-authority="['user:setRole']"
                      type="info"
                      :underline="false"
                      @click="setRole(scope.row)"
                      >设置角色</el-link
                    >
                  </template>
                </el-table-column>
              </el-table>
              <!--分页组件-->
              <pagination />
            </div>
          </div>
      </el-row>
    </div>
  </template>
  <script>
  import crudUser from "@/api/system/user";
  import { setRoles, UpdateUserDisabled } from "@/api/system/user";
  import { getDeptTree } from "@/api/system/department";
  import { getRoleAllList } from "@/api/system/role";
  import DeptTree from "@/components/dept-tree/dept-tree.vue";
  import CRUD, { presenter } from "@crud/crud";
  import OPTOperation from "@crud/OPT.operation";
  import pagination from "@crud/Pagination";
  import { mapGetters } from "vuex";
  import Avatar from "@/assets/images/avatar.png";
  export default {
    components: {
      OPTOperation,
      DeptTree,
      pagination,
    },
    cruds() {
      return CRUD({
        title: "用户",
        url: "/user/getByCondition",
        crudMethod: { ...crudUser },
      });
    },
    mixins: [presenter()],
    data() {
      return {
        request: false,
        status: 0,
        roles: [],
        roleList: [],
        userId: 0,
        rolesIds: [],
        Avatar: Avatar,
        deptEntity: [],
      };
    },
    created() {
      this.crud.msg.add = "新增成功，默认密码：jxxqz123";
    },
    computed: {
      ...mapGetters(["user"]),
    },
    mounted() {
      this.getDeptTree();
    },
    methods: {
      // 查询全部机构
      async getDeptTree() {
        let response_data = {};
        response_data = await getDeptTree();
        this.deptEntity = response_data.result;
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

      /**
       * 新增SPU
       */
      async addSpu(){
        debugger
        this.$router.push({name:'/shop/spu/edit',query:{}})
      },
      remove(obj) {
        this.$confirm(
          `确认删除账号【${obj.username}】吗，删除后不可恢复`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            this.crud.delAllLoading = true;
            this.crud.doDelete(obj);
          })
          .catch(() => {});
      },
    },
  };
  </script>
  <style scoped>
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
  