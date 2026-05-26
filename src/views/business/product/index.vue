<template>
  <div class="app-container">
      <!-- 产品批量修改分组 -->
      <my-dialog append-to-body :close-on-click-modal="false" :visible.sync="batchEditDialog" @close="batchEditDialog=false" :title="title" :width="editDialogWidth" custom-class="xin-dialog">
            <template #content>
                <el-form ref="batchForm" :model="batchForm" :rules="batchRules" size="medium" label-width="85px">
                    <el-row :gutter="24">
                         <!-- 批量改分组 -->
                        <el-col :span="24" v-if="batchEditType==1">
                            <el-form-item label="移动到:" prop="groupId">
                               <el-select v-model="batchForm.groupId" placeholder="请选择" clearable style="width: 100%;">
                                   <el-option v-for="item in productGroupList" :key="item.id" :label="item.name" :value="item.id"/>
                               </el-select>
                           </el-form-item>
                        </el-col>
                         <!-- 批量改商品描述 -->
                        <el-col :span="24" v-if="batchEditType==2">
                            <el-form-item label="商品描述:">
                                <el-input v-model="batchForm.description" minlength="5" maxlength="450" show-word-limit clearable placeholder="限5-450字" rows="4" type="textarea"></el-input>
                           </el-form-item>
                        </el-col>
                        <!-- 批量改打包费 -->
                        <el-col :span="24" v-if="batchEditType==3">
                            <el-form-item label="打包费:" prop="packingPrice">
                                <el-input v-model="batchForm.packingPrice">
                                    <template slot="append">元</template>
                                </el-input>
                           </el-form-item>
                        </el-col>
                        <el-col :span="24" v-if="batchEditType==3">
                           <el-form-item label="每:" prop="unitInfo.number">
                                <el-input v-model="batchForm.unitInfo.number">
                                    <template slot="append">份</template>
                                </el-input>
                           </el-form-item>
                        </el-col>
                    </el-row>
                       <el-row :gutter="24" style="margin-bottom:20px;"><el-alert v-if="batchEditType==4 || batchEditType==5" type="warning" show-icon>
                           <div style="font-size:14px;color:#333;">保存后，原商品信息将被替换，请谨慎操作</div>
                       </el-alert></el-row>
                       <!-- 份量规格组件 -->
                       <product-spec :form="batchForm" v-if="batchEditType==4" @addSpec="addSpec" @deleteSpec="deleteSpec"></product-spec>
                       <!-- 属性规格组件 -->
                       <product-properties :form="batchForm" v-if="batchEditType==5" @addProperties="addProperties" @deleteProperties="deleteProperties" @addPropertiesOption="addPropertiesOption" @deletePropertiesOption="deletePropertiesOption" @autoAddProperties="autoAddProperties"></product-properties>
                </el-form>
            </template>
            <!-- 底部操作按钮 -->
            <template #footer>
                <slot name="footer">
                  <el-button type="default" @click="resetForm('batchForm')">取消</el-button>
                  <el-button :loading="!batchEditDialog" type="primary" @click="batchSubmit('batchForm')">确定</el-button>
                </slot>
            </template>
    </my-dialog> 
    <addGroupMenu />
    <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="head-container">
          <div class="content-box box-shadow">
            <div class="text item">
              <el-row :gutter="24">
                <el-col :span="24">
                  <el-row :gutter="24">
                    <el-col :span="24" class="product-search-col">
                      <div class="product-active">
                        <div class="flex">
                            <div class="product-active-item" v-for="(item,index) in searchStatusList" :key="index" :class="['product-active-item', { checked:isActiveIndex == item.isActive }]"  @click="itemInActiveClick(item,index)">
                                {{ item.name }} <span style="color:#999;font-size:12px;">{{ item.count }}</span>
                            </div>
                        </div>
                      </div>  
                      <el-form label-width="0px" style="display:inline-block">
                        <el-form-item>
                          <el-input style="width:300px;"
                            v-model="crud.query.name"
                            clearable
                            size="small"
                            suffix-icon="el-icon-search"
                            placeholder="搜商品/份量/属性/加料/主料"
                            class="filter-item"
                          />
                        </el-form-item>
                      </el-form>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row :gutter="24" v-if="isActiveIndex==2">
                <div class="productTipInfo">
                        已下架商品表示已暂停售卖，用户选购时不可见
                    </div>
              </el-row>
              <el-row :gutter="24" v-if="isActiveIndex==3">
                    <div class="productTipInfo">
                        已售罄表示该商品库存为0，用户可以看到但无法购买
                    </div>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="24" class="product-options">
                        <div class="group-list">
                                <div class="add-product" v-show="isActiveIndex==-1">
                                    <el-link :underline="false" type="primary" icon="el-icon-plus"  @click="crud.toAdd">新建分组</el-link>
                                </div>
                                <div :class="['group-item', { checked: groupSelectedIndex === index }]"  v-for="(item,index) in crud.data" :key="item.id" @click="groupItemClick(index,item)">{{item.name}}({{item.product_count}})
                                        <el-badge :value="selectProductList.length" class="item" v-show="groupSelectedIndex === index && selectProductList.length>0" style="position:absolute;right:10px;top:25px;"></el-badge>
                                        <i class="el-icon-edit" style="display:none;" @click.stop="crud.toEdit(item)"></i>
                                </div>   
                        </div>
                        <div class="table">
                            <div class="batchAll" v-if="isActiveIndex==-1">
                                <div class="batchAll-top">
                                    <div class="batchItem">
                                        <span class="batch-item-home">批量:</span>
                                        <span v-show="selectProductList.length>0">已选<span style="color:#409EFF">{{selectProductList.length}}</span>个 <el-link :underline="false" style="padding-left:15px;color:#1a71ff" @click="crud.selectAllChange([])">取消选择</el-link> </span>
                                        <span class="batch-item-list inActived" @click="updateIsActive(selectProductList,1)">上架</span>
                                        <span class="batch-item-list downActived" @click="updateIsActive(selectProductList,2)">下架</span>
                                        <span class="batch-item-list delActived">删除</span>
                                        <span class="batch-item-list inActived" @click="batchEditProduct('1',selectProductList)">改分组</span>
                                        <span class="batch-item-list inActived">改库存</span>
                                        <el-dropdown trigger="click" class="batch-item-list"  @command="handleMenuCommand">
                                            <span class="el-dropdown-link">
                                                更多<i class="el-icon-arrow-down el-icon--right"></i>
                                            </span>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item command="3">改打包费</el-dropdown-item>
                                                <el-dropdown-item command="4">改份量规格</el-dropdown-item>
                                                <el-dropdown-item command="5">改属性规格</el-dropdown-item>
                                                <el-dropdown-item>改加料规格</el-dropdown-item>
                                                <el-dropdown-item command="2">改描述</el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </div>
                                </div>
                                <div class="batchAll-bottom">
                                    <div class="create-product">
                                        <el-dropdown class="custom-dropdown" split-button type="primary" @command="createProductCommand">
                                            <span class="el-dropdown-link" style="vertical-align:bottom">快速录菜</span>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item command="1">
                                                    手动录菜
                                                    <div><small class="grey-text">定制特色商品，突出商品卖点</small></div>
                                                </el-dropdown-item>
                                                <el-dropdown-item command="2">
                                                    新建套餐
                                                    <div><small class="grey-text">搭配单品为套餐，顾客可快速下单</small></div>
                                                </el-dropdown-item>
                                                <el-dropdown-item command="3">
                                                    复制新建
                                                    <div><small class="grey-text">复制店内商品，稍加修改即可发布</small></div>
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </div>
                                    <div class="view-mode">
                                        <el-radio-group v-model="viewMode" size="small">
                                            <el-radio-button label="table">表格</el-radio-button>
                                            <el-radio-button label="card">卡片</el-radio-button>
                                        </el-radio-group>
                                    </div>
                                </div>
                            </div>
                            <!-- 表格展示方式 -->
                            <el-table ref="table" v-if="viewMode === 'table' && productList.length>0" :data="productList" highlight-current-row @selection-change="changeTable">
                                <el-table-column v-if="isActiveIndex==-1" type="selection" align="center" width="45" />
                                <el-table-column v-if="groupItem" :label="isActiveIndex==-1 && groupItem.name ? `${groupItem.name} (${groupItem.product_count})`:''">
                                    <template slot-scope="scope">
                                        <div style="display:flex;align-items:center;justify-content:start !important;">
                                                <div style="position:relative;">
                                                    <el-image fit="cover" referrerpolicy="no-referrer" style="width: 72px;height: 72px;border-radius: 10px;line-height: 72px;flex-wrap:nowrap;" :src="scope.row.imageUrl.split(',').length>0?scope.row.imageUrl.split(',')[0]:scope.row.imageUrl.split(',')" :preview-src-list="[scope.row.imageUrl.split(',')]">
                                                    </el-image>
                                                    <span v-show="scope.row.isActive==2" style="background-color: rgba(0, 0, 0, 0.5);bottom: 0px;color: rgb(255, 255, 255);font-size: 12px;height: 20px;left: 0px; position: absolute;text-align: center;width: 100%;">已下架</span>
                                                </div>
                                                <div style="padding-left:20px;display:flex;flex-direction:column;">
                                                    <span style="color:#333;font-size:14px">{{ scope.row.productName }}</span>
                                                    <span style="color: #999;font-size:12px">月售：0</span>
                                                </div>  
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column width="200">
                                    <template slot-scope="scope">
                                        <div style="color:#333;font-size:14px;">¥{{scope.row.specs.length>1 && scope.row.specs.some(t=>t.price!=t.price)? (Math.min(...scope.row.specs.map(t=>parseFloat(t.price))) +'~'+Math.max(...scope.row.specs.map(t=>parseFloat(t.price)))):scope.row.specs[0].price}}</div>
                                        <div style="color:#999;font-size:12px;" v-if="scope.row.specs.length==1">
                                            打包费¥{{ scope.row.specs[0].packingPrice }}
                                        </div>
                                        <div style="color:#999;font-size:12px;" v-else-if="scope.row.specs.length>1 && (Math.min(...scope.row.specs.map(t=>t.packingPrice && parseFloat(t.packingPrice)))==0 && Math.max(...scope.row.specs.map(t=>parseFloat(t.packingPrice)))) ==0">
                                            打包费¥0
                                        </div>
                                        <div style="color:#999;font-size:12px;" v-else>
                                            打包费¥{{ Math.min(...scope.row.specs.map(t=>t.packingPrice && parseFloat(t.packingPrice))) +'~'+Math.max(...scope.row.specs.map(t=>parseFloat(t.packingPrice))) }}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column width="150">
                                    <template slot-scope="scope">
                                        <div style="color:#333;font-size:14px;">库存{{Math.max(...scope.row.specs.map(t=>t.stock))}}</div>
                                    </template>
                                </el-table-column>
                                <!--   编辑与删除 -->
                                <el-table-column width="120" align="left">
                                    <template slot-scope="scope">
                                        <el-button style="margin-bottom: 15px;" v-if="scope.row.isActive==1" @click="updateIsActive([...scope.row],2)">下架</el-button>
                                        <el-button type="primary" plain style="margin-bottom: 15px;" v-if="scope.row.isActive==2" @click="updateIsActive([...scope.row],1)">上架</el-button>
                                        <br />
                                        <el-link :underline="false" @click="editProduct(scope.row)">编辑</el-link>
                                        <el-link :underline="false"  @click="remove(scope.row)">删除</el-link>
                                    </template>
                                </el-table-column>
                            </el-table>
                            
                            <!-- 卡片展示方式 -->
                            <div class="product-card-container" v-if="viewMode === 'card' && productList.length>0">
                                <div class="product-card" v-for="(product, index) in productList" :key="product.id">
                                    <div class="product-card-header">
                                        <div class="product-checkbox" v-if="isActiveIndex==-1">
                                            <el-checkbox v-model="product.checked" @change="handleProductCheck(product)"></el-checkbox>
                                        </div>
                                        <div class="product-status" v-if="product.isActive==2">
                                            已下架
                                        </div>
                                        <div class="product-status sold-out" v-else-if="Math.max(...product.specs.map(t=>t.stock))<=0">
                                            已售罄
                                        </div>
                                    </div>
                                    <div class="product-image">
                                        <el-image 
                                            fit="cover" 
                                            referrerpolicy="no-referrer" 
                                            :src="product.imageUrl.split(',').length>0?product.imageUrl.split(',')[0]:product.imageUrl.split(',')" 
                                            :preview-src-list="[product.imageUrl.split(',')]"
                                        >
                                        </el-image>
                                    </div>
                                    <div class="product-info">
                                        <div class="product-name">{{ product.productName }}</div>
                                        <div class="product-sales">月售：0</div>
                                        <div class="product-price">
                                            ¥{{product.specs.length>1 && product.specs.some(t=>t.price!=t.price)? (Math.min(...product.specs.map(t=>parseFloat(t.price))) +'~'+Math.max(...product.specs.map(t=>parseFloat(t.price)))):product.specs[0].price}}
                                        </div>
                                        <div class="product-packing" v-if="product.specs.length==1">
                                            打包费¥{{ product.specs[0].packingPrice }}
                                        </div>
                                        <div class="product-packing" v-else-if="product.specs.length>1 && (Math.min(...product.specs.map(t=>t.packingPrice && parseFloat(t.packingPrice)))==0 && Math.max(...product.specs.map(t=>parseFloat(t.packingPrice)))) ==0">
                                            打包费¥0
                                        </div>
                                        <div class="product-packing" v-else>
                                            打包费¥{{ Math.min(...product.specs.map(t=>t.packingPrice && parseFloat(t.packingPrice))) +'~'+Math.max(...product.specs.map(t=>parseFloat(t.packingPrice))) }}
                                        </div>
                                        <div class="product-stock">
                                            库存{{Math.max(...product.specs.map(t=>t.stock))}}
                                        </div>
                                    </div>
                                    <div class="product-actions">
                                        <el-button 
                                            size="small" 
                                            :type="product.isActive==1?'default':'primary'" 
                                            :plain="product.isActive==2"
                                            @click="updateIsActive([product], product.isActive==1?2:1)"
                                        >
                                            {{ product.isActive==1?'下架':'上架' }}
                                        </el-button>
                                        <el-button size="small" type="info" @click="editProduct(product)">
                                            编辑
                                        </el-button>
                                        <el-button size="small" type="danger" @click="remove(product)">
                                            删除
                                        </el-button>
                                    </div>
                                </div>
                            </div>
                            <div v-else-if="productList.length==0" class="no-product">
                                <div class="empty">
                                </div>
                                <div class="text">
                                    <p>改分组下无商品</p>
                                </div>
                            </div>
                    </div>
                   </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import CRUD, { presenter, form } from "@crud/crud";
