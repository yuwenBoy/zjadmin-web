    
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
                        v-model="crud.query.requestPath"
                        clearable
                        size="mini"
                        autofocus
                        placeholder="请求URL"
                        class="filter-item round-left"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-select
                        v-model="crud.query.requestMethod"
                        clearable
                        placeholder="请求方式"
                        class="wt100"
                      >
                        <el-option label="GET" value="GET" />
                        <el-option label="POST" value="POST" />
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
                    @click="$router.push({ name: 'edit', query: {} })"
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
              <el-table-column prop="id" width="120" label="ID" align="center" />
              <el-table-column prop="operator"  width="100" label="操作人" align="center" />
              <el-table-column prop="requestPath" label="请求URL" align="center" />
              <el-table-column prop="requestMethod"  width="100" label="请求方式" align="center" />
              <el-table-column
                prop="operationTime"
                label="操作时间"
                width="170"
                align="center"
              >
              </el-table-column>
              <el-table-column prop="duration" label="耗时（毫秒）" width="120" align="center">
              </el-table-column>
              <el-table-column
                prop="statusCode"
                label="请求成功"
                width="120"
                align="center"
              >
            </el-table-column>
              <!--   编辑与删除   -->
              <el-table-column label="操作" align="left" width="100">
                <template slot-scope="scope">
                  <el-link
                    v-authority="['user:edit']"
                    type="info"
                    :underline="false"
                    @click="crud.toEdit(scope.row)"
                    >详情</el-link
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
        title: "操作日志",
        url: "/log/getByCondition",
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
    