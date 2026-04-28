<template>
  <div class="app-container">
    <div class="head-container">
      <div class="content-box box-shadow">
        <div class="text item">
          <el-form inline :model="crud.query">
            <el-form-item label="审核类型">
              <el-select
                v-model="crud.query.auditType"
                clearable
                placeholder="请选择审核类型"
                class="wt100"
              >
                <el-option label="全部" value="" />
                <el-option label="商家入驻" :value="1" />
                <el-option label="门店修改" :value="2" />
                <el-option label="员工审核" :value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="审核状态">
              <el-select
                v-model="crud.query.status"
                clearable
                placeholder="请选择审核状态"
                class="wt100"
              >
                <el-option label="全部" value="" />
                <el-option label="待审核" :value="0" />
                <el-option label="已通过" :value="1" />
                <el-option label="已驳回" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="关键词">
              <el-input
                v-model="crud.query.keyword"
                clearable
                size="mini"
                placeholder="商家名称/门店名称"
                class="filter-item"
              />
            </el-form-item>
            <OPTOperation />
          </el-form>
        </div>
        <el-table
          ref="table"
          :data="crud.data"
          stripe
          @selection-change="crud.selectionChangeHandler"
        >
          <el-table-column
            type="selection"
            align="center"
            width="55"
          />
          <el-table-column prop="id" label="ID" align="center" width="80" />
          <el-table-column
            label="审核类型"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              <el-tag :type="getAuditTypeTag(scope.row.auditType)">
                {{ getAuditTypeName(scope.row.auditType) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="审核对象"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.targetName }}
            </template>
          </el-table-column>
          <el-table-column
            label="申请人"
            align="center"
            width="120"
          >
            <template slot-scope="scope">
              {{ scope.row.applicantName || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            label="提交时间"
            prop="createdAt"
            align="center"
            width="160"
          />
          <el-table-column
            label="审核状态"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              <el-tag :type="getStatusTag(scope.row.status)">
                {{ getStatusName(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="审核时间"
            prop="updatedAt"
            align="center"
            width="160"
          />
          <el-table-column label="操作" align="left" width="200">
            <template slot-scope="scope">
              <el-link
                type="primary"
                :underline="false"
                @click="viewDetail(scope.row)"
                >查看详情</el-link
              >
              <el-link
                v-if="scope.row.status === 0"
                type="success"
                :underline="false"
                @click="auditPass(scope.row)"
                >通过</el-link
              >
              <el-link
                v-if="scope.row.status === 0"
                type="danger"
                :underline="false"
                @click="auditReject(scope.row)"
                >驳回</el-link
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination />
      </div>
    </div>

    <!-- 审核详情弹窗 -->
    <el-dialog
      :title="detailTitle"
      :visible.sync="detailVisible"
      width="800px"
      append-to-body
    >
      <el-form v-if="currentAudit" :model="currentAudit" label-width="120px">
        <div class="detail-section">
          <h4>基本信息</h4>
          <el-form-item label="审核类型">
            <el-tag>{{ getAuditTypeName(currentAudit.auditType) }}</el-tag>
          </el-form-item>
          <el-form-item label="审核对象">
            {{ currentAudit.targetName }}
          </el-form-item>
          <el-form-item label="申请人">
            {{ currentAudit.applicantName || '-' }}
          </el-form-item>
          <el-form-item label="提交时间">
            {{ currentAudit.createdAt }}
          </el-form-item>
        </div>
        <div class="detail-section" v-if="currentAudit.auditType === 1">
          <h4>商家信息</h4>
          <el-form-item label="商家名称">
            {{ getValue(currentAudit.data, 'title') }}
          </el-form-item>
          <el-form-item label="联系人">
            {{ getValue(currentAudit.data, 'contactName') }}
          </el-form-item>
          <el-form-item label="联系电话">
            {{ getValue(currentAudit.data, 'contactPhone') }}
          </el-form-item>
          <el-form-item label="营业执照">
            {{ getValue(currentAudit.data, 'businessLicense') }}
          </el-form-item>
          <el-form-item label="食品经营许可证">
            {{ getValue(currentAudit.data, 'healthLicense') }}
          </el-form-item>
        </div>
        <div class="detail-section" v-if="currentAudit.auditType === 2">
          <h4>门店信息</h4>
          <el-form-item label="门店名称">
            {{ getValue(currentAudit.data, 'storeName') }}
          </el-form-item>
          <el-form-item label="经营品类">
            {{ getValue(currentAudit.data, 'name') }}
          </el-form-item>
          <el-form-item label="门店地址">
            {{ getValue(currentAudit.data, 'address') }}
          </el-form-item>
        </div>
        <div class="detail-section" v-if="currentAudit.auditType === 3">
          <h4>员工信息</h4>
          <el-form-item label="员工姓名">
            {{ getValue(currentAudit.data, 'name') }}
          </el-form-item>
          <el-form-item label="联系电话">
            {{ getValue(currentAudit.data, 'phone') }}
          </el-form-item>
          <el-form-item label="所属门店">
            {{ getValue(currentAudit.data, 'storeName') }}
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button
          v-if="currentAudit && currentAudit.status === 0"
          type="success"
          @click="handlePass"
          >审核通过</el-button
        >
        <el-button
          v-if="currentAudit && currentAudit.status === 0"
          type="danger"
          @click="showRejectDialog = true"
          >驳回</el-button
        >
      </div>
    </el-dialog>

    <!-- 驳回弹窗 -->
    <el-dialog
      title="驳回审核"
      :visible.sync="showRejectDialog"
      width="400px"
      append-to-body
    >
      <el-form :model="rejectForm" label-width="80px">
        <el-form-item label="驳回原因" prop="reason">
          <el-textarea
            v-model="rejectForm.reason"
            rows="3"
            placeholder="请输入驳回原因"
          ></el-textarea>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showRejectDialog = false">取消</el-button>
        <el-button type="danger" @click="handleReject">确认驳回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import CRUD, { presenter } from "@crud/crud";
import OPTOperation from "@crud/OPT.operation";
import pagination from "@crud/Pagination";
import { auditPass, auditReject, getAuditLogDetail } from "@/api/business/auditLog";
import request from "@/utils/request";

export default {
  components: {
    OPTOperation,
    pagination,
  },
  cruds() {
    return CRUD({
      title: "审核管理",
      url: "/auditLog/list",
      crudMethod: {
        getList: function(params) {
          return request({
            url: "/auditLog/list",
            method: "get",
            params: params,
          });
        },
      },
    });
  },
  mixins: [presenter()],
  data() {
    return {
      detailVisible: false,
      showRejectDialog: false,
      currentAudit: null,
      rejectForm: {
        reason: "",
      },
    };
  },
  computed: {
    detailTitle() {
      if (!this.currentAudit) return "审核详情";
      return this.getAuditTypeName(this.currentAudit.auditType) + " - 审核详情";
    },
  },
  methods: {
    getValue(obj, key) {
      if (!obj) return "-";
      return obj[key] || "-";
    },
    getAuditTypeName(type) {
      var map = {
        1: "商家入驻",
        2: "门店修改",
        3: "员工审核",
      };
      return map[type] || "未知类型";
    },
    getAuditTypeTag(type) {
      var map = {
        1: "primary",
        2: "success",
        3: "warning",
      };
      return map[type] || "info";
    },
    getStatusName(status) {
      var map = {
        0: "待审核",
        1: "已通过",
        2: "已驳回",
      };
      return map[status] || "未知";
    },
    getStatusTag(status) {
      var map = {
        0: "warning",
        1: "success",
        2: "danger",
      };
      return map[status] || "info";
    },
    viewDetail(row) {
      var that = this;
      getAuditLogDetail(row.id).then(function(res) {
        if (res.success) {
          that.currentAudit = res.result;
          that.detailVisible = true;
        }
      });
    },
    auditPass(row) {
      var that = this;
      this.$msg.confirm("确认通过该审核吗？", {
        ok: function() {
          auditPass({ ids: [row.id] }).then(function(res) {
            if (res.success) {
              that.$msg.alert("审核通过");
              that.crud.toQuery();
            }
          });
        },
      });
    },
    auditReject(row) {
      this.currentAudit = row;
      this.rejectForm.reason = "";
      this.showRejectDialog = true;
    },
    handlePass() {
      var that = this;
      auditPass({ ids: [this.currentAudit.id] }).then(function(res) {
        if (res.success) {
          that.$msg.alert("审核通过");
          that.detailVisible = false;
          that.crud.toQuery();
        }
      });
    },
    handleReject() {
      var that = this;
      if (!this.rejectForm.reason.trim()) {
        this.$msg.alert("请输入驳回原因");
        return;
      }
      auditReject({
        id: this.currentAudit.id,
        reason: this.rejectForm.reason,
      }).then(function(res) {
        if (res.success) {
          that.$msg.alert("驳回成功");
          that.showRejectDialog = false;
          that.detailVisible = false;
          that.crud.toQuery();
        }
      });
    },
  },
};
</script>
<style scoped>
.detail-section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;

  h4 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #303133;
  }
}
</style>