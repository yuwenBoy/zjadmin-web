<template>
  <div class="app-container">
    <div class="head-container">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>用户列表</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            v-model="queryInfo.open"
            @click="isOpen"
            :icon="
              queryInfo.isQueryOpen == true
                ? 'el-icon-arrow-down'
                : 'el-icon-arrow-up'
            "
            >{{ queryInfo.queryMsg }}</el-button
          >
        </div>
        <div class="text item">
          <el-form label-width="100px" label-position="right">
            <el-row :gutter="24">
              <el-col :span="7">
                <el-form-item label="登录账号：">
                  <el-input
                    clearable
                    size="small"
                    v-model="crud.query.userName"
                    placeholder="请输入用户账号"
                    class="filter-item"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="部门：">
                  <zjdepartment
                    @input="updateLyDeptId"
                    :isLazy="isLazy"
                    v-model="crud.query.departmentId"
                    :placeholder="placeholder"
                    :isResetVal="isResetVal"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-button
                  class="filter-item"
                  size="mini"
                  type="success"
                  @click="crud.toQuery"
                  icon="el-icon-search"
                  style="margin-left: 30px"
                  round
                  >搜索</el-button
                >
                &nbsp;&nbsp;
                <el-button
                  class="filter-item"
                  size="mini"
                  type="warning"
                  icon="el-icon-refresh-left"
                  @click="crud.resetQuery"
                  round
                  >重置</el-button
                >
                &nbsp;&nbsp;
                <el-button
                  class="filter-item"
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  round
                  @click="crud.toAdd"
                  v-if="crud.optShow.add"
                  v-authority="['user:add']"
                  >新增</el-button
                >
                &nbsp;&nbsp;
                <el-button
                  class="filter-item"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  :loading="crud.delAllLoading"
                  :disabled="crud.selections.length === 0"
                  @click="toDelete(crud.selections)"
                  v-authority="['user:delete']"
                  round
                  >删除</el-button
                >
              </el-col>
            </el-row>
          
            
              <el-row :gutter="24" v-show="queryInfo.isQueryOpen">
              <el-col :span="7">
                <el-form-item label="姓名：">
                  <el-input
                    clearable
                    size="small"
                    v-model="crud.query.cname"
                    placeholder="请输入姓名"
                    class="filter-item"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="邮箱：">
                  <el-input
                    clearable
                    size="small"
                    v-model="crud.query.email"
                    placeholder="请输入邮箱"
                    class="filter-item"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="手机号：">
                  <el-input
                    clearable
                    size="small"
                    v-model="crud.query.phone"
                    placeholder="请输入手机号"
                    class="filter-item"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <el-table
          ref="table"
          v-loading="crud.loading"
          :data="crud.data"
          style="width: 100%"
          @selection-change="crud.selectionChangeHandler"
        >
          <el-table-column
            type="selection"
            :selectable="checkboxT"
            width="55"
          />
          <el-table-column prop="userName" label="登录账号" />
          <el-table-column prop="cname" label="姓名" />


          <el-table-column prop="sex" label="性别">
            <template slot-scope="scope">
              <span v-if="scope.row.sex == 1">男</span>
              <span v-if="scope.row.sex == 2">女</span>
            </template>
          </el-table-column>
          <el-table-column prop="birthday" label="年龄">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.birthday) | FormatAge }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="dept.departmentName"
            width="150"
            show-overflow-tooltip
            label="部门/职位">
              <template slot-scope="scope">
                         {{scope.row.dept.departmentName}}<span>/</span> {{scope.row.position.name}}
            </template>
            </el-table-column>
          <el-table-column prop="phone" label="手机号" width="100" />
          <el-table-column prop="email" label="邮箱" width="120" show-overflow-tooltip/>
          <el-table-column prop="isdisabled" label="用户状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isdisabled == 1"> 正常启用 </span>
              <span v-if="scope.row.isdisabled == 2" style="color: red">
                禁用
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="createtime" width="140" label="创建日期">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createtime) }}</span>
            </template>
          </el-table-column>
          <!--   编辑与删除   -->
          <el-table-column label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  更多
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="beforeHandleCommand('edit', scope.row)"
                    icon="el-icon-edit"
                    v-authority="['user:edit']"
                    >编辑</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="beforeHandleCommand('delete', scope.row)"
                    icon="el-icon-delete"
                    v-authority="['user:delete']"
                    :disabled="scope.row.id === user.id"
                    >删除</el-dropdown-item
                  >
                  <el-dropdown-item
                    :command="beforeHandleCommand('setRole', scope.row)"
                    icon="el-icon-setting"
                    v-authority="['user:setRole']"
                    >设置角色</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination />
        <jForm />
      </el-card>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :visible="status > 0"
      title="设置角色"
      width="700px"
      :before-close="handleClose"
    >
      <el-checkbox-group v-model="roles">
        <el-checkbox
          v-for="role in roleList"
          :label="role.value"
          :key="role.value"
          >{{ role.name }}</el-checkbox
        >
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="success"
          size="mini"
          @click="saveRoles"
          icon="el-icon-circle-plus"
          >保存</el-button
        >
        <el-button
          type="default"
          size="mini"
          @click="cancelRoles"
          icon="el-icon-remove-outline"
          >关闭</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import crudUser from "@/api/system/user";
