<template>
  <div class="modifyShopEdit">
    <div class="header">
      <i class="el-icon-back" @click="goBack"></i
      ><span style="padding-left: 10px">修改基础信息 </span>
    </div>
    <el-alert
      title="修改须知：每个月仅允许修改10次，请谨慎修改（本月还可修改10次）"
      type="warning"
      show-icon
    ></el-alert>
    <el-form
      ref="form"
      size="medium"
      label-width="100px"
      style="margin-top: 15px; padding: 0 15px"
      :model="form"
      :rules="rules"
    >
      <div class="form-container">
        <div class="main-title">基础信息</div>
        <div class="modify-shop-card">
          <div class="left">
            <div class="sub-title">基本信息</div>
            <div class="sub-content">
              <el-form-item
                label="牌匾名"
                label-position="left"
                prop="storeName"
              >
                <el-input
                  v-model="form.storeName"
                  placeholder="请输入牌匾名"
                ></el-input>
              </el-form-item>
              <el-form-item label="经营品类">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="right">
            <el-form-item prop="doorPhoto">
              <template slot="label">
                <span>门脸照</span>
                <span class="label-tip"
                  >建议拍摄营业中的商户门面，包含完整牌匾名</span
                >
                <a href="#" class="label-link">查看示例图</a>
              </template>
              <pic-upload
                v-model="form.doorPhoto"
                :css="{ width: '460px', height: '312px' }"
              />
            </el-form-item>
            <el-form-item prop="envPhoto">
              <template slot="label">
                <span>环境图</span>
                <span class="label-tip"
                  >需真实反映食堂区域（餐桌、餐椅等）</span
                >
                <a href="#" class="label-link">查看示例图</a>
              </template>
              <pic-upload
                v-model="form.envPhoto"
                :css="{ width: '460px', height: '312px' }"
              />
            </el-form-item>
          </div>
        </div>
        <div class="main-title">资质信息</div>
        <div class="modify-shop-card">
          <div class="left">
            <div class="sub-title">主体资质</div>
            <div class="sub-content">
              <el-form-item label="证照类型" prop="licenseInfo.license_type">
                <el-select
                  v-model="form.licenseInfo.license_type"
                  placeholder="请选择证照类型"
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in licenseTypeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="注册号" prop="licenseInfo.license_no">
                <el-input
                  v-model="form.licenseInfo.license_no"
                  placeholder="请填写注册号"
                ></el-input>
              </el-form-item>
              <el-form-item label="单位名称" prop="licenseInfo.company_name">
                <el-input
                  v-model="form.licenseInfo.company_name"
                  placeholder="请填写单位名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="法定代表人" prop="licenseInfo.legal_person">
                <el-input
                  v-model="form.licenseInfo.legal_person"
                  placeholder="请填写法定代表人"
                ></el-input>
              </el-form-item>
              <el-form-item label="经营场所" prop="licenseInfo.license_plan">
                <el-input
                  v-model="form.licenseInfo.license_plan"
                  placeholder="请填写经营场所"
                ></el-input>
              </el-form-item>
              <el-form-item label="营业期限" prop="licenseInfo.license_valid_date">
                <el-date-picker
                  v-model="form.licenseInfo.license_valid_date"
                  type="date"
                  placeholder="请选择日期"
                >
                </el-date-picker>
                <el-button
                  v-model="form.licenseInfo.is_long_term"
                  :type="form.licenseInfo.is_long_term ? 'primary' : 'default'"
                  @click="handleClick(form.licenseInfo.is_long_term)"
                  >长期</el-button
                >
              </el-form-item>
            </div>
          </div>
          <div class="right">
            <el-form-item prop="licenseInfo.license_pic">
              <template slot="label">
                <span>{{
                  licenseTypeList.find(
                    (t) => t.id == form.licenseInfo.license_type
                  ).name
                }}</span>
                <a href="#" class="label-link">查看示例图</a>
              </template>
              <pic-upload
                v-model="form.licenseInfo.license_pic"
                :css="{ width: '460px', height: '312px' }"
              />
            </el-form-item>
          </div>
        </div>
        <div class="modify-shop-card">
          <div class="left">
            <div class="sub-title">行业资质</div>
            <div class="sub-content">
              <el-form-item label="证照类型" prop="permitInfo.permit_type">
                <el-select
                  v-model="form.permitInfo.permit_type"
                  placeholder="请选择证照类型"
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in permitTypeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="许可证编号" prop="permitInfo.permit_no">
                <el-input
                  v-model="form.permitInfo.permit_no"
                  placeholder="请填写许可证编号"
                ></el-input>
              </el-form-item>
              <el-form-item label="单位名称" prop="permitInfo.permit_name">
                <el-input
                  v-model="form.permitInfo.permit_name"
                  placeholder="请填写单位名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="法定代表人" prop="permitInfo.permit_legalPerson">
                <el-input
                  v-model="form.permitInfo.permit_legalPerson"
                  placeholder="请填写法定代表人"
                ></el-input>
              </el-form-item>
               <el-form-item label="经营场所" prop="permitInfo.permit_address">
                <el-input
                  v-model="form.permitInfo.permit_address"
                  placeholder="请填写经营场所"
                ></el-input>
              </el-form-item>
               <el-form-item label="主体业态" prop="permitInfo.permit_mainBusiness">
                <el-input
                  v-model="form.permitInfo.permit_mainBusiness"
                  placeholder="请填写主体业态"
                ></el-input>
              </el-form-item>
                  <el-form-item label="经营项目" prop="permitInfo.permit_scope">
                <el-input
                  v-model="form.permitInfo.permit_scope"
                  placeholder="请填写经营项目"
                ></el-input>
              </el-form-item>
               <el-form-item label="有效期" prop="permitInfo.permit_expireDate">
                <el-date-picker
                  v-model="form.permitInfo.permit_expireDate"
                  type="date"
                  placeholder="请选择日期"
                >
                </el-date-picker>
                <el-button
                  v-model="form.permitInfo.is_rang_date"
                  :type="form.permitInfo.is_rang_date ? 'primary' : 'default'"
                  @click="permitHanderClick(form.permitInfo.is_rang_date)"
                  >长期</el-button
                >
              </el-form-item>
            </div>
          </div>
          <div class="right">
            <el-form-item prop="permitInfo.permit_pic">
              <template slot="label">
                <span>{{
                  permitTypeList.find(
                    (t) => t.id == form.permitInfo.permit_type
                  ).name
                }}</span>
                <a href="#" class="label-link">查看示例图</a>
              </template>
              <pic-upload
                v-model="form.permitInfo.permit_pic"
                :css="{ width: '460px', height: '312px' }"
              />
            </el-form-item>
          </div>
        </div>
        <div class="main-title">地址信息</div>
        <div
          class="modify-shop-card"
          style="margin-bottom: 0px; padding-bottom: 0px"
        >
          <div class="left">
            <el-form-item label="门店地址">
              <div class="sub-content">
                <el-form-item label="所在地区" prop="district_code">
                  <el-cascader
                    style="width: 100%"
                    placeholder="请选择省市区"
                    ref="address"
                    v-model="form.district_code"
                    :options="cascaderData"
                    @change="handlerChange"
                  ></el-cascader>
                </el-form-item>
                <el-form-item
                  label="详细地址"
                  prop="detail_address"
                  style="margin-top: 15px"
                >
                  <el-input
                    v-model="form.detail_address"
                    placeholder="精确到道路、门牌号、单元室等"
                    @blur="handlerAddress"
                  ></el-input>
                </el-form-item>
              </div>
            </el-form-item>
          </div>
          <div class="right">智能识别</div>
        </div>
        <div class="modify-shop-card" style="padding-top: 0px">
          <el-form-item label="地图定位" style="width: 100%">
            <!-- <map-selector
              ref="mapSelectorRef"
              :initial-center="initialCenter"
              :textAddress="textAddress"
              @confirm="handleMapConfirm"
            ></map-selector> -->
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="shop-modify-footer">
      <el-button plain size="medium" @click="goBack">取消</el-button>
      <el-button
        type="primary"
        size="medium"
        :autofocus="true"
        @click="submitForm('form')"
        >修改并提交审核</el-button
      >
    </div>
  </div>
