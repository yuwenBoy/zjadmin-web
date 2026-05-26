<template>
    <div class="app-container">
      <div class="head-container">
        <el-row :gutter="24">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">    
                <div class="content-box box-shadow">
                <div class="text item">
                    <el-row :gutter="24">
                        <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
                            <el-form label-width="0px" inline>
                                <el-form-item>
                                    <el-input style="width:150px" v-model="crud.query.attributeName" clearable size="small" placeholder="请输入属性名称" class="filter-item round-left" />
                                </el-form-item>
                                <OPTOperation />
                            </el-form>
                        </el-col>
                        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4"  v-if="type==='remove'">
                            <el-button class="filter-item" round  type="danger" icon="el-icon-delete" size="mini" :loading="crud.delAllLoading" :disabled="crud.selections.length === 0" @click="batchRemoveRelevance(crud.selections)">批量移除属性</el-button>
                        </el-col>
                        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4"  v-else-if="type==='add'">
                            <el-button class="filter-item" round  type="primary" icon="el-icon-plus" size="mini" :loading="crud.delAllLoading" :disabled="crud.selections.length === 0" @click="batchRelevance(crud.selections)">批量关联属性</el-button>
                        </el-col>
                        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" v-else>
                            <el-button v-if="crud.optShow.add" class="filter-item" round size="mini" type="primary" icon="el-icon-plus" @click="crud.toAdd">新增</el-button>
                            <el-button class="filter-item" round  type="danger" icon="el-icon-delete" size="mini" :loading="crud.delAllLoading" :disabled="crud.selections.length === 0" @click="toDelete(crud.selections)">删除</el-button>
                        </el-col>
                    </el-row>
                    <el-table ref="table" :data="crud.data" highlight-current-row @selection-change="crud.selectionChangeHandler">
                        <el-table-column type="selection" align="center" width="55"/>
                        <el-table-column prop="id" label="属性ID" width="80"/>
                        <el-table-column prop="attributeName" label="属性名称" />
                        <el-table-column prop="isRequired" label="是否必填">
                            <template slot-scope="scope">
                                <el-tag type="danger" v-if="scope.row.isRequired == 1">必填</el-tag>
                                <el-tag  v-else>非必填</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="attributeType" label="属性类型">
                            <template slot-scope="scope">
                                <el-tag :type="$enum.attributeTypeColor[scope.row.attributeType]">{{ $enum.attributeTypeEnum[scope.row.attributeType] }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="isStar" label="是否标星">
                            <template slot-scope="scope">
                                <el-tag type="danger" v-if="scope.row.isStar == 1">已标星</el-tag>
                                <el-tag  v-else>未标星</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="isStar" label="属性值数量" width="100">
                            <template slot-scope="scope">
                                <el-button @click="$router.push({name:'dynamicAttributeValue',query:{...scope.row}})" type="text" size="small" v-if="scope.row.attrValue">{{ scope.row.attrValue.length}}</el-button>
                                <span v-else> - </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createdAt" label="创建时间" width="160" />
                        <!--   编辑与删除   -->
                        <el-table-column label="操作" align="left" :width="relevanceRequest.categoryId ? 80:300">
                            <template slot-scope="scope">
                                <el-link type="info" :underline="false" v-if="type==='add'" @click="batchRelevance(scope.row)">关联属性</el-link>
                                <el-link type="info" :underline="false" v-else-if="type==='remove'" @click="batchRemoveRelevance(scope.row)">移除属性</el-link>
                                <span v-else>
                                    <el-link type="info" :underline="false" @click="$router.push({name:'dynamicAttributeValue',query:{...scope.row}})">新增属性值</el-link>
                                <el-link type="info" :underline="false" @click="crud.toEdit(scope.row)">编辑</el-link>
                                <el-link type="info" :underline="false" @click="remove(scope.row)">删除</el-link>
                                <el-link type="info" :underline="false" @click="addRelevanceProductCategory(scope.row)">关联分类</el-link>
                                <el-link type="info" :underline="false" @click="relevanceProductCategory(scope.row)">移除分类</el-link>
                                </span>
                            </template>
                        </el-table-column>
                  </el-table>
                  <!--分页组件-->
                  <pagination />
                  <jForm/>
                  <relevanceProductCategoryList :visible.sync="dialogVisible" :attributeId="attribute_id" :key="deleteDialogKey" title="移除产品分类"/>
                  <addRelevanceProductCategoryList :visible.sync="addDialogVisible" :attributeId="attributeId" :key="dialogKey" title="关联产品分类"/>
                </div>
              </div>
           </el-col>
        </el-row>
      </div>
    </div>
  </template>
<script>
import crudDynamicAttribute,{relevanceProductCategory,batchRemove} from "@/api/system/dynamicAttribute";
import CRUD, { presenter } from "@crud/crud";
import pagination from "@crud/Pagination";
import jForm from "./dynamicAttributeEdit";
import relevanceProductCategoryList from './relevanceProductCategoryList';
import addRelevanceProductCategoryList from './addRelevanceProductCategoryList';
import OPTOperation from "@crud/OPT.operation";
  export default {
    components: {OPTOperation, pagination, jForm,relevanceProductCategoryList,addRelevanceProductCategoryList},
    cruds() {
        return CRUD({
            title: "属性",
            url: "dynamicAttribute/getByCondition",
            crudMethod: { ...crudDynamicAttribute },
        });
    },
    mixins: [presenter()],
    data() {
      return {
        dialogVisible:false,
        addDialogVisible:false,
        attributeId:null,
        attribute_id:null,
        dialogKey:0,
        deleteDialogKey:1,
        relevanceRequest:{
            categoryId:null,
            ids:[],
        },
        type:null, // 移除还是关联
      };
    },
    mounted() {
        this.relevanceRequest.categoryId = this.$route.query.categoryId;
        this.type = this.$route.query.type;
    },
    methods: {
        // 表格刷新之后
        [CRUD.HOOK.beforeRefresh](crud, form) {
            crud.params.categoryId = this.$route.query.categoryId;
            crud.params.type = this.$route.query.type;
        },
        toDelete(datas) {
        this.$msg.confirm(
          `确认删除选中的${datas.length}条数据?`,
              {
                ok: () => {
                  this.crud.delAllLoading = true
                  this.crud.doDelete(datas)
                }
              }
            );
      },
      remove(row) {
      this.$msg.confirm(`确认删除此属性及包含的属性值吗，删除后不可恢复`, {
        ok: () => {
          this.crud.delAllLoading = true;
          this.crud.doDelete(row);
        },
        cancel: () => {},
      });
    },
    /*/**
     * 分类关联多个属性
     */
    batchRelevance(datas){
        let that = this;
        if(datas instanceof Array){
            this.relevanceRequest.ids = datas.map(t=>t.id);
        }else{
            this.relevanceRequest.ids.push(datas.id);
        }
        this.$msg.confirm(`确认关联此属性吗?`, {
                ok: () => {
                    if(!this.relevanceRequest.categoryId){
                        this.$msg.alert('分类ID不能为空！',"error");
                        return false;
                    }

                    if(this.relevanceRequest.ids.length==0){
                        this.$msg.alert('请选择属性！',"error");
                        return false;
                    }
                    relevanceProductCategory(JSON.stringify(this.relevanceRequest)).then(response => {
                            // 处理响应
                            this.$msg.success('保存成功！');
                            that.crud.delAllLoading = false;
                            this.$router.replace({name:'categoryList'})
                    }).catch(error => {
                      this.$msg.error('操作失败，原因！'+error.msg);
         });
       },
    });
    },
    /**
     * 批量移除属性 | 单个移除属性
     * @param datas 
     */
    batchRemoveRelevance(datas) {
        let that = this;
            let params = {
                categoryId:that.relevanceRequest.categoryId,
                attributeIds:[]
            }
            if(datas instanceof Array){
                params.attributeIds = datas.map(t=>t.id)
            }else{
                params.attributeIds.push(datas.id);
            }
            this.$msg.confirm(`确认移除该属性吗?`, {
                ok: () => {
                    if(!params.categoryId){
                        this.$msg.alert('分类ID参数错误，移除失败！','error');
                        return false;
                    }

                    if(params.attributeIds.length==0){
                        this.$msg.alert('属性ID参数错误，移除失败！','error');
                        return false;
                    }
                    batchRemove(JSON.stringify(params)).then(response => {
                            // 处理响应
                            this.$msg.success('操作成功！');
                            that.crud.delAllLoading = false;
                            that.crud.toQuery();
                    }).catch(error => {
                       this.$msg.error('操作失败，原因！'+error.msg);
            });
        },
    });
      },
      /**
       * 
       * @param row 关联产品分类
       */
      relevanceProductCategory(row){
        this.attribute_id = row.id;
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.deleteDialogKey += 1;
        });
      },
      /**
       * 
       * @param row 添加产品分类
       */
       addRelevanceProductCategory(row){
        this.attributeId = row.id;
        this.addDialogVisible = true;
        this.dialogKey += 1;
      },
    },
  }
</script>
    
 <style>
  .el-card__header {
    padding: 8px 20px;
    border-bottom: 1px solid #e6ebf5;
    box-sizing: border-box;
  }
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
  </style>
    