<template>
  <div class="app-container">
    <div class="head-container">
      <div class="content-box box-shadow">
        <!-- 公告列表 -->
        <div class="text item">
          <el-row :gutter="24">
            <el-col :span="10">
              <el-button v-if="crud.optShow.add" class="filter-item" size="mini" round type="primary" icon="el-icon-position" @click="crud.toAdd">新增</el-button>
              <el-button class="filter-item" size="mini" round type="danger" icon="el-icon-delete" :loading="crud.delAllLoading" :disabled="crud.selections.length === 0" @click="toDelete(crud.selections)">删除</el-button>
            </el-col>
            <el-col :span="10" :push="4" style="text-align:right;">
              <el-form label-width="0px" inline>
                <el-form-item>
                  <el-input v-model="crud.query.title" clearable size="mini" autofocus placeholder="公告标题" class="filter-item round-left" />
                </el-form-item>
                <OPTOperation />
              </el-form>
            </el-col>
          </el-row>
        </div>
        <el-table ref="table" :data="crud.data" stripe @selection-change="crud.selectionChangeHandler">
          <el-table-column type="selection" align="center" width="55" />
          <el-table-column type="index" label="序号" align="center" width="50" />
          <el-table-column prop="title" label="公告标题" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-link type="primary" @click="$router.push({path:'/news/news/detail',query:{id:scope.row.id}})">{{ scope.row.title }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="type" width="120" label="公告类型" align="center">
            <template slot-scope="scope">
              <span v-for="(item,index) in $enum.noticeTypeList">
                <span v-if="item.id == scope.row.type">{{ item.name }}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="status" width="120" label="审核状态" align="center">
            <template slot-scope="scope">
              <span>{{ $enum.noticeStatus[scope.row.status] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createtime" width="145" label="创建时间" align="center">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createtime) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pubdate" width="145" label="发布时间" align="center">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.pubdate) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="left" width="170">
            <template slot-scope="scope">
              <el-link type="info" :underline="false" @click="crud.toEdit(scope.row)">修改</el-link>
              <el-link type="info" :underline="false" @click="remove(scope.row)">删除</el-link>
              <el-link type="info" :underline="false" @click="$router.push({path:'/news/news/detail',query:{id:scope.row.id}})">查看</el-link>
              <el-link type="info" :underline="false" @click="apply(1,scope.row)">提交</el-link>
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
// https://blog.csdn.net/DamonREN/article/details/83339636
import crudNews from '@/api/news'
import { submitApply } from '@/api/news/index'
import CRUD, { presenter } from '@crud/crud'
import OPTOperation from '@crud/OPT.operation'
import pagination from '@crud/Pagination'
import jForm from './newsEdit'
import { Notification } from 'element-ui'
export default {
  components: {
    OPTOperation,
    pagination,
    jForm
  },
  cruds() {
    return CRUD({
      title: '公告',
      url: '/api/news/getByCondition?status=0',
      crudMethod: { ...crudNews }
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
    remove(obj) {
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
    // 审核通过|审核不通过|撤销|提交审核
    apply(status, row) {
      const title = status === 1 ? '提交成功' : status === 3 ? '审核成功' : '撤销成功'
      row.status = status
      submitApply(JSON.stringify(row)).then((res) => {
        if (res.success) {
          Notification.success({
            title: title,
            duration: 2000
          })
          this.crud.toQuery()
        }
      }).catch((error) => {
        Notification.error({
          title: error,
          duration: 2000
        })
      })
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
