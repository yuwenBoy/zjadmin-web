<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :xs="9" :sm="6" :md="5" :lg="4" :xl="4">
        <div style="padding-top: 10px">
          <dept-tree :data="deptEntity" :checkValue="[]" @change="change" />
        </div>
      </el-col>
      <el-col
        :xs="15"
        :sm="18"
        :md="20"
        :lg="20"
        :xl="20"
        style="padding-left: 0px"
      >
        <div class="head-container">
          <div class="content-box box-shadow">
            <div class="text item">
              <el-row :gutter="24">
                <el-col :xs="15" :sm="14" :md="16" :lg="16" :xl="1">
                  <el-form label-width="0px" inline>
                    <el-form-item>
                      <el-input
                        v-model="crud.query.cname"
                        clearable
                        size="mini"
                        autofocus
                        placeholder="姓名、手机、邮箱"
                        class="filter-item round-left"
                      />
                    </el-form-item>
                    <!-- <el-form-item>
                      <Department
                        v-model="crud.query.departmentId"
                        :is-lazy="isLazy"
                        placeholder="所在部门"
                        :is-reset-val="isResetVal"
                        @input="updateLyDeptId"
                      />
                    </el-form-item> -->
                    <el-form-item>
                      <el-select
                        v-model="crud.query.disabled"
                        clearable
                        placeholder="用户状态"
                        class="wt100"
                      >
                        <el-option label="启用" value="1" />
                        <el-option label="锁定" value="2" />
                      </el-select>
                    </el-form-item>
                    <OPTOperation />
                  </el-form>
                </el-col>
                <el-col
                  :xs="9"
                  :sm="8"
                  :md="8"
                  :lg="8"
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
                    @click="crud.toAdd"
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
                  <el-button
                    type="info"
                    class="filter-item"
                    round
                    plain
                    icon="el-icon-upload2"
                    size="mini"
                    @click="handleImport"
                    >导入</el-button
                  >
                  <el-button
                    type="warning"
                    class="filter-item"
                    round
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                    >导出</el-button
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
              <el-table-column
                type="selection"
                :selectable="checkboxT"
                align="center"
                width="55"
              />
              <!-- <el-table-column
                type="index"
                label="序号"
                align="center"
                width="50"
              /> -->
              <el-table-column prop="avatar" label="头像" width="80">
                <template slot-scope="scope">
                  <div
                    v-if="!scope.row.avatar"
                    style="
                      width: 32px;
                      height: 32px;
                      border-radius: 50%;
                      background: #0cded4;
                      line-height: 32px;
                      text-align: center;
                      font-size: 12px;
                      color: #fff;
                      border: 1px solid #0cded4;
                    "
                  >
                    <span v-if="scope.row.cname.length > 2">{{
                      scope.row.cname.substr(
                        scope.row.cname.length - 2,
                        scope.row.cname.length - 1
                      )
                    }}</span>
                    <span v-else>{{ scope.row.cname }}</span>
                  </div>
                  <el-image
                    v-else
                    style="
                      width: 32px;
                      height: 32px;
                      border-radius: 50%;
                      line-height: 32px;
                      text-align: center;
                    "
                    :src="'//localhost:8080/' + scope.row.avatar.split('\\')[3]"
                    :preview-src-list="[
                      '//localhost:8080/' + scope.row.avatar.split('\\')[3],
                    ]"
                  ></el-image>
                </template>
              </el-table-column>
              <el-table-column
                prop="username"
                width="120"
                label="账号"
                align="center"
              />
              <el-table-column prop="cname" label="姓名" align="center" />
              <el-table-column
                prop="sex"
                label="性别"
                width="50"
                align="center"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.sex == 1" class="text-primary">男</span>
                  <span v-else-if="scope.row.sex == 2" class="text-success"
                    >女</span
                  >
                  <span v-else class="text-primary">未识别</span>
                </template>
              </el-table-column>

              <!-- <el-table-column prop="birthday" label="年龄" align="center">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.birthday) | fmt_age }}</span>
                </template>
              </el-table-column> -->
              <!-- <el-table-column prop="dept.departmentName" width="150" align="center" show-overflow-tooltip label="部门/职位">
            <template slot-scope="scope">
              {{ scope.row.dept.departmentName }}<span>/</span>{{ scope.row.position.name }}
            </template>
          </el-table-column> -->
              <el-table-column
                prop=""
                label="手机号"
                width="120"
                align="center"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.phone">{{
                    scope.row.phone | fmt_phone
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="dept_id.department_name"
                label="机构"
                width="120"
                align="center"
              />
              <el-table-column
                prop="position_id.name"
                label="职位"
                width="120"
                align="center"
              />
              <el-table-column prop="disabled" label="状态" align="center">
                <template slot-scope="scope">
                  <el-tooltip
                    :content="scope.row.disabled == 1 ? '正常' : '锁定'"
                    placement="top"
                  >
                    <el-switch
                      v-model="scope.row.disabled"
                      active-color="#ff4949"
                      inactive-color="#13ce66"
                      :active-value="2"
                      :inactive-value="1"
                      :disabled="scope.row.id == 19"
                      @change="setUserDisabled(scope.row)"
                    >
                    </el-switch>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                prop="create_time"
                width="145"
                label="创建时间"
                align="center"
              />
              <!--   编辑与删除   -->
              <el-table-column label="操作" align="left" width="170">
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
                    type="info"
                    :underline="false"
                    :disabled="scope.row.id === user.id"
                    @click="remove(scope.row)"
                    >删除</el-link
                  >
                  <el-link
                    v-authority="['user:setRole']"
                    type="info"
                    :underline="false"
                    @click="setRole(scope.row)"
                    >设置角色</el-link
                  >
                </template>
              </el-table-column>
            </el-table>
            <!--分页组件-->
            <pagination />
            <jForm />
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :visible="status > 0"
      title="设置角色"
      width="700px"
      :before-close="handleClose"
    >
      <el-checkbox-group v-if="request" v-model="roles">
        <el-checkbox
          v-for="role in roleList"
          :key="role.value"
          :label="role.value"
          >{{ role.name }}</el-checkbox
        >
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="success"
          size="mini"
          icon="el-icon-circle-plus"
          @click="saveRoles"
          >保存</el-button
        >
        <el-button
          type="default"
          size="mini"
          icon="el-icon-remove-outline"
          @click="cancelRoles"
          >关闭</el-button
        >
      </div>
    </el-dialog>
    <!-- 用户导入对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate"
            >下载模板</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import crudUser from "@/api/system/user";
