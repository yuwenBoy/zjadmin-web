<template>
    <div class="modifyShopEdit">
        <div class="header"><i class="el-icon-back"  @click="goBack"></i><span style="padding-left:10px;">修改基础信息 </span></div>
        <el-alert title="修改须知：每个月仅允许修改10次，请谨慎修改（本月还可修改10次）" type="warning" show-icon></el-alert>
           <el-form ref="form" size="medium" label-width="100px" style="margin-top:15px;padding:0 15px;" :model="form" :rules="rules">
            <div class="form-container">
                <div class="main-title">基础信息</div>
                    <div class="modify-shop-card">
                        <div class="left">
                            <div class="sub-title">基本信息</div>
                            <div class="sub-content">
                                <el-form-item label="门店名称" prop="storeName">
                                    <el-input v-model="form.storeName" placeholder="请输入门店名称"></el-input>
                                </el-form-item>
                                <el-form-item label="经营品类">
                                    <el-input v-model="form.name"></el-input>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="right">
                            <el-form-item label="门脸照" prop="doorPhoto">
                                <pic-upload v-model="form.doorPhoto" :maxUploadCount="1" :css="{width:'420px',height:'300px'}"/>
                            </el-form-item>
                            <el-form-item label="环境图" prop="envPhoto">
                                <pic-upload v-model="form.envPhoto" :maxUploadCount="1" :css="{width:'420px',height:'300px'}"/>
                            </el-form-item>
                        </div>
                  </div>
                   <div class="main-title">资质信息</div>
                    <div class="modify-shop-card">
                        <div class="left">
                            <div class="sub-title">主体资质</div>
                            <div class="sub-content">
                                <el-form-item label="证照类型" prop="license_type">
                                      <el-select v-model="form.license_type" placeholder="请选择证照类型" clearable style="width: 100%;">
                                           <el-option v-for="item in licenseTypeList" :key="item.id" :label="item.name" :value="item.id"/>
                                       </el-select>
                                </el-form-item>
                                 <el-form-item label="注册号" prop="license_no">
                                    <el-input v-model="form.license_no" placeholder="请填写注册号"></el-input>
                                </el-form-item>
                                  <el-form-item label="单位名称" prop="company_name">
                                    <el-input v-model="form.company_name" placeholder="请填写单位名称"></el-input>
                                </el-form-item>
                                  <el-form-item label="法定代表人" prop="legal_person">
                                    <el-input v-model="form.legal_person" placeholder="请填写法定代表人"></el-input>
                                </el-form-item>
                                  <el-form-item label="经营场所" prop="license_plan">
                                    <el-input v-model="form.license_plan" placeholder="请填写经营场所"></el-input>
                                </el-form-item>
                                  <el-form-item label="营业期限" prop="license_valid_date">
                                    <el-date-picker
                                        v-model="form.license_valid_date"
                                        type="date"
                                        placeholder="请选择日期">
                                        </el-date-picker>
                                         <el-radio v-model="form.is_long_term" label="1">长期</el-radio>
                                   </el-form-item>
                            </div>
                        </div>
                        <div class="right">
                            <el-form-item label="营业执照">
                                <pic-upload v-model="form.imageUrl" :maxUploadCount="1" :css="{width:'450px',height:'300px'}"/>
                            </el-form-item>
                        </div>
                  </div>
                  <div class="modify-shop-card">
                        <div class="left">
                            <div class="sub-title">行业资质</div>
                            <div class="sub-content">
                                <el-form-item label="证照类型">
                                    <el-select v-model="form.permit_type" placeholder="请选择证照类型" clearable style="width: 100%;">
                                           <el-option v-for="item in [{id:1,name:'食品经营许可证',id:2,name:'三小类许可证',id:3,name:'其他'}]" :key="item.id" :label="item.name" :value="item.id"/>
                                     </el-select>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="right">
                            <el-form-item label="查看示例图片">
                                <pic-upload v-model="form.imageUrl" :maxUploadCount="1" :css="{width:'450px',height:'300px'}"/>
                            </el-form-item>
                        </div>
                  </div>
                   <div class="main-title">地址信息</div>
                    <div class="modify-shop-card">
                        <div class="left">
                            <div class="sub-content">
                                <el-form-item label="门店地址">
                                    <el-input v-model="form.name" placeholder="请输入门店名称"></el-input>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="right">
                          
                        </div>
                  </div>
            </div>
         </el-form>
         <div class="shop-modify-footer">
            <el-button plain size="medium" @click="goBack">取消</el-button>
            <el-button type="primary" size="medium" :autofocus="true" @click="submitForm('form')">修改并提交审核</el-button>
         </div>
    </div>
