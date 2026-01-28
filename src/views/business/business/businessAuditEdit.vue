<template>
    <div class="container">
        <el-alert title="管理员审核商家入驻信息" type="warning" description="请仔细核实商家信息，严格审核信息" show-icon></el-alert>
        <el-form ref="form" :model="form" :rules="rules" size="medium" label-width="130px" style="height:300px;overflow-y:auto;">
        <div class="header-content">
            <div class="title">基本信息</div>
            <div class="itemBox">
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="商家名称" prop="title">
                            <el-input v-model="form.title" readonly placeholder="请输入商家名称" />
                        </el-form-item>
                    </el-col>
                 </el-row>   
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="联系人姓名" prop="contactName">
                            <el-input v-model="form.contactName"  readonly placeholder="请输入联系人姓名" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系人电话" prop="contactPhone">
                            <el-input v-model="form.contactPhone"  readonly placeholder="请输入联系人电话" />
                        </el-form-item>
                    </el-col>
                 </el-row> 
                 <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="店铺地址" prop="address">
                            <el-input type="textarea" readonly v-model="form.address" placeholder="请输入店铺地址"></el-input>
                        </el-form-item>
                    </el-col>
                 </el-row>     
            </div>
        </div>
        <div class="header-content">
            <div class="title">资质信息</div>
            <div class="itemBox">
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="营业执照编号" prop="businessLicense">
                                <el-input v-model="form.businessLicense"  readonly placeholder="请输入营业执照编号" />
                        </el-form-item>
                    </el-col>  
                </el-row>  
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="食品经营许可证编号" prop="healthLicense">
                                <el-input v-model="form.healthLicense"  readonly placeholder="请输入食品经营许可证编号" />
                        </el-form-item>
                    </el-col>  
                </el-row>  
            </div>
        </div>
        <div class="header-content">
            <div class="title">店铺信息</div>
            <div class="itemBox">
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="店铺Logo">
                            <pic-upload v-model="form.logoUrl" style="width: 500px" />
                        </el-form-item>
                    </el-col>  
                </el-row>  
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="店铺封面图片">
                            <pic-upload v-model="form.coverUrl" style="width: 500px" />
                        </el-form-item>
                    </el-col>  
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="店铺简介">
                            <el-input type="textarea" readonly v-model="form.description" placeholder="店铺简介"></el-input>
                        </el-form-item>
                    </el-col>
                 </el-row>  
            </div>
        </div>
        <div class="header-content">
            <div class="title">联系信息</div>
            <div class="itemBox">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="联系邮箱" prop="email">
                            <el-input v-model="form.email"  readonly placeholder="请输入联系邮箱" />
                        </el-form-item>
                    </el-col>
                 </el-row>
            </div>       
        </div>
        <div class="header-content">
            <div class="title">经营范围信息</div>
            <div class="itemBox">
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="经营范围" prop="categories">
                              <el-cascader ref="cascader" placeholder="请选择经营范围" style="width:100%" :props="{multiple: true,checkStrictly: true}" collapse-tags v-model="form.categories" :options="categoriesDataList" @change="change" filterable clearable>
                                    <template slot-scope="{ node, data }">
                                        <span>{{ data.label }}</span>
                                        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                                    </template>
                                </el-cascader>
                        </el-form-item>
                    </el-col>
                 </el-row>
               
            </div>
        </div>
        <div class="header-content">
            <div class="title">审核信息</div>
            <div class="itemBox">
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="审核意见" prop="status">
                            <el-select v-model="form.status" clear placeholder="请选择审核意见" @change="change">
                                <el-option label="同意" value="1"></el-option>
                                <el-option label="拒绝" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                 </el-row>
                 <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="拒绝原因">
                            <el-input type="textarea"  v-model="form.reason" placeholder="请输入拒绝原因"></el-input>
                        </el-form-item>
                    </el-col>
                 </el-row>  
            </div>
        </div>
        <div class="header-footer">
            <el-form-item>
                <el-button type="primary" @click="submitForm('form')" :disabled="this.$route.query.options==1">确定</el-button>
                <el-button @click="resetForm('form')">关闭</el-button>
            </el-form-item>
        </div>
   </el-form>
 </div>
