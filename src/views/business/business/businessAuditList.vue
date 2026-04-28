<template>
    <div class="app-container">
      <div class="head-container">
        <div class="content-box box-shadow">
          <div class="text item">
            <el-row :gutter="24">
              <el-col :xs="15" :sm="14" :md="12" :lg="7" :xl="7">
                <el-form label-width="0px" inline>
                  <el-form-item>
                    <el-input
                      v-model="crud.query.title"
                      clearable
                      size="small"
                      placeholder="请输入商家名称"
                      class="filter-item round-left"
                    />
                  </el-form-item>
                  <OPTOperation />
                </el-form>
              </el-col>
            </el-row>
          </div>
          <el-table
            v-if="refreshTable"
            ref="table"
            :data="crud.data"
            row-key="id"
          >
            <el-table-column
              type="selection"
              width="55"
              align="center"
              :reserve-selection="true"
            />
            <el-table-column prop="id" label="ID" align="center" width="80" />
            <el-table-column
              :show-overflow-tooltip="true"
              label="商家名称"
              prop="business.title"
              align="center"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              label="联系电话"
              prop="business.contactPhone"
              align="center"
            />
            <el-table-column prop="business.createdAt" label="提交时间" width="145" />
          </el-table>
        </div>
      </div>
    </div>
  </template>
    <script>
  import CRUD, { presenter, form } from "@crud/crud";
  import OPTOperation from "@crud/OPT.operation";
  const defaultForm = {
    id: null,
    name: "",
    is_parent: 0,
    sort: 99,
    parent_id: 0,
    pic: "",
    created_at:undefined,
    updated_at:undefined,
  };
  export default {
    components: { OPTOperation },
    cruds() {
      return CRUD({
        title: "",
        url: "/business/getBusinessAuditList",
        sort: "sort",
      });
    },
    mixins: [presenter(), form(defaultForm)],
    data() {
      return {
        // 重新渲染表格状态
        refreshTable: true,
        rules: {
          name: [{ required: true, message: "请输入品类名称", trigger: "blur" }],
          sort: [{ required: true, message: "请选择排序", trigger: "blur" }],
        },
        treeEntity: [],
      };
    },
    mounted() {
    },
    methods: {

    }
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
    