</template>
<script>
import picUpload from "@/components/file";
import { chinaRegions } from "@/api/base";
import MapSelector from "@/components/MapSeletor";
export default {
  components: { picUpload, MapSelector },
  data() {
    return {
      form: {
        storeName: "",
        licenseInfo: {
          license_type: 1,
          license_pic: "", // 营业执照图片
          license_no: "", // 注册号
          company_name: "", // 公司名称
          legal_person: "", // 法人
          license_plan: "", // 经营场所
          license_valid_date: "", // 营业执照有效期
          is_long_term: 0, // 长期营业执照
        },
        permitInfo: {
          permit_type: 1,
          permit_pic: "", //许可证图片
          permit_no: "", // 许可证号
          permit_name:'', // 单位名称
          permit_legalPerson:'', // 法人
          permit_address:'', // 经营场所
          permit_mainBusiness:'', // 主营业态
          permit_scope:'', // 经营项目
          permit_expireDate: "", // 许可证有效期
          is_rang_date:0, // 长期许可证
        },

        district_code: null, // 区县编码
        detail_address: "", // 详细地址
        latitude: "", // 纬度
        longitude: "", // 经度
      },
      licenseTypeList: [
        {
          id: 1,
          name: "营业执照",
        },
        { id: 2, name: "事业单位法人证书" },
        { id: 3, name: "民办非企业单位登记证书" },
        { id: 4, name: "社会团体登记证书" },
        { id: 5, name: "双证合一" },
      ],
      permitTypeList: [
        {
          id: 1,
          name: "食品经营许可证",
        },
        {
          id: 2,
          name: "三小类许可证",
        },
        {
          id: 3,
          name: "其他",
        },
      ],
      cascaderData: [],
      initialCenter: [116.46, 39.92],
      showMap: true,
      textAddress: "",
    };
  },
  computed: {
    rules() {
      return {
        storeName: [
          { required: true, message: "请输入门店名称", trigger: "blur" },
        ],
        envPhoto: [
          { required: true, message: "店内环境图片不能为空", trigger: "blur" },
        ],
        doorPhoto: [
          { required: true, message: "门脸图不能为空", trigger: "blur" },
        ],
        licenseInfo: {
          license_type: [
            { required: true, message: "请选择证照类型", trigger: "blur" },
          ],
          license_pic: [
            { required: true, message: "证照照片不能为空", trigger: "blur" },
          ],
          license_no: [
            { required: true, message: "请输入注册号", trigger: "blur" },
          ],
          license_plan: [
            { required: true, message: "请输入经营场所", trigger: "blur" },
          ],
          company_name: [
            { required: true, message: "请输入公司名称", trigger: "blur" },
          ],
          legal_person: [
            { required: true, message: "请输入法人姓名", trigger: "blur" },
          ],

          license_valid_date: this.form.licenseInfo.is_long_term
            ? [{ required: false, message: "", trigger: "blur" }]
            : [
                {
                  required: true,
                  message: "请输入营业执照有效期",
                  trigger: "blur",
                },
              ],
        },
        permitInfo: {
          permit_type: [
            { required: true, message: "请选择证照类型", trigger: "blur" },
          ],
          permit_pic: [
            { required: true, message: "证照照片不能为空", trigger: "blur" },
          ],
          permit_name:[{ required: true, message: "请输入单位名称", trigger: "blur" }],
          permit_legalPerson:[{ required: true, message: "请输入法人姓名", trigger: "blur" }],
          permit_address:[{ required: true, message: "请输入经营场所", trigger: "blur" }],
          permit_mainBusiness:[{ required: true, message: "请输入主营业态", trigger: "blur" }],
          permit_scope:[{ required: true, message: "请输入经营项目", trigger: "blur" }],
          permit_no: [
            { required: true, message: "请输入许可证编号", trigger: "blur" },
          ],
          permit_expireDate:this.form.permitInfo.is_rang_date == 1 ?  [{ required: false, message: "", trigger: "blur" }
          ]:[{ required: true, message: "请输入许可证有效期", trigger: "blur" }],
        },
        district_code: [
          { required: true, message: "请选择所在地区", trigger: "change" },
        ],
        detail_address: [
          {
            required: true,
            message: "记得完善道路、门牌号、单元室等",
            trigger: "blur",
          },
        ],
      };
    },
  },
  mounted() {
    chinaRegions().then((res) => {
      console.log(res);
      this.cascaderData = res.result.provinceList.map((province) => ({
        value: province.districtCode,
        label: province.fullName,
        children: (province.directCityList || []).map((city) => {
          const children = [];
          // 2. 添加下属县/县级市（lowerCityList）
          if (city.lowerCityList && city.lowerCityList.length > 0) {
            city.lowerCityList.forEach((county) => {
              children.push({
                value: county.districtCode,
                label: county.fullName, // 或 fullName
                latitude: county.latitude,
                longitude: county.longitude,
              });
            });
          }
          // 1. 添加市辖区（districtList）
          if (city.districtList && city.districtList.length > 0) {
            city.districtList.forEach((district) => {
              children.push({
                value: district.districtCode,
                label: district.name,
                latitude: district.latitude,
                longitude: district.longitude,
              });
            });
          }

          return {
            value: city.districtCode,
            label: city.fullName,
            children: children.length > 0 ? children : undefined,
          };
        }),
      }));
    });
  },
  methods: {
    handleClick() {
        this.form.licenseInfo.is_long_term =
        this.form.licenseInfo.is_long_term === 0 ? 1 : 0;
    },
    permitHanderClick(){
        this.form.permitInfo.is_rang_date =
        this.form.permitInfo.is_rang_date === 0 ? 1 : 0;
    },
    handlerChange(val, selectData) {
      let { label, value, latitude, longitude } =
        this.$refs.address.getCheckedNodes()[0].data;
      // 直接调用子组件方法传经纬度
      this.$refs.mapSelectorRef.regeoCode(longitude, latitude);
    },
    // 完整地址
    handlerAddress() {
      this.textAddress = this.form.detail_address;
    },
    handleMapConfirm(addressInfo) {
      this.form.latitude = addressInfo.lat;
      this.form.longitude = addressInfo.lng;
      this.form.detail_address = addressInfo.name;
      this.showMap = false;

      // 如果地图返回的adcode和级联选中的不一致，提示用户
      if (addressInfo.adcode !== this.form.district_code) {
        this.$message.warning("地图定位位置与所选区域不一致，请重新选择");
      }
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        console.log(this.form)
        if (valid) {
          this.$message.success("修改成功");
          this.$router.replace("info");
        } else {
          this.$message.error("请检查输入项");
        }
      });
    },
    goBack() {
      this.$router.replace("info");
    },
  },
};
</script>

