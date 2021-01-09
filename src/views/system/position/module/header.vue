<template>
  <div>
    <el-form label-width="100px" label-position="right">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="职位名称:">
            <el-input
              clearable
              size="small"
              v-model="crud.query.name"
              placeholder="请输入职位名称搜索"
              style="width: 200px"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
          </el-form-item>
        </el-col>
        <el-row :span="16">
          <el-button
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-search"
            @click="crud.toQuery"
            >搜索</el-button
          >
          <el-button
            class="filter-item"
            size="mini"
            type="warning"
            icon="el-icon-refresh-left"
            @click="crud.resetQuery"
            >重置</el-button
          >
          <el-button
            v-if="crud.optShow.add"
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="crud.toAdd"
            v-authority="['position:add']"
            >新增</el-button
          >
          <el-button
            class="filter-item"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :loading="crud.delAllLoading"
            :disabled="crud.selections.length === 0"
            v-authority="['position:delete']"
            @click="toDelete(crud.selections)"
            >删除</el-button
          >
        </el-row>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { crud } from "@crud/crud";
export default {
  mixins: [crud()],
  methods: {
    toDelete(datas) {
      this.$confirm(`确认删除选中的${datas.length}条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.crud.delAllLoading = true;
          this.crud.doDelete(datas);
        })
        .catch(() => {});
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
