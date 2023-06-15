<template>
  <div class="text item">
    <el-row :gutter="24">
      <el-col :span="10">
        <el-form label-width="0px" inline>
          <el-form-item>
            <el-input
              v-model.trim="crud.query.name"
              clearable
              size="small"
              placeholder="请输入职位名称搜索"
              style="width: 200px"
              class="filter-item round-left"
              @keyup.enter.native="crud.toQuery"
            />
          </el-form-item>
          <OPTOperation />
        </el-form>
      </el-col>
      <el-col :push="9" :span="5">
        <el-button
          v-if="crud.optShow.add"
          v-authority="['position:add']"
          class="filter-item"
          size="mini"
          round
          type="primary"
          icon="el-icon-plus"
          @click="crud.toAdd"
          >新增</el-button
        >
        <el-button
          v-authority="['position:delete']"
          class="filter-item"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          round
          :loading="crud.delAllLoading"
          :disabled="crud.selections.length === 0"
          @click="toDelete(crud.selections)"
          >删除</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { crud } from "@crud/crud";
import OPTOperation from "@crud/OPT.operation";
export default {
  mixins: [crud()],
  components: { OPTOperation },
  methods: {
    toDelete(datas) {
      this.$msg.confirm(`确认删除选中的${datas.length}条数据?`, {
        ok: () => {
          this.crud.delAllLoading = true;
          this.crud.doDelete(datas);
        },
        cancel: () => {},
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