import {productListPager} from "@/api/business/product";
import { getStatistics,updateProductStatus,batchUpdateInfo } from '@/api/business/product'
import OPTOperation from "@crud/OPT.operation";
import MyDialog from '@/components/my-dialog';
import ProductSpec from '@/views/business/components/productSpec.vue';
import productProperties from '@/views/business/components/productProperties.vue';
import  crudCategory  from "@/api/business";
import addGroupMenu from "../business/addGroupMenu";
const defaultForm = {
    id: null,
    name: "",
    sort: 99,
    description: "",
  };
export default {
  components: { OPTOperation,addGroupMenu,MyDialog,ProductSpec,productProperties },
  cruds() {
    return CRUD({
      title: "分组",
      url: "product_group/productGroupAll",
      crudMethod: { ...crudCategory },
    });
  },
  mixins: [presenter(), form(defaultForm)],
  data() {
    return {
      isActiveIndex:-1,  // 商品状态查询默认选中全部
      groupSelectedIndex:0, // 分组菜单默认选中第一个
      searchStatusList:[{isActive:-1,name:'全部'},{isActive:2,name:'已下架'},{isActive:3,name:'已售罄'}],
      productGroupList:[], // 获取分组数据
      groupItem:{},
      productCountObject:{},
      productList:[],
      selectProductList:[],
      viewMode: 'table', // 展示方式：table（表格）、card（卡片）
      batchEditDialog:false, // 批量改分组
      batchEditType:"1",// 默认1 批量改分组
      title:'批量改分组', // 批量改分组
      editDialogWidth:'30%',
      batchForm:{
        groupId:'', // 分组ID
        description:'',
        packingPrice:"",
        unitInfo:{
            number:1,
            name:'克',
            values:["1","101"]
        },
        product_spea:[{weight:"",name:"",price:'',unitInfo:{number:1,values:['1','101'],name:'克'}}], // 批量改份量规格
        properties:[], // 产品售卖属性设置
      },
      batchRules: {
          groupId: [{ required: true, message: '请选择要移动到的分类。已经在当前分类下啦，不需要移动哦', trigger: "blur" }],
          packingPrice: [{ required: true, message: '不得为空，请输入', trigger: "blur" }],
          'unitInfo.number':   [{ required: true, message: '不得为空，请输入', trigger: "blur" }],
        },
    };
  },
  mounted() {
        setTimeout(()=>{
            this.productCountList();
        },300)
  },
  methods: {
      // 表格刷新之后
      [CRUD.HOOK.afterRefresh](crud, form) {
        this.productGroupList = crud.data;
        this.groupItem = crud.data[this.groupSelectedIndex];
        this.productListByGroupId(this.groupItem,this.crud.query.isActive);
     },
     // 保存分组之后
     [CRUD.HOOK.afterToAdd](crud, form) {
         this.groupSelectedIndex = crud.data.length;
     },
    async productListByGroupId(params,isActive){
        let pager = {
            order: "desc",
            page: 1,
            size: 10,
            sort: "id"
        }
        if(params){
            pager.groupId = params.id;
        }
        let response = await productListPager({isActive, ...pager});
        if(response.success){
            this.productList =response.result.content;
        }
    },
    async productCountList(){
        let data = await getStatistics();
        this.productCountObject  = data.result;
        // 整合数据（添加count属性）
        this.searchStatusList.forEach((item, index) => {
            switch(index) {
                case 0:
                this.$set(item, 'count', data.result.productCount);
                break
                case 1:
                this.$set(item, 'count', data.result.downActiveCount);
                break
                case 2:
                this.$set(item, 'count', data.result.soldOutCount);
                break
            }
        })
    },
    itemInActiveClick(item,index){
        this.isActiveIndex = item.isActive;
        this.groupSelectedIndex = 0;
        this.crud.query.isActive = item.isActive;
        this.crud.toQuery();
    },
    groupItemClick(index,dataItem){
        this.groupSelectedIndex = index;
        this.groupItem = dataItem;
        this.crud.query.groupId = this.groupItem.id;
        this.crud.refresh();
    },

    /***
     * 批量上下架
     */
    async updateProductStatus(params){
        const res = await updateProductStatus(params);
        if(res.result.success){
            this.$msg.alert(res.result.message,'success');
        }else{
            this.$msg.alert(res.result.message,'error');
        }
      
        this.crud.refresh();
        setTimeout(()=>{
            this.productCountList();
        },300)
    },

    /**
     * 
     * @param rows 批量更新产品信息
     */
    updateIsActive(row,isActive){
       if(row.length===0){
          this.$msg.alert('请选择商品','error');
          return false;
       }else{
        this.updateProductStatus(JSON.stringify({ids:row.map(t=>t.id),isActive}));
       }
    },

    /***
     * 勾选产品
     */
    changeTable(row){
      this.selectProductList=row;
    },
    /**
     * 处理商品选择
     */
    handleProductCheck(product){
      if(product.checked){
        this.selectProductList.push(product);
      }else{
        this.selectProductList = this.selectProductList.filter(item => item.id !== product.id);
      }
    },

    /**
     * 新建商品
     * @param command 
     */
    createProductCommand(command){
         if(command==1){
            this.$router.push({name:'productEdit',query:{groupId:this.groupItem.id,mode:'create'}})
         }
    },
     /**
     * 编辑商品
     * @param command 
     */
    editProduct(row){
        if(row.id>0){
            this.$router.push({name:'productEdit',query:{id:row.id, groupId:this.groupItem.id,mode: 'edit' }})
        }
    },
    toDelete(datas) {
      this.$msg.confirm(`确认删除选中的${datas.length}条数据?`, {
        ok: () => {
          this.crud.delAllLoading = true;
          this.crud.doDelete(datas);
        },
        cancel: () => {},
      });
    },
    remove(row) {
      this.$msg.confirm(`确认删除此条数据吗，删除后不可恢复`, {
        ok: () => {
          this.crud.delAllLoading = true;
          this.crud.doDelete(row);
        },
        cancel: () => {},
      });
    },

    /**
     * 批量修改分组
     */
    batchEditProduct(type,row){
        if(row.length===0){
          this.$msg.alert('请选择商品','error');
          return false;
       }
       switch(type)
          {
              case "1": // 批量改分组
                    this.editDialogWidth = '30%';
                    this.batchEditDialog = true;
                    this.batchEditType = "1";
                    this.title = '批量改分组';
              break;
              case "2": // 批量改描述
                    this.editDialogWidth = '30%';
                    this.batchForm.description = '';
                    this.batchEditDialog = true;
                    this.batchEditType = "2";
                    this.title = '批量改商品描述';
              break;
              case "3": // 改打包费
                    this.editDialogWidth = '30%';
                    this.batchForm.packingPrice = '';
                    this.batchEditDialog = true;
                    this.batchEditType = "3";
                    this.title = '批量改打包费';
                break;
                case "4": //批量改份量规格
                    this.editDialogWidth = '45%';
                    this.batchForm.product_spea = [{weight:"",name:"",price:'',unitInfo:{number:1,values:['1','101'],name:'克'}}];
                    this.batchEditDialog = true;
                    this.batchEditType = "4";
                    this.title = '批量改份量规格';
                break;   
                case "5": //批量改属性规格
                    this.editDialogWidth = '45%';
                    this.batchForm.properties = [{name:'',id:null,details:[{id:null,name:'',saleStatus:1}]}];
                    this.batchEditDialog = true;
                    this.batchEditType = "5";
                    this.title = '批量改属性规格';
                break;    
        }
    },

    /**
     * 批量改打包费、份量规格、属性规格、改加料规格、改描述
     * @param type 
     */
    handleMenuCommand(type){
        switch(type){
            case "2":
                // 批量改备注
               this.batchEditProduct("2",this.selectProductList);
            break;
            case "3":
                // 批量改打包费
               this.batchEditProduct("3",this.selectProductList);
            break;
            case "4":
                // 批量改份量规格
               this.batchEditProduct("4",this.selectProductList);               
            break;
            case "5":
                // 批量改属性规格
               this.batchEditProduct("5",this.selectProductList);               
            break;
        }
    },
    // 添加规格信息
    addSpec(){
       this.batchForm.product_spea.push({weight:"",name:"",price:'',unitInfo:{number:1,values:["1","101"],name:'克'},stock:10000})
    },
    /**
     * 
     * @param index 删除份量规格
     */
    deleteSpec(index){
        this.batchForm.product_spea.splice(index,1)
    },

    // 新增规格属性组
    addProperties(){
        this.batchForm.properties.push({name:'',id:null,details:[{id:null,name:'',saleStatus:1}]})
    },
   // 删除规格属性组
    deleteProperties(index){
       this.batchForm.properties.splice(index,1)
    },

    /**
     * 添加属性组选项
     * @param index 属性组索引
     */
    addPropertiesOption(index){
        this.batchForm.properties[index].details.push({id:null,name:'',saleStatus:1})
    },
    /**
     * 删除属性组选项
     * @param index 属性组索引
     * @param cIndex 属性组选项索引
     */
     deletePropertiesOption(index,cIndex){
        this.batchForm.properties[index].details.splice(cIndex, 1)
    },
    /**
     * 自动填充属性组信息
     * @param item 
     */
    autoAddProperties(item){
       this.batchForm.properties.push({
            id:item.id,
            name: item.name,
            details: item.details.map(detail => ({
                id:detail.id,    
                name: detail.name,
                saleStatus: detail.saleStatus
            }))
        });
    },
    /**
     * 批量改分组、描述
     */
    batchSubmit(batchForm){
        this.$refs[batchForm].validate((valid) =>   {
          if (valid) {
            let mergeObj = {...this.batchForm,type:this.batchEditType,productIds:this.selectProductList.map(t=>t.id)}
             batchUpdateInfo(JSON.stringify(mergeObj)).then(response => {
                 this.$msg.alert(response.message);
                 this.batchEditDialog = false;
                 this.crud.query.groupId = this.groupItem.id;  
                 this.$refs.table.clearSelection();
                 this.crud.refresh();
              }).catch(error => {
                // 错误已在上层处理
            });
          } 
        });
    },
    /**
     * 取消批量设置
     * @param form 
     */
    resetForm(batchForm) {
        this.batchEditDialog = false;
    },
  },
};
</script>
<style class="less">
.el-form-item__label {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
  font-weight: 500;
}

