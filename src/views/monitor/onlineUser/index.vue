<template>
  <div class="app-container">
    <div class="head-container">
      <div class="content-box box-shadow">
        <!-- 搜索表单 -->
        <div class="filter-container">
          <el-form label-width="80px" inline>
            <el-form-item label="用户名">
              <el-input
                v-model="crud.query.username"
                clearable
                size="mini"
                placeholder="请输入用户名"
                class="filter-item"
                @keyup.enter.native="crud.toQuery"
              />
            </el-form-item>
            <el-form-item label="IP地址">
              <el-input
                v-model="crud.query.ip"
                clearable
                size="mini"
                placeholder="请输入IP地址"
                class="filter-item"
                @keyup.enter.native="crud.toQuery"
              />
            </el-form-item>
            <el-form-item label="登录状态">
              <el-select
                v-model="crud.query.status"
                clearable
                placeholder="请选择状态"
                size="mini"
                class="filter-item"
              >
                <el-option label="在线" value="online" />
                <el-option label="离线" value="offline" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                class="filter-item"
                size="mini"
                type="primary"
                icon="el-icon-search"
                @click="crud.toQuery"
                >搜索</el-button
              >
              <el-button
                class="filter-item"
                size="mini"
                type="default"
                icon="el-icon-refresh"
                @click="resetQuery"
                >重置</el-button
              >
              <el-button
                class="filter-item"
                size="mini"
                type="default"
                icon="el-icon-refresh"
                @click="refreshOnline"
                >刷新</el-button
              >
            </el-form-item>
          </el-form>
        </div>

        <!-- 操作按钮 -->
        <div class="operate-container">
          <el-button
            v-if="crud.optShow.del"
            v-authority="['onlineUser:kick']"
            class="filter-item"
            size="mini"
            round
            type="danger"
            icon="el-icon-close"
            :loading="kickLoading"
            :disabled="crud.selections.length === 0"
            @click="handleBatchKick"
            >强制下线</el-button
          >
        </div>

        <!-- 数据统计 -->
        <div class="stats-container">
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-icon online">
                  <i class="el-icon-user-solid"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ stats.onlineCount }}</div>
                  <div class="stat-label">在线人数</div>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-icon today">
                  <i class="el-icon-s-custom"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ stats.todayLoginCount }}</div>
                  <div class="stat-label">今日登录</div>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-icon total">
                  <i class="el-icon-s-data"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ stats.totalCount }}</div>
                  <div class="stat-label">总记录数</div>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-icon peak">
                  <i class="el-icon-s-marketing"></i>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ stats.peakCount }}</div>
                  <div class="stat-label">历史峰值</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 数据表格 -->
        <el-table
          ref="table"
          size="medium"
          v-loading="crud.loading"
          :max-height="tableMaxHeight"
          :data="crud.data"
          stripe
          @selection-change="crud.selectionChangeHandler"
        >
          <el-table-column type="selection" align="center" width="55" />
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="60"
          />
          <el-table-column prop="username" label="用户名" width="120">
            <template slot-scope="scope">
              <span class="username-cell">
                <i class="el-icon-user"></i>
                {{ scope.row.username }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="cname"
            label="昵称"
            width="120"
            align="center"
          />
          <el-table-column prop="ip" label="登录IP" width="140" align="center">
            <template slot-scope="scope">
              <span class="ip-cell">{{ scope.row.ip || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="location"
            label="登录地点"
            width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="browser"
            label="浏览器"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="os"
            label="操作系统"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="status"
            label="状态"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status === 'online' ? 'success' : 'info'"
                size="small"
              >
                {{ scope.row.status === "online" ? "在线"  : scope.row.status === "busy" ? "忙碌" :"离线" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="loginTime"
            label="登录时间"
            width="170"
            align="center"
          />
          <el-table-column
            label="最后访问时间"
            width="170"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.lastActiveTime || '——' }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="150"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status === 'online'"
                type="text"
                size="mini"
                @click="handleOperLog(scope.row)"
                >操作日志</el-button
              >
              <el-button
                v-if="scope.row.status === 'online'"
                v-authority="['onlineUser:kick']"
                type="text"
                size="mini"
                class="kick-btn"
                @click="handleKick(scope.row)"
                >强制下线</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <pagination />
      </div>
    </div>

    <!-- 操作日志弹窗 -->
    <el-dialog
      :visible.sync="operLogVisible"
      title="用户操作日志"
      width="900px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-table
        v-loading="operLogLoading"
        :data="operLogData"
        stripe
        max-height="350"
      >
        <el-table-column type="index" label="序号" align="center" width="60" />
        <el-table-column
          prop="operator"
          label="操作人"
          width="100"
          align="center"
        />
        <el-table-column
          prop="operationType"
          label="操作类型"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              :type="getMethodTagType(scope.row.operationType)"
              size="small"
            >
              {{ scope.row.operationType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="requestPath"
          label="请求路径"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="clientIp"
          label="IP地址"
          width="140"
          align="center"
        />
        <el-table-column
          prop="operationTime"
          label="操作时间"
          width="170"
          align="center"
        />
        <el-table-column
          label="操作"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="showOperLogDetail(scope.row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <div class="oper-log-pagination">
        <el-pagination
          :current-page="operLogPage.currentPage"
          :page-size="operLogPage.pageSize"
          :total="operLogPage.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleOperLogSizeChange"
          @current-change="handleOperLogCurrentChange"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="operLogVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 操作日志详情弹窗 -->
    <el-dialog
      :visible.sync="operLogDetailVisible"
      title="操作日志详情"
      width="700px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form :model="currentOperLog" label-width="100px" class="oper-log-detail-form">
        <el-form-item label="操作人">
          <span>{{ currentOperLog.operator || '-' }}</span>
        </el-form-item>
        <el-form-item label="操作类型">
          <el-tag
            :type="getMethodTagType(currentOperLog.operationType)"
            size="small"
          >
            {{ currentOperLog.operationType || '-' }}
          </el-tag>
        </el-form-item>
        <el-form-item label="请求路径">
          <span>{{ currentOperLog.requestPath || '-' }}</span>
        </el-form-item>
        <el-form-item label="IP地址">
          <span>{{ currentOperLog.clientIp || currentOperLog.ip || '-' }}</span>
        </el-form-item>
        <el-form-item label="操作时间">
          <span>{{ currentOperLog.operationTime || currentOperLog.createTime || '-' }}</span>
        </el-form-item>
        <el-form-item label="请求参数">
          <pre class="detail-pre">{{ formatJson(currentOperLog.requestParams) }}</pre>
        </el-form-item>
        <el-form-item label="响应结果">
          <pre class="detail-pre">{{ formatJson(currentOperLog.responseData) }}</pre>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="operLogDetailVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CRUD, { presenter } from "@crud/crud";
import pagination from "@crud/Pagination";
import {
  getOnlineUserList,
  getOnlineStats,
  kickUser,
  kickUsers,
  getUserOperLog,
} from "@/api/monitor/onlineUser";

import tableHeightMixin from '@/layout/mixin/tableHeightMixin';

export default {
  name: "OnlineUser",
  components: {
    pagination,
  },
  cruds() {
    return CRUD({
      title: "在线用户",
      url: "/log/online/list",
      crudMethod: {
        getOnlineUserList,
        del: kickUser,
      },
      queryParams: {},
    });
  },
  mixins: [presenter(), tableHeightMixin],
  data() {
    return {
      stats: {
        onlineCount: 0,
        todayLoginCount: 0,
        totalCount: 0,
        peakCount: 0,
      },
      kickLoading: false,
      operLogVisible: false,
      operLogLoading: false,
      operLogData: [],
      currentUser: {},
      // 操作日志分页
      operLogPage: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      // 操作日志详情
      operLogDetailVisible: false,
      currentOperLog: {},
    };
  },
  created() {
    this.crud.optShow.add = false;
    this.crud.optShow.edit = false;
    this.getStats();
  },
  methods: {
    // 获取统计数据
    async getStats() {
      try {
        const res = await getOnlineStats();
        if (res.success) {
          const result = res.result;
          this.stats.onlineCount = result.onlineCount || 0;
          this.stats.todayLoginCount = result.todayLoginCount || 0;
          this.stats.totalCount = result.totalCount || 0;
          this.stats.peakCount = result.historyPeak || 0;
        }
      } catch (error) {
        // 如果API调用失败，从表格数据中统计
        this.$nextTick(() => {
          const data = this.crud.data || [];
          this.stats.onlineCount = data.filter(
            (item) => item.status === "online"
          ).length;
          this.stats.totalCount = this.crud.page.total || data.length;
        });
      }
    },
    // 重置查询
    resetQuery() {
      this.crud.query.username = undefined;
      this.crud.query.ip = undefined;
      this.crud.query.status = undefined;
      this.crud.toQuery();
    },
    // 刷新在线用户列表
    refreshOnline() {
      this.crud.toQuery();
      this.$message.success("刷新成功");
    },
    // 获取请求方式标签类型
    getMethodTagType(method) {
      const typeMap = {
        GET: "success",
        POST: "primary",
        PUT: "warning",
        DELETE: "danger",
        PATCH: "info",
      };
      return typeMap[method] || "info";
    },
    // 强制单个用户下线
    handleKick(row) {
      this.$msg.confirm(`确认强制用户【${row.username}】下线吗？`, {
        ok: () => {
          this.kickLoading = true;
          kickUser({ userId: row.userId || row.id })
            .then((res) => {
              if (res.success) {
                this.$message.success("操作成功，用户已下线");
                this.crud.toQuery();
              } else {
                this.$message.error(res.message || "操作失败");
              }
            })
            .catch(() => {
              this.$message.error("操作失败");
            })
            .finally(() => {
              this.kickLoading = false;
            });
        },
      });
    },
    // 批量强制下线
    handleBatchKick() {
      const selections = this.crud.selections;
      if (selections.length === 0) {
        this.$message.warning("请选择要下线的用户");
        return;
      }
      const onlineUsers = selections.filter((item) => item.status === "online");
      if (onlineUsers.length === 0) {
        this.$message.warning("所选用户均已离线");
        return;
      }
      this.$msg.confirm(
        `确认强制下线选中的${onlineUsers.length}位在线用户吗？`,
        {
          ok: () => {
            this.kickLoading = true;
            const userIds = onlineUsers.map((item) => item.userId || item.id);
            kickUsers({ userIds })
              .then((res) => {
                if (res.success) {
                  this.$message.success(`成功下线${onlineUsers.length}位用户`);
                  this.crud.toQuery();
                } else {
                  this.$message.error(res.message || "操作失败");
                }
              })
              .catch(() => {
                this.$message.error("操作失败");
              })
              .finally(() => {
                this.kickLoading = false;
              });
          },
        }
      );
    },
    // 查看用户操作日志
    handleOperLog(row) {
      this.currentUser = row;
      this.operLogVisible = true;
      this.operLogPage.currentPage = 1;
      this.loadOperLog();
    },
    // 加载操作日志
    loadOperLog() {
      this.operLogLoading = true;
      this.operLogData = [];
      const params = {
        userId: this.currentUser.userId || this.currentUser.id,
        page: this.operLogPage.currentPage,
        size: this.operLogPage.pageSize,
      };
      getUserOperLog(params)
        .then((res) => {
          if (res.success) {
            // 兼容后端返回的数据结构（分页格式）
            const result = res.result;
            if (result.content) {
              this.operLogData = result.content;
              this.operLogPage.total = result.totalElements || result.total || 0;
            } else {
              this.operLogData = result || [];
              this.operLogPage.total = this.operLogData.length;
            }
          } else {
            this.$message.error(res.message || "获取操作日志失败");
          }
        })
        .catch(() => {
          this.$message.error("获取操作日志失败");
        })
        .finally(() => {
          this.operLogLoading = false;
        });
    },
    // 操作日志分页大小改变
    handleOperLogSizeChange(val) {
      this.operLogPage.pageSize = val;
      this.operLogPage.currentPage = 1;
      this.loadOperLog();
    },
    // 操作日志当前页改变
    handleOperLogCurrentChange(val) {
      this.operLogPage.currentPage = val;
      this.loadOperLog();
    },
    // 显示操作日志详情
    showOperLogDetail(row) {
      this.currentOperLog = row;
      this.operLogDetailVisible = true;
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
  },
};
</script>

<style scoped>
.filter-container {
  padding: 16px 16px 0;
}

.operate-container {
  padding: 0 16px 16px;
  border-bottom: 1px solid #ebeef5;
}

.stats-container {
  padding: 16px;
  background: #f5f7fa;
  margin-bottom: 16px;
  border-radius: 4px;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
  color: #fff;
}

.stat-icon.online {
  background: linear-gradient(135deg, #67c23a 0%, #95d475 100%);
}

.stat-icon.today {
  background: linear-gradient(135deg, #409eff 0%, #79bbff 100%);
}

.stat-icon.total {
  background: linear-gradient(135deg, #909399 0%, #b1b3b8 100%);
}

.stat-icon.peak {
  background: linear-gradient(135deg, #e6a23c 0%, #ebb563 100%);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.username-cell {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #409eff;
}

.ip-cell {
  font-family: Consolas, Monaco, monospace;
  font-size: 12px;
}

.kick-btn {
  color: #f56c6c;
}

.box-shadow {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.oper-log-pagination {
  padding: 12px 0;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: center;
}

.oper-log-detail-form {
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
</style>