import { setRoles, UpdateUserDisabled, exportUser,importTemplate } from "@/api/system/user";
import { getDeptTree } from "@/api/system/department";
import { getRoleAllList } from "@/api/system/role";
import DeptTree from "@/components/dept-tree/dept-tree.vue";
import CRUD, { presenter } from "@crud/crud";
import OPTOperation from "@crud/OPT.operation";
import pagination from "@crud/Pagination";
import jForm from "./userEdit";
import { mapGetters } from "vuex";
import Avatar from "@/assets/images/avatar.png";
import { getToken } from "@/utils/storage";
import { excelDownload } from "@/utils";

export default {
  components: {
    OPTOperation,
    DeptTree,
    pagination,
    jForm,
  },
  cruds() {
    return CRUD({
      title: "用户",
      url: "/user/getByCondition",
      crudMethod: { ...crudUser },
    });
  },
  mixins: [presenter()],
  data() {
    return {
      request: false,
      status: 0,
      roles: [],
      roleList: [],
      userId: 0,
      rolesIds: [],
      Avatar: Avatar,
      deptEntity: [],
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASEURL + "/user/import",
      },
    };
  },
  created() {
    this.crud.msg.add = "新增成功，默认密码：jxxqz123";
  },
  computed: {
    ...mapGetters(["user"]),
  },
  mounted() {
    this.getDeptTree();
  },
  methods: {
    // 查询全部机构
    async getDeptTree() {
      let response_data = {};
      response_data = await getDeptTree();
      this.deptEntity = response_data.result;
    },
    toDelete(datas) {
      this.$msg.confirm(`确认删除选中的${datas.length}条数据?`, {
        ok: () => {
          this.crud.delAllLoading = true;
          this.crud.doDelete(datas);
        },
        cancel: () => {},
      });
    },
    remove(obj) {
      this.$msg.confirm(`确认删除账号【${obj.username}】吗，删除后不可恢复`, {
        ok: () => {
          this.crud.delAllLoading = true;
          this.crud.doDelete(obj);
        },
        cancel: () => {},
      });
    },
    // 设置角色
    setRole(obj) {
      this.status = 1;
      this.userId = obj.id;
      this.getRoleData(this.userId);
    },
    checkboxT(row, rowIndex) {
      return row.id !== this.user.id;
    },
    handleClose() {
      this.resetUserRoleForm();
    },
    cancelRoles() {
      this.resetUserRoleForm();
    },
    // 获取所有角色
    getRoleData(userId) {
      var that = this;
      that.request = false;
      getRoleAllList({ userId: userId })
        .then((res) => {
          if (res.success) {
            that.request = true;
            that.roleList = res.result.roleList;
            for (var i = 0; i < res.result.checkList.length; i++) {
              that.rolesIds.push(res.result.checkList[i].id);
            }
            that.roles = that.rolesIds;
          }
        })
        .catch((error) => {
          reject(error);
        });
    },
    /**
     * 设置用户状态
     */
    setUserDisabled(data) {
      const [id, disabled] = [data.id, data.disabled];
      this.$msg.confirm(
        `您确定${disabled == 2 ? "锁定" : "启用"}账号【${
          data.username
        }】吗，操作后不可恢复?`,
        {
          ok: () => {
            this.crud.loading = true;
            UpdateUserDisabled({
              id: id,
              disabled: disabled,
            }).then((res) => {
              if (res.success) {
                this.crud.loading = false;

                this.$msg.alert("修改成功");
                this.crud.refresh();
              }
            });
          },
          cancel: () => {
            this.crud.refresh();
          },
        }
      );
    },

    // 关闭重置角色窗口
    resetUserRoleForm() {
      this.status = 0;
      this.roles = [];
      this.rolesIds = [];
      this.roleList = [];
    },
    // 保存角色
    saveRoles() {
      if (this.userId === 0) {
        return;
      } else {
        setRoles(JSON.stringify({ userId: this.userId, roles: this.roles }))
          .then((res) => {
            if (res.success) {
              this.$msg.alert("修改成功");
              this.resetUserRoleForm();
            } else {
              Notification.error({
                title: "设置失败",
                duration: 2000,
              });
              this.status = 1;
            }
          })
          .catch(() => {});
      }
    },
    // 切换部门
    change(data) {
      if (data.pid === 0) {
        this.crud.query.deptId = null;
      } else {
        this.crud.query.deptId = data.id;
      }
      this.crud.toQuery();
    },
    /** 批量导出 */
    async handleExport() {
      const response = await exportUser(this.crud.getQueryParams());
      excelDownload(response);
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    async importTemplate() {
      const response = await importTemplate();
      excelDownload(response);
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(
        "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
          response.message +
          "</div>",
        "导入结果",
        { dangerouslyUseHTMLString: true }
      );
      this.crud.toQuery();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
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
