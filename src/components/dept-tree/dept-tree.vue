<template>
  <div class="tree-content">
    <el-card>
      <div slot="header" class="clearfix" v-if="title">
          <span style="text-align: right;">{{ title }}</span>
      </div>
      <el-input
        clearable
        v-model="name"
        size="small"
        placeholder="输入名称搜索"
        prefix-icon="el-icon-search"
        class="filter-item"
      />
      <el-tree
        class="child-tree"
        ref="tree"
        :data="treeList"
        :show-checkbox="isShowCheck"
        :check-strictly="isCheckStrictly"
        default-expand-all
        :default-checked-keys="checkList"
        :props="defaultProps"
        node-key="id"
        @node-click="handleNodeClick"
        :filter-node-method="filterNode"
      />
    </el-card>
  </div>
</template>

<script>
export default {
  name: "dept-tree",
  props: {
    data: {
      type: Array,
      default: [],
    },
    showCheckBox: {
      type: Boolean,
      default: false,
    },
    checkStrictly: {
      type: Boolean,
      default: false,
    },
    checkValue: {
      type: Array,
      default: [],
    },
    title:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      name: null,
      defaultProps: { children: "children", label: "label", isLeaf: "leaf" },
      treeList: [], // 树options
      isShowCheck: this.showCheckBox,
      isCheckStrictly: this.checkStrictly,
      checkList: [], // 复选框选中的值
    };
  },
  methods: {
    /**
     * 将数值转换成树形展示
     */
    arrayToTree(arr, pid) {
      return arr.reduce((res, current) => {
        if (current["parent_id"] == pid) {
          let obj = { name: "", label: "" };
          obj.name = current["label"];
          obj.label = current["label"];
          obj.id = current["id"];
          obj.pid = current["parent_id"];
          obj.children = this.arrayToTree(arr, current["id"]);
          if (arr.filter((t) => t.parent_id == current["id"]).length == 0) {
            obj.children = undefined;
          }
          return res.concat(obj);
        }
        return res;
      }, []);
    },
    handleNodeClick(data) {
      this.$emit("change", data);
    },
    // 搜索
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 获取选中的数据
    getCheckedNode(){
      return this.$refs.tree.store.getCheckedNodes();
    }
  },
  watch: {
    data(val, oldVal) {
      this.treeList = this.arrayToTree(val, 0);
    },
    checkValue(val, oldVal) {
      console.log(val);     // 清空菜单的选中
      this.$refs.tree.setCheckedKeys([])
      this.checkList = val;
    },
    name(val) {
      this.$refs.tree.filter(val);
    },
    deep: true, // 深度监听
    immediate: true, // 第一次改变就执行
  },
};
</script>
<style lang="scss" scoped>
.tree-content{
  width:100%;
  height:100%;

  .child-tree{
      height: calc(100vh - 210px);
      overflow-y: auto;
      overflow-x: hidden;
  }
}
</style>