<template>
    <el-cascader style="width:100%;"
    :key="renderKey"
      v-model="selectedCategories"
      :options="options"
      checkStrictly="true"
      :props="cascaderProps"
      placeholder="请选择分类"
      clearable
      @change="handleChange"
    ></el-cascader>
  </template>
  
  <script>
  import { fetchMainProductCategories, fetchSubProductCategories } from "@/api/business"; // 引入产品类目接口
  export default {
    name: 'CategoryCascader',
    props: {
      value: {
        type: [String,Array],
        default: () =>[]
      },
      urlRequestType:{
        type:Number,
        default:1, // 商家分类
      },
      // 是否多选 默认是
      multiple:{
        type:Boolean,
        default:true,
      }
    },
    data() {
      return {
        selectedCategories:[],
        options: [], // 动态加载的分类选项
        cascaderProps: {
          multiple: this.multiple, 
          lazy: true,
          lazyLoad: this.lazyLoad,
        },
        renderKey:0, // 改变 key，强制重新渲染组件
      };
    },
    mounted(){
        this.$nextTick(() => {
          this.selectedCategories = this.value;
       });
    },
    methods: {
      handleChange(val) {
        this.$emit('input', val);
      },
      async lazyLoad(node, resolve) {
        const { level, value } = node;
        console.log(level)
        if (level ===0) {
          // 获取一级分类
          if(this.urlRequestType == 2){
            const mainCategories = await fetchMainProductCategories();
            console.log(mainCategories);
            resolve(mainCategories.result);
          }
        } else {
          // 获取子分类
          if(this.urlRequestType==2){
                const subCategories = await fetchSubProductCategories(value);
                const formattedSubCategories = subCategories.result.map(item => ({
                    label: item.label, // 确保接口返回的字段是 label 和 value
                    value: item.value,
                    leaf:item.hasChildren,
                }));
                resolve(formattedSubCategories);  
          }
        }
      }
    }, watch: {
    value(newVal) {
        this.selectedCategories = newVal;
        this.renderKey++;
    }
  },
  };
  </script>
  