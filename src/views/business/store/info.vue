<template>
  <div>
    <div style="width: 70%; margin: 10px auto">
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
        style="background: #ffffff"
      >
      <el-tab-pane label="基本信息" name="first">
        <div class="storeInfo">
          <div class="storeWapper">
            <div class="storeWapper-Item">
              <div class="text">门店头像</div>
              <div class="describe">
                <el-image
                  style="width: 45px; height: 45px"
                  :src="requestStore.avatarImg || ''"
                ></el-image>
              </div>
            </div>
            <div class="operation" @click="modifyAvatarEdit">
              {{ requestStore.avatarImg ? "申请修改" : "上传" }}
            </div>
          </div>
          <div class="storeWapper">
            <div class="storeWapper-Item">
              <div class="text">门店名称</div>
              <div class="describe">{{ requestStore.storeName }}</div>
            </div>
            <div class="operation" @click="modifyShopEdit">
              <span v-html="getBtnText()"></span>
            </div>
          </div>
          <div class="storeWapper">
            <div class="storeWapper-Item">
              <div class="text">门店电话</div>
              <div class="describe">
                <template v-if="!isEditingPhone">{{ requestStore.contactInfo || '未设置' }}</template>
                <template v-else>
                  <el-input v-model="editPhone" size="small" class="edit-input" />
                </template>
              </div>
            </div>
            <div class="operation" v-if="!isEditingPhone" @click="startEditPhone">修改</div>
            <div v-else class="operation-group">
              <span class="operation confirm" @click="savePhone">保存</span>
              <span class="operation cancel" @click="cancelEditPhone">取消</span>
            </div>
          </div>
          <div class="storeWapper">
            <div class="storeWapper-Item">
              <div class="text">门店地址</div>
              <div class="describe">{{ requestStore.address || '未设置' }}</div>
            </div>
            <div class="operation" @click="modifyShopEdit">
              <span v-html="getBtnText()"></span>
            </div>
          </div>
          <div class="storeWapper">
            <div class="storeWapper-Item">
              <div class="text">门店品类</div>
              <div class="describe">{{ requestStore.name || '未设置' }}</div>
            </div>
            <div class="operation" @click="modifyShopEdit">
              <span v-html="getBtnText()"></span>
            </div>
          </div>
          <div class="storeWapper">
            <div class="storeWapper-Item">
              <div class="text">门店照片</div>
              <div class="describe">
                <div v-if="storePhotos && storePhotos.length > 0" class="photo-preview">
                  <el-image
                    v-for="(photo, index) in storePhotos"
                    :key="index"
                    :src="photo"
                    style="width: 60px; height: 60px; margin-right: 8px; border-radius: 4px"
                    :preview-src-list="storePhotos"
                  ></el-image>
                </div>
                <span v-else>未上传</span>
              </div>
            </div>
            <div class="operation" @click="uploadPhotos">上传</div>
          </div>
          <div class="storeWapper">
            <div class="storeWapper-Item">
              <div class="text">门店二维码</div>
              <div class="describe">
                <div v-if="requestStore.qrCode" class="qr-code">
                  <el-image :src="requestStore.qrCode" style="width: 80px; height: 80px"></el-image>
                </div>
                <span v-else>未生成</span>
              </div>
            </div>
            <div class="operation" v-if="requestStore.qrCode" @click="downloadQrCode">保存二维码</div>
          </div>
          <div class="storeWapper">
            <div class="storeWapper-Item">
              <div class="text">门店号</div>
              <div class="describe">{{ requestStore.id }}</div>
            </div>
          </div>
          <div class="storeWapper">
            <div class="storeWapper-Item">
              <div class="text">申请解除合作</div>
              <div class="describe"></div>
            </div>
            <div class="operation danger" @click="applyTerminate">申请解除</div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="营业信息" name="second">
        <div class="storeInfo">
          <div class="storeWapper">
            <div class="storeWapper-Item">
              <div class="text">营业时间</div>
              <div
                class="describe"
                v-if="!isEditBusinessTime"
                v-html="
                  flexibleServingTimeStrList
                    .toString()
                    .replaceAll(',', ',<br />') || '未设置'
                "
              ></div>
              <div v-else>
                <el-form
                  ref="form"
                  :model="form"
                  size="mini"
                  label-width="70px"
                >
                  <div
                    class="hours-bg"
                    v-for="(item, index) in form.normalServingTimeList"
                    :key="index"
                  >
                    <el-form-item label="营业日" prop="storeName">
                      <el-checkbox-group v-model="item.weeks">
                        <el-checkbox
                          size="mini"
                          v-for="ditem in weekList"
                          :key="ditem.value"
                          :label="ditem.value"
                          border
                          >{{ ditem.name }}</el-checkbox
                        >
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item
                      label="营业时段"
                      v-for="(hItem, hindex) in item.buinessHours"
                      :key="hindex"
                    >
                      <el-time-picker
                        size="mini"
                        v-model="hItem.startTime"
                        :clearable="false"
                        placeholder="选择时间"
                        format="HH:mm"
                        value-format="HH:mm"
                      >
                      </el-time-picker>
                      <span>至</span>
                      <el-time-picker
                        size="mini"
                        v-model="hItem.endTime"
                        :clearable="false"
                        placeholder="选择时间"
                        format="HH:mm"
                        value-format="HH:mm"
                      ></el-time-picker>
                      <el-link v-show="item.buinessHours.length > 1">
                        <i
                          class="el-icon-delete"
                          @click="removeBuinessHours(index, hindex)"
                        ></i
                      ></el-link>
                    </el-form-item>
                    <el-link
                      style="padding-left: 65px"
                      :underline="false"
                      type="primary"
                      icon="el-icon-plus"
                      v-show="
                        item.buinessHours.length === maxBuinessHours
                          ? false
                          : true
                      "
                      @click="addBuinessHours(index)"
                      >新增营业时段({{ item.buinessHours.length }}/{{
                        maxBuinessHours
                      }})</el-link
                    >
                  </div>
                  <footer>
                    <div style="margin-bottom: 16px">
                      <el-link
                        :underline="false"
                        type="primary"
                        icon="el-icon-plus"
                        @click="addNormalServingTimeList"
                        v-show="isShowAddNormalServingTimeList"
                        >新增营业日</el-link
                      >
                    </div>
                    <el-button
                      type="primary"
                      :disabled="saveNormalServingTimeListDisabled"
                      @click="saveNormalServingTime('form')"
                      >保存</el-button
                    >
                    <el-button @click="isEditBusinessTime = false"
                      >取消</el-button
                    >
                  </footer>
                </el-form>
              </div>
            </div>
            <div
              class="operation"
              v-if="!isEditBusinessTime"
              @click="editBusinessTime"
            >
              修改
            </div>
          </div>
          <div class="storeWapper">
            <div class="storeWapper-Item">
              <div class="text">门店公告</div>
              <div class="describe">
                <template v-if="!isEditingNotice">{{ storeNotice || '未设置' }}</template>
                <template v-else>
                  <el-textarea v-model="editNotice" rows="3" class="edit-textarea" />
                </template>
              </div>
            </div>
            <div class="operation" v-if="!isEditingNotice" @click="startEditNotice">修改</div>
            <div v-else class="operation-group">
              <span class="operation confirm" @click="saveNotice">保存</span>
              <span class="operation cancel" @click="cancelEditNotice">取消</span>
            </div>
          </div>
          <div class="storeWapper">
            <div class="storeWapper-Item">
              <div class="text">门店简介</div>
              <div class="describe">
                <template v-if="!isEditingIntro">{{ storeIntro || '未设置' }}</template>
                <template v-else>
                  <el-textarea v-model="editIntro" rows="3" class="edit-textarea" />
                </template>
              </div>
            </div>
            <div class="operation" v-if="!isEditingIntro" @click="startEditIntro">修改</div>
            <div v-else class="operation-group">
              <span class="operation confirm" @click="saveIntro">保存</span>
              <span class="operation cancel" @click="cancelEditIntro">取消</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="资质认证" name="third">
        <div class="storeInfo">
          <div class="cert-section">
            <h3>主体资质</h3>
            <div v-if="licenseInfo" class="cert-card">
              <div class="cert-item">
                <span class="label">证照类型</span>
                <span class="value">{{ getLicenseTypeName(licenseInfo.license_type) }}</span>
              </div>
              <div class="cert-item">
                <span class="label">注册号</span>
                <span class="value">{{ licenseInfo.license_no || '-' }}</span>
              </div>
              <div class="cert-item">
                <span class="label">单位名称</span>
                <span class="value">{{ licenseInfo.company_name || '-' }}</span>
              </div>
              <div class="cert-item">
                <span class="label">法定代表人</span>
                <span class="value">{{ licenseInfo.legal_person || '-' }}</span>
              </div>
              <div class="cert-item">
                <span class="label">经营场所</span>
                <span class="value">{{ licenseInfo.license_plan || '-' }}</span>
              </div>
              <div class="cert-item">
                <span class="label">营业期限</span>
                <span class="value">{{ licenseInfo.is_long_term ? '长期' : (licenseInfo.license_valid_date || '-') }}</span>
              </div>
              <div class="cert-item">
                <span class="label">证照图片</span>
                <div class="value">
                  <el-image v-if="licenseInfo.license_pic" :src="licenseInfo.license_pic" style="width: 100px; height: 100px"></el-image>
                  <span v-else>未上传</span>
                </div>
              </div>
            </div>
            <div v-else class="empty-tip">暂无主体资质信息</div>
          </div>
          <div class="cert-section">
            <h3>行业资质</h3>
            <div v-if="permitInfo" class="cert-card">
              <div class="cert-item">
                <span class="label">证照类型</span>
                <span class="value">{{ getPermitTypeName(permitInfo.permit_type) }}</span>
              </div>
              <div class="cert-item">
                <span class="label">许可证编号</span>
                <span class="value">{{ permitInfo.permit_no || '-' }}</span>
              </div>
              <div class="cert-item">
                <span class="label">单位名称</span>
                <span class="value">{{ permitInfo.permit_name || '-' }}</span>
              </div>
              <div class="cert-item">
                <span class="label">法定代表人</span>
                <span class="value">{{ permitInfo.permit_legalPerson || '-' }}</span>
              </div>
              <div class="cert-item">
                <span class="label">经营场所</span>
                <span class="value">{{ permitInfo.permit_address || '-' }}</span>
              </div>
              <div class="cert-item">
                <span class="label">证照图片</span>
                <div class="value">
                  <el-image v-if="permitInfo.permit_pic" :src="permitInfo.permit_pic" style="width: 100px; height: 100px"></el-image>
                  <span v-else>未上传</span>
                </div>
              </div>
            </div>
            <div v-else class="empty-tip">暂无行业资质信息</div>
          </div>
          <div class="cert-section">
            <h3>资质状态</h3>
            <div class="status-card">
              <div class="status-item">
                <span class="label">审核状态</span>
                <el-tag :type="getCertStatusTag(certStatus)">{{ getCertStatusName(certStatus) }}</el-tag>
              </div>
              <div class="status-item">
                <span class="label">审核时间</span>
                <span class="value">{{ certAuditTime || '-' }}</span>
              </div>
              <div class="status-item">
                <span class="label">审核意见</span>
                <span class="value">{{ certAudit意见 || '-' }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="调控记录" name="fourth">
        <div class="storeInfo">
          <div class="record-list" v-if="regulateRecords && regulateRecords.length > 0">
            <div class="record-item" v-for="(record, index) in regulateRecords" :key="index">
              <div class="record-header">
                <span class="record-type" :class="'type-' + record.type">{{ getRecordTypeName(record.type) }}</span>
                <span class="record-time">{{ record.createTime }}</span>
              </div>
              <div class="record-content">
                <p>{{ record.content }}</p>
              </div>
              <div class="record-operator">操作人：{{ record.operatorName || '-' }}</div>
            </div>
          </div>
          <div v-else class="empty-tip">暂无调控记录</div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>

  <!-- 照片上传弹窗 -->
  <el-dialog title="上传门店照片" :visible.sync="showPhotoUpload" width="600px">
    <el-form>
      <el-form-item label="门店照片">
        <pic-upload v-model="uploadPhotosData" :css="{ width: '100%', height: '200px' }" multiple />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="showPhotoUpload = false">取消</el-button>
      <el-button type="primary" @click="submitPhotos">确认上传</el-button>
    </div>
  </el-dialog>

  <!-- 申请解除合作弹窗 -->
  <el-dialog title="申请解除合作" :visible.sync="showTerminateDialog" width="400px">
    <el-form>
      <el-form-item label="解除原因">
        <el-textarea v-model="terminateReason" rows="4" placeholder="请输入解除合作的原因"></el-textarea>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="showTerminateDialog = false">取消</el-button>
      <el-button type="danger" @click="submitTerminate">确认申请</el-button>
    </div>
  </el-dialog>
  </div>
</template>
<script>
import {
  updateShopServingTime,
  queryShopServingTime,
  detail,
} from "@/api/business/store";
export default {
  data() {
    return {
      activeName: "first",
      requestStore: {},
      isEditBusinessTime: false,
      maxBuinessHours: 3,
      normalServingTimeListMax: 7,
      saveNormalServingTimeListDisabled: false,
      isShowAddNormalServingTimeList: true,
      weekList: [
        { value: 1, name: "周一" },
        { value: 2, name: "周二" },
        { value: 3, name: "周三" },
        { value: 4, name: "周四" },
        { value: 5, name: "周五" },
        { value: 6, name: "周六" },
        { value: 0, name: "周日" },
      ],
      form: {
        storeId: null,
        normalServingTimeList: [
          { weeks: [], buinessHours: [{ startTime: "", endTime: "" }] },
        ],
      },
      flexibleServingTimeStrList: [],
      // 电话编辑
      isEditingPhone: false,
      editPhone: "",
      // 公告编辑
      isEditingNotice: false,
      editNotice: "",
      storeNotice: "",
      // 简介编辑
      isEditingIntro: false,
      editIntro: "",
      storeIntro: "",
      // 门店照片
      storePhotos: [],
      showPhotoUpload: false,
      uploadPhotosData: "",
      // 资质信息
      licenseInfo: null,
      permitInfo: null,
      certStatus: 0,
      certAuditTime: "",
      certAudit意见: "",
      licenseTypeList: [
        { id: 1, name: "营业执照" },
        { id: 2, name: "组织机构代码证" },
        { id: 3, name: "税务登记证" },
      ],
      permitTypeList: [
        { id: 1, name: "食品经营许可证" },
        { id: 2, name: "卫生许可证" },
        { id: 3, name: "消防许可证" },
      ],
      // 调控记录
      regulateRecords: [],
      // 解除合作
      showTerminateDialog: false,
      terminateReason: "",
    };
  },
  mounted() {
    this.requestStore = this.$store.state.user.user.business.store.find(
      (t) => t.isDefault == 1
    );
    this.activeName = this.$route.query.name || "first";
    if (this.activeName === "second") {
      this.queryShopServingTime();
    }
    this.loadStoreDetail();
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name === "second") {
        this.queryShopServingTime();
      }
      if (tab.name === "third") {
        this.loadCertInfo();
      }
      if (tab.name === "fourth") {
        this.loadRegulateRecords();
      }
    },
    async loadStoreDetail() {
      if (this.requestStore && this.requestStore.id) {
        const res = await detail({ storeId: this.requestStore.id });
        if (res.success && res.result) {
          this.storeNotice = res.result.notice || "";
          this.storeIntro = res.result.intro || "";
          this.storePhotos = res.result.photos || [];
          this.licenseInfo = res.result.licenseInfo;
          this.permitInfo = res.result.permitInfo;
        }
      }
    },
    modifyAvatarEdit() {
      this.$router.push({
        name: "modifyShopAvatar",
        query: {
          storeId: this.requestStore.id,
          avatarUrl: this.requestStore.avatarImg,
        },
      });
    },
    modifyShopEdit() {
      this.$router.push({
        name: "modifyShopEdit",
        query: {
          storeId: this.requestStore.id,
          status: this.requestStore.status,
        },
      });
    },
    getBtnText() {
      let _status = this.requestStore.status;
      if (_status === 0) return "申请修改";
      else if (_status === 1) return '<span style="color:#333">审核中</span>';
      else if (_status === 2) return '<span style="color:#333">审核通过</span>';
      else if (_status === 6)
        return '<span style="color:#ff1a38">审核驳回</span>';
    },
    // 电话编辑
    startEditPhone() {
      this.editPhone = this.requestStore.contactInfo || "";
      this.isEditingPhone = true;
    },
    async savePhone() {
      if (!this.editPhone.trim()) {
        this.$msg.alert("请输入门店电话");
        return;
      }
      const res = await this.$request({
        url: "/store/edit",
        method: "post",
        data: {
          id: this.requestStore.id,
          contactInfo: this.editPhone,
        },
      });
      if (res.success) {
        this.$msg.alert("修改成功");
        this.requestStore.contactInfo = this.editPhone;
        this.isEditingPhone = false;
      }
    },
    cancelEditPhone() {
      this.isEditingPhone = false;
      this.editPhone = "";
    },
    // 公告编辑
    startEditNotice() {
      this.editNotice = this.storeNotice || "";
      this.isEditingNotice = true;
    },
    async saveNotice() {
      const res = await this.$request({
        url: "/store/updateNotice",
        method: "post",
        data: {
          storeId: this.requestStore.id,
          notice: this.editNotice,
        },
      });
      if (res.success) {
        this.$msg.alert("保存成功");
        this.storeNotice = this.editNotice;
        this.isEditingNotice = false;
      }
    },
    cancelEditNotice() {
      this.isEditingNotice = false;
      this.editNotice = "";
    },
    // 简介编辑
    startEditIntro() {
      this.editIntro = this.storeIntro || "";
      this.isEditingIntro = true;
    },
    async saveIntro() {
      const res = await this.$request({
        url: "/store/updateIntro",
        method: "post",
        data: {
          storeId: this.requestStore.id,
          intro: this.editIntro,
        },
      });
      if (res.success) {
        this.$msg.alert("保存成功");
        this.storeIntro = this.editIntro;
        this.isEditingIntro = false;
      }
    },
    cancelEditIntro() {
      this.isEditingIntro = false;
      this.editIntro = "";
    },
    // 照片上传
    uploadPhotos() {
      this.showPhotoUpload = true;
    },
    async submitPhotos() {
      if (!this.uploadPhotosData) {
        this.$msg.alert("请选择照片");
        return;
      }
      const res = await this.$request({
        url: "/store/uploadPhotos",
        method: "post",
        data: {
          storeId: this.requestStore.id,
          photos: this.uploadPhotosData,
        },
      });
      if (res.success) {
        this.$msg.alert("上传成功");
        this.storePhotos = [...this.storePhotos, this.uploadPhotosData];
        this.showPhotoUpload = false;
        this.uploadPhotosData = "";
      }
    },
    // 二维码下载
    downloadQrCode() {
      if (this.requestStore.qrCode) {
        const link = document.createElement("a");
        link.href = this.requestStore.qrCode;
        link.download = "门店二维码.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    // 申请解除合作
    applyTerminate() {
      this.showTerminateDialog = true;
    },
    async submitTerminate() {
      if (!this.terminateReason.trim()) {
        this.$msg.alert("请输入解除原因");
        return;
      }
      const res = await this.$request({
        url: "/store/applyTerminate",
        method: "post",
        data: {
          storeId: this.requestStore.id,
          reason: this.terminateReason,
        },
      });
      if (res.success) {
        this.$msg.alert("申请已提交");
        this.showTerminateDialog = false;
        this.terminateReason = "";
      }
    },
    // 资质信息
    getLicenseTypeName(type) {
      const item = this.licenseTypeList.find((t) => t.id == type);
      return item ? item.name : "未知";
    },
    getPermitTypeName(type) {
      const item = this.permitTypeList.find((t) => t.id == type);
      return item ? item.name : "未知";
    },
    getCertStatusName(status) {
      const map = {
        0: "待审核",
        1: "审核通过",
        2: "审核驳回",
      };
      return map[status] || "未知";
    },
    getCertStatusTag(status) {
      const map = {
        0: "warning",
        1: "success",
        2: "danger",
      };
      return map[status] || "info";
    },
    async loadCertInfo() {
      if (this.requestStore && this.requestStore.id) {
        const res = await detail({ storeId: this.requestStore.id });
        if (res.success && res.result) {
          this.licenseInfo = res.result.licenseInfo;
          this.permitInfo = res.result.permitInfo;
          this.certStatus = res.result.certStatus || 0;
          this.certAuditTime = res.result.certAuditTime;
          this.certAudit意见 = res.result.certAudit意见;
        }
      }
    },
    // 调控记录
    async loadRegulateRecords() {
      const res = await this.$request({
        url: "/store/getRegulateRecords",
        method: "get",
        params: { storeId: this.requestStore.id },
      });
      if (res.success) {
        this.regulateRecords = res.result || [];
      }
    },
    getRecordTypeName(type) {
      const map = {
        1: "营业时间调整",
        2: "门店状态变更",
        3: "资质审核",
        4: "合作解除",
        5: "其他",
      };
      return map[type] || "未知";
    },
    addNormalServingTimeList() {
      this.form.normalServingTimeList.push({
        weeks: [],
        buinessHours: [{ startTime: "", endTime: "" }],
      });
    },
    addBuinessHours(index) {
      this.form.normalServingTimeList[index].buinessHours.push({
        startTime: "",
        endTime: "",
      });
    },
    removeBuinessHours(index, hIndex) {
      this.form.normalServingTimeList[index].buinessHours.splice(hIndex, 1);
    },
    editBusinessTime() {
      this.isEditBusinessTime = true;
    },
    async queryShopServingTime() {
      const response = await queryShopServingTime();
      if (
        response.result.flexibleServingTimeStrList.length > 0 &&
        response.result.normalServingTimeList.length > 0
      ) {
        this.flexibleServingTimeStrList =
          response.result.flexibleServingTimeStrList;
        this.form.normalServingTimeList = response.result.normalServingTimeList;
      }
      this.isEditBusinessTime = false;
    },
    saveNormalServingTime(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          updateShopServingTime(this.form)
            .then((response) => {
              this.$msg.success("提交成功");
              this.isEditBusinessTime = false;
              this.queryShopServingTime();
            })
            .catch((error) => {
              console.error("Error submitting form:", error);
              this.$msg.error("操作失败，原因！" + error.msg);
            });
        }
      });
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss">
.el-tabs {
  background: transparent !important;
  .el-tabs__content {
    background: rgb(255, 255, 255);
    border-radius: 8px;
    height: 76vh;
    overflow-y: auto;
  }
  .el-tabs__item {
    font-size: 16px !important;
    font-weight: 500 !important;
  }
  .el-tabs__active-bar {
    color: #1971ff !important;
  }
  .el-tabs__header {
    background: rgb(255, 255, 255);
    border-radius: 8px;
    height: 60px;
    line-height: 60px;
    padding: 0 16px;
    .el-tabs__item.is-active {
      color: #1989fa !important;
    }
    .el-tabs__nav-wrap::after {
      background: transparent !important;
      height: 3px !important;
    }
  }
}
.storeInfo {
  .storeWapper:first-child {
    border: none;
  }
  .storeWapper {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    border-top: 1px solid #eee;
    &-Item {
      display: flex;
      align-items: center;
    }
    .text {
      width: 100px;
      padding-left: 15px;
    }
    .describe {
      color: #6e6f70;
      line-height: 24px;
      flex: 1;
      padding: 0 10px;
    }
    .hours-bg {
      background: rgb(245, 247, 252);
      border-radius: 4px;
      margin-bottom: 12px;
      padding: 12px;
      position: relative;
      .el-checkbox.is-bordered.el-checkbox--mini {
        margin-right: 0px !important;
      }
    }
    .photo-preview {
      display: flex;
      flex-wrap: wrap;
    }
    .qr-code {
      display: flex;
      align-items: center;
    }
  }
  .operation {
    width: 100px;
    color: #1989fa;
    cursor: pointer;
    text-align: center;
  }
  .operation.danger {
    color: #ff4d4f;
  }
  .operation-group {
    display: flex;
    gap: 10px;
  }
  .operation.confirm {
    color: #52c41a;
  }
  .operation.cancel {
    color: #999;
  }
  .operation:hover {
    opacity: 0.8;
  }
  .edit-input {
    width: 200px;
  }
  .edit-textarea {
    width: 100%;
    max-width: 400px;
  }
  .cert-section {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
    h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 15px;
      color: #303133;
    }
  }
  .cert-card {
    background: #f5f7fc;
    border-radius: 8px;
    padding: 20px;
  }
  .cert-item {
    display: flex;
    margin-bottom: 12px;
    .label {
      width: 120px;
      color: #909399;
    }
    .value {
      color: #606266;
    }
  }
  .status-card {
    background: #f5f7fc;
    border-radius: 8px;
    padding: 20px;
  }
  .status-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    .label {
      width: 120px;
      color: #909399;
    }
    .value {
      color: #606266;
    }
  }
  .record-list {
    padding: 10px;
  }
  .record-item {
    background: #f5f7fc;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
  }
  .record-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .record-type {
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    &.type-1 {
      background: #e6f7ff;
      color: #1890ff;
    }
    &.type-2 {
      background: #f6ffed;
      color: #52c41a;
    }
    &.type-3 {
      background: #fff7e6;
      color: #fa8c16;
    }
    &.type-4 {
      background: #fff1f0;
      color: #ff4d4f;
    }
    &.type-5 {
      background: #f9f9f9;
      color: #666;
    }
  }
  .record-time {
    font-size: 12px;
    color: #909399;
  }
  .record-content {
    margin-bottom: 8px;
    p {
      margin: 0;
      color: #606266;
    }
  }
  .record-operator {
    font-size: 12px;
    color: #909399;
  }
  .empty-tip {
    text-align: center;
    color: #909399;
    padding: 40px;
  }
}
</style>