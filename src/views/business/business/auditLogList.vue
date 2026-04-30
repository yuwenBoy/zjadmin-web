<template>
  <div class="app-container">
    <div class="head-container">
      <div class="content-box box-shadow">
        <!-- 搜索区域 -->
        <div class="search-section" :class="{ 'is-expanded': isExpanded }">
          <el-form :model="crud.query" class="search-form">
            <div class="search-row">
              <el-form-item label="目标类型" class="search-item inline-item">
                <el-select v-model="crud.query.targetType" placeholder="请选择目标类型" class="search-select">
                  <el-option
                    v-for="item in [
                      { label: '商家入驻审核', value: 1 },
                      { label: '门店信息修改', value: 2 },
                      { label: '门店头像修改', value: 3 },
                      { label: '商品审核', value: 4 },
                      { label: '骑手审核', value: 5 },
                    ]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="申请人" class="search-item inline-item">
                <el-select
                  v-model="crud.query.applicantId"
                  placeholder="请选择申请人"
                  class="search-select"
                >
                  <el-option
                    v-for="item in [
                      { label: '商家信息', value: 1 },
                      { label: '门店修改', value: 2 },
                      { label: '骑士信息', value: 3 },
                    ]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="审核人" class="search-item inline-item">
                <el-select
                  v-model="crud.query.operatorId"
                  placeholder="请选择审核人"
                  class="search-select"
                >
                  <el-option
                    v-for="item in [
                      { label: '商家信息', value: 1 },
                      { label: '门店修改', value: 2 },
                      { label: '骑士信息', value: 3 },
                    ]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <div class="search-actions">
                <OPTOperation />
                <el-button class="filter-item expand-btn" size="mini" @click="toggleExpand">
                  {{ isExpanded ? '收起' : '展开' }}
                  <i :class="isExpanded ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </el-button>
              </div>
            </div>
            <div class="search-row search-row-second">
              <el-form-item label="提交时间" class="search-item inline-item">
                <el-date-picker
                  v-model="dateRange.createdAt"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  class="search-date"
                  @change="handleDateChange('createdAt')"
                />
              </el-form-item>
              <el-form-item label="审核时间" class="search-item inline-item">
                <el-date-picker
                  v-model="dateRange.auditAt"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  class="search-date"
                  @change="handleDateChange('auditAt')"
                />
              </el-form-item>
            </div>
          </el-form>
        </div>

        <!-- 操作区域 -->
        <div class="action-section">
          <div class="action-left">
            <el-tabs
              v-model="activeStatus"
              @tab-click="handleTabChange"
              class="status-tabs"
            >
              <el-tab-pane
                :label="item.label"
                :name="item.value"
                v-for="(item, index) in statusList"
                :key="index"
              />
            </el-tabs>
          </div>
          <div class="action-right">
            <el-button
              type="primary"
              icon="el-icon-check"
              :disabled="crud.selections.length === 0"
              class="batch-btn success"
            >
              批量通过
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-close"
              :disabled="crud.selections.length === 0"
              class="batch-btn danger"
            >
              批量驳回
            </el-button>
          </div>
        </div>
        <el-table
          v-if="refreshTable"
          ref="table"
          :data="crud.data"
          row-key="id"
          @selection-change="crud.selectionChangeHandler"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
            :reserve-selection="true"
          />
          <el-table-column prop="id" label="审核ID" align="center" width="80" />
          <el-table-column label="目标类型" prop="targetType" align="center">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.targetType === 1"
                >商家</el-tag
              >
              <el-tag v-if="scope.row.targetType === 2">门店修改</el-tag>
              <el-tag type="danger" v-if="scope.row.targetType === 3"
                >修改门店头像</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="目标对象" prop="targetId" align="center" width="120" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-if="scope.row.targetType === 1">商家</span>
              <span v-if="scope.row.targetType === 2">
                {{ scope.row.store.id }} - {{ scope.row.store.storeName }}
              </span>
              <span v-if="scope.row.targetType === 3">修改门店头像</span>
            </template>
          </el-table-column>
          <el-table-column
            label="申请人"
            prop="applicant.cname"
            align="center"
          />
          <el-table-column
            prop="createdAt"
            label="提交时间"
            width="180"
            align="center"
          />
          <el-table-column
            label="审核状态"
            prop="status"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              <span style="color: #ff9800" v-if="scope.row.status == 0"
                >待审核</span
              >
              <span style="color: #4caf50" v-if="scope.row.status == 1"
                >审核通过</span
              >
              <span style="color: #f44336" v-if="scope.row.status == 2"
                >已驳回</span
              >
            </template>
          </el-table-column>
          <!-- 修正：审核人字段 -->
          <el-table-column
            label="审核人"
            prop="operator.cname"
            align="center"
            width="100"
          />
          <!-- 修正：审核时间字段 + 格式化 -->
          <el-table-column
            prop="auditAt"
            label="审核时间"
            width="180"
            align="center"
          />
          <!-- 修正：驳回原因字段 -->
          <el-table-column
            label="驳回原因"
            prop="reason"
            align="center"
            show-overflow-tooltip
            width="180"
          >
            <template slot-scope="scope">
              {{scope.row.status==1 ? scope.row.reason : parseRejectReason(scope.row.reason)}}
            </template>
          </el-table-column>
          <!-- 编辑与删除 -->
          <el-table-column label="操作" width="100px" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="
                  $router.push({
                    name: 'auditLogDetail',
                    query: { id: scope.row.id },
                  })
                "
                >详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页组件 -->
        <div class="pagination-container">
          <el-pagination
            :current-page="crud.page.page"
            :page-size="crud.page.size"
            :total="crud.page.total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CRUD, { presenter, form } from "@crud/crud";
