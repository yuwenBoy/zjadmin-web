<template>
  <el-card>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      size="small"
      label-position="top"
      label-width="80px"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="分类名称" prop="level_id">
            <el-cascader :data="treeEntity"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input
              clearable
              placeholder="请输入商品名称"
              v-model.trim="ruleForm.goods_name"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="商品图片">
            <pic-upload v-model="ruleForm.goods_pic" style="width: 500px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-form-item label="所属品牌" prop="brand_id">
          <el-select v-model="ruleForm.brand_id" placeholder="请选择" clearable>
            <el-option />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="商品描述" prop="goods_desc">
            <el-input type="textarea" v-model="ruleForm.goods_desc"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="商品详情" prop="goods_detail">
            <quill-editor
              ref="myQuillEditor"
              v-model="ruleForm.goods_detail"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @ready="onEditorReady($event)"
              @change="onEditorChange($event)"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" style="text-align: center">
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button>关闭</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-card>
</template>
<script>
import ElCascader from "@/components/el-cascader/el-cascader.vue";
import picUpload from "@/components/pic-upload";
import { quillEditor } from "vue-quill-editor";
import { getCategoryAll } from "@/api/shop/category";
import { arrayToTree } from '@/utils';
export default {
  components: {
    ElCascader,
    picUpload,
    quillEditor,
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        goods_name: "",
        brand_id: 0,
        level_id: 0,
        goods_pic: "",
        goods_desc: "",
        goods_detail: "",
      },
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        goods_desc: [
          { required: true, message: "请输入商品描述", trigger: "blur" },
        ],
        goods_detail: [
          { required: true, message: "请输入商品", t详情rigger: "blur" },
        ],
        level_id: [
          {
            required: true,
            message: "请输入商品名称选择分类",
            trigger: "blur",
          },
        ],
      },
      editorOption: {},
      treeEntity:[],
    };
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
  },
  mounted(){
    // 加载分类数据
    this.getTreeAllApi();
  },
  methods: {
    onEditorBlur(quiller) {},
    onEditorFocus(quiller) {},
    onEditorReady(quiiler) {},
    onEditorChange(quiiler) {},
    
    async getTreeAllApi() {
      let response_data = {};
      response_data = await getCategoryAll();
      response_data.result.forEach(item=>{
        item.value = item.id;
      })
      this.treeEntity = arrayToTree(response_data.result,0);
      console.log(this.treeEntity);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>