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
          <el-table ref="table" :data="crud.data" stripe @selection-change="crud.selectionChangeHandler" :max-height="tableMaxHeight">
            <el-table-column type="selection" align="center" width="55" />
            <el-table-column type="index" label="序号" align="center" width="50" />
            <el-table-column prop="id" label="员工ID" align="center" width="80" />
            <el-table-column prop="store.storeName" label="所属门店" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="user.username" label="员工姓名" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="user.nick_name" label="员工昵称" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="user.avatar" label="头像" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="status" width="120" label="员工状态" align="center">
              <template slot-scope="scope">
                <span>{{ $enum.employeeStatus[scope.row.status] }}</span>
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
  import curdEmployee from '@/api/business/employee';
  import OPTOperation from '@crud/OPT.operation'
  import pagination from '@crud/Pagination'
  import jForm from './employeeEdit';
import tableHeightMixin from '@/layout/mixin/tableHeightMixin';

export default {
  components: {
    OPTOperation,
    pagination,
    jForm
  },
  cruds() {
    return CRUD({
      title: '员工',
      url: '/employee/getByCondition',
      crudMethod: { ...curdEmployee }
    })
  },
  mixins: [presenter(), tableHeightMixin],
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
    systemApply(row){
        this.$msg.confirm(`确定通过审核吗，操作后不可恢复`, {
        ok: () => {
          this.crud.delAllLoading = true;
          row.status = 1; // 修改为营业中
          this.crud.toEdit(row);
        },
        cancel: () => {},
      });
    }
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
  