<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="content-box box-shadow">
        <jHeader />
        <crudOperation />
        <!--表格渲染-->
        <el-table ref="table" :data="crud.data" style="width:100%" @selection-change="crud.selectionChangeHandler">
          <el-table-column type="selection" align="center" width="55" />
          <el-table-column type="index" label="序号" align="center" width="50" />
          <el-table-column prop="name" label="职位名称" width="135" />
          <el-table-column prop="code" label="职位编码" width="135" />
          <el-table-column prop="dept.departmentName" label="部门名称" />
          <el-table-column prop="createtime" label="创建日期" width="135">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createtime) }}</span>
            </template>
          </el-table-column>
          <!--   编辑与删除   -->
          <el-table-column label="操作" width="100px" align="left">
            <template slot-scope="scope">
              <el-link v-authority="['position:edit']" type="info" :underline="false" @click="crud.toEdit(scope.row)">编辑</el-link>
              <el-link v-authority="['position:delete']" type="info" :underline="false" @click="remove(scope.row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination />
      </div>
    </div>
    <!--表单渲染-->
    <jForm />
  </div>
</template>

<script>
import crudPosition from '@/api/system/position'
import jHeader from './module/header'
import jForm from './module/form'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
export default {
  name: 'Position',
  components: { jHeader, jForm, crudOperation, pagination },
  cruds() {
    return CRUD({
      title: '职位',
      url: '/api/position/getByCondition',
      crudMethod: { ...crudPosition }
    })
  },
  mixins: [presenter()],
  data() {
    return {
    }
  },
  methods: {
    remove(row) {
      this.$confirm(`确认删除此条数据吗，删除后不可恢复`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.crud.delAllLoading = true
        this.crud.doDelete(row)
      })
        .catch(() => {})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