</template>

<script>
import picUpload from "@/components/file";
import { fetchMainCategories } from "@/api/business/businesscategory"
import { apply } from "@/api/business/signup";; // 引入接口方法
export default {
  data() {
    return {
      rules: {
        title: [{ required: true, message: '请输入商家名称', trigger: 'blur' }],
        contactName:[{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
        contactPhone:[{ required: true, message: '请输入联系人电话', trigger: 'blur' }],
        address:[{ required: true, message: '请输入地址', trigger: 'blur' }],
        businessLicense:[{ required: true, message: '请输入营业执照编号', trigger: 'blur' }],
        healthLicense:[{ required: true, message: '请输入食品经营许可证编号', trigger: 'blur' }],
        email:[{ required: true, message: '请输入商家邮箱', trigger: 'blur' }],
        categories:[{ required: true, message: '请选择经营范围', trigger: 'blur' }],
        status:[{ required: true, message: '请选择审核意见', trigger: 'blur' }],
      },
      form: {
        title:'',
        contactPhone:'',
        contactName:'',
        address:'',
        description:'',
        email:'', // 商家邮箱
        coverUrl:'',
        logoUrl:'',
        businessLicense:'',
        healthLicense:'',
        description:'',
        categories: [],
        status:'',
      },
      categoriesDataList:[],
      audit:{
        id:'',
        reason:'',
        status:'',
      },
    }
  },
  computed: {
    
  },
  created(){
    this.form = {...this.$route.query,...this.$route.query.business,categories:this.$route.query.businessCategoryRelation.map(t=>t.categoryId)};
    this.audit.id = this.$route.query.id;
    this.audit.reason = this.form.reason;
    this.audit.status = this.form.status;
    console.log(this.form)
    this.form.status = '';
    this.getCategoriesDataList()
  },
  mounted() {
  },
  methods: {
     /** 获取经营范围类目列表 */ 
   async getCategoriesDataList(){
       const {code,message,result,success} = await fetchMainCategories()
       let data = this.handleTree(result,'id','parent_id')
       this.categoriesDataList = data
    },
     change(){
        this.$refs.cascader.dropDownVisible = false;
    },
    submitForm(form) {
          this.$refs[form].validate((valid) =>   {
          if (valid) {
                this.$msg.confirm(`确定审核吗？操作后不可恢复`, {
                    ok: () => {
                        console.log(this.form);
                        if(this.form.status==2){
                           if(!this.form.reason){
                                this.$msg.alert('请选择拒绝原因');
                                return false;
                           }
                        }

                        this.audit.status = this.form.status;
                        this.audit.reason = this.form.reason;
                        
                        apply(JSON.stringify(this.audit)).then(response => {
                            this.$msg.success('操作成功');
                            this.$store.dispatch('tagsView/delView', this.$route).then(() => {
                                    // 关闭标签页后的逻辑，如导航到上一页
                                this.$router.go(-1);
                            });
                        }).catch(error => {
                            // 处理错误
                            console.error('Error submitting form:', error);
                        });
                    },
                    cancel: () => {},
                });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(form) {
        this.$refs[form].resetFields();
        // this.$router.back();
        // this.$router.replace({ name: 'businessAuditList' });
        this.$store.dispatch('tagsView/delView', this.$route).then(() => {
             // 关闭标签页后的逻辑，如导航到上一页
           this.$router.go(-1);
        });
      },
  },
  components: { picUpload },
}
</script>

<style rel="stylesheet/scss" lang="scss">
    .container{
        margin: 15px;
        .header-title{
            font-weight: 400;
            font-size: 16px;
            color: #333333;
            background-color: #FFFFFF;
            padding: 15px;
            border-radius: 7px;
            .title{text-align: left;}
        }
        .header-content{
            background-color: #FFFFFF;
            border-radius: 7px;
            margin-top: 10px;
            .itemBox {
               padding: 15px;
            }
        }
        .header-footer{
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            background-color: #FFFFFF;

        }
    }
</style>