import { setRoles } from "@/api/system/user";
import { getRoleAllList, getRoleIdsByUserId } from "@/api/system/role";
import zjdepartment from "@/components/myComponent/zj-department";
import CRUD, { presenter } from "@crud/crud";
import pagination from "@crud/Pagination";
import jForm from "./userEdit";
import { mapGetters } from "vuex";
import { Notification } from "element-ui";
import Avatar from "@/assets/images/avatar.png";
import DateRangePicker from "@/components/DateRangePicker/index.vue"
export default {
  components: { zjdepartment, pagination, jForm,DateRangePicker },
  cruds() {
    return CRUD({
      title: "用户",
      url: "/api/user/getByCondition",
      crudMethod: { ...crudUser },
    });
  },
  mixins: [presenter()],
  data() {
    return {
      placeholder: "请选择部门",
      isLazy: false,
      isResetVal: false,
      queryInfo: {
        isQueryOpen: false,
        queryMsg: "收起",
        open: "close",
      },
      status: 0,
      roles: [],
      roleList: [],
      userId: 0,
      rolesIds: [],
      Avatar: Avatar,
      seledBg: 0,
    };
  },
  created() {
    this.crud.msg.add = "新增成功，默认密码：jxxqz123";
  },
  computed: {
    ...mapGetters(["user"]),
  },
  methods: {
    // 父组件获取子组件的数据
    updateLyDeptId(data) {
      this.crud.query.departmentId = data;
      this.crud.toQuery();
    },
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
    handleCommand(command) {
      switch (command.command) {
        case "edit":
          this.crud.toEdit(command.obj);
          break;
        case "delete":
          this.$confirm(
            `确认删除账号【${command.obj.userName}】吗，删除后不可恢复`,
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then(() => {
              this.crud.delAllLoading = true;
              this.crud.doDelete(command.obj);
            })
            .catch(() => {});
          break;
        case "setRole":
          this.status = 1;
          this.userId = command.obj.id;
          this.getRoleData();
          this.getRoleIdsData(this.userId);
          break;
      }
    },
    beforeHandleCommand(item, obj) {
      return {
        command: item,
        obj: obj,
      };
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
    getRoleData() {
      var that = this;
      getRoleAllList()
        .then((res) => {
          if (res.success) {
            that.roleList = res.result;
          }
        })
        .catch((error) => {
          reject(error);
        });
    },

    // 根据用户获取已设置的角色
    getRoleIdsData(userId) {
      var that = this;
      getRoleIdsByUserId({ userId: userId })
        .then((res) => {
          if (res.success) {
            for (var i = 0; i < res.result.length; i++) {
              that.rolesIds.push(res.result[i].roleId);
            }
            that.roles = that.rolesIds;
          }
        })
        .catch((error) => {
          reject(error);
        });
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
      console.log(this.roles);
      if (this.userId === 0) {
        return;
      } else {
        var param = {
          userId: this.userId,
          roles: this.roles,
        };
        setRoles(JSON.stringify(param))
          .then((res) => {
            if (res.success) {
              Notification.success({
                title: "设置成功",
                duration: 2000,
              });
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
    }
  }
}
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
.spDate {
  margin-right: 8px;
  /* float: left; */
  display: inline-block;
  padding: 5px 6px;
  line-height: 1;
  border-radius: 4px;
  color: #000;
  font-size: 12px;
}
.spDate.selected {
  background: #13c2c2;
  color: #fff;
}
.spDate:hover {
  cursor: pointer;
  color: #13c2c2;
}
.spDate.selected:hover {
  color: #fff;
}
</style>