import OPTOperation from "@crud/OPT.operation";
const defaultForm = {
  id: null,
  name: "",
  is_parent: 0,
  sort: 99,
  parent_id: 0,
  pic: "",
  created_at: undefined,
  updated_at: undefined,
};
export default {
  components: { OPTOperation },
  cruds() {
    return CRUD({
      title: "",
      url: "/auditLog/list",
      sort: "sort",
    });
  },
  mixins: [presenter(), form(defaultForm)],
  data() {
    return {
      // 重新渲染表格状态
      refreshTable: true,
      // 新增：当前选中的状态Tab
      activeStatus: "-1",
      // 日期范围
      dateRange: {
        createdAt: [],
        auditAt: [],
      },
      // 搜索展开/收起状态
      isExpanded: false,
      rules: {
        name: [{ required: true, message: "请输入品类名称", trigger: "blur" }],
        sort: [{ required: true, message: "请选择排序", trigger: "blur" }],
      },
      statusList: [
        { label: "全部数据", value: "-1" },
        { label: "待审核", value: "0" },
        { label: "已通过", value: "1" },
        { label: "已驳回", value: "2" },
      ],
    };
  },
  mounted() {
    // 初始化加载全部数据
    this.loadAuditList();
  },
  methods: {
    // 新增：加载审核列表（带状态筛选）
    loadAuditList() {
      this.refreshTable = false;
      // 组装筛选参数：商家名称 + 状态
      const params = {
        // 全部状态不传status，其他状态传对应值
        status: this.activeStatus === "-1" ? "" : this.activeStatus,
      };
      // 调用CRUD的查询方法，传入筛选参数
      this.crud.query = { ...this.crud.query, ...params };
      this.crud.toQuery();
      // 重新渲染表格
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },

    // 新增：Tab切换事件
    handleTabChange() {
      this.loadAuditList();
    },

    // 展开/收起搜索
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    },

    /**
     * 通用解析不固定key的驳回原因
     * @param {string} reasonJson - JSON字符串
     * @param {boolean} isGroup - 是否分组展示（默认false：合并展示）
     * @returns {string|Object} 展示文本 / 分组对象
     */
    parseRejectReason(reasonJson, isGroup = false) {
      if (!reasonJson) return isGroup ? {} : "无驳回原因";

      try {
        const reasonObj = JSON.parse(reasonJson);
        const groupResult = {};
        const allReasons = [];

        // 遍历所有未知key
        Object.keys(reasonObj).forEach((fieldKey) => {
          const reasonList = reasonObj[fieldKey];
          if (Array.isArray(reasonList) && reasonList.length > 0) {
            const fieldReasons = reasonList
              .map((item) => item.reason || item.riskReason || item.riskName)
              .filter(Boolean); // 过滤空值

            if (fieldReasons.length > 0) {
              groupResult[fieldKey] = fieldReasons;
              allReasons.push(...fieldReasons);
            }
          }
        });

        // 分组/合并返回
        if (isGroup) {
          return groupResult;
        } else {
          return allReasons.length > 0 ? allReasons.join("；") : "无驳回原因";
        }
      } catch (e) {
        console.error("解析驳回原因失败：", e);
        return isGroup ? { error: "解析失败" } : "驳回原因解析失败";
      }
    },

    // 日期范围变化
    handleDateChange(field) {
      const range = this.dateRange[field];
      if (range && range.length === 2) {
        this.crud.query[`${field}Start`] = this.formatDate(range[0]);
        this.crud.query[`${field}End`] = this.formatDate(range[1]);
      } else {
        delete this.crud.query[`${field}Start`];
        delete this.crud.query[`${field}End`];
      }
      this.loadAuditList();
    },

    // 格式化日期
    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
    },

    // 重置搜索条件
    resetSearch() {
      this.crud.query = {};
      this.dateRange = {
        createdAt: [],
        auditAt: [],
      };
      this.activeStatus = "-1";
      this.loadAuditList();
    },

    // 分页大小改变
    handleSizeChange(val) {
      this.crud.page.size = val;
      this.crud.page.page = 1;
      this.loadAuditList();
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.crud.page.page = val;
      this.loadAuditList();
    },
  },
  // 监听搜索框变化，支持回车搜索
  watch: {
    "crud.query.title": {
      handler() {
        this.loadAuditList();
      },
      immediate: false,
    },
  },
};
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: #f0f2f5;
  padding: 20px;
}