.product-search-col{display: flex;justify-content: space-between;height: 36px;}

.product-active{
    display: inline-block;
}
.product-active-item {
    padding: 5px 20px;
    position: relative;
    cursor: pointer;
    color: #666;
    font-size: 14px;
    transition: all 0.3s; /* 添加过渡效果 */
}

.product-active-item::after {
  content: '';
  position: absolute;
  left: 50%; /* 将伪元素水平居中于菜单项下方 */
  bottom: -5px;
  width: 40%; /* 设置伪元素的宽度，这里设置为菜单项宽度的一半作为示例 */
  height: 3px; /* 设置伪元素的高度，即下边框的高度 */
  background-color: #1a71ff; /* 设置下边框的颜色 */
  transform: translateX(-50%); /* 将伪元素水平居中 */
  opacity: 0; /* 初始状态下隐藏伪元素 */
  transition: opacity 0.3s; /* 添加过渡效果 */
}

/* 如果需要修改触发按钮的文字大小 */
.custom-dropdown .el-dropdown-link {
  font-size: 14px; /* 修改为你需要的大小 */
}
.custom-dropdown button:first-child{
    vertical-align: bottom;
}

.product-active-item.checked::after {
  opacity: 1; /* 选中状态下显示伪元素 */
}
.product-active-item.checked{
  font-weight: 600;
}
.el-icon-arrow-down {
    font-size: 14px;
}
 

