<template>
    <div class="app-container">
      <div class="head-container">
        <div class="content-box box-shadow">
          <div class="text item">
            <el-row :gutter="24">
              <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
                <el-form label-width="0px" inline>
                  <el-form-item>
                    <el-input
                      v-model="crud.query.name"
                      clearable
                      size="small"
                      placeholder="请输入分组名称"
                      class="filter-item round-left"
                    />
                  </el-form-item>
                  <OPTOperation />
                </el-form>
              </el-col>
              <el-col
                :xs="4"
                :sm="4"
                :md="4"
                :lg="4"
                :xl="4"
                style="text-align: right">
                <el-button
                  v-if="crud.optShow.add"
                  class="filter-item"
                  size="mini"
                  round
                  type="primary"
                  icon="el-icon-plus"
                  @click="crud.toAdd">新增</el-button>
                <el-button
                  class="filter-item"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  round
                  :loading="crud.delAllLoading"
                  :disabled="crud.selections.length === 0"
                  @click="toDelete(crud.selections)">删除</el-button>
              </el-col>
            </el-row>
          </div>
              <el-table :data="crud.data" 
              row-key="id"
           stripe @selection-change="crud.selectionChangeHandler"
          >
            <el-table-column
              type="selection"
              width="55"
              align="center"
              :reserve-selection="true"
            />
            <el-table-column prop="id" label="分组ID" align="center" width="80" />
            <el-table-column  :show-overflow-tooltip="true" label="分组名称" prop="name" align="center" />
            <el-table-column label="排序" prop="sort" width="80" align="center" />
            <el-table-column prop="createdAt" label="创建时间" width="145" />
            <el-table-column prop="updatedAt" label="最后更新时间" width="165" />
            <!--   编辑与删除   -->
            <el-table-column label="操作" width="100px" align="left">
              <template slot-scope="scope">
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
               <pagination />
               <addGroupMenu />
        </div>
      </div>
    </div>
  </template>
    <script>
  import  crudCategory from "@/api/business";
  import {getStoreList} from '@/api/business/store';
  import CRUD, { presenter, form } from "@crud/crud";
  import OPTOperation from "@crud/OPT.operation";
  import pagination from '@crud/Pagination';
  import addGroupMenu from "../business/addGroupMenu";
  const defaultForm = {
    id: null,
    name: "",
    sort: 99,
    description: "",
    storeId:"",
    isDefault:0,
  };
  export default {
    components: {  OPTOperation, pagination,addGroupMenu },
    cruds() {
      return CRUD({
        title: "分组",
        url: "/product_group/getByCondition",
        crudMethod: { ...crudCategory },
        sort: "sort",
      });
    },
    mixins: [presenter(), form(defaultForm)],
    data() {
      return {
      };
    },
    mounted() {
    },
    methods: {
      toDelete(datas) {
        this.$msg.confirm(`确认删除选中的${datas.length}条数据?`, {
          ok: () => {
            this.crud.delAllLoading = true;
            this.crud.doDelete(datas);
          },
        });
      },
      remove(row) {
        this.$msg.confirm(`确认删除此条数据吗，删除后不可恢复?`, {
          ok: () => {
            this.crud.delAllLoading = true;
            this.crud.doDelete(row);
          },
        });
      },
    },
  };
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
    