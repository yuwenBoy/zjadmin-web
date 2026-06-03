<template>
<div ref="container" style="height:calc(100vh - 150px);overflow-y:auto;overflow-x:hidden;box-sizing: border-box;">
   <div class="container-form" style="box-sizing:border-box;width:73%;margin-left:15px;">
       <el-page-header class="cusomter-header" @back="$router.replace('index')" :content="form.id>0 ? '编辑商品':'手动录菜'"></el-page-header>
        <div class="sticky-tabs">
                <!-- Tabs 组件 -->
                <el-tabs v-model="activeTab" @tab-click="handleTabClick" style="background-color: #ffffff; ">
                    <el-tab-pane label="基础信息" name="tab1"></el-tab-pane>
                    <el-tab-pane label="详细信息" name="tab2"></el-tab-pane>
                    <el-tab-pane label="售卖信息" name="tab3"></el-tab-pane>
                    <el-tab-pane label="高级设置" name="tab4"></el-tab-pane>
                </el-tabs>
        </div>
    <el-form ref="form" :model="form" :rules="dynamicRules" size="medium" label-width="85px" style="margin-top:15px;">
            <!-- 页面内容 -->
            <div class="headerTitle">基础信息</div>
                <div ref="content1" class="content">
                    <el-form-item label="商品名称" prop="productName" style="width:65%">
                           <el-input v-model="form.productName"  clearable placeholder="请输入商品名称" />
                    </el-form-item>
                    <el-form-item label="菜单分组" prop="groupId" style="width:65%">
                          <el-select v-model="form.groupId" placeholder="请选择" clearable style="width: 100%;">
                                <el-option v-for="item in productGroupList" :key="item.id" :label="item.name" :value="item.id"/>
                          </el-select>
                    </el-form-item>
                    <el-form-item label="商品类目" prop="categories" style="width:65%">
                        <el-cascader v-model="form.categories" ref="categoryCascader" style="width:100%;" :options="productCategoryList" :props="{ expandTrigger: 'hover' }" @change="handerCategory"></el-cascader>
                    </el-form-item>
                    <el-form-item label="封面">
                         <pic-upload v-model="form.imageUrl" :maxUploadCount="5" />
                    </el-form-item>        
                </div>
            <div class="headerTitle">详细信息</div>
                <div ref="content2" class="content productDescInfo">
                    <el-row :gutter="24">
                        <el-col :span="2">
                            <div class="desc-text">
                                <label class="cusomte-label"><span style="color: red;">*</span> 详情</label>
                            </div>
                        </el-col>
                        <el-col :span="22" style="margin-left:0">
                           <div class="desc-text">准确填写有助于商品在搜索和推荐中露出，标❤的项可提升曝光及订单转化率详情</div>
                              <div class="itemContrainer">
                                     <div class="dynamic-attrs-wrapper" style="padding:0 15px;">
                                       <div class="attr-item-box" v-for="(item,index) in form.dynamicAttributeList" :key="`${item.attributeId || 'attr'}-${index}`">
                                         <!-- 文本 -->
                                        <el-form-item v-if="parseInt(item.attributeType) === 1" :label="item.attributeName" :prop="`dynamicAttributeList.${index}.attributeValue`">
                                            <el-input size="small" clearable :placeholder="item.description" v-model="item.attributeValue" />
                                        </el-form-item>
                                        <!-- 级联 -->
                                        <el-form-item v-else-if="parseInt(item.attributeType) === 2" :label="item.attributeName" :prop="`dynamicAttributeList.${index}.attributeValue`">
                                            <el-cascader size="small" :options="item.values" :show-all-levels="false" v-model="item.attributeValue" :props="{ expandTrigger: 'hover',value: 'id' }" style="width:100%"/>
                                        </el-form-item>
                                        <!-- 下拉 -->
                                        <el-form-item v-else-if="parseInt(item.attributeType) === 3" :label="item.attributeName" :prop="`dynamicAttributeList.${index}.attributeValue`">
                                            <el-select size="small" :placeholder="'如：'+item.values[0].value" clearable style="width: 100%;" v-model="item.attributeValue">
                                                <el-option v-for="cItem in item.values" :key="cItem.id" :label="cItem.value" :value="cItem.id"/>
                                            </el-select>
                                        </el-form-item>
                                        <!-- 多选 -->
                                        <el-form-item v-else-if="parseInt(item.attributeType) === 4" :label="item.attributeName" :prop="`dynamicAttributeList.${index}.attributeValue`">
                                            <el-select placeholder="请选择" size="small" multiple clearable style="width: 100%;" v-model="item.attributeValue" >
                                                <el-option  v-for="cItem in item.values" :key="cItem.id" :label="cItem.value" :value="cItem.id" />
                                            </el-select>
                                        </el-form-item>
                                       </div>
                                     </div>
                                </div>
                            </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="2">
                            <div class="desc-text">
                                <label class="cusomte-label">描述</label>
                            </div>
                        </el-col>
                        <el-col :span="12">
                          <el-input v-model="form.description" minlength="5" maxlength="450" show-word-limit clearable placeholder="限5-450字" rows="4" type="textarea"></el-input>
                        </el-col>
                    </el-row>
                    </div>
                    <div class="headerTitle">售卖信息</div>
                    <div ref="content3" class="content saleContrainer">
                        <el-row :gutter="24" class="speaInfo">
                            <el-col :span="3">
                                <div class="desc-text">
                                    <label style="font-size:14px;padding-left:10px;color: #333;"><span style="color: red;">*</span> 份量</label>
                                </div>
                            </el-col>
                            <el-col :span="21">
                                <div style="margin-bottom: 10px;color:#999;font-size:14px;">
                                    建议参考相近客单价同行定价，并填写加工后的实际份量，避免投诉
                                </div>
                                <div class="itemContrainer">
                                      <!-- 份量规格组件 -->
                                     <product-spec :form="form"  @addSpec="addSpec" @deleteSpec="deleteSpec"></product-spec>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="24" class="stockInfo">
                        <el-col :span="3">
                                <div class="desc-text">
                                    <label style="font-size:14px;color: #333;">
                                        <span style="color: red;">*</span>库存打包费
                                    </label>
                                </div>
                            </el-col>
                            <el-col :span="21">
                                <div style="margin-bottom: 10px;color:#999;font-size:14px;">
                                    打包尽心，费用实在，让顾客放心下单
                                </div>
                                <div class="itemContrainer">
                                    <el-row :gutter="24" class="product-spea-title">
                                        <el-col :span="8" v-if="form.product_spea.length>1">
                                            <label><span style="color: red;">*</span>份量名称</label>
                                        </el-col>
                                        <el-col :span="8">
                                            <label><span style="color: red;">*</span>打包费</label>
                                        </el-col>
                                        <el-col :span="5">
                                            <label><span style="color: red;">*</span>库存</label>
                                        </el-col>
                                        <el-col :span="3" v-if="form.product_spea.length>1">
                                            <el-link :underline="false" icon="el-icon-setting">统一设置</el-link>
                                        </el-col>
                                    </el-row>
                                        <el-tooltip class="item" effect="dark" content="请先在上面为此份量命名" placement="top-start"  v-for="(item,index) in form.product_spea" :key="index">
                                    <el-row :gutter="24" class="specList">
                                        <el-col :span="8" v-if="form.product_spea.length>1">
                                            <el-form-item :prop="`product_spea.${index}.name`" :rules="rules[`product_spea.${index}.name`]" class="label-top">
                                                <el-input size="small" v-model="item.name" disabled  clearable placeholder="待命名" />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item :prop="`product_spea.${index}.packingPrice`" :rules="rules[`product_spea.${index}.packingPrice`]" class="label-top">
                                                <el-input size="small" v-model="item.packingPrice"  clearable placeholder="请输入">
                                                    <template #prefix>
                                                        <span>¥</span>
                                                    </template>
                                                    <el-select v-model="item.unitInfo.number" slot="append"  :popper-append-to-body="false" placeholder="请选择">
                                                        <el-option label="每1份" value="1"></el-option>
                                                    </el-select>
                                                </el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item :prop="`product_spea.${index}.stock`" :rules="rules[`product_spea.${index}.stock`]" class="label-top">
                                                <el-input size="small" clearable placeholder="请输入" v-model="item.stock"  />
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
    </el-tooltip>

                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="24" class="productAttributeInfo">
                        <el-col :span="3">
                                <div class="desc-text">
                                    <label style="font-size:14px;padding-left:10px;color: #333;">属性</label>
                                </div>
                            </el-col>
                            <el-col :span="21">
                                <div :class="form.properties.length>0 ? 'itemContrainer':'itemEmptyData'">
                                   <!-- 规格属性组件 -->
                                   <product-properties :form="form"  @addProperties="addProperties" @deleteProperties="deleteProperties" @addPropertiesOption="addPropertiesOption" @deletePropertiesOption="deletePropertiesOption" @autoAddProperties="autoAddProperties"></product-properties>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="headerTitle">高级设置</div>
                    <div ref="content4" class="content last-content">
                        <!-- <h3 class="headerTitle">高级设置</h3> -->
                        <div style="margin-bottom:0px;">
                            ddddd
                        </div>
                    </div>
    </el-form>
    <footer class="xin-footer footer-fixed-button" :class="form.id>0  && routeTitle=== '编辑产品' ?'flex':''">
            <div v-show="form.id>0 && routeTitle=== '编辑产品'">
                <el-button plain size="medium">删除</el-button>
            </div> 
            <div>
                <el-button plain size="medium" @click="goBack">取消</el-button>
                <el-button plain size="medium" @click="previewSpeacDialog=true">预览</el-button>
                <el-button plain size="medium" :autofocus="true" @click="submitForm('form',2)" v-show="!productId">发布并继续新建</el-button>
                <el-button size="medium" type="primary" @click="submitForm('form',1)" :disabled="this.$route.query.options==1">{{!productId ? '发布':'保存'}}</el-button>
            </div> 
    </footer>
 </div>
   <!-- 商品预览详情页 -->
       <my-dialog append-to-body :close-on-click-modal="false" :visible.sync="previewSpeacDialog" @close="previewSpeacDialog=false"
            title="预览" width="50%" custom-class="xin-dialog">
            <template #content>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-card class="box-card previewProductInfo">
                            <div slot="header" class="clearfix desc-text" style="text-align: center;">
                                <span>商品详情页</span>
                            </div>
                            <div>
                                <div class="product_name" style="padding: 15px 0;">{{form.productName}}</div>
                                <div class="price flex" style="padding: 15px 0;">
                                    <span style="color: red;font-size:12px;">¥{{form.product_spea.length>1?Math.min(...form.product_spea.map(t=>t.price)) : form.product_spea[0].price}}<span style="font-size:14px;" v-show="form.product_spea.length>1">起</span> </span>
                                    <el-button size="mini" type="primary" round icon="el-icon-plus">加入购物车</el-button>
                                </div>
                                <div class="product_desc">商品详情</div>
                                <div class="description"><span class="text">商品描述：</span><span class="value">{{form.description || '---'}}</span></div>
                                <div class="description" v-for="(item,index) in form.dynamicAttributeList" :key="index">
                                    <div v-if="item.attributeValue">
                                        <span class="text">{{item.attributeName}}：</span>
                                        <span class="value" v-if="item.attributeType==1">{{item.attributeValue}}</span>
                                        <span class="value" v-else-if="item.attributeValue.length>0 && item.attributeType==2">{{ item.attributeValue }}</span>
                                        <span class="value" v-else-if="item.attributeType==3">{{item.values.find(t=>t.id ==item.attributeValue).value}}</span>
                                        <span class="value" v-else-if="item.attributeValue.length>0 && item.attributeType==4">{{ item.values.filter(t=>item.attributeValue.includes(t.id)).map(h=>h.value).toString() }}</span>
                                    </div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="12" v-if="form.product_spea.length>1">
                        <el-card class="box-card previewSpea">
                            <div slot="header" class="clearfix text-color" style="text-align: center;">
                                <span>选规格弹窗</span>
                            </div>
                            <div style="margin-top:150px;height:350px;background-color:#ffffff;padding:10px;border-radius:5px;">
                                <div class="list-item">{{form.productName}}</div>
                                <div class="list-item"><label style="color:#999">已选:{{form.product_spea[preViewActived].name}}{{form.product_spea[preViewActived].price}}</label></div>
                                <div class="list-item"><label style="color:red">¥{{form.product_spea[preViewActived].price}}</label></div>
                                <div class="list-item">
                                    <div style="color:#333">份量:</div>
                                </div>
                                <div class="list-item">
                                    <div class="list-item-spea" v-for="(item,index) in form.product_spea" :key="index" @click="preViewSpeaClick(index)" :class="preViewActived===index?'actived-spea':''"> 
                                        {{ item.name }} ¥{{ item.price }}
                                    </div>
                                </div>
                                <div class="list-item" v-for="(item,index) in form.properties" :key="index">
                                    <div style="color:#333">{{item.name}}:</div>
                                    <div class="list-item-spea" v-for="(cItem,cIndex) in item.details" :key="cIndex"> 
                                        {{ cItem.name }}
                                    </div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </template>
            <!-- 底部操作按钮 -->
            <template #footer>
                <slot name="footer">
                       <span></span>
                </slot>
            </template>
    </my-dialog>
