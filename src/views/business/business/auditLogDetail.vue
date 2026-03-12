<template>
  <div class="audit-detail-container">
    <div class="header-card">
      <div class="header-left">
        <span class="title">{{ pageTitle }}</span>
        <el-tag :type="statusTagType" size="medium" class="status-tag">
          {{ statusText }}
        </el-tag>
      </div>
      <div class="header-right">
        <div class="info-item">
          <span class="label">审核ID：</span>
          <span class="value">{{ getVal(auditData, 'id') || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">提交时间：</span>
          <span class="value">{{ formatDate(getVal(auditData, 'createdAt')) || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">申请人：</span>
          <span class="value">{{ getVal(auditData, 'applicant.cname') || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ targetTypeText }}：</span>
          <span class="value">{{ getVal(auditData, 'store.storeName') || '-' }}</span>
        </div>
        <div class="info-item" v-if="isStore">
          <span class="label">门店ID：</span>
          <span class="value">{{ getVal(auditData, 'store.id') || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">业务线：</span>
          <span class="value">淘宝闪购</span>
        </div>
      </div>
    </div>

    <!-- 驳回问题汇总（已驳回状态显示） -->
    <div class="reject-summary" v-if="auditData.status === 2 && auditData.rejectReason">
      <div class="summary-title">
        <i class="el-icon-warning"></i> 驳回问题汇总（共{{ getTotalRejectProblems() }}项）
      </div>
      <div class="summary-content">
        <div class="field-group" v-for="(problems, fieldKey) in auditData.rejectReason" :key="fieldKey">
          <div class="field-name">{{ getFieldName(fieldKey) }}：</div>
          <div class="problem-item" v-for="(problem, index) in problems" :key="index">
            {{ index + 1 }}. {{ problem.reason }}
          </div>
        </div>
      </div>
    </div>

    <div class="compare-container">
      <!-- 基础信息对比 -->
      <div class="compare-card">
        <div class="card-title">基础信息</div>
        <div class="compare-content">
          <div class="compare-col before-col">
            <div class="col-title">修改前</div>
            <div class="info-list">
              <div class="info-row">
                <span class="info-label">{{ targetTypeText }}名称：</span>
                <span class="info-value">{{ getVal(auditData, 'beforeData.store.storeName') || '-' }}</span>
              </div>
              <div class="info-row" :class="{ 'reject-item': hasFieldReject('address') }">
                <span class="info-label">详细地址：</span>
                <span class="info-value">{{ getVal(auditData, 'beforeData.store.detail_address') || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">联系电话：</span>
                <span class="info-value">{{ getVal(auditData, 'store.contactInfo') || '-' }}</span>
              </div>
              <div class="info-row" v-if="isStore">
                <span class="info-label">经度：</span>
                <span class="info-value">{{ getVal(auditData, 'beforeData.store.longitude') || '-' }}</span>
              </div>
              <div class="info-row" v-if="isStore">
                <span class="info-label">纬度：</span>
                <span class="info-value">{{ getVal(auditData, 'beforeData.store.latitude') || '-' }}</span>
              </div>
            </div>
          </div>
          <div class="compare-col after-col">
            <div class="col-title">修改后</div>
            <div class="info-list">
              <div class="info-row">
                <span class="info-label">{{ targetTypeText }}名称：</span>
                <span class="info-value changed">{{ getVal(auditData, 'afterData.store.storeName') || '-' }}</span>
              </div>
              <div class="info-row" :class="{ 'reject-item': hasFieldReject('address') }">
                <span class="info-label">详细地址：</span>
                <span class="info-value changed">{{ getVal(auditData, 'afterData.store.detail_address') || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">联系电话：</span>
                <span class="info-value">{{ getVal(auditData, 'store.contactInfo') || '-' }}</span>
              </div>
              <div class="info-row" v-if="isStore">
                <span class="info-label">经度：</span>
                <span class="info-value changed">{{ getVal(auditData, 'afterData.store.longitude') || '-' }}</span>
              </div>
              <div class="info-row" v-if="isStore">
                <span class="info-label">纬度：</span>
                <span class="info-value changed">{{ getVal(auditData, 'afterData.store.latitude') || '-' }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 地址驳回原因选择（仅待审核状态显示） -->
        <div class="reject-field-group" v-if="auditData.status === 0">
          <div class="field-title">详细地址驳回原因</div>
          <div class="risk-item" v-for="(risk, index) in rejectRiskLibrary.address" :key="index">
            <el-checkbox 
              v-model="checkedRisks.address" 
              :label="index"
              @change="handleRiskCheck"
            >
              {{ risk.riskName }}
            </el-checkbox>
            <el-input
              v-if="checkedRisks.address && checkedRisks.address.includes(index)"
              v-model="customReason['address_' + index]"
              placeholder="可补充自定义原因（选填）"
              size="small"
              class="custom-reason-input"
            />
          </div>
        </div>
      </div>

      <!-- 资质信息对比 -->
      <div class="compare-card">
        <div class="card-title">资质信息</div>
        <div class="compare-content">
          <div class="compare-col before-col">
            <div class="col-title">修改前</div>
            <div class="cert-list">
              <!-- 营业执照 -->
              <div class="cert-item" :class="{ 'reject-item': hasFieldReject('mainlicensepic') }">
                <span class="cert-label">营业执照：</span>
                <div class="cert-img" @click="previewImage(getVal(auditData, 'beforeData.licenseInfo.license_pic'))">
                  <img v-if="getVal(auditData, 'beforeData.licenseInfo.license_pic')" :src="getVal(auditData, 'beforeData.licenseInfo.license_pic')" alt="营业执照">
                  <div v-else class="no-img">暂无图片</div>
                </div>
                <div class="cert-info">
                  <span>注册号：{{ getVal(auditData, 'beforeData.licenseInfo.license_no') || '-' }}</span>
                  <span>公司名称：{{ getVal(auditData, 'beforeData.licenseInfo.company_name') || '-' }}</span>
                </div>
                <div class="cert-info">
                  <span>法人：{{ getVal(auditData, 'beforeData.licenseInfo.legal_person') || '-' }}</span>
                  <span>有效期：{{ getVal(auditData, 'beforeData.licenseInfo.license_valid_date') || (getVal(auditData, 'beforeData.licenseInfo.is_long_term') ? '长期' : '-') }}</span>
                </div>
              </div>
              <!-- 食品经营许可证（门店） -->
              <div class="cert-item" v-if="isStore" :class="{ 'reject-item': hasFieldReject('industrylicensepic') }">
                <span class="cert-label">食品经营许可证：</span>
                <div class="cert-img" @click="previewImage(getVal(auditData, 'beforeData.permitInfo.permit_pic'))">
                  <img v-if="getVal(auditData, 'beforeData.permitInfo.permit_pic')" :src="getVal(auditData, 'beforeData.permitInfo.permit_pic')" alt="食品经营许可证">
                  <div v-else class="no-img">暂无图片</div>
                </div>
                <div class="cert-info">
                  <span>许可证号：{{ getVal(auditData, 'beforeData.permitInfo.permit_no') || '-' }}</span>
                  <span>企业名称：{{ getVal(auditData, 'beforeData.permitInfo.permit_name') || '-' }}</span>
                </div>
                <div class="cert-info">
                  <span>法人：{{ getVal(auditData, 'beforeData.permitInfo.permit_legalPerson') || '-' }}</span>
                  <span>有效期：{{ getVal(auditData, 'beforeData.permitInfo.permit_expireDate') || '-' }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="compare-col after-col">
            <div class="col-title">修改后</div>
            <div class="cert-list">
              <!-- 营业执照 -->
              <div class="cert-item" :class="{ 'reject-item': hasFieldReject('mainlicensepic') }">
                <span class="cert-label">营业执照：</span>
                <div class="cert-img" @click="previewImage(getVal(auditData, 'afterData.licenseInfo.license_pic'))">
                  <img v-if="getVal(auditData, 'afterData.licenseInfo.license_pic')" :src="getVal(auditData, 'afterData.licenseInfo.license_pic')" alt="营业执照">
                  <div v-else class="no-img">暂无图片</div>
                </div>
                <div class="cert-info">
                  <span>注册号：{{ getVal(auditData, 'afterData.licenseInfo.license_no') || '-' }}</span>
                  <span>公司名称：{{ getVal(auditData, 'afterData.licenseInfo.company_name') || '-' }}</span>
                </div>
                <div class="cert-info">
                  <span>法人：{{ getVal(auditData, 'afterData.licenseInfo.legal_person') || '-' }}</span>
                  <span>有效期：{{ getVal(auditData, 'afterData.licenseInfo.license_valid_date') || (getVal(auditData, 'afterData.licenseInfo.is_long_term') ? '长期' : '-') }}</span>
                </div>
              </div>
              <!-- 食品经营许可证（门店） -->
              <div class="cert-item" v-if="isStore" :class="{ 'reject-item': hasFieldReject('industrylicensepic') }">
                <span class="cert-label">食品经营许可证：</span>
                <div class="cert-img" @click="previewImage(getVal(auditData, 'afterData.permitInfo.permit_pic'))">
                  <img v-if="getVal(auditData, 'afterData.permitInfo.permit_pic')" :src="getVal(auditData, 'afterData.permitInfo.permit_pic')" alt="食品经营许可证">
                  <div v-else class="no-img">暂无图片</div>
                </div>
                <div class="cert-info">
                  <span>许可证号：{{ getVal(auditData, 'afterData.permitInfo.permit_no') || '-' }}</span>
                  <span>企业名称：{{ getVal(auditData, 'afterData.permitInfo.permit_name') || '-' }}</span>
                </div>
                <div class="cert-info">
                  <span>法人：{{ getVal(auditData, 'afterData.permitInfo.permit_legalPerson') || '-' }}</span>
                  <span>有效期：{{ getVal(auditData, 'afterData.permitInfo.permit_expireDate') || '-' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 营业执照驳回原因选择（仅待审核状态显示） -->
        <div class="reject-field-group" v-if="auditData.status === 0">
          <div class="field-title">营业执照驳回原因</div>
          <div class="risk-item" v-for="(risk, index) in rejectRiskLibrary.mainlicensepic" :key="index">
            <el-checkbox 
              v-model="checkedRisks.mainlicensepic" 
              :label="index"
              @change="handleRiskCheck"
            >
              {{ risk.riskName }}
            </el-checkbox>
            <el-input
              v-if="checkedRisks.mainlicensepic && checkedRisks.mainlicensepic.includes(index)"
              v-model="customReason['mainlicensepic_' + index]"
              placeholder="可补充自定义原因（选填）"
              size="small"
              class="custom-reason-input"
            />
          </div>
        </div>

        <!-- 食品经营许可证驳回原因选择（仅待审核状态显示） -->
        <div class="reject-field-group" v-if="auditData.status === 0 && isStore">
          <div class="field-title">食品经营许可证驳回原因</div>
          <div class="risk-item" v-for="(risk, index) in rejectRiskLibrary.industrylicensepic" :key="index">
            <el-checkbox 
              v-model="checkedRisks.industrylicensepic" 
              :label="index"
              @change="handleRiskCheck"
            >
              {{ risk.riskName }}
            </el-checkbox>
            <el-input
              v-if="checkedRisks.industrylicensepic && checkedRisks.industrylicensepic.includes(index)"
              v-model="customReason['industrylicensepic_' + index]"
              placeholder="可补充自定义原因（选填）"
              size="small"
              class="custom-reason-input"
            />
          </div>
        </div>
      </div>

      <!-- 门店照片对比（门店） -->
      <div class="compare-card" v-if="isStore">
        <div class="card-title">门店照片</div>
        <div class="compare-content">
          <div class="compare-col before-col">
            <div class="col-title">修改前</div>
            <div class="photo-list">
              <div class="photo-item" @click="previewImage(getVal(auditData, 'beforeData.store.doorPhoto'))" :class="{ 'reject-item': hasFieldReject('doorpic') }">
                <span class="photo-label">门脸照：</span>
                <div class="photo-img">
                  <img v-if="getVal(auditData, 'beforeData.store.doorPhoto')" :src="getVal(auditData, 'beforeData.store.doorPhoto')" alt="门脸照">
                  <div v-else class="no-img">暂无图片</div>
                </div>
              </div>
              <div class="photo-item" @click="previewImage(getVal(auditData, 'beforeData.store.envPhoto'))" :class="{ 'reject-item': hasFieldReject('indoorpic') }">
                <span class="photo-label">内景照：</span>
                <div class="photo-img">
                  <img v-if="getVal(auditData, 'beforeData.store.envPhoto')" :src="getVal(auditData, 'beforeData.store.envPhoto')" alt="内景照">
                  <div v-else class="no-img">暂无图片</div>
                </div>
              </div>
            </div>
          </div>
          <div class="compare-col after-col">
            <div class="col-title">修改后</div>
            <div class="photo-list">
              <div class="photo-item" @click="previewImage(getVal(auditData, 'afterData.store.doorPhoto'))" :class="{ 'reject-item': hasFieldReject('doorpic') }">
                <span class="photo-label">门脸照：</span>
                <div class="photo-img">
                  <img v-if="getVal(auditData, 'afterData.store.doorPhoto')" :src="getVal(auditData, 'afterData.store.doorPhoto')" alt="门脸照">
                  <div v-else class="no-img">暂无图片</div>
                </div>
              </div>
              <div class="photo-item" @click="previewImage(getVal(auditData, 'afterData.store.envPhoto'))" :class="{ 'reject-item': hasFieldReject('indoorpic') }">
                <span class="photo-label">内景照：</span>
                <div class="photo-img">
                  <img v-if="getVal(auditData, 'afterData.store.envPhoto')" :src="getVal(auditData, 'afterData.store.envPhoto')" alt="内景照">
                  <div v-else class="no-img">暂无图片</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 门脸照驳回原因选择（仅待审核状态显示） -->
        <div class="reject-field-group" v-if="auditData.status === 0">
          <div class="field-title">门脸照驳回原因</div>
          <div class="risk-item" v-for="(risk, index) in rejectRiskLibrary.doorpic" :key="index">
            <el-checkbox 
              v-model="checkedRisks.doorpic" 
              :label="index"
              @change="handleRiskCheck"
            >
              {{ risk.riskName }}
            </el-checkbox>
            <el-input
              v-if="checkedRisks.doorpic && checkedRisks.doorpic.includes(index)"
              v-model="customReason['doorpic_' + index]"
              placeholder="可补充自定义原因（选填）"
              size="small"
              class="custom-reason-input"
            />
          </div>
        </div>

        <!-- 内景照驳回原因选择（仅待审核状态显示） -->
        <div class="reject-field-group" v-if="auditData.status === 0">
          <div class="field-title">内景照驳回原因</div>
          <div class="risk-item" v-for="(risk, index) in rejectRiskLibrary.indoorpic" :key="index">
            <el-checkbox 
              v-model="checkedRisks.indoorpic" 
              :label="index"
              @change="handleRiskCheck"
            >
              {{ risk.riskName }}
            </el-checkbox>
            <el-input
              v-if="checkedRisks.indoorpic && checkedRisks.indoorpic.includes(index)"
              v-model="customReason['indoorpic_' + index]"
              placeholder="可补充自定义原因（选填）"
              size="small"
              class="custom-reason-input"
            />
          </div>
        </div>
      </div>

      <div class="log-card">
        <div class="card-title">审核日志</div>
        <div class="log-list">
          <div class="log-item">
            <div class="log-time">{{ formatDate(getVal(auditData, 'createdAt')) }}</div>
            <div class="log-content">
              <span class="log-operator">{{ getVal(auditData, 'applicant.cname') || '系统' }}</span>
              <span class="log-action">提交审核</span>
            </div>
          </div>
          <div class="log-item" v-if="getVal(auditData, 'auditAt') && getVal(auditData, 'auditAt') !== '-'">
            <div class="log-time">{{ formatDate(getVal(auditData, 'auditAt')) }}</div>
            <div class="log-content">
              <span class="log-operator">{{ getVal(auditData, 'operator.cname') || '系统' }}</span>
              <span class="log-action">{{ getVal(auditData, 'status') === 1 ? '审核通过' : '审核驳回' }}</span>
              <span class="log-reason" v-if="getVal(auditData, 'reason')">：{{ getVal(auditData, 'reason') }}</span>
            </div>
          </div>
          <div class="log-item" v-if="getVal(auditData, 'auditAt') === '-'">
            <div class="empty-log">暂无审核操作日志</div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-actions" :class="{ disabled: getVal(auditData, 'status') !== 0 }">
      <div class="action-buttons">
        <el-button @click="goBack" type="default" size="medium">返回列表</el-button>
        <el-button
          v-if="getVal(auditData, 'status') === 0"
          @click="handleReject"
          type="danger"
          size="medium"
          class="reject-btn"
          :disabled="!hasCheckedAnyRisk()"
        >
          审核驳回
        </el-button>
        <el-button
          v-if="getVal(auditData, 'status') === 0"
          @click="handlePass"
          type="primary"
          size="medium"
          class="pass-btn"
        >
          审核通过
        </el-button>
        <div v-else class="audit-result">
          <span class="result-label">审核结果：{{ getVal(auditData, 'statusText') || statusText }}</span>
          <span class="result-operator" v-if="getVal(auditData, 'operator.cname')">
            审核人：{{ getVal(auditData, 'operator.cname') }}
          </span>
          <span class="result-time" v-if="getVal(auditData, 'auditAt') && getVal(auditData, 'auditAt') !== '-'">
            审核时间：{{ formatDate(getVal(auditData, 'auditAt')) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 图片预览弹窗 -->
    <el-dialog
      title="图片预览"
      width="800px"
      :visible.sync="previewVisible"
      append-to-body
      close-on-click-modal
      :modal-append-to-body="false"
    >
      <div class="preview-img-container">
        <img :src="previewUrl" alt="预览图片" class="preview-img" />
      </div>
    </el-dialog>
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
          {
            riskName: "地址策略标-证地不一致",
            reason: "门店文本地址（详细地址）须与证照地址一致。注意：省市区三段式信息也需勾选与证照一致。"
          },
          {
            riskName: "地址格式错误",
            reason: "地址需包含省市区+详细地址，格式不符合要求。"
          }
        ],
        mainlicensepic: [
          {
            riskName: "主体资质-禁止无效门店无商户主体变更营业执照",
            reason: "该门店缺少商户主体，请先补全门店商户主体后再进行资质变更"
          },
          {
            riskName: "主体资质-非证件照片",
            reason: "上传有误，请上传正确的营业执照图片"
          }
        ],
        doorpic: [
          {
            riskName: "门头图-不为门面照",
            reason: "不得上传与店铺门面无关的照片，如突出的人物照、动物照、菜品图、证照等"
          }
        ],
        indoorpic: [
          {
            riskName: "大堂-不为大堂图",
            reason: "请勿上传与店铺大堂无关的图片，如突出的人物照、动物照、菜品图、证照等"
          }
        ],
        industrylicensepic: [
          {
            riskName: "行业资质-非证件照片",
            reason: "上传有误，请上传正确的行业资质图片"
          }
        ]
      },
      checkedRisks: {
        address: [],
        mainlicensepic: [],
        doorpic: [],
        indoorpic: [],
        industrylicensepic: []
      }, // 初始化所有字段的选中状态
      customReason: {}, // 自定义原因 {address_0: '补充原因'}
      previewVisible: false,
      previewUrl: '',
      statusText: '',
      statusTagType: '',
      pageTitle: '',
      targetTypeText: '',
      isStore: false,
      isBusiness: false
    };
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
    // 安全取值
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

    // 加载详情
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

    // 设置目标类型
    setTargetType(targetType) {
      switch (targetType) {
        case 1:
          this.pageTitle = '商家审核详情';
          this.targetTypeText = '商家';
          this.isBusiness = true;
          this.isStore = false;
          break;
        case 2:
          this.pageTitle = '门店审核详情';
          this.targetTypeText = '门店';
          this.isStore = true;
          this.isBusiness = false;
          break;
        default:
          this.pageTitle = '审核详情';
          this.targetTypeText = '关联对象';
          this.isStore = false;
          this.isBusiness = false;
      }
    },

    // 设置状态
    setStatusInfo(status) {
      const statusMap = {
        0: { text: '待审核', type: 'warning' },
        1: { text: '审核通过', type: 'success' },
        2: { text: '审核驳回', type: 'danger' }
      };
      const info = statusMap[status] || { text: '未知状态', type: 'info' };
      this.statusText = info.text;
      this.statusTagType = info.type;
    },

    // 格式化日期
    formatDate(date) {
      if (!date || date === '-') return '-';
      const d = new Date(date.replace(/\/+/g, '-'));
      if (isNaN(d.getTime())) return date;
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
    },

    // 预览图片
    previewImage(url) {
      if (!url) return;
      this.previewUrl = url;
      this.previewVisible = true;
    },

    // 返回列表
    goBack() {
      this.$router.push({ name: 'AuditList' });
    },

    // 审核通过
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

    // 字段key转中文名称
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

    // 勾选风险时的处理
    handleRiskCheck() {
      // 触发视图更新即可，无需额外逻辑
      this.$forceUpdate();
    },

    // 判断是否勾选了至少一个风险（核心：控制驳回按钮禁用）
    hasCheckedAnyRisk() {
      return Object.keys(this.checkedRisks).some(fieldKey => {
        return Array.isArray(this.checkedRisks[fieldKey]) && this.checkedRisks[fieldKey].length > 0;
      });
    },

    // 组装结构化驳回原因（和淘宝返回格式一致）
    buildRejectReason() {
      const rejectReason = {};
      // 遍历所有选中的字段
      Object.keys(this.checkedRisks).forEach(fieldKey => {
        const riskIndexes = this.checkedRisks[fieldKey];
        if (Array.isArray(riskIndexes) && riskIndexes.length > 0) {
          rejectReason[fieldKey] = [];
          // 遍历该字段下选中的风险
          riskIndexes.forEach(index => {
            const risk = this.rejectRiskLibrary[fieldKey][index];
            if (!risk) return;
            // 组装单个风险的信息
            const riskItem = {
              name: null,
              riskName: risk.riskName,
              riskReason: risk.reason,
              reason: this.customReason[fieldKey + '_' + index] || risk.reason, // 优先用自定义原因
              advise: null,
              referArticleUrl: null,
              remark: null
            };
            rejectReason[fieldKey].push(riskItem);
          });
        }
      });
      return rejectReason;
    },

    // 审核驳回（核心方法）
    async handleReject() {
      // 二次校验：防止前端校验失效
      if (!this.hasCheckedAnyRisk()) {
        this.$message.warning('请至少选择一项驳回原因');
        return;
      }

      try {
        await this.$confirm('确定要驳回该审核申请吗？', '温馨提示', {
          type: 'warning'
        });
        // 组装结构化驳回原因
        const rejectReason = this.buildRejectReason();
        // 调用后端驳回接口
        const res = await auditReject({
          auditId: this.getVal(this.auditData, 'id'),
          rejectReason: rejectReason // 传结构化数据
        });
        if (res.success) {
          this.$message.success('审核驳回成功');
          // 刷新审核详情
          this.loadAuditDetail(this.getVal(this.auditData, 'id'));
          // 重置选中状态
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

    // 计算驳回问题总数（已驳回状态展示用）
    getTotalRejectProblems() {
      const rejectReason = this.auditData.rejectReason || {};
      let total = 0;
      Object.keys(rejectReason).forEach(fieldKey => {
        total += Array.isArray(rejectReason[fieldKey]) ? rejectReason[fieldKey].length : 0;
      });
      return total;
    },

    // 判断字段是否被驳回（用于标红）
    hasFieldReject(fieldKey) {
      const rejectReason = this.auditData.rejectReason || {};
      // 该字段存在且有问题 → 返回true（标红）
      return this.auditData.status === 2 && !!rejectReason[fieldKey] && rejectReason[fieldKey].length > 0;
    }
  }
};
</script>

<style scoped>
.audit-detail-container {
  padding: 16px 20px;
  background: #f5f7fa;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}

.header-card {
  background: #fff;
  padding: 12px 16px;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ebeef5;
}

.header-left .title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-right: 12px;
}

.status-tag {
  vertical-align: middle;
}

.header-right {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.info-item {
  font-size: 13px;
  color: #666;
}

.info-item .label {
  color: #999;
  margin-right: 4px;
}

/* 驳回问题汇总样式 */
.reject-summary {
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 4px;
  padding: 12px 16px;
  margin-bottom: 16px;
}

.summary-title {
  font-size: 14px;
  font-weight: 600;
  color: #f56c6c;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.summary-content {
  font-size: 13px;
  color: #f56c6c;
}

.field-group {
  margin-bottom: 8px;
}

.field-name {
  font-size: 13px;
  font-weight: 500;
  color: #f56c6c;
  margin-bottom: 4px;
}

.problem-item {
  line-height: 1.6;
  margin-left: 12px;
}

.compare-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 140px;
}

.compare-card,
.log-card {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #ebeef5;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  padding: 10px 16px;
  border-bottom: 1px solid #ebeef5;
  background: #fafafa;
}

.compare-content {
  display: flex;
  padding: 16px;
  gap: 20px;
}

.compare-col {
  flex: 1;
}

.col-title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 4px;
  border-bottom: 1px solid #ebeef5;
  display: block;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-row {
  font-size: 13px;
  color: #666;
  display: flex;
  flex-wrap: wrap;
  padding: 4px 0;
}

/* 驳回字段标红样式 */
.info-row.reject-item {
  border-left: 3px solid #f56c6c;
  padding-left: 8px;
  background: #fff2f0;
  border-radius: 2px;
}

.info-label {
  color: #999;
  min-width: 70px;
}

.info-value.changed {
  color: #f56c6c;
  font-weight: 500;
  background: #fff2f0;
  padding: 1px 3px;
  border-radius: 2px;
}

.cert-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cert-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 驳回资质标红 */
.cert-item.reject-item {
  border: 1px solid #ffccc7;
  padding: 8px;
  border-radius: 4px;
  background: #fff2f0;
}

.cert-label {
  font-size: 13px;
  color: #999;
}

.cert-img {
  width: 180px;
  height: 120px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
}

.cert-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-img {
  font-size: 12px;
  color: #ccc;
}

.cert-info {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #666;
}

.photo-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.photo-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
}

/* 驳回照片标红 */
.photo-item.reject-item {
  border: 1px solid #ffccc7;
  padding: 8px;
  border-radius: 4px;
  background: #fff2f0;
}

.photo-label {
  font-size: 13px;
  color: #999;
}

.photo-img {
  width: 180px;
  height: 120px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.photo-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.log-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.log-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #ebeef5;
}

.log-time {
  font-size: 12px;
  color: #999;
}

.log-content {
  font-size: 13px;
  color: #666;
}

.log-operator {
  color: #1890ff;
  margin-right: 4px;
}

.log-action {
  margin-right: 4px;
}

.log-reason {
  color: #f56c6c;
}

.empty-log {
  font-size: 13px;
  color: #999;
  text-align: center;
  padding: 16px 0;
}

.footer-actions {
  position: fixed;
  bottom: 0;
  left: 200px;
  right: 0;
  background: #fff;
  padding: 10px 20px;
  border-top: 1px solid #ebeef5;
  box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.05);
  z-index: 999;
  border-radius: 0;
}

.footer-actions.disabled .reject-btn,
.footer-actions.disabled .pass-btn {
  display: none;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
}

.audit-result {
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 12px;
}

.result-label {
  font-weight: 500;
}

.preview-img-container {
  width: 100%;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.preview-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* 字段驳回原因选择区样式 */
.reject-field-group {
  padding: 12px 16px;
  border-top: 1px dashed #ebeef5;
  background: #fafafa;
}

.field-title {
  font-size: 13px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
}

.risk-item {
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
}

.custom-reason-input {
  margin-left: 24px;
  margin-top: 4px;
  width: 400px;
}

@media (max-width: 1200px) {
  .compare-content {
    flex-direction: column;
    gap: 16px;
  }
  .header-right {
    gap: 8px;
  }
  .custom-reason-input {
    width: 100%;
  }
}
</style>