.product-options {
    display: flex;
    justify-content: space-between;
    padding-left: 30px;
}

.product-options .group-list {
    min-width: 200px;
    margin-left: 10px;
    padding-right: 3px;
    background-color: #f8f8fa;
    box-shadow: 0 1px 0 0 #f1f1f1;
    cursor: pointer;
}

.product-options .group-list .add-product {
    padding: 23px 15px;
}

.product-options .group-list .group-item {
    padding: 20px 15px;
    position: relative;
    color: #666;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
}

s.group-list .group-item .el-icon-edit {
    display: none; /* 初始状态隐藏 */
}

.group-list .group-item:hover .el-icon-edit {
    display: inline-block !important; /* 鼠标悬停时显示 */
    color: #1a71ff !important;
    cursor: pointer;
    font-size: 14px;
}

.product-options .group-list .group-item.checked {
    background-color: #FFFFFF;
    border-left: 4px solid #1a71ff;
    color: #1a71ff;
}

.product-options .table {
    flex: 1;
    width: calc(100% - 200px);
}

.productTipInfo{
    color:#666;
    background-color: #f8f8fa;
    box-shadow: 0 1px 0 0 #f1f1f1;
    padding: 15px;
    margin-left: 22px;
}

.product-options .table .batchAll {
    background-color: #f8f8fa;
    box-shadow: 0 1px 0 0 #f1f1f1;
    padding: 15px;
}

