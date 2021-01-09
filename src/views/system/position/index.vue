<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>职位列表</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            v-model="queryInfo.open"
            @click="isOpen"
            :icon="queryInfo.isQueryOpen==true?'el-icon-arrow-down':'el-icon-arrow-up'"
          >{{queryInfo.queryMsg}}</el-button>
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
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="职位名称" />
          <el-table-column prop="code" label="职位编码" />
          <el-table-column prop="dept.departmentName" label="部门名称" />
          <el-table-column prop="createtime" label="创建日期">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createtime) }}</span>
            </template>
          </el-table-column>
          <!--   编辑与删除   -->
          <el-table-column label="操作" width="130px" align="center" fixed="right">
            <template slot-scope="scope">
              <!-- <udOperation :data="scope.row" /> -->
              <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                      更多
                      <i class="el-icon-arrow-down el-icon--right"></i>
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
import crudPosition from "@/api/system/position";
import jHeader from "./module/header";
import jForm from "./module/form";
import CRUD, { presenter } from "@crud/crud";
import crudOperation from "@crud/CRUD.operation";
import pagination from "@crud/Pagination";
export default {
  name: "Position",
  components: { jHeader, jForm, crudOperation, pagination },
  cruds() {
    return CRUD({
      title: "职位",
      url: "/api/position/getByCondition",
      crudMethod: { ...crudPosition },
    });
  },
  mixins: [presenter()],
  data() {
    return {
      queryInfo: {
        isQueryOpen: false,
        queryMsg: "收起",
        open: "close",
      },
    };
  },
  methods: {
    isOpen() {
      if (this.queryInfo.open == "open") {
        this.queryInfo.isQueryOpen = false;
        this.queryInfo.queryMsg = "收起";
        this.queryInfo.open = "close";
      } else if (this.queryInfo.open === "close") {
        this.queryInfo.isQueryOpen = true;
        this.queryInfo.queryMsg = "展开";
        this.queryInfo.open = "open";
      }
    },
     handleCommand(command) {
      switch (command.command) {
        case "edit":
          this.crud.toEdit(command.obj);
          break;
        case "delete":
          this.$confirm(`确认删除此条数据吗，删除后不可恢复`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.crud.delAllLoading = true;
              this.crud.doDelete(command.obj);
            })
            .catch(() => {});
      }
    },
    beforeHandleCommand(item, obj) {
      return {
        command: item,
        obj: obj,
      };
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
