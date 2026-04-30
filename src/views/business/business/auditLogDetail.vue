<template>
  <div class="app-container">
    <!-- 固定的头部返回行 -->
    <div class="fixed-header">
      <div class="header-left">
        <el-button type="text" @click="goBack" class="back-btn">
          <i class="el-icon-arrow-left"></i> 返回
        </el-button>
        <span class="page-title">{{ pageTitle }}</span>
      </div>
    </div>

    <!-- 可滚动的内容区域 -->
    <div class="scrollable-content">
      <!-- 基本信息 -->
      <div class="detail-header">
        <div class="info-grid-wrapper">
          <div class="info-grid">
            <div class="info-item">
              <span class="label">审核ID</span>
              <span class="value">{{ getVal(auditData, 'id') || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">申请人</span>
              <span class="value">{{ getVal(auditData, 'applicant.cname') || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">状态</span>
              <span class="value" :class="statusClass">{{ statusText }}</span>
            </div>
            <div class="info-item" v-if="getVal(auditData, 'status') !== 0">
              <span class="label">审核人</span>
              <span class="value">{{ getVal(auditData, 'operator.cname') || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">提交时间</span>
              <span class="value">{{ formatDate(getVal(auditData, 'createdAt')) || '-' }}</span>
            </div>
            <div class="info-item" v-if="getVal(auditData, 'status') !== 0 && getVal(auditData, 'auditAt')">
              <span class="label">审核时间</span>
              <span class="value">{{ formatDate(getVal(auditData, 'auditAt')) }}</span>
            </div>
            <div class="info-item" v-if="getVal(auditData, 'reason')">
              <span class="label">审核意见</span>
              <span class="value">{{ getVal(auditData, 'reason') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 驳回问题 -->
      <div class="section" v-if="auditData.status === 2 && auditData.rejectReason">
        <div class="section-title">驳回问题</div>
        <div class="problem-list">
          <div v-for="(problems, fieldKey) in auditData.rejectReason" :key="fieldKey" class="problem-item">
            <span class="problem-title">{{ getFieldName(fieldKey) }}</span>
            <div v-for="(problem, index) in problems" :key="index" class="problem-desc">
              {{ index + 1 }}. {{ problem.reason }}
            </div>
          </div>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="content-area">
        <!-- 商家基本信息 -->
        <div class="section" v-if="isBusiness">
          <div class="section-title">商家基本信息</div>
          <div class="compare-box">
            <div class="compare-col">
              <div class="col-title">修改前</div>
              <div class="info-list">
                <div class="info-row"><span class="label">商家名称</span><span class="value">{{ getVal(auditData, 'beforeData.business.businessName') || '-' }}</span></div>
                <div class="info-row"><span class="label">详细地址</span><span class="value">{{ getVal(auditData, 'beforeData.business.detailAddress') || '-' }}</span></div>
                <div class="info-row"><span class="label">联系人</span><span class="value">{{ getVal(auditData, 'beforeData.business.contactPerson') || '-' }}</span></div>
                <div class="info-row"><span class="label">联系电话</span><span class="value">{{ getVal(auditData, 'beforeData.business.contactPhone') || '-' }}</span></div>
              </div>
            </div>
            <div class="compare-col">
              <div class="col-title">修改后</div>
              <div class="info-list">
                <div class="info-row highlight"><span class="label">商家名称</span><span class="value">{{ getVal(auditData, 'afterData.business.businessName') || '-' }}</span></div>
                <div class="info-row highlight"><span class="label">详细地址</span><span class="value">{{ getVal(auditData, 'afterData.business.detailAddress') || '-' }}</span></div>
                <div class="info-row highlight"><span class="label">联系人</span><span class="value">{{ getVal(auditData, 'afterData.business.contactPerson') || '-' }}</span></div>
                <div class="info-row highlight"><span class="label">联系电话</span><span class="value">{{ getVal(auditData, 'afterData.business.contactPhone') || '-' }}</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 门店基本信息 -->
        <div class="section" v-if="isStore">
          <div class="section-title">门店基本信息</div>
          <div class="compare-box">
            <div class="compare-col">
              <div class="col-title">修改前</div>
              <div class="info-list">
                <div class="info-row"><span class="label">门店名称</span><span class="value">{{ getVal(auditData, 'beforeData.store.storeName') || '-' }}</span></div>
                <div class="info-row"><span class="label">详细地址</span><span class="value">{{ getVal(auditData, 'beforeData.store.detailAddress') || '-' }}</span></div>
                <div class="info-row"><span class="label">联系电话</span><span class="value">{{ getVal(auditData, 'beforeData.store.contactPhone') || '-' }}</span></div>
                <div class="info-row"><span class="label">经度</span><span class="value">{{ getVal(auditData, 'beforeData.store.longitude') || '-' }}</span></div>
                <div class="info-row"><span class="label">纬度</span><span class="value">{{ getVal(auditData, 'beforeData.store.latitude') || '-' }}</span></div>
              </div>
            </div>
            <div class="compare-col">
              <div class="col-title">修改后</div>
              <div class="info-list">
                <div class="info-row highlight"><span class="label">门店名称</span><span class="value">{{ getVal(auditData, 'afterData.store.storeName') || '-' }}</span></div>
                <div class="info-row highlight"><span class="label">详细地址</span><span class="value">{{ getVal(auditData, 'afterData.store.detailAddress') || '-' }}</span></div>
                <div class="info-row highlight"><span class="label">联系电话</span><span class="value">{{ getVal(auditData, 'afterData.store.contactPhone') || '-' }}</span></div>
                <div class="info-row highlight"><span class="label">经度</span><span class="value">{{ getVal(auditData, 'afterData.store.longitude') || '-' }}</span></div>
                <div class="info-row highlight"><span class="label">纬度</span><span class="value">{{ getVal(auditData, 'afterData.store.latitude') || '-' }}</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 门店头像 -->
        <div class="section" v-if="isStore && (getVal(auditData, 'beforeData.store.avatarImg') || getVal(auditData, 'afterData.store.avatarUrl'))">
          <div class="section-title">门店头像</div>
          <div class="compare-box">
            <div class="compare-col">
              <div class="col-title">修改前</div>
              <div class="avatar-box" @click="previewImage(getVal(auditData, 'beforeData.store.avatarImg'))">
                <img v-if="getVal(auditData, 'beforeData.store.avatarImg')" :src="getVal(auditData, 'beforeData.store.avatarImg')" alt="头像">
                <span v-else class="no-img">暂无</span>
              </div>
            </div>
            <div class="compare-col">
              <div class="col-title">修改后</div>
              <div class="avatar-box" @click="previewImage(getVal(auditData, 'afterData.store.avatarUrl'))">
                <img v-if="getVal(auditData, 'afterData.store.avatarUrl')" :src="getVal(auditData, 'afterData.store.avatarUrl')" alt="头像">
                <span v-else class="no-img">暂无</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 资质信息 -->
        <div class="section" v-if="isBusiness || isStore">
          <div class="section-title">资质信息</div>
          <div class="compare-box">
            <div class="compare-col">
              <div class="col-title">修改前</div>
              <div class="cert-list">
                <div class="cert-item">
                  <span class="cert-label">营业执照</span>
                  <div class="cert-img" @click="previewImage(getVal(auditData, 'beforeData.licenseInfo.license_pic') || getVal(auditData, 'beforeData.store.licensePic'))">
                    <img v-if="getVal(auditData, 'beforeData.licenseInfo.license_pic') || getVal(auditData, 'beforeData.store.licensePic')" :src="getVal(auditData, 'beforeData.licenseInfo.license_pic') || getVal(auditData, 'beforeData.store.licensePic')" alt="营业执照">
                    <span v-else class="no-img">暂无</span>
                  </div>
                  <div class="cert-info">注册号：{{ getVal(auditData, 'beforeData.licenseInfo.license_no') || getVal(auditData, 'beforeData.store.licenseNo') || '-' }}</div>
                </div>
                <div class="cert-item" v-if="isStore">
                  <span class="cert-label">食品经营许可证</span>
                  <div class="cert-img" @click="previewImage(getVal(auditData, 'beforeData.permitInfo.permit_pic') || getVal(auditData, 'beforeData.store.permitPic'))">
                    <img v-if="getVal(auditData, 'beforeData.permitInfo.permit_pic') || getVal(auditData, 'beforeData.store.permitPic')" :src="getVal(auditData, 'beforeData.permitInfo.permit_pic') || getVal(auditData, 'beforeData.store.permitPic')" alt="许可证">
                    <span v-else class="no-img">暂无</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="compare-col">
              <div class="col-title">修改后</div>
              <div class="cert-list">
                <div class="cert-item">
                  <span class="cert-label">营业执照</span>
                  <div class="cert-img" @click="previewImage(getVal(auditData, 'afterData.licenseInfo.license_pic') || getVal(auditData, 'afterData.store.licensePic'))">
                    <img v-if="getVal(auditData, 'afterData.licenseInfo.license_pic') || getVal(auditData, 'afterData.store.licensePic')" :src="getVal(auditData, 'afterData.licenseInfo.license_pic') || getVal(auditData, 'afterData.store.licensePic')" alt="营业执照">
                    <span v-else class="no-img">暂无</span>
                  </div>
                  <div class="cert-info">注册号：{{ getVal(auditData, 'afterData.licenseInfo.license_no') || getVal(auditData, 'afterData.store.licenseNo') || '-' }}</div>
                </div>
                <div class="cert-item" v-if="isStore">
                  <span class="cert-label">食品经营许可证</span>
                  <div class="cert-img" @click="previewImage(getVal(auditData, 'afterData.permitInfo.permit_pic') || getVal(auditData, 'afterData.store.permitPic'))">
                    <img v-if="getVal(auditData, 'afterData.permitInfo.permit_pic') || getVal(auditData, 'afterData.store.permitPic')" :src="getVal(auditData, 'afterData.permitInfo.permit_pic') || getVal(auditData, 'afterData.store.permitPic')" alt="许可证">
                    <span v-else class="no-img">暂无</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 门店照片 -->
        <div class="section" v-if="isStore">
          <div class="section-title">门店照片</div>
          <div class="compare-box">
            <div class="compare-col">
              <div class="col-title">修改前</div>
              <div class="photo-list">
                <div class="photo-item">
                  <span class="photo-label">门脸照</span>
                  <div class="photo-img" @click="previewImage(getVal(auditData, 'beforeData.store.doorPhoto'))">
                    <img v-if="getVal(auditData, 'beforeData.store.doorPhoto')" :src="getVal(auditData, 'beforeData.store.doorPhoto')" alt="门脸照">
                    <span v-else class="no-img">暂无</span>
                  </div>
                </div>
                <div class="photo-item">
                  <span class="photo-label">内景照</span>
                  <div class="photo-img" @click="previewImage(getVal(auditData, 'beforeData.store.envPhoto'))">
                    <img v-if="getVal(auditData, 'beforeData.store.envPhoto')" :src="getVal(auditData, 'beforeData.store.envPhoto')" alt="内景照">
                    <span v-else class="no-img">暂无</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="compare-col">
              <div class="col-title">修改后</div>
              <div class="photo-list">
                <div class="photo-item">
                  <span class="photo-label">门脸照</span>
                  <div class="photo-img" @click="previewImage(getVal(auditData, 'afterData.store.doorPhoto'))">
                    <img v-if="getVal(auditData, 'afterData.store.doorPhoto')" :src="getVal(auditData, 'afterData.store.doorPhoto')" alt="门脸照">
                    <span v-else class="no-img">暂无</span>
                  </div>
                </div>
                <div class="photo-item">
                  <span class="photo-label">内景照</span>
                  <div class="photo-img" @click="previewImage(getVal(auditData, 'afterData.store.envPhoto'))">
                    <img v-if="getVal(auditData, 'afterData.store.envPhoto')" :src="getVal(auditData, 'afterData.store.envPhoto')" alt="内景照">
                    <span v-else class="no-img">暂无</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 审核日志 -->
        <div class="section">
          <div class="section-title">审核日志</div>
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <span class="time">{{ formatDate(getVal(auditData, 'createdAt')) }}</span>
                <span class="desc">{{ getVal(auditData, 'applicant.cname') || '系统' }} 提交审核申请</span>
              </div>
            </div>
            <div class="timeline-item" v-if="getVal(auditData, 'auditAt') && getVal(auditData, 'auditAt') !== '-'">
              <div class="timeline-dot" :class="getVal(auditData, 'status') === 1 ? 'success' : 'danger'"></div>
              <div class="timeline-content">
                <span class="time">{{ formatDate(getVal(auditData, 'auditAt')) }}</span>
                <span class="desc" :class="getVal(auditData, 'status') === 1 ? 'success' : 'danger'">
                  {{ getVal(auditData, 'operator.cname') || '系统' }} {{ getVal(auditData, 'status') === 1 ? '审核通过' : '审核驳回' }}
                  <span v-if="getVal(auditData, 'reason')">：{{ getVal(auditData, 'reason') }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 驳回原因面板 -->
      <div class="section" v-if="getVal(auditData, 'status') === 0">
        <div class="section-title">驳回原因（至少选择一项）</div>
        <div class="reject-content">
          <div class="reject-section" v-for="(risks, fieldKey) in rejectRiskLibrary" :key="fieldKey">
            <div class="section-label">{{ getFieldName(fieldKey) }}</div>
            <div class="risk-list">
              <div v-for="(risk, index) in risks" :key="index" class="risk-item" :class="{ active: checkedRisks[fieldKey] && checkedRisks[fieldKey].includes(index) }">
                <el-checkbox v-model="checkedRisks[fieldKey]" :label="index" @change="handleRiskCheck">
                  {{ risk.riskName }}
                </el-checkbox>
                <el-input
                  v-if="checkedRisks[fieldKey] && checkedRisks[fieldKey].includes(index)"
                  v-model="customReason[fieldKey + '_' + index]"
                  placeholder="补充说明"
                  size="small"
                  class="reason-input"
                ></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="action-bar" v-if="getVal(auditData, 'status') === 0">
          <el-button @click="handleReject" :disabled="!hasCheckedAnyRisk()">驳回</el-button>
          <el-button type="primary" @click="handlePass">通过</el-button>
        </div>
      </div>

      <!-- 图片预览 -->
      <el-dialog title="图片预览" :visible.sync="previewVisible" width="600px" append-to-body>
        <div class="preview-box">
          <img :src="previewUrl" alt="预览图片" class="preview-img" />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getAuditLogDetail, auditPass, auditReject } from '@/api/business/auditLog';

export default {
  name: 'AuditLogDetail',
  data() {
    return {
      auditData: {},
      rejectRiskLibrary: {
        address: [
          { riskName: '地址策略标-证地不一致', reason: '门店文本地址（详细地址）须与证照地址一致' },
          { riskName: '地址格式错误', reason: '地址需包含省市区+详细地址，格式不符合要求' }
        ],
        mainlicensepic: [
          { riskName: '主体资质-禁止无效门店无商户主体变更营业执照', reason: '该门店缺少商户主体' },
          { riskName: '主体资质-非证件照片', reason: '上传有误，请上传正确的营业执照图片' }
        ],
        doorpic: [{ riskName: '门头图-不为门面照', reason: '不得上传与店铺门面无关的照片' }],
        indoorpic: [{ riskName: '大堂-不为大堂图', reason: '请勿上传与店铺大堂无关的图片' }],
        industrylicensepic: [{ riskName: '行业资质-非证件照片', reason: '上传有误，请上传正确的行业资质图片' }]
      },
      checkedRisks: {
        address: [],
        mainlicensepic: [],
        doorpic: [],
        indoorpic: [],
        industrylicensepic: []
      },
      customReason: {},
      previewVisible: false,
      previewUrl: '',
      statusText: '',
      statusDesc: '',
      pageTitle: '',
      isStore: false,
      isBusiness: false
    };
  },
  computed: {
    statusClass() {
      const status = this.getVal(this.auditData, 'status');
      switch (status) {
        case 1:
          return 'success';
        case 2:
          return 'danger';
        default:
          return 'pending';
      }
    }
  },
  mounted() {
    const auditId = this.$route.query.id;
    if (auditId) {
      this.loadAuditDetail(auditId);
    } else {
      this.$message.error('缺少审核记录ID');
      this.goBack();
    }
  },
  methods: {
    getVal(obj, path) {
      if (!obj || !path) return '';
      const keys = path.split('.');
      let result = obj;
      for (const key of keys) {
        if (result === null || result === undefined) return '';
        result = result[key];
      }
      return result === null || result === undefined ? '' : result;
    },

    async loadAuditDetail(auditId) {
      try {
        const res = await getAuditLogDetail(auditId);
        this.auditData = res.result || {};
        this.setStatusInfo(this.getVal(this.auditData, 'status'));
        this.setTargetType(this.getVal(this.auditData, 'targetType'));
      } catch (error) {
        this.$message.error('加载审核详情失败：' + (error.message || ''));
        this.goBack();
      }
    },

    setTargetType(targetType) {
      switch (targetType) {
        case 1:
          this.pageTitle = '商家审核';
          this.isBusiness = true;
          this.isStore = false;
          break;
        case 2:
        case 3:
          this.pageTitle = '门店审核';
          this.isStore = true;
          this.isBusiness = false;
          break;
        default:
          this.pageTitle = '审核详情';
          this.isStore = false;
          this.isBusiness = false;
      }
    },

    setStatusInfo(status) {
      const statusMap = {
        0: { text: '待审核', desc: '等待审核人员处理' },
        1: { text: '审核通过', desc: '审核已完成，信息已更新' },
        2: { text: '审核驳回', desc: '审核已完成，需修改后重新提交' }
      };
      const info = statusMap[status] || { text: '未知状态', desc: '' };
      this.statusText = info.text;
      this.statusDesc = info.desc;
    },

    formatDate(date) {
      if (!date || date === '-') return '-';
      const d = new Date(date.replace(/\/+/g, '-'));
      if (isNaN(d.getTime())) return date;
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    },

    previewImage(url) {
      if (!url) return;
      this.previewUrl = url;
      this.previewVisible = true;
    },

    goBack() {
      this.$router.go(-1);
    },

    async handlePass() {
      try {
        await this.$confirm('确定要审核通过吗？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        await auditPass({ auditId: this.getVal(this.auditData, 'id') });
        this.$message.success('审核通过成功');
        this.loadAuditDetail(this.getVal(this.auditData, 'id'));
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('审核通过失败：' + (error.message || ''));
        }
      }
    },

    getFieldName(fieldKey) {
      const fieldMap = {
        address: '详细地址',
        mainlicensepic: '营业执照',
        doorpic: '门脸照',
        indoorpic: '内景照',
        industrylicensepic: '食品经营许可证'
      };
      return fieldMap[fieldKey] || fieldKey;
    },

    handleRiskCheck() {
      this.$forceUpdate();
    },

    hasCheckedAnyRisk() {
      return Object.keys(this.checkedRisks).some(fieldKey => {
        return Array.isArray(this.checkedRisks[fieldKey]) && this.checkedRisks[fieldKey].length > 0;
      });
    },

    buildRejectReason() {
      const rejectReason = {};
      Object.keys(this.checkedRisks).forEach(fieldKey => {
        const riskIndexes = this.checkedRisks[fieldKey];
        if (Array.isArray(riskIndexes) && riskIndexes.length > 0) {
          rejectReason[fieldKey] = [];
          riskIndexes.forEach(index => {
            const risk = this.rejectRiskLibrary[fieldKey][index];
            if (!risk) return;
            rejectReason[fieldKey].push({
              name: null,
              riskName: risk.riskName,
              riskReason: risk.reason,
              reason: this.customReason[fieldKey + '_' + index] || risk.reason,
              advise: null,
              referArticleUrl: null,
              remark: null
            });
          });
        }
      });
      return rejectReason;
    },

    async handleReject() {
      if (!this.hasCheckedAnyRisk()) {
        this.$message.warning('请至少选择一项驳回原因');
        return;
      }
      try {
        await this.$confirm('确定要驳回此审核吗？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        const res = await auditReject({
          auditId: this.getVal(this.auditData, 'id'),
          rejectReason: this.buildRejectReason()
        });
        if (res.success) {
          this.$message.success('审核驳回成功');
          this.loadAuditDetail(this.getVal(this.auditData, 'id'));
          Object.keys(this.checkedRisks).forEach(fieldKey => {
            this.checkedRisks[fieldKey] = [];
          });
          this.customReason = {};
        } else {
          this.$message.error(res.message || '驳回失败');
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('驳回失败：' + error.message);
        }
      }
    },

    getTotalRejectProblems() {
      const rejectReason = this.auditData.rejectReason || {};
      let total = 0;
      Object.keys(rejectReason).forEach(fieldKey => {
        total += Array.isArray(rejectReason[fieldKey]) ? rejectReason[fieldKey].length : 0;
      });
      return total;
    }
  }
};
</script>

<style scoped>
.app-container {
  padding: 0;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 84px);
}

/* 固定的顶部返回行 */
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 12px 14px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  color: #409eff;
  font-size: 14px;
}

.page-title {
  font-size: 14px;
  color: #303133;
  font-weight: 600;
}

/* 可滚动的内容区域 */
.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  margin-top: 49px; /* 顶部固定区域的高度 */
}

.content-area {
  overflow: visible;
}

.section {
  background: #fff;
  border-radius: 4px;
  padding: 14px;
  margin-bottom: 14px;
}

.detail-header ~ .section,
.scrollable-content > .section:first-child {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 10px;
  background: #fafafa;
  border-radius: 4px;
}

.info-item .label {
  color: #909399;
}

.info-item .value {
  color: #303133;
}

.info-item .value.success {
  color: #67c23a;
}

.info-item .value.danger {
  color: #f56c6c;
}

.info-item .value.pending {
  color: #e6a23c;
}

.problem-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.problem-item {
  padding: 10px;
  background: #fef0f0;
  border-radius: 4px;
  border-left: 3px solid #f56c6c;
}

.problem-title {
  display: block;
  color: #f56c6c;
  font-weight: 600;
  margin-bottom: 6px;
}

.problem-desc {
  color: #606266;
  font-size: 13px;
  line-height: 1.6;
}

.compare-box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.compare-col {
  background: #fafafa;
  border-radius: 4px;
  padding: 12px;
}

.col-title {
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
  font-size: 14px;
}

.info-list .info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #ebeef5;
}

.info-list .info-row:last-child {
  border-bottom: none;
}

.info-list .info-row .label {
  color: #909399;
}

.info-list .info-row .value {
  color: #303133;
}

.info-list .info-row.highlight .value {
  color: #409eff;
}

.avatar-box {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto;
  border: 2px solid #ebeef5;
  cursor: pointer;
}

.avatar-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cert-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cert-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cert-label {
  font-weight: 600;
  color: #303133;
}

.cert-img {
  width: 100%;
  height: 120px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #ebeef5;
  cursor: pointer;
}

.cert-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cert-info {
  color: #909399;
  font-size: 13px;
}

.photo-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.photo-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.photo-label {
  font-weight: 600;
  color: #303133;
}

.photo-img {
  width: 100%;
  height: 140px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #ebeef5;
  cursor: pointer;
}

.photo-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-img {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  color: #909399;
}

.timeline {
  padding-left: 16px;
  border-left: 2px solid #dcdfe6;
}

.timeline-item {
  position: relative;
  padding-left: 16px;
  padding-bottom: 16px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -6px;
  top: 4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #409eff;
  border: 2px solid #fff;
}

.timeline-dot.success {
  background: #67c23a;
}

.timeline-dot.danger {
  background: #f56c6c;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timeline-content .time {
  color: #909399;
  font-size: 13px;
}

.timeline-content .desc {
  color: #303133;
}

.timeline-content .desc.success {
  color: #67c23a;
}

.timeline-content .desc.danger {
  color: #f56c6c;
}

.action-bar {
  margin-top: 20px;
  padding-top: 14px;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.reject-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 14px;
}

.panel-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}

.reject-section {
  background: #fafafa;
  border-radius: 4px;
  padding: 12px;
}

.section-label {
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
}

.risk-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.risk-item {
  padding: 8px;
  background: #fff;
  border-radius: 4px;
}

.risk-item.active {
  border: 1px solid #409eff;
}

.reason-input {
  margin-top: 8px;
  width: 100%;
}

.preview-box {
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-img {
  max-width: 100%;
  max-height: 500px;
}
</style>
