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
                                    placeholder="请输入属性值"
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
                    <el-table
                        v-if="refreshTable"
                        ref="table"
                        :data="crud.data"
                        row-key="id"
                        :default-expand-all="!isExpandAll"
                        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
                        @select="crud.selectChange"
                        @select-all="crud.selectAllChange"
                        >
                    <el-table-column
                      type="selection"
                      align="center"
                      width="55"
                    />
                    <el-table-column prop="id" label="属性值ID" width="80"/>
                    <el-table-column prop="value" label="属性值名称" />
                    <el-table-column label="排序" prop="sort" width="130" align="center" />
                    <el-table-column
                      prop="createdAt"
                      label="创建时间"
                      width="160"
                    />
                    <!--   编辑与删除   -->
                    <el-table-column label="操作" align="left" width="150">
                      <template slot-scope="scope">
                        <el-link type="info" :underline="false" @click="addChilder(scope.row)" >新增子级</el-link>
                        <el-link
                          type="info"
                          :underline="false"
                          @click="crud.toEdit(scope.row)"
                          >编辑</el-link
                        >
                        <el-link
                          type="info"
                          :underline="false"
                          @click="remove(scope.row)"
                          >删除</el-link
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <!--分页组件-->
                  <jForm :attributeId="attributeId"/>
                  </div>
                </div>
           </el-col>
        </el-row>
      </div>
    </div>
  </template>
<script>
import crudDynamicAttributeValue from "@/api/system/dynamicAttributeValue";
import OPTOperation from "@crud/OPT.operation";
import CRUD, { presenter } from "@crud/crud";
import jForm from "./dynamicAttributeValueEdit";
  export default {
    components: { jForm,OPTOperation},
    cruds() {
        return CRUD({
            title: "属性值",
            url: "dynamicAttributeValue/getByCondition",
            crudMethod: { ...crudDynamicAttributeValue},
        });
    },
    mixins: [presenter()],
    data() {
      return {
        // 是否展开，默认全部展开
        isExpandAll: true,
        attributeId:null,
        refreshTable:true
      };
    },
    mounted() {
    },
    methods: {
        // 表格刷新之后
        [CRUD.HOOK.beforeRefresh](crud, form) {
            console.log('表格刷新之后');
            this.attributeId = this.$route.query.id;
            crud.params.attributeId = this.attributeId
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
    