<template>
    <div class="productSpecContrainer">
      <el-row :gutter="24" class="titleHeader">
        <el-col :span="7" v-if="form.product_spea.length > 1">
          <label><span style="color: red;">*</span>份量名称</label>
        </el-col>
        <el-col :span="8">
          <label><span style="color: red;">*</span>份量</label>
        </el-col>
        <el-col :span="7">
          <label><span style="color: red;">*</span>价格</label>
        </el-col>
      </el-row>
      <el-row :gutter="24" v-for="(item, index) in form.product_spea"  :key="index" class="specList">
        <el-col :span="7" v-if="form.product_spea.length > 1">
          <el-form-item :prop="`product_spea.${index}.name`" :rules="rules[`product_spea.${index}.name`]" class="label-top">
            <el-input size="small" v-model="item.name" clearable placeholder="如大份" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :prop="`product_spea.${index}.weight`" :rules="rules[`product_spea.${index}.weight`]" class="label-top">
            <el-input type="number" min="1" size="small" v-model="item.weight" clearable placeholder="请输入">
              <div slot="prefix" style="margin-top:7px;" v-if="item.unitInfo.values[0] == 1">
                约
              </div>
              <el-cascader
                :ref="'SelectCascader' + index"
                slot="append"
                :popper-append-to-body="false"
                size="small"
                v-model="item.unitInfo.values"
                :options="options"
                :show-all-levels="false"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange(item, $event)"
              ></el-cascader>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
            :prop="`product_spea.${index}.price`"
            :rules="rules[`product_spea.${index}.price`]"
            class="label-top"
          >
            <el-input
              size="small"
              type="number"
              min="0"
              clearable
              placeholder="请输入"
              v-model="item.price"
            >
              <span slot="prefix" style="margin-left:5px">¥</span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2" v-if="form.product_spea.length > 1">
          <el-form-item class="label-top">
            <el-popconfirm
              confirm-button-text="确认删除"
              cancel-button-text="取消"
              icon="el-icon-info"
              cancel-button-type="Button"
              confirm-button-type="danger"
              title="确认删除此份量规格吗？"
              @confirm="handleConfirm(index)"
            >
              <el-link :underline="false" slot="reference" icon="el-icon-delete"></el-link>
            </el-popconfirm>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="padding-left:10px;">
        <el-link type="primary" :underline="false" icon="el-icon-circle-plus-outline" @click="addSpec">添加份量</el-link>
        <span style="color:#666;font-size:14px;">如：大份18¥，小份15¥</span>
      </div>
    </div>
  </template>
  <script>
  import product from '@/api/mock/product.js'
  export default {
    name: "ProductSpea",
    props: {
      form: {
        type: Object,
        required: true,
      },
    },
    data(){
       return {
          options: product.ProductData.quantityUnit(),
          rules:{},
       }
    },  
    mounted(){
        this.generateRules();
    },
    methods: {
        /**
     * 验证份量规格
     */
     generateRules() {
      const rules = {};
      this.form.product_spea.forEach((_, index) => {
        rules[`product_spea.${index}.name`] = [{ required: true, message: "请输入份量名称" },  {
            validator: (rule, value, callback) => {
              const names = this.form.product_spea.map(prop => prop.name);
              if (names.filter(name => name === value).length > 1) {
                callback(new Error('份量名称不能重复'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }];
        rules[`product_spea.${index}.weight`] = [{ required: true, message: "请输入份量" }];
        rules[`product_spea.${index}.price`] = [{ required: true, message: "请输入价格" }];
      });
      this.rules = rules;
    },  
    findNodeByValue(options, value) {
      for (const option of options) {
        if (option.value === value) {
          return option;
        }
        if (option.children) {
          const result = this.findNodeByValue(option.children, value);
          if (result) {
            return result;
          }
        }
      }
      return null;
  },
      handleChange(item, value) {
        item.weight = '';
        const labels = value.map(value => {
            const node = this.findNodeByValue(this.options, value);
            return node ? node.label : '';
          });
        if(value[0]==3){
          item.weight = labels[1].replace('人份','');
        }
        item.unitInfo.name= labels[1];
        console.log(item)
      },
      handleConfirm(index) {
        this.$emit("deleteSpec", index);
      },
      addSpec() {
        this.$emit("addSpec");
      },  
    },
    watch: {
    'form.product_spea': {
      deep: true,
      handler() {
        this.generateRules();
      }
    },
  },
  };
  </script>
  
  <style lang="scss">
  .productSpecContrainer{width: 100%;margin-bottom: 15px;font-size: 14px;color: #333;
  .titleHeader{
    margin-bottom:10px;
    padding: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 I !important;
  }
  .specList{
    margin: 0 !important;
    padding:10px 0;
    width: 100%;
  }
  .specList:hover{
     background-color: rgb(236, 238, 242);
  }
  .el-form-item__content{margin-left: 0 !important;}
  .el-input__prefix{
                    left:10px !important;
                    color:#333;
                }
                .el-input-group__append {
                      min-width: 80px !important;
                      color:#333;
                      padding: 0;
               }
               .el-cascader .el-input .el-input__inner{background-color: #f5f7fa !important;padding-left: 10px;padding-right:20px;text-align:left;}
  }
  </style>
  