.batchAll-top {
    margin-bottom: 10px;
}

.batchAll-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.view-mode {
    margin-left: 20px;
    display: flex;
    align-items: center;
}

.product-options .table .batchAll .batch-item-home {
    color: #666;
}

.product-options .table .batchAll .batch-item-list {
    padding: 5px 10px;
    cursor: pointer;
    font-size: 14px;
    color: #333;
}

.product-options .table .batchAll .batch-item-list:hover {
    color: #1a71ff;
    background: #f8f8fa;
}

.product-options .table .no-product{
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    position: relative;
}
.product-options .table .no-product .empty{
    background: url('~@/assets/images/noData.png') no-repeat center center;
    width:360px;
    height: 360px;
    background-size: 40%
}
.product-options .table .no-product .text{
    position:absolute;
    bottom: 80px;
    color:#333;
    text-align:center;
    font-size:14px;
}
.el-alert__icon.is-big{font-size: 16px;}
.el-alert.is-light .el-alert__closebtn{display: none;}

/* 商品卡片样式 */
.product-card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 20px;
}

.product-card {
    width: 280px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 15px;
    position: relative;
    transition: all 0.3s ease;
}

.product-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
}

.product-card-header {
    position: relative;
    margin-bottom: 10px;
}

.product-checkbox {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
}

