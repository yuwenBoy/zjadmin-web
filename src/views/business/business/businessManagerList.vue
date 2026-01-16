     
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
                        v-model="crud.query.title"
                        clearable
                        size="mini"
                        autofocus
                        placeholder="商家名称"
                        class="filter-item round-left"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-select
                        v-model="crud.query.status"
                        clearable
                        placeholder="商家状态"
                        class="wt100"
                      >
                        <el-option label="审核中" value="0" />
                        <el-option label="活跃" value="1" />
                        <el-option label="停用" value="2" />
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
                    v-authority="['business:add']"
                    class="filter-item"
                    size="mini"
                    round
                    type="primary"
                    icon="el-icon-plus"
                    @click="$router.push({ name: 'edit', query: {} })"
                    >新增</el-button
                  >
                  <el-button
                    v-authority="['business:delete']"
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
              <el-table-column prop="id" width="80" label="ID" align="center" />
              <el-table-column
                prop="title"
                label="商家名称"
                align="center"
                width="150" 
              />
              <el-table-column prop="contactName"  width="100" label="商家联系人" align="center" />
              <el-table-column prop="contactPhone"  width="100" label="联系人电话" align="center" />
              <el-table-column prop="businessLicense"  width="150" label="营业执照编号" show-overflow-tooltip align="center" />
              <el-table-column prop="healthLicense"  width="150" label="食品经营许可证编号" show-overflow-tooltip align="center" />
              <el-table-column prop="email" width="150" label="商家邮箱" align="center" />
              <el-table-column prop="businessCategory"  width="200" label="经营范围" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.businessCategory">{{
                    scope.row.businessCategory.map(t=>t.name).toString()
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="营业状态" width="120" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.status==1" style="color:#67C23A">活跃（营业中）</span>
                  <span v-else-if="scope.row.status==2" style="color:#F56C6C">停用（已休息）</span>
                  <span v-else-if="scope.row.status==0" style="color:#E6A23C">审核中</span>
                  <span v-else> - </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="createdAt"
                width="145"
                label="创建时间"
                align="center"
              />
              <!--   编辑与删除   -->
              <el-table-column label="操作" align="left" width="100">
                <template slot-scope="scope">
                  <el-link
                    v-authority="['business:edit']"
                    type="info"
                    :underline="false"
                    @click="crud.toEdit(scope.row)"
                    >编辑</el-link
                  >
                  <el-link
                    v-authority="['business:delete']"
                    type="danger"
                    style="font-size: 12px"
                    :underline="false"
                    :disabled="scope.row.id === user.id"
                    @click="remove(scope.row)"
                    >删除</el-link
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
  import crudUser from "@/api/shop/goods";
  import CRUD, { presenter } from "@crud/crud";
  import OPTOperation from "@crud/OPT.operation";
  import pagination from "@crud/Pagination";
  import { mapGetters } from "vuex";
  export default {
    components: {
      OPTOperation,
      pagination,
    },
    cruds() {
      return CRUD({
        title: "用户",
        url: "/business/getBusinessList",
        crudMethod: { ...crudUser },
      });
    },
    mixins: [presenter()],
    data() {
      return {};
    },
    computed: {
      ...mapGetters(["user"]),
    },
    mounted() {},
    methods: {
      toDelete(datas) {
        this.$msg.confirm(`确认删除选中的${datas.length}条数据?`, {
          ok: () => {
            this.crud.delAllLoading = true;
            this.crud.doDelete(row);
          },
        });
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
    