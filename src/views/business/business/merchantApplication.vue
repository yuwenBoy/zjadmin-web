<template>
    <div class="container">
        <div class="header-title">商家入驻申请</div>
        <el-form ref="form" :model="form" :rules="rules" size="medium" label-width="130px">
        <div class="header-content">
            <div class="title">基本信息</div>
            <div class="itemBox">
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="商家名称" prop="title">
                            <el-input v-model="form.title"  clearable placeholder="请输入商家名称" />
                        </el-form-item>
                    </el-col>
                 </el-row>   
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="联系人姓名" prop="contactName">
                            <el-input v-model="form.contactName"  clearable placeholder="请输入联系人姓名" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系人电话" prop="contactPhone">
                            <el-input v-model="form.contactPhone"  clearable placeholder="请输入联系人电话" />
                        </el-form-item>
                    </el-col>
                 </el-row> 
                 <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="店铺地址" prop="address">
                            <el-input type="textarea" clearable v-model="form.address" placeholder="请输入店铺地址"></el-input>
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
                                <el-input v-model="form.businessLicense"  clearable placeholder="请输入营业执照编号" />
                        </el-form-item>
                    </el-col>  
                </el-row>  
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="食品经营许可证编号" prop="healthLicense">
                                <el-input v-model="form.healthLicense"  clearable placeholder="请输入食品经营许可证编号" />
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
                            <el-input type="textarea" clearable v-model="form.description" placeholder="店铺简介"></el-input>
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
                            <el-input v-model="form.email"  clearable placeholder="请输入联系邮箱" />
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
        <div class="header-footer">
            <el-form-item>
                <el-button type="primary" @click="submitForm('form')">提交入驻申请</el-button>
                <el-button @click="resetForm('form')">重置</el-button>
            </el-form-item>
        </div>
   </el-form>
 </div>
</template>

<script>
import picUpload from "@/components/file"
import { fetchMainCategories } from "@/api/business/businesscategory"
import { create } from "@/api/business/signup";; // 引入接口方法
export default {
  data() {
        // 定义验证规则
    const validateEmail = (rule, value, callback) => {
        if (!value) {
        return callback(new Error('请输入联系邮箱'));
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        return callback(new Error('请输入有效的邮箱地址'));
        } else {
        callback();
        }
    };
    return {
      rules: {
        title: [{ required: true, message: '请输入商家名称', trigger: 'blur' }],
        contactName:[{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
        contactPhone:[{ required: true, message: '请输入联系人电话', trigger: 'blur' }],
        address:[{ required: true, message: '请输入地址', trigger: 'blur' }],
        businessLicense:[{ required: true, message: '请输入营业执照编号', trigger: 'blur' }],
        healthLicense:[{ required: true, message: '请输入食品经营许可证编号', trigger: 'blur' }],
        email:[{ required: true, validator: validateEmail, trigger: 'blur' }],
        categories:[{ required: true, message: '请选择经营范围', trigger: 'blur' }]
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
        categories: []
      },
      categoriesDataList:[]
    }
  },
  created() {
      this.getCategoriesDataList()
  },
  mounted() {
  },
  methods: {
    change(){
        this.$refs.cascader.dropDownVisible = false;
    },
   /** 获取经营范围类目列表 */ 
   async getCategoriesDataList(){
       const {code,message,result,success} = await fetchMainCategories()
       let data = this.handleTree(result,'id','parent_id')
       this.categoriesDataList = data
    },
    submitForm(form) {
          this.$refs[form].validate((valid) =>   {
          if (valid) {
            this.$msg.confirm(`确定提交入驻申请吗？操作后不可恢复`, {
                ok: () => {
                    this.form.categories = this.form.categories.flatMap(item=>item)
                    this.form.logoUrl = this.form.logoUrl && this.form.logoUrl.length > 0 ? this.form.logoUrl[0].location : ''
                   this.form.coverUrl = this.form.coverUrl && this.form.coverUrl.length > 0 ? this.form.coverUrl[0].location : ''
                    create(JSON.stringify(this.form)).then(response => {
                        // 处理响应
                        this.$msg.success('商家入驻申请已提交，请等待平台审核！');
                    }).catch(error => {
                        this.$msg.error('提交失败：'+error.msg);
                    });
                },
            cancel: () => {},
      });
          } else {
            return false;
          }
        });
      },
      resetForm(form) {
        this.$refs[form].resetFields();
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
            .title{text-align: left;}
        }
        .header-footer{
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            background-color: #FFFFFF;

        }
    }
</style>