<template>
  <div class="app-container">
    <div class="head-container">
      <div class="content-box box-shadow">
        <!-- 搜索表单 -->
        <div class="filter-container">
          <el-form label-width="80px" inline>
            <el-form-item label="请求路径">
              <el-input
                v-model="crud.query.requestPath"
                clearable
                size="mini"
                placeholder="请输入请求路径"
                class="filter-item"
                @keyup.enter.native="crud.toQuery"
              />
            </el-form-item>
            <el-form-item label="异常类型">
              <el-input
                v-model="crud.query.exceptionType"
                clearable
                size="mini"
                placeholder="请输入异常类型"
                class="filter-item"
                @keyup.enter.native="crud.toQuery"
              />
            </el-form-item>
            <el-form-item label="操作人">
              <el-input
                v-model="crud.query.operator"
                clearable
                size="mini"
                placeholder="请输入操作人"
                class="filter-item"
                @keyup.enter.native="crud.toQuery"
              />
            </el-form-item>
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="dateRange"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                size="mini"
                value-format="yyyy-MM-dd HH:mm:ss"
                class="filter-item"
                @change="handleDateChange"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                class="filter-item"
                size="mini"
                type="primary"
                icon="el-icon-search"
                @click="crud.toQuery"
              >搜索</el-button>
              <el-button
                class="filter-item"
                size="mini"
                type="default"
                icon="el-icon-refresh"
                @click="resetQuery"
              >重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 操作按钮 -->
        <div class="operate-container">
          <el-button
            v-if="crud.optShow.add"
            v-authority="['errorLog:export']"
            class="filter-item"
            size="mini"
            round
            type="warning"
            icon="el-icon-download"
            :loading="exportLoading"
            @click="handleExport"
          >导出</el-button>
          <el-button
            v-if="crud.optShow.del"
            v-authority="['errorLog:delete']"
            class="filter-item"
            size="mini"
            round
            type="danger"
            icon="el-icon-delete"
            :loading="crud.delAllLoading"
            :disabled="crud.selections.length === 0"
            @click="toDelete(crud.selections)"
          >删除</el-button>
          <el-button
            v-authority="['errorLog:clear']"
            class="filter-item"
            size="mini"
            round
            type="danger"
            plain
            icon="el-icon-delete"
            :loading="clearLoading"
            @click="handleClear"
          >清空日志</el-button>
        </div>

        <!-- 数据表格 -->
        <el-table
          ref="table"
          v-loading="crud.loading"
          :data="crud.data"
          stripe
          @selection-change="crud.selectionChangeHandler"
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
            width="60"
          />
          <el-table-column
            prop="id"
            label="日志ID"
            width="100"
            align="center"
          />
          <el-table-column
            prop="operator"
            label="操作人"
            width="120"
            align="center"
          />
          <el-table-column
            prop="requestPath"
            label="请求路径"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="requestMethod"
            label="请求方式"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag
                :type="getMethodTagType(scope.row.requestMethod)"
                size="small"
              >
                {{ scope.row.requestMethod }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="exceptionType"
            label="异常类型"
            width="150"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span class="exception-type">{{ scope.row.exceptionType }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="exceptionMsg"
            label="异常信息"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="operationTime"
            label="操作时间"
            width="170"
            align="center"
          />
          <el-table-column
            label="操作"
            width="120"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-link
                v-authority="['errorLog:detail']"
                type="primary"
                :underline="false"
                @click="handleDetail(scope.row)"
              >详情</el-link>
              <el-link
                v-authority="['errorLog:delete']"
                type="danger"
                :underline="false"
                @click="remove(scope.row)"
              >删除</el-link>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <pagination />
      </div>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog
      :visible.sync="detailVisible"
      title="异常日志详情"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="日志ID">
          {{ detailData.id }}
        </el-descriptions-item>
        <el-descriptions-item label="操作人">
          {{ detailData.operator }}
        </el-descriptions-item>
        <el-descriptions-item label="请求路径" :span="2">
          {{ detailData.requestPath }}
        </el-descriptions-item>
        <el-descriptions-item label="请求方式">
          <el-tag
            :type="getMethodTagType(detailData.requestMethod)"
            size="small"
          >
            {{ detailData.requestMethod }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="IP地址">
          {{ detailData.ip || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="操作时间" :span="2">
          {{ detailData.operationTime }}
        </el-descriptions-item>
        <el-descriptions-item label="异常类型" :span="2">
          <span class="exception-type">{{ detailData.exceptionType }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="异常信息" :span="2">
          <div class="exception-message">{{ detailData.exceptionMsg }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="请求参数" :span="2">
          <div class="code-block">{{ detailData.requestParams || '-' }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="堆栈信息" :span="2">
          <div class="code-block stack-trace">{{ detailData.stackTrace || '-' }}</div>
        </el-descriptions-item>
      </el-descriptions>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="detailVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CRUD, { presenter } from "@crud/crud";
import pagination from "@crud/Pagination";
import {
  getErrorLogList,
  getErrorLogDetail,
  delErrorLog,
  clearErrorLog,
  exportErrorLog
} from "@/api/monitor/errorLog";
import { excelDownload } from "@/utils";

export default {
  name: "ErrorLog",
  components: {
    pagination
  },
  cruds() {
    return CRUD({
      title: "异常日志",
      url: "/log/error/list",
      crudMethod: {
        ...{ getErrorLogList },
        del: delErrorLog
      },
      queryParams: {}
    });
  },
  mixins: [presenter()],
  data() {
    return {
      dateRange: [],
      detailVisible: false,
      detailData: {},
      exportLoading: false,
      clearLoading: false
    };
  },
  created() {
    this.crud.optShow.add = false;
    this.crud.optShow.edit = false;
  },
  methods: {
    // 获取请求方式标签类型
    getMethodTagType(method) {
      const typeMap = {
        GET: "success",
        POST: "primary",
        PUT: "warning",
        DELETE: "danger",
        PATCH: "info"
      };
      return typeMap[method] || "info";
    },
    // 日期范围变化
    handleDateChange(val) {
      if (val) {
        this.crud.query.startTime = val[0];
        this.crud.query.endTime = val[1];
      } else {
        this.crud.query.startTime = undefined;
        this.crud.query.endTime = undefined;
      }
    },
    // 重置查询
    resetQuery() {
      this.dateRange = [];
      this.crud.query.requestPath = undefined;
      this.crud.query.exceptionType = undefined;
      this.crud.query.operator = undefined;
      this.crud.query.startTime = undefined;
      this.crud.query.endTime = undefined;
      this.crud.toQuery();
    },
    // 查看详情
    handleDetail(row) {
      this.detailData = row;
      this.detailVisible = true;
    },
    // 删除单条
    remove(obj) {
      this.$msg.confirm(`确认删除该异常日志吗？`, {
        ok: () => {
          this.crud.delAllLoading = true;
          this.crud.doDelete(obj);
        }
      });
    },
    // 批量删除
    toDelete(datas) {
      this.$msg.confirm(`确认删除选中的${datas.length}条日志吗？`, {
        ok: () => {
          this.crud.delAllLoading = true;
          this.crud.doDelete(datas);
        }
      });
    },
    // 导出
    async handleExport() {
      this.exportLoading = true;
      try {
        const params = { ...this.crud.query };
        const res = await exportErrorLog(params);
        excelDownload(res, "异常日志_" + this.parseTime(new Date()));
        this.$message.success("导出成功");
      } catch (e) {
        this.$message.error("导出失败");
      } finally {
        this.exportLoading = false;
      }
    },
    // 清空日志
    handleClear() {
      this.$msg.confirm(`确认清空所有异常日志吗？此操作不可恢复！`, {
        ok: () => {
          this.clearLoading = true;
          clearErrorLog()
            .then(res => {
              if (res.success) {
                this.$message.success("清空成功");
                this.crud.toQuery();
              } else {
                this.$message.error(res.message || "清空失败");
              }
            })
            .catch(() => {
              this.$message.error("清空失败");
            })
            .finally(() => {
              this.clearLoading = false;
            });
        }
      });
    },
    // 格式化时间
    parseTime(time) {
      const date = new Date(time);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hour = String(date.getHours()).padStart(2, "0");
      const minute = String(date.getMinutes()).padStart(2, "0");
      const second = String(date.getSeconds()).padStart(2, "0");
      return `${year}${month}${day}${hour}${minute}${second}`;
    }
  }
};
</script>

<style scoped>
.filter-container {
  padding: 16px 16px 0;
}

.operate-container {
  padding: 0 16px 16px;
}

.exception-type {
  color: #f56c6c;
  font-weight: 500;
}

.exception-message {
  max-height: 150px;
  overflow-y: auto;
  word-break: break-all;
  background: #f5f7fa;
  padding: 8px;
  border-radius: 4px;
  color: #606266;
}

.code-block {
  background: #f5f7fa;
  padding: 8px;
  border-radius: 4px;
  font-family: Consolas, Monaco, monospace;
  font-size: 12px;
  color: #606266;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
}

.stack-trace {
  color: #909399;
}

.box-shadow {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
