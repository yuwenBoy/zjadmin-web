 <template>
  <div class="app-container">
    <div class="head-container">
      <div class="content-box box-shadow">
      
        <div class="text item">
          <el-form inline :model="crud.query">
            <el-form-item label="目标类型">
              <el-select v-model="crud.query.targetType"  placeholder="请选择目标类型">
                 <el-option v-for="item in [ { label: '商家信息', value: 1 },{ label: '门店修改', value: 2 },{ label: '骑士信息', value: 3 }]" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
             <el-form-item label="申请人">
              <el-select v-model="crud.query.applicantId"  placeholder="请选择申请人">
                 <el-option v-for="item in [ { label: '商家信息', value: 1 },{ label: '门店修改', value: 2 },{ label: '骑士信息', value: 3 }]" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
             <el-form-item label="审核人">
              <el-select v-model="crud.query.operatorId"  placeholder="请选择审核人">
                 <el-option v-for="item in [ { label: '商家信息', value: 1 },{ label: '门店修改', value: 2 },{ label: '骑士信息', value: 3 }]" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <OPTOperation />
          </el-form>
        </div>
       <div class="tab-container" style="margin-bottom:0">
          <el-tabs v-model="activeStatus" @tab-click="handleTabChange" style="margin-bottom:0">
            <el-tab-pane
              :label="item.label"
              :name="item.value"
              v-for="(item, index) in statusList"
              :key="index"
            >
            </el-tab-pane>
          </el-tabs>
        </div>
        <el-table
          v-if="refreshTable"
          ref="table"
          :data="crud.data"
          row-key="id"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
            :reserve-selection="true"
          />
          <el-table-column prop="id" label="审核ID" align="center" width="80" />
          <el-table-column label="目标类型" prop="targetType" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.targetType === 1">商家</span>
              <span v-if="scope.row.targetType === 2">门店修改</span>
              <span v-if="scope.row.targetType === 3">订单</span>
            </template>
          </el-table-column>
          <el-table-column label="目标对象" prop="targetId" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.targetType === 1">商家</span>
              <span v-if="scope.row.targetType === 2">
                {{ scope.row.store.id }} - {{ scope.row.store.storeName }}
              </span>
              <span v-if="scope.row.targetType === 3">订单</span>
            </template>
          </el-table-column>
          <el-table-column
            label="申请人"
            prop="applicant.cname"
            align="center"
          />
          <el-table-column
            prop="createdAt"
            label="提交时间"
            width="180"
            align="center"
          />
          <el-table-column
            label="审核状态"
            prop="status"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              <span style="color: #ff9800" v-if="scope.row.status == 0"
                >待审核</span
              >
              <span style="color: #4caf50" v-if="scope.row.status == 1"
                >审核通过</span
              >
              <span style="color: #f44336" v-if="scope.row.status == 2"
                >已驳回</span
              >
            </template>
          </el-table-column>
          <!-- 修正：审核人字段 -->
          <el-table-column
            label="审核人"
            prop="operator.cname"
            align="center"
            width="100"
          />
          <!-- 修正：审核时间字段 + 格式化 -->
          <el-table-column
            prop="auditAt"
            label="审核时间"
            width="180"
            align="center"
          />
          <!-- 修正：驳回原因字段 -->
          <el-table-column
            label="驳回原因"
            prop="reason"
            align="center"
            show-overflow-tooltip
            width="180"
          />
          <!-- 编辑与删除 -->
          <el-table-column label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <!-- 仅待审核显示审核按钮 -->
              <el-link
                v-if="scope.row.status === 'pending'"
                type="warning"
                :underline="false"
                @click="
                  $router.push({
                    name: 'businessAuditEdit',
                    query: { ...scope.row },
                  })
                "
                >审核</el-link
              >
              <!-- 查看详情按钮始终显示 -->
              <el-link
                type="info"
                :underline="false"
                style="margin-left: 10px"
                @click="
                  $router.push({
                    name: 'businessAuditEdit',
                    query: { options: 1, ...scope.row },
                  })
                "
                >查看详情</el-link
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import CRUD, { presenter, form } from "@crud/crud";
import OPTOperation from "@crud/OPT.operation";
const defaultForm = {
  id: null,
  name: "",
  is_parent: 0,
  sort: 99,
  parent_id: 0,
  pic: "",
  created_at: undefined,
  updated_at: undefined,
};
export default {
  components: { OPTOperation },
  cruds() {
    return CRUD({
      title: "",
      url: "/business/auditLogList",
      sort: "sort",
    });
  },
  mixins: [presenter(), form(defaultForm)],
  data() {
    return {
      // 重新渲染表格状态
      refreshTable: true,
      // 新增：当前选中的状态Tab
      activeStatus: "-1",
      rules: {
        name: [{ required: true, message: "请输入品类名称", trigger: "blur" }],
        sort: [{ required: true, message: "请选择排序", trigger: "blur" }],
      },
      statusList: [
        { label: "全部数据", value: "-1" },
        { label: "待审核", value: "0" },
        { label: "已通过", value: "1" },
        { label: "已驳回", value: "2" },
      ],
    };
  },
  mounted() {
    // 初始化加载全部数据
    this.loadAuditList();
  },
  methods: {
    // 新增：加载审核列表（带状态筛选）
    loadAuditList() {
      this.refreshTable = false;
      // 组装筛选参数：商家名称 + 状态
      const params = {
        // 全部状态不传status，其他状态传对应值
        status: this.activeStatus === "-1" ? "" : this.activeStatus,
      };
      // 调用CRUD的查询方法，传入筛选参数
      this.crud.query = { ...this.crud.query, ...params };
      this.crud.toQuery();
      // 重新渲染表格
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },

    // 新增：Tab切换事件
    handleTabChange() {
      this.loadAuditList();
    },
  },
  // 监听搜索框变化，支持回车搜索
  watch: {
    "crud.query.title": {
      handler() {
        this.loadAuditList();
      },
      immediate: false,
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
/* 新增：Tab样式优化 */
.tab-container /deep/ .el-tabs__header {
  margin: 0;
}
.tab-container /deep/ .el-tabs__nav-wrap::after {
  display: none;
}
</style>