.product-status {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.6);
    color: #ffffff;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 10px;
}

.product-status.sold-out {
    background-color: #ff4d4f;
}

.product-image {
    width: 100%;
    height: 180px;
    margin-bottom: 15px;
    border-radius: 6px;
    overflow: hidden;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.product-info {
    margin-bottom: 15px;
}

.product-name {
    font-size: 16px;
    font-weight: 500;
    color: #333333;
    margin-bottom: 8px;
    line-height: 1.4;
    height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.product-sales {
    font-size: 12px;
    color: #999999;
    margin-bottom: 8px;
}

.product-price {
    font-size: 18px;
    font-weight: 600;
    color: #ff4d4f;
    margin-bottom: 4px;
}

.product-packing {
    font-size: 12px;
    color: #999999;
    margin-bottom: 4px;
}

.product-stock {
    font-size: 12px;
    color: #999999;
}

.product-actions {
    display: flex;
    gap: 8px;
    justify-content: space-between;
}

.product-actions .el-button {
    flex: 1;
}

/* 响应式调整 */
@media screen and (max-width: 1200px) {
    .product-card {
        width: calc(33.333% - 14px);
    }
}

@media screen and (max-width: 992px) {
    .product-card {
        width: calc(50% - 10px);
    }
}

@media screen and (max-width: 768px) {
    .product-card {
        width: 100%;
    }
}
</style>

  