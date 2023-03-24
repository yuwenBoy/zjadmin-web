<template>
  <div class="tree-content">
    <el-card>
      <div slot="header" class="clearfix">
        <span  v-if="title">{{ title }}</span>
        <el-button :style="{'margin-left':title ? '65px':'80px'}"
        type="primary" plain
        round
        icon="el-icon-sort"
        size="mini"
        @click="nodeExpand(isExpandAll)"
        >展开/折叠</el-button
      >
      </div>
      <el-input
        clearable
        v-model="name"
        size="small"
        placeholder="输入名称搜索"
        prefix-icon="el-icon-search"
        class="filter-item"
        style="padding-bottom: 10px"
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
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      name: null,
      defaultProps: { children: "children", label: "label", isLeaf: "leaf" },
      treeList: [], // 树options
      isShowCheck: this.showCheckBox,
      isCheckStrictly: this.checkStrictly,
      checkList: [], // 复选框选中的值
      isExpandAll:true,
    };
  },
  methods: {
    handleNodeClick(data) {
      this.$emit("change", data);
    },
    // 搜索
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 获取选中的数据
    getCheckedNode() {
      return this.$refs.tree.store.getCheckedNodes();
    },
    nodeExpand(expend) {
      this.isExpandAll = !expend;
      for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
        this.$refs.tree.store._getAllNodes()[i].expanded =  this.isExpandAll;
      }
    },
  },
  watch: {
    data(val, oldVal) {
      this.treeList = val;
      // this.treeList = this.arrayToTree(val, 0);
    },
    checkValue(val, oldVal) {
      console.log(val); // 清空菜单的选中
      this.$refs.tree.setCheckedKeys([]);
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
.tree-content {
  width: 100%;
  height: 100%;

  .child-tree {
    height: calc(100vh - 265px);
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>