</template>
<script>
import picUpload from "@/components/file"
    export default {
        components:{ picUpload },
        data() {
            return {
                form: {
                    storeName: '',
                    license_type: 1,
                    license_no:'', // 注册号
                    company_name:'', // 公司名称
                    legal_person:'', // 法人
                    license_img:'',// 营业执照图片
                    license_plan:'', // 经营场所
                    license_valid_date:'', // 营业执照有效期
                    is_long_term:0, // 长期营业执照

                    permit_type:1,
                    permit_no:'', // 许可证号
                    permit_img:'', // 许可证图片
                    permit_valid_date:'', // 许可证有效期
                },
                rules: {
                    storeName: [{ required: true, message: "请输入门店名称", trigger: "blur" }],
                    envPhoto: [{ required: true, message: "请选择店内环境图片", trigger: "blur" }],
                    doorPhoto: [{ required: true, message: "请选择门脸图", trigger: "blur" }],
                    license_type:[{ required: true, message: "请选择证照类型", trigger: "blur" }],
                    license_no:[{ required: true, message: "请输入注册号", trigger: "blur" }],
                    license_plan:[{ required: true, message: "请输入经营场所", trigger: "blur" }],
                    company_name:[{ required: true, message: "请输入公司名称", trigger: "blur" }],
                    legal_person:[{ required: true, message: "请输入法人姓名", trigger: "blur" }],
                    license_img:[{ required: true, message: "请上传营业执照图片", trigger: "blur" }],
                    license_valid_date:[{ required: true, message: "请输入营业执照有效期", trigger: "blur" }],

                    permit_type:[{required: true, message: "请选择证照类型", trigger: "blur" }],
                    permit_no:[{ required: true, message: "请输入许可证号", trigger: "blur" }],
                    permit_img:[{ required: true, message: "请上传许可证图片", trigger: "blur" }],
                    permit_plan:[{required: true, message: "请输入经营场所", trigger: "blur" }],
                    permit_valid_date:[{ required: true, message: "请输入许可证有效期", trigger: "blur" }],
                },
                licenseTypeList:[{
                    id:1,name:'营业执照'
                },{id:2,name:'事业单位法人证书'},{id:3,name:'民办非企业单位登记证书'},{id:4,name:'社会团体登记证书'},{id:5,name:'双证合一'}]
            }
        },
        methods: {
            submitForm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$message.success('修改成功');
                        this.$router.replace('info');
                    } else {
                        this.$message.error('请检查输入项');
                    }
                });
            },
            goBack(){
                this.$router.replace('info')
            }
        }
    }
</script>

<style lang="scss" scoped>
.modifyShopEdit {
    height: 100%;
    overflow: auto;
    padding-bottom: 56px;
    .header {
        color: #333;
        font-size: 18px;
        font-weight: bold;
        padding: 15px;

        i:hover{
            cursor: pointer;
        }
    }
    .form-container{
        background: #FFF;
        border-radius: 8px;
        margin-bottom: 56px;
        min-width: 1098px;
        padding: 24px;
        width: 100%;
        .main-title{
            font-size: 20px;
            margin: 10px;
        }
        .modify-shop-card{
                background-color: #f9fafd;
                border-radius: 10px;
                column-gap: 20px;
                display: flex;
                margin-bottom: 24px;
                padding: 24px;
                position: relative;
                .left{
                    flex:1;
                    min-width:520px;
                      .sub-title{
                        color: #333;
                        font-family: PingFangSC;
                        font-size: 20px;
                        font-weight: 500;
                        line-height: 30px;
                        margin-bottom: 24px;
                    }
                    .sub-content{
                        margin-top: 10px;
                    }
                }
                .right{
                    flex-shrink:0;
                    width:460px;
                }
            }
    }
    .shop-modify-footer{
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