<style lang="scss">
.modifyShopEdit {
  height: 100%;
  overflow: auto;
  padding-bottom: 56px;
  .header {
    color: #333;
    font-size: 18px;
    font-weight: bold;
    padding: 15px;

    i:hover {
      cursor: pointer;
    }
  }
  .form-container {
    background: #fff;
    border-radius: 8px;
    margin-bottom: 56px;
    min-width: 1098px;
    padding: 24px;
    width: 100%;
    .label-tip {
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      margin-left: 4px;
    }

    .label-link {
      color: #409eff;
      font-size: 14px;
      margin-left: 8px;
      text-decoration: none;

      &:hover {
        cursor: pointer;
      }
    }
    .main-title {
      font-size: 20px;
      margin: 10px;
    }
    .modify-shop-card {
      background-color: #f9fafd;
      border-radius: 10px;
      column-gap: 20px;
      display: flex;
      margin-bottom: 24px;
      padding: 24px;
      position: relative;
      .left {
        flex: 1;
        min-width: 520px;
        .sub-title {
          color: #333;
          font-family: PingFangSC;
          font-size: 20px;
          font-weight: 500;
          line-height: 30px;
          margin-bottom: 24px;
        }
        .sub-content {
          margin-top: 10px;
        }
      }
      .right {
        flex-shrink: 0;
        width: 460px;
        .el-form-item {
          display: flex;
          flex-direction: column;
          .el-form-item__label {
            text-align: left;
            width: 100% !important;
          }
          .el-form-item__content {
            margin-left: 0 !important;
          }
        }
      }
    }
  }
  .shop-modify-footer {
    background: #fff;
    bottom: 0;
    height: 56px;
    overflow: visible;
    padding: 12px 24px;
    position: fixed;
    width: calc(100% - 180px);
    text-align: right;
  }
}
</style>