.head-container {
  max-width: 100%;
}

.content-box {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

/* 搜索区域 */
.search-section {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.search-row-second {
  display: none;
}

.search-section.is-expanded .search-row-second {
  display: flex;
}

.inline-item {
  display: flex;
  align-items: center;
  margin-bottom: 0 !important;
}
.search-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-left: auto;
}

.expand-btn {
  color: #ff6034;
  border: none;
  background: transparent;
  font-size: 13px;
}

.expand-btn:hover {
  color: #ff7034;
  background: #fff7e6;
}

.expand-btn i {
  margin-left: 2px;
  transition: transform 0.2s;
}

/* 操作区域 */
.action-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.action-left {
  flex: 1;
}

.action-right {
  display: flex;
  gap: 12px;
}

.status-tabs >>> .el-tabs__header {
  margin: 0;
}

.status-tabs >>> .el-tabs__nav-wrap::after {
  display: none;
}

.status-tabs >>> .el-tabs__item {
  font-size: 14px;
  color: #8c8c8c;
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
}

.status-tabs >>> .el-tabs__item:hover {
  color: #ff6034;
}

.status-tabs >>> .el-tabs__item.is-active {
  color: #ff6034;
  font-weight: 600;
}

.status-tabs >>> .el-tabs__active-bar {
  background-color: #ff6034;
  height: 3px;
  border-radius: 2px;
}

.batch-btn {
  padding: 10px 20px;
  font-size: 13px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.batch-btn.success {
  background: #52c41a;
  color: #fff;
}

.batch-btn.success:hover:not(:disabled) {
  background: #73d13d;
}

.batch-btn.danger {
  background: #ff4d4f;
  color: #fff;
}

.batch-btn.danger:hover:not(:disabled) {
  background: #ff7875;
}

.batch-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* 表格样式优化 */
.el-table {
  --el-table-header-text-color: #595959;
  --el-table-row-hover-bg-color: #fffbf8;
  font-size: 13px;
}

.el-table >>> .el-table__header-wrapper {
  background: #fafafa;
}

.el-table >>> .el-table__header-wrapper th {
  font-weight: 600;
  font-size: 13px;
  color: #404040;
  padding: 14px 0;
  background: #fafafa !important;
}

.el-table >>> .el-table__body-wrapper {
  font-size: 13px;
}

.el-table >>> .el-table__row {
  height: 54px;
  transition: background 0.2s;
}

.el-table >>> .el-table__row:hover > td {
  background: #fffbf8 !important;
}

.el-table >>> .el-table__row td {
  padding: 12px 0;
}

/* 表格标签样式优化 */
.el-table >>> .el-tag {
  border-radius: 4px;
  padding: 0 8px;
  height: 24px;
  line-height: 22px;
  font-size: 12px;
}

.el-table >>> .el-tag--success {
  background: #f6ffed;
  border-color: #b7eb8f;
  color: #52c41a;
}

.el-table >>> .el-tag--danger {
  background: #fff2f0;
  border-color: #ffccc7;
  color: #ff4d4f;
}

/* 详情按钮样式 */
.el-table >>> .el-button--text {
  color: #ff6034;
  font-size: 13px;
  padding: 4px 8px;
  border-radius: 4px;
}

.el-table >>> .el-button--text:hover {
  background: #fff7e6;
  color: #ff7034;
}

/* 分页容器样式 */
.pagination-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.pagination-container >>> .el-pagination {
  font-size: 13px;
}

.pagination-container >>> .el-pagination__total {
  color: #8c8c8c;
  margin-right: 16px;
}

.pagination-container >>> .el-pagination__sizes {
  margin: 0 12px;
}

.pagination-container >>> .el-pagination__sizes .el-input__inner {
  border-radius: 6px;
  border-color: #d9d9d9;
}

.pagination-container >>> .el-pager li {
  border-radius: 6px;
  margin: 0 2px;
  min-width: 32px;
  height: 32px;
  line-height: 32px;
}

.pagination-container >>> .el-pager li.active {
  background-color: #ff6034;
  color: #fff;
}

.pagination-container >>> .el-pager li:hover:not(.active) {
  color: #ff6034;
}

.pagination-container >>> .el-pagination__jump {
  margin-left: 12px;
}

.pagination-container >>> .el-pagination__editor {
  border-radius: 6px;
}

/* 复选框样式 */
.el-table >>> .el-checkbox__inner {
  border-radius: 4px;
}

.el-table >>> .el-checkbox__inner:hover {
  border-color: #ff6034;
}

.el-table >>> .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #ff6034;
  border-color: #ff6034;
}

/* 状态文字颜色 */
.status-pending {
  color: #faad14;
  font-weight: 500;
}

.status-approved {
  color: #52c41a;
  font-weight: 500;
}

.status-rejected {
  color: #ff4d4f;
  font-weight: 500;
}
</style>