</div> 
</template>

<script>
import picUpload from "@/components/file";
import {fetchProductGroup} from "@/api/business/index";
import { create,detail } from "@/api/business/product";; // 引入接口方法
import {getDynamicAttributeByCategoryId} from "@/api/system/dynamicAttribute";
import MyDialog from '@/components/my-dialog';
import CustomPopconfirm from '@/components/CustomPopconfirm';
import product from '@/api/mock/product.js'
import ProductSpec from '@/views/business/components/productSpec.vue';
import productProperties from '@/views/business/components/productProperties.vue';
import { fetchMainProductCategories } from "@/api/business";
export default {
  data() {
    return {
      routeTitle: '', // 动态标题
      rules: {
        productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        groupId:[{ required: true, message: '请选择菜单分组', trigger: 'blur' }],
        categories:[{ required: true, message: '请选择商品类目', trigger: 'blur' }],
      },
      options: product.ProductData.quantityUnit(),
      form: {
        id:null,
        productName:'',
        groupId:0,
        categories: [],
        imageUrl:[],
        description:'',
        dynamicAttributeList:[], // 商品详情属性
        product_spea:[{weight:"",name:"",price:'',unitInfo:{number:"1",values:['1','101'],name:'克'},
        packingPrice:0,
        stock:10000
       }], // 产品规格
        properties:[], // 产品售卖属性设置
      },
      productGroupList:[],
      activeTab: 'tab1', // 当前激活的标签
      previewSpeacDialog:false,
      ticking:false,
      preViewActived:0, // 多规格切换 默认价格最小的选中
      submitType:1, // 发布
      productId:null,
      newProductDynamic:[],
      state2: '',
      // 产品类目list
      productCategoryList:[],
    }
  },
computed: {
   dynamicRules(){
            const rules = {};
            if(this.form.dynamicAttributeList && this.form.dynamicAttributeList.length>0){
                // 详情属性验证
                this.form.dynamicAttributeList.forEach((item, index) => {
                    // 根据 attributeType 设置验证规则
                    let triggerType = 'blur';
                    if (parseInt(item.attributeType) === 2 || parseInt(item.attributeType) === 4) {
                        triggerType = 'change';
                    }
                    let isRequired = parseInt(item.isRequired) === 1
                    // 设置验证规则
                    rules[`dynamicAttributeList.${index}.attributeValue`] = [
                        {
                            required: isRequired,
                            message: item.attributeName + '不得为空',
                            trigger: triggerType,
                            validator: this.getValidator(item,isRequired)
                        }
                    ]
               })
            }
        return { ...this.rules,...rules }; // 合并验证规则
    }
  },
async created(){
    this.getProductGroupList();
    this.getProductCategoryList();
    this.productId = this.$route.query.id;
    if(this.productId>0){
         try {
           const {result} =  await detail({id:this.productId})
           if (result) {
             this.form = result
             this.newProductDynamic = result.newProductDynamic || [];
             this.handerCategory(this.form.categories);
           }
         } catch (error) {
         }
    }
    this.form.groupId = this.$route.query.groupId
  },
  methods: {
    updateTitle() {
      if (this.mode === 'create') {
        this.routeTitle = '新建产品';
        this.$route.meta.title = '新建产品';
      } else if (this.mode === 'edit') {
        this.routeTitle = '编辑产品';
        this.$route.meta.title = '编辑产品';
      }
    },
    /** 获取经营范围类目列表 */ 
   async getProductCategoryList(){
       try {
         const {result} = await fetchMainProductCategories()
         if (result && Array.isArray(result)) {
           const data = this.handleTree(result,'id','parent_id')
           this.productCategoryList = data
         } else {
           this.productCategoryList = []
         }
       } catch (error) {
         this.productCategoryList = []
       }
    },
   // 标签点击事件处理函数
   handleTabClick(tab, event) {
      // 根据标签页的 name 属性确定目标内容区域的 ref
      const contentRef = `content${tab.name.replace('tab', '')}`;

      this.$nextTick(() => {
        const targetElement = this.$refs[contentRef];
        if (targetElement) {
          const container = this.$refs.container;
          const stickyTabsHeight = 50;
          
          // ✅ 使用 getBoundingClientRect 获取精确位置
          const elementRect = targetElement.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          // 计算元素相对于容器顶部的偏移（需要考虑页面滚动）
          const elementOffsetTop = elementRect.top - containerRect.top;
          
          // 计算目标滚动位置：让元素顶部刚好在 sticky tabs 下方
          const targetScrollTop = container.scrollTop + elementOffsetTop - stickyTabsHeight;
          
          // 平滑滚动
          container.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
          });
        }
      });
   },
    /***
     * 获取产品分组菜单
     */
    async getProductGroupList() {
     try {
       let response_data = await fetchProductGroup();
       this.productGroupList = response_data.result || [];
     } catch (error) {
       this.productGroupList = [];
     }
    },
    // 详情属性验证规则
    getValidator(item,isRequired){
      return (rule, value, callback) => {
        if (!isRequired) return callback();
           const hasValue = value !== null && value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true);
              if (hasValue) {
                   callback();
              } else {
                callback(new Error(`${item.attributeName}不得为空`));
            }   
        } 
    },
    /**
     * 商品类目事件
     * @param form 
     * 
     */
     handerCategory(val){
        let categoryId = val[val.length-1];
        getDynamicAttributeByCategoryId({categoryId:categoryId}).then(res=>{
            this.$set(this.form, 'dynamicAttributeList', res.result);
            this.form.dynamicAttributeList = res.result;
            // this.updateDynamicRules();
            this.$nextTick(() => {
              if(this.productId>0){
                // 编辑产品绑定各种属性值回显
                this.form.dynamicAttributeList.forEach(item=>{
                    if(this.newProductDynamic.filter(t=>t.attributeId==item.id).length>1){
                        item.attributeValue = this.newProductDynamic.filter(t=>t.attributeId==item.id).map(t=>parseInt(t.attributeValueId))
                    }else{
                        this.newProductDynamic.forEach(nItem=>{
                            if(item.id == nItem.attributeId){
                                item.attributeValue = item.attributeType == 3? parseInt(nItem.attributeValueId): nItem.attributeValueId
                            }
                        });
                    }
                });
              }
            });
        }).catch(err=>{
        })
     },
    // 添加规格信息
    addSpec(){
       this.form.product_spea.push({weight:"",name:"",price:'',unitInfo:{number:1,values:["1","101"],name:'克'},stock:10000})
    },
    /**
     * 
     * @param index 删除份量规格
     */
    deleteSpec(index){
        this.form.product_spea.splice(index,1)
    },
   // 新增规格属性组
   addProperties(){
        this.form.properties.push({name:'',id:null,details:[{id:null,name:'',saleStatus:1}]})
    },
    /**
     * 添加属性组选项
     * @param index 属性组索引
     */
     addPropertiesOption(index){
        this.form.properties[index].details.push({id:null,name:'',saleStatus:1})
    },
     // 删除规格属性组
     deleteProperties(index){
       this.form.properties.splice(index,1)
    },
    /**
     * 删除属性组选项
     * @param index 属性组索引
     * @param cIndex 属性组选项索引
     */
     deletePropertiesOption(index,cIndex){
        this.form.properties[index].details.splice(cIndex, 1)
    },
    /**
     * 自动填充属性组信息
     * @param item 
     */
    autoAddProperties(item){
       this.form.properties.push({
            id:item.id,
            name: item.name,
            details: item.details.map(detail => ({
                id:detail.id,    
                name: detail.name,
                saleStatus: detail.saleStatus
            }))
        });
    },
    // 规格预览查看-切换
    preViewSpeaClick(index){
        this.preViewActived = index;
    },
    // 保存产品
    submitForm(form,submitType) {
          this.$refs[form].validate((valid) =>   {
          if (valid) {
            // if(this.form.imageUrl instanceof Array){
            //     this.form.imageUrl = this.form.imageUrl.map(t=>t.location);
            // }
            // else{
            //     this.form.imageUrl = this.form.imageUrl.split(',');
            // }
             this.form.imageUrl = this.form.imageUrl.split(',');
            create(this.form).then(response => {
                if(submitType==2){
                    // 发布并继续新建
                    this.$msg.success('发布成功您可以继续添加下一个');
                }else{
                  // 发布
                  this.$router.replace('index')
                }
            }).catch(error => {
                this.$msg.error('操作失败，原因！'+error.msg);
            });
          } 
        });
      },
      goBack(){
        this.$router.replace('index')
      },
      cancel(){
        
      }
  },
  watch: {
    'form.dynamicAttributeList': {
      deep: true,
      handler() {
        if (this.form.product_spea && this.form.product_spea.length > 0) {
          const prices = this.form.product_spea.map(t => parseFloat(t.price) || 0)
          if (prices.length > 0) {
            let minPrice = Math.min(...prices)
            let indexOfMin = this.form.product_spea.findIndex(item => parseFloat(item.price) === minPrice)
            this.preViewActived = indexOfMin >= 0 ? indexOfMin : 0
          }
        }
      }
    },
    'form': {
      deep: true,
      handler(val,newVal) {
      }
    },
    '$route.query.mode': {
      immediate: true,
      handler(newMode) {
        this.mode = newMode || 'create';
        this.updateTitle();
      }
    },
  },
  components: { picUpload,MyDialog,CustomPopconfirm,ProductSpec,productProperties },
}
</script>
<style lang="scss">
.previewSpea{
    .el-card box-card{height: 350px !important;}
    .el-card__body{background-color: #eee !important;}
    .list-item{
        padding: 6px;
        &-spea{
            cursor: pointer; display:inline-block;border-radius:4px;margin-right: 10px;border: none; background-color:#eee;color:#333;padding:8px 25px;
        }
        .actived-spea{
        border:1px solid #409EFF;
        color: #409EFF;
    }
    }
   
}
.previewProductInfo{
        .el-card box-card{height: 520px !important;}
        .product_desc{margin-bottom: 15px;}
       .description{padding: 5px 0;.text{color: #999;;}.value{color: #333;}}
}
  /* 粘性定位的样式 */
  .sticky-tabs {
        height: 50px;
        line-height: 50px;
        box-shadow: 0 0 10px 0 rgba(0,0,0,.08);
        position: sticky;
        top: 0;
        z-index: 100; /* 确保粘性定位的元素在其他内容之上 */
        .el-tabs{
            margin-bottom: 0 !important;
            .el-tabs__header{padding: 0 15px !important;margin: 0 !important;}
        }
    }
 .cusomter-header{
     padding: 10px 0;   
     .el-page-header__left{
        color: #666;
        margin-right: 20px;
    }
    .el-page-header__left::after{width:0px;}
    .el-page-header__content{
        font-size: 16px;
    }
}
  
    .desc-text{color: #999;}
   
    .headerTitle{
            font-weight: 400;
            font-size: 18px;
            padding: 16px;
            color: #333;
            background-color: #ffffff;
            box-sizing: border-box;
        }
   .productDescInfo{
     .attr-item-box{
        display: inline-block;
     }
   
    .cusomte-label{
        font-size:14px;color: #333;
    }
     .attr-item-list{
        padding-top: 20px;
     }
   }     
  .content {
        margin-bottom: 15px;
        background-color: #ffffff;
        padding: 0 15px 15px 15px; 
        box-sizing: border-box;
        .itemEmptyData{
            margin:0;
            padding: 5px 0;
            background-color: transparent;
        }
        .itemContrainer{
            margin: 0;
            background-color: #f8f8fa;
            border-radius: 8px;
            display: flex;
            flex-wrap: wrap;
            height: auto;
            padding-top: 16px; 
            width: 100%;
            .label-top .el-form-item__label {display: block; margin-bottom: 4px;float: none;text-align: left;}
            .label-top .el-form-item__content{margin-left: 0  !important;}
            .el-form--label-top .el-form-item__label{padding: 0 !important;}
            .product-spea-title{width: 100%;margin-bottom: 10px;font-size: 14px;color: #333;padding-left: 10px;}
            .specList{
                 width:100%; 
                 margin: 0 !important;
                 padding:10px 0;
                 
                .el-input__prefix{
                    left:10px !important;
                    color:#333;
                }
                .el-input-group__append, .el-input-group__prepend {
                      width: 100px !important;
                      color:#333;
               }
               .el-form-item{margin-bottom: 12px !important;}
            }
             .specList:hover{
              background-color: rgb(236, 238, 242);
            }
            .specList:last-child{
                border-radius: 0 0 8px 8px;
        }
     }
   }
   
   .last-content {
      margin-bottom: 20px; /* 清除底部外边距 */
   }
   .saleContrainer {
    .stockInfo{
        padding: 20px 0;
        .el-input__prefix{
                    left:10px !important;
                    top:8px !important;
                    color:#333;
                }
                .el-input-group__append, .el-input-group__prepend {
                      width: 100px !important;
                      color:#333;
            }
    }
   
   }
  .footer-fixed-button{text-align: right; position:fixed;background-color: #ffffff;width: 65%;z-index: 999; bottom: 0;
   .flex{
    display: flex;justify-content: space-between;
   }
}
</style>