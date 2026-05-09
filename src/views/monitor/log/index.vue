
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
                    type="info"
                    :underline="false"
                    @click="showDetail(scope.row)"
                  >详情</el-link>
                </template>
              </el-table-column>
            </el-table>
            <!--分页组件-->
            <pagination />
          </div>
        </div>
      </el-row>

      <!-- 操作日志详情弹窗 -->
      <el-dialog
        :visible.sync="detailVisible"
        title="操作日志详情"
        width="700px"
        append-to-body
        :close-on-click-modal="false"
      >
        <el-form :model="currentLog" label-width="100px" class="detail-form">
          <el-form-item label="ID">
            <span>{{ currentLog.id || '-' }}</span>
          </el-form-item>
          <el-form-item label="操作人">
            <span>{{ currentLog.operator || '-' }}</span>
          </el-form-item>
          <el-form-item label="请求URL">
            <span>{{ currentLog.requestPath || '-' }}</span>
          </el-form-item>
          <el-form-item label="请求方式">
            <el-tag
              :type="getMethodTagType(currentLog.requestMethod)"
              size="small"
            >
              {{ currentLog.requestMethod || '-' }}
            </el-tag>
          </el-form-item>
          <el-form-item label="操作时间">
            <span>{{ currentLog.operationTime || currentLog.createTime || '-' }}</span>
          </el-form-item>
          <el-form-item label="耗时（毫秒）">
            <span>{{ currentLog.duration || '-' }}</span>
          </el-form-item>
          <el-form-item label="状态码">
            <span :class="currentLog.statusCode === 200 ? 'success-text' : 'error-text'">
              {{ currentLog.statusCode || '-' }}
            </span>
          </el-form-item>
          <el-form-item label="请求参数">
            <pre class="detail-pre">{{ formatJson(currentLog.requestParams) }}</pre>
          </el-form-item>
          <el-form-item label="响应结果">
            <pre class="detail-pre">{{ formatJson(currentLog.responseResult) }}</pre>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="detailVisible = false">关闭</el-button>
        </div>
      </el-dialog>
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
      return {
        // 详情弹窗
        detailVisible: false,
        currentLog: {},
      };
    },
    computed: {
      ...mapGetters(["user"]),
    },
    mounted() {},
    methods: {
      // 显示详情
      showDetail(row) {
        this.currentLog = row;
        this.detailVisible = true;
      },
      // 获取请求方式标签类型
      getMethodTagType(method) {
        const types = {
          GET: 'success',
          POST: 'primary',
          PUT: 'warning',
          DELETE: 'danger',
        };
        return types[method] || 'info';
      },
      // 格式化JSON显示
      formatJson(data) {
        if (!data) {
          return '-';
        }
        try {
          const obj = typeof data === 'string' ? JSON.parse(data) : data;
          return JSON.stringify(obj, null, 2);
        } catch (e) {
          return data.toString();
        }
      },
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

  .detail-form {
    max-height: 500px;
    overflow-y: auto;
  }

  .detail-pre {
    background: #f5f7fa;
    padding: 12px;
    border-radius: 4px;
    font-size: 12px;
    color: #606266;
    max-height: 200px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .success-text {
    color: #67c23a;
    font-weight: bold;
  }

  .error-text {
    color: #f56c6c;
    font-weight: bold;
  }
  </style>
