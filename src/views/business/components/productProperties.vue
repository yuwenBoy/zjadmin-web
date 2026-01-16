<template>
    <div class="productPropertiesContainer">
            <el-row :gutter="24" class="propertiesTitle" v-show="form.properties.length>0">
                <el-col :span="6"><label>
                    <span style="color: red;">*</span>属性组名称</label>
                </el-col>
                <el-col :span="18"><label>
                    <span style="color: red;">*</span>选项</label>
                </el-col>
            </el-row>
            <el-row :gutter="24" class="propertiesList" v-for="(item,index) in form.properties" :key="index">
                <el-col :span="6">
                     <el-form-item :prop="`properties.${index}.name`" :rules="rules[`properties.${index}.name`]" class="label-top">
                           <el-input v-model="item.name" size="small" clearable placeholder="如：辣度"/>
                     </el-form-item>
                </el-col>
                <el-col :span="8" :offset="cIndex>=2 && cIndex % 2 ===0 ? 6:0" v-for="(cItem,cIndex) in item.details" :key="cIndex">
                      <el-form-item class="label-top" :prop="`properties.${index}.details.${cIndex}.name`" :rules="rules[`properties.${index}.details.${cIndex}.name`]">
                            <el-input v-model="cItem.name" size="small" placeholder="如：不辣">
                                   <template #suffix>  
                                        <el-icon class="cust-icon-remove el-icon-circle-close"  @click.native="deleteSpeaAttrOption(index,cIndex)" />  
                                   </template> 
                                   <el-select v-model="cItem.saleStatus" slot="append"  :popper-append-to-body="false" placeholder="请选择">
                                           <el-option label="在售" :value="1"></el-option>
                                           <el-option label="停售" :value="2"></el-option>
                                   </el-select>
                            </el-input>
                     </el-form-item>
                </el-col>
                <el-col :span="8" :offset="form.properties[index].details.length >=2 && form.properties[index].details.length % 2===0 ? 6:0">
                        <el-form-item class="label-top" :prop="`properties.${index}.details`" :rules="rules[`properties.${index}.details`]">
                             <el-button icon="el-icon-plus" size="small"  style="width:100%;" @click="addProductAttrOption(index)">添加选项</el-button>
                        </el-form-item>
                </el-col>
                <el-col :span="1" v-if="form.properties.length>0">
                        <el-form-item class="label-top">
                            <el-popconfirm confirm-button-text='确认删除' cancel-button-text='取消'
                                                    icon="el-icon-info"
                                                    cancel-button-type="Button"
                                                    confirm-button-type="danger"
                                                    title="确认删除此属性组吗？"
                                                    @confirm="deleteProperties(index)"
                                                    >
                                                    <el-link :underline="false" slot="reference" icon="el-icon-delete"></el-link>
                            </el-popconfirm>
                        </el-form-item>
                 </el-col>
             </el-row>  
             <el-popover width="300" :offset="110" trigger="click" placement="bottom" :visible-arrow="false" v-model="isPopoverVisible">
                    <div class="propertiesContent">
                        <el-autocomplete v-model="state2" clearable style="width: 100%;" ref="autoFocusInput"
                                            :fetch-suggestions="querySearch"
                                            @select="handleSelect"
                                            placeholder="搜索属性组名称或选项"
                                            :trigger-on-focus="false"
                                            >
                                            <i slot="suffix" class="el-input__icon el-icon-search"></i>
                                            </el-autocomplete>
                                            <div class="properites">
                                                <div class="properitesItem" v-for="(item,index) in storePropertiesList" :key="item.id" @click="autoAddSpeaAttr(item,index)">
                                                {{ item.name }}
                                                <div class="properitesItemDetails"><span>{{item.details.map(t=>t.name).toString().replace(',','、')}}</span></div>
                                                </div>
                                            </div>
                                            <footer style="padding: 8px 0;border-top:1px solid #e0e0e0">
                                                <el-link type="primary" :underline="false" icon="el-icon-circle-plus-outline" @click="addProperties">手动新建</el-link>
                                            </footer>
                                        </div>
                                        <el-link type="primary" slot="reference" style="margin-left:10px" :underline="false" icon="el-icon-circle-plus-outline">添加属性</el-link><span style="color:#666;" slot="reference">如：不辣，微辣</span>
                        </el-popover>                         
    </div>
