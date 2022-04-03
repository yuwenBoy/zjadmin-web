<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <el-card class="box-card">
        <div
          slot="header"
          class="clearfix"
        >
          <span>广告列表</span>
        </div>
        <jHeader />
        <crudOperation />
        <!--表格渲染-->
        <el-table
          ref="table"
          v-loading="crud.loading"
          :data="crud.data"
          style="width: 100%;"
          @selection-change="crud.selectionChangeHandler"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="img"
            label="广告图片"
          />
          <el-table-column
            prop="name"
            label="广告名称"
          />
          <el-table-column
            prop="position"
            label="广告位"
          />
          <el-table-column
            prop="link_url"
            label="链接地址"
          />
          <el-table-column
            prop="sort"
            label="排序"
          />
          <el-table-column
            prop="disabled"
            label="是否启用"
          />
          <!--   编辑与删除   -->
          <el-table-column
            label="操作"
            width="130px"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <!-- <udOperation :data="scope.row" /> -->
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  更多
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="beforeHandleCommand('edit',scope.row)"
                    icon="el-icon-edit"
                  >编辑</el-dropdown-item>
                  <el-dropdown-item
                    :command="beforeHandleCommand('delete',scope.row)"
                    icon="el-icon-delete"
                  >删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination />
      </el-card>
    </div>

    <!--表单渲染-->
    <jForm />
  </div>
</template>

<script>
import crudAdvertisement from '@/api/goods/advertisement'
import jHeader from './module/header'
import jForm from './module/form'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
export default {
  components: { jHeader, jForm, crudOperation, pagination },
  cruds() {
    return CRUD({
      title: '广告',
      url: '/api/advertisement/getByCondition',
      crudMethod: { ...crudAdvertisement }
    })
  },
  mixins: [presenter()],
  data() {
    return {}
  },
  methods: {
    handleCommand(command) {
      switch (command.command) {
        case 'edit':
          this.crud.toEdit(command.obj)
          break
        case 'delete':
          this.$confirm(`确认删除此条数据吗，删除后不可恢复`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.crud.delAllLoading = true
              this.crud.doDelete(command.obj)
            })
            .catch(() => {})
      }
    },
    beforeHandleCommand(item, obj) {
      return {
        command: item,
        obj: obj
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
