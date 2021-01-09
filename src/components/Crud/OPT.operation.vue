<template>
  <span>
    <el-button
      class="filter-item"
      size="mini"
      type="success"
      round
      icon="el-icon-search"
      @click="crud.toQuery"
    >搜索</el-button>
    <el-button
      class="filter-item"
      size="mini"
      type="warning"
      round
      icon="el-icon-refresh-left"
      @click="crud.resetQuery"
    >重置</el-button>
    <el-button
      v-if="crud.optShow.add"
      class="filter-item"
      size="mini"
      type="primary"
      icon="el-icon-plus"
      @click="crud.toAdd"
      round
    >新增</el-button>
    <el-button
      v-if="crud.optShow.edit"
      class="filter-item"
      size="mini"
      type="success"
      icon="el-icon-edit"
      round
      :disabled="crud.selections.length !== 1"
      @click="crud.toEdit(crud.selections[0])"
    >修改</el-button>
    <el-button
      v-if="crud.optShow.del"
      slot="reference"
      class="filter-item"
      type="danger"
      icon="el-icon-delete"
      size="mini"
      round
      :loading="crud.delAllLoading"
      :disabled="crud.selections.length === 0"
      @click="toDelete(crud.selections)"
    >删除</el-button>
  </span>
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