</template>
<script>
import { fetchProperties } from "@/api/business/product"; // 引入接口方法
import { hasDuplicateProperty } from '@/utils'
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
          rules:{},
          storePropertiesList:[],
          isPopoverVisible:false,
          state2: '',
       }
    },  
    mounted(){
        this.getStorePropertiesList();
        this.generateRules();
    },
    methods: {
     /**
     * 获取商家门店所属属性
     */
    async getStorePropertiesList(){
        const data = await fetchProperties();
        this.storePropertiesList = data.result;
    },
     generateRules() {
      this.form.properties.forEach((item, index) => {
        // 验证 properties.name 不重复
        this.rules[`properties.${index}.name`] = [
          { required: true, message: '名称不得为空，请输入', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              const names = this.form.properties.map(prop => prop.name);
              if (names.filter(name => name === value).length > 1) {
                callback(new Error('属性组名称不能重复'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ];

        // 验证每个 properties 至少有一个 details 选项被填写
        this.rules[`properties.${index}.details`] = [
          {
            validator: (rule, value, callback) => {
              const filledDetails = item.details.filter(detail => detail.name.trim() !== '');
              if (filledDetails.length === 0) {
                callback(new Error('至少需要填写一个选项'));
              } else {
                if (hasDuplicateProperty(filledDetails,'name')) {
                    callback(new Error('选项名称不能重复'));
                }else{
                    callback();
                }
              }
            },
            trigger: 'blur'
          }
        ];

        // 验证 details.name 不为空
        item.details.forEach((_, cIndex) => {
          this.rules[`properties.${index}.details.${cIndex}.name`] = [
            { required: true, message: '选项不得为空，请输入', trigger: 'blur' }
          ];
        });
      });
    },  
    // 添加规格属性组选项
    addProductAttrOption(index,cIndex){
        this.$emit('addPropertiesOption',index);
    },

    // 删除规格属性组选项
    deleteSpeaAttrOption(index,cIndex){
        this.$emit('deletePropertiesOption',index,cIndex);
    },

    // 新增规格属性组
    addProperties(){
        this.isPopoverVisible = false;
        this.$emit('addProperties')
    },

    // 删除规格属性组
    deleteProperties(index){
        this.$emit('deleteProperties', index)
    },

    // 自动填充属性组信息
    autoAddSpeaAttr(item){
        this.$emit('autoAddProperties',item)
        this.isPopoverVisible =false;
    },
    querySearch(queryString, cb) {
      console.log(queryString);
      var restaurants = this.storePropertiesList;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      console.log(results);
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return restaurant.name.toLowerCase().includes(queryString.toLowerCase()) || restaurant.details.some(t=>t.name == queryString);
      };
    },
    // 搜索选中
    handleSelect(item){
        this.autoAddSpeaAttr(item);
    },
    },
    watch: {
    'form.properties': {
      deep: true,
      handler() {
        this.generateRules();
      }
    },
  },
  };
  </script>
  
  <style lang="scss">
  .productPropertiesContainer{width: 100%;margin-bottom: 15px;font-size: 14px;color: #333;
    .el-form-item__content{margin-left: 0 !important;}
    .propertiesTitle{width: 100%;margin-bottom: 10px;font-size: 14px;color: #333;padding-left: 10px;}
    .propertiesList{
                 padding: 10px 0;
                 width: 100%;
                 margin:0px !important;
                 .el-input__suffix{z-index: 100 !important;}
                .cust-icon-remove{display: none !important; right: -90px !important;top: -10px !important;display: inline-block;position: absolute; font-size: 16px;cursor: pointer;}
                .cust-icon-remove:hover{color: red;}
                .el-form-item__content .el-input-group:hover .cust-icon-remove{display: block !important;}
                .el-input-group__append, .el-input-group__prepend {
                      width: 75px !important;
                      color:#333;
                }
                .el-form-item{margin-bottom: 12px !important;}
              
    }
    .propertiesList:hover{
        background-color: rgb(236, 238, 242);
    }
   
  }
  .propertiesContent{
      .properites{
        height: 150px;
        overflow-y: auto;
        .properitesItem{
            height: 54px;
            color: #333;
            padding-left: 10px;
            padding-top: 10px;
            .properitesItemDetails{
                color:#999;
                font-size:12px;
              
            }
        };
        .properitesItem:hover{
            background-color: #eee;
        }
      }
    }
  </style>