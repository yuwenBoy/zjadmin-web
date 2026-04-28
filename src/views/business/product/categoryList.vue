<template>
    <div class="app-container">
      <div class="head-container">
        <el-row :gutter="24">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">    
                <div class="content-box box-shadow">
                <div class="text item">
                    <el-row :gutter="24">
                        <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
                            <el-form label-width="0px" inline>
                                <el-form-item>
                                    <el-input style="width:150px"
                                    v-model="crud.query.value"
                                    clearable
                                    size="small"
                                    placeholder="请输入分类名称"
                                    class="filter-item round-left"
                                    />
                                </el-form-item>
                                <OPTOperation />
                            </el-form>
                        </el-col>
                        <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
                            <el-button type="info" round icon="el-icon-sort" size="mini" @click="toggleExpandAll" >展开/折叠</el-button>
                        </el-col>
                        <el-col :push="8" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                                <el-button
                                v-if="crud.optShow.add"
                                class="filter-item"
                                round
                                size="mini"
                                type="primary"
                                icon="el-icon-plus"
                                @click="crud.toAdd">新增</el-button>
                                <el-button
                                class="filter-item"
                                round
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                :loading="crud.delAllLoading"
                                :disabled="crud.selections.length === 0"
                                @click="toDelete(crud.selections)">删除</el-button>
                        </el-col>
                    </el-row>
                    <el-table v-if="refreshTable" ref="table" :data="crud.data" row-key="id" :default-expand-all="!isExpandAll"  :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" @select="crud.selectChange" @select-all="crud.selectAllChange" >
                    <el-table-column type="selection" align="center" width="55" :selectable="isLastLevelCategory"/>
                    <el-table-column prop="name" label="分类名称" />
                    <el-table-column label="层级" prop="level" width="130" align="center" />
                    <el-table-column label="排序" prop="sort" width="130" align="center" />
                    <el-table-columnprop="createdAt" label="创建时间" width="145"/>
                    <!--   编辑与删除   -->
                    <el-table-column label="操作" align="left" width="300">
                      <template slot-scope="scope">
                        <el-link type="info" :underline="false" @click="addChilder(scope.row)" >新增子级</el-link>
                        <el-link type="info" :underline="false" @click="crud.toEdit(scope.row)">编辑</el-link>
                        <el-link type="info" :underline="false" @click="remove(scope.row)">删除</el-link>
                        <el-link type="info" :underline="false" v-if="!scope.row.children" @click="$router.push({ name: 'dynamicAttributeList', query: {categoryId:scope.row.id,type:'add'} })">关联属性</el-link>
                        <el-link type="info" :underline="false" v-if="!scope.row.children" @click="$router.push({ name: 'dynamicAttributeList', query: {categoryId:scope.row.id,type:'remove'} })">移除属性</el-link>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!--分页组件-->
                  <jForm/>
                  </div>
                </div>
           </el-col>
        </el-row>
      </div>
    </div>
  </template>
<script>
import crudProductCategory from "@/api/business/product";
import OPTOperation from "@crud/OPT.operation";
import CRUD, { presenter } from "@crud/crud";
import jForm from "./categoryEdit";
  export default {
    components: { jForm,OPTOperation},
    cruds() {
        return CRUD({
            title: "产品分类",
            url: "productCategory/getByCondition",
            crudMethod: { ...crudProductCategory},
        });
    },
    mixins: [presenter()],
    data() {
      return {
        // 是否展开，默认全部展开
        isExpandAll: true,
        refreshTable:true
      };
    },
    mounted() {
    },
    methods: {
        /**
     * 
     * @param row 只能选中最后一级否则禁用
     */
    isLastLevelCategory(row) {
      // 如果 isLastLevel 为 true，则允许选择，否则禁用复选框
      return !row.children;
    },
        // 表格刷新之后
        [CRUD.HOOK.beforeRefresh](crud, form) {
        },
        /** 展开/折叠操作 */
        toggleExpandAll() {
        this.refreshTable = false;
        this.isExpandAll = !this.isExpandAll;
        this.$nextTick(() => {
            this.refreshTable = true;
        });
        },
       toDelete(datas) {
            this.$msg.confirm(
            `确认删除选中的${datas.length}条数据?`,{
                    ok: () => {
                    this.crud.delAllLoading = true
                    this.crud.doDelete(datas)
                    }
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
    addChilder(row){
        this.crud.defaultForm.parent_id = row.id;
        this.crud.toAdd();
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
    