<template>
    <div class="app-container">
      <div class="head-container">
        <div class="content-box box-shadow">
          <!-- 公告列表 -->
          <div class="text item">
            <el-row :gutter="24">
              <el-col :span="6">
                <el-button v-if="crud.optShow.add" class="filter-item" size="mini" round type="primary" icon="el-icon-plus" @click="crud.toAdd">新增</el-button>
                <el-button class="filter-item" size="mini" round type="danger" icon="el-icon-delete" :loading="crud.delAllLoading" :disabled="crud.selections.length === 0" @click="toDelete(crud.selections)">删除</el-button>
              </el-col>
              <el-col :span="14" :push="4" style="text-align:right;">
                <el-form label-width="0px" inline>
                  <el-form-item>
                    <el-input v-model="crud.query.storeName" clearable size="mini" autofocus placeholder="门店名称" class="filter-item round-left" />
                  </el-form-item>
                  <el-form-item>
                    <el-input v-model="crud.query.contactInfo" clearable size="mini" autofocus placeholder="门店联系方式" class="filter-item" />
                  </el-form-item>
                  <OPTOperation />
                </el-form>
              </el-col>
            </el-row>
          </div>
          <el-table ref="table" :data="crud.data" stripe @selection-change="crud.selectionChangeHandler">
            <el-table-column type="selection" align="center" width="55" />
            <el-table-column type="index" label="序号" align="center" width="50" />
            <el-table-column prop="id" label="门店ID" align="center" width="80" />
            <el-table-column prop="storeName" label="门店名称" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="contactInfo" label="门店联系方式" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="latitude" label="门店经度" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="longitude" label="门店纬度" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="address" label="门店地址" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="status" width="120" label="门店状态" align="center">
              <template slot-scope="scope">
                <span>{{ $enum.storeStatus[scope.row.status] }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" width="145" label="创建时间" align="center">
            </el-table-column>
            <el-table-column prop="updatedAt" width="145" label="更新时间" align="center">
            </el-table-column>
            <el-table-column label="操作" align="left" width="170">
              <template slot-scope="scope">
                <el-link type="info" :underline="false" @click="crud.toEdit(scope.row)">修改</el-link>
                <el-link type="info" :underline="false" @click="remove(scope.row)">删除</el-link>
                <el-link type="danger" v-authority="['storeList:businessApply']" v-if="scope.row.status==1" :underline="false" @click="switchStatus(scope.row,2)">暂停营业</el-link>
                <el-link type="success" v-authority="['storeList:businessApply']" v-if="scope.row.status==2" :underline="false" @click="switchStatus(scope.row,1)">营业</el-link>
                <el-link type="info" v-authority="['storeList:systemApply']"  :underline="false" @click="systemApply(scope.row,1)">平台审核</el-link>
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <pagination />
          <jForm />
        </div>
      </div>
    </div>
  </template>
  <script>
  import CRUD, { presenter,form } from '@crud/crud'
  import curdStore from '@/api/business/store';
  import OPTOperation from '@crud/OPT.operation'
  import pagination from '@crud/Pagination'
  import jForm from './storeEdit';

  export default {
    components: {
      OPTOperation,
      pagination,
      jForm
    },
    cruds() {
      return CRUD({
        title: '门店',
        url: '/store/getByCondition',
        crudMethod: { ...curdStore }
      })
    },
    mixins: [presenter()],
    data() {
      return {
      }
    },
    methods: {
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
      this.$msg.confirm(`确认删除此条数据吗，删除后不可恢复`, {
        ok: () => {
          this.crud.delAllLoading = true;
          this.crud.doDelete(row);
        },
        cancel: () => {},
      });
    },
    systemApply(row,status){
        this.$msg.confirm(`确定通过审核吗，操作后不可恢复`, {
        ok: () => {
          this.crud.delAllLoading = true;
          row.status = status; // 修改为营业中
          this.crud.toEdit(row);
        },
        cancel: () => {},
      });
    },
    switchStatus(row,status){
        let confirmText = status==1?'确定营业吗，操作后不可恢复':'确定暂停营业吗，暂停后将限制接单？';
        this.$msg.confirm(confirmText, {
        ok: () => {
          this.crud.delAllLoading = true;
          row.status = status; // 修改为营业中
          this.crud.toEdit(row);
        },
        cancel: () => {},
      });
    },
    }
  }
  </script>
  <style scoped>
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
  