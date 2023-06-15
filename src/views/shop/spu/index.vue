    
<template>
  <div class="app-container">
    <el-row :gutter="24">
      <div class="head-container">
        <div class="content-box box-shadow">
          <div class="text item">
            <el-row :gutter="24">
              <el-col :xs="15" :sm="14" :md="18" :lg="18" :xl="1">
                <el-form label-width="0px" inline>
                  <el-form-item>
                    <el-input
                      v-model="crud.query.goods_name"
                      clearable
                      size="mini"
                      autofocus
                      placeholder="商品名称"
                      class="filter-item round-left"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-select
                      v-model="crud.query.disabled"
                      clearable
                      placeholder="上架状态"
                      class="wt100"
                    >
                      <el-option label="未上架" value="0" />
                      <el-option label="已上架" value="1" />
                    </el-select>
                  </el-form-item>
                  <OPTOperation />
                </el-form>
              </el-col>
              <el-col
                :xs="9"
                :sm="8"
                :md="6"
                :lg="6"
                :xl="2"
                style="text-align: right"
              >
                <el-button
                  v-if="crud.optShow.add"
                  v-authority="['user:add']"
                  class="filter-item"
                  size="mini"
                  round
                  type="primary"
                  icon="el-icon-plus"
                  @click="$router.push({ name: 'edit', query: {} })"
                  >新增</el-button
                >
                <el-button
                  v-authority="['user:delete']"
                  class="filter-item"
                  size="mini"
                  round
                  type="danger"
                  icon="el-icon-delete"
                  :loading="crud.delAllLoading"
                  :disabled="crud.selections.length === 0"
                  @click="toDelete(crud.selections)"
                  >删除</el-button
                >
              </el-col>
            </el-row>
          </div>
          <el-table
            ref="table"
            :data="crud.data"
            stripe
            @selection-change="crud.selectionChangeHandler"
          >
            <el-table-column prop="id" width="120" label="ID" align="center" />
            <el-table-column
              prop="goods_name"
              width="120"
              label="商品名称"
              align="center"
            />
            <el-table-column prop="cname" label="一级分类名称" align="center" />
            <el-table-column prop="cname" label="二级分类名称" align="center" />
            <el-table-column
              prop="sex"
              label="所属品牌"
              width="80"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="" label="图片" width="120" align="center">
            </el-table-column>
            <el-table-column
              prop="sex"
              label="上架状态"
              width="80"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="create_time"
              width="145"
              label="创建时间"
              align="center"
            />
            <!--   编辑与删除   -->
            <el-table-column label="操作" align="left" width="120">
              <template slot-scope="scope">
                <el-link
                  v-authority="['user:edit']"
                  type="info"
                  :underline="false"
                  @click="crud.toEdit(scope.row)"
                  >编辑</el-link
                >
                <el-link
                  v-authority="['user:delete']"
                  type="danger"
                  style="font-size: 12px"
                  :underline="false"
                  :disabled="scope.row.id === user.id"
                  @click="remove(scope.row)"
                  >删除</el-link
                >
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <pagination />
        </div>
      </div>
    </el-row>
  </div>
</template>
  <script>
import crudUser from "@/api/shop/goods";
import CRUD, { presenter } from "@crud/crud";
import OPTOperation from "@crud/OPT.operation";
import pagination from "@crud/Pagination";
import { mapGetters } from "vuex";
export default {
  components: {
    OPTOperation,
    pagination,
  },
  cruds() {
    return CRUD({
      title: "用户",
      url: "/spu/getByCondition",
      crudMethod: { ...crudUser },
    });
  },
  mixins: [presenter()],
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["user"]),
  },
  mounted() {},
  methods: {
    toDelete(datas) {
      this.$msg.confirm(`确认删除选中的${datas.length}条数据?`, {
        ok: () => {
          this.crud.delAllLoading = true;
          this.crud.doDelete(row);
        },
      });
    },

    remove(obj) {
      this.$confirm(
        `确认删除账号【${obj.username}】吗，删除后不可恢复`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.crud.delAllLoading = true;
          this.crud.doDelete(obj);
        })
        .catch(() => {});
    },
  },
};
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
  