<template>
  <div class="tree-content">
    <el-card style="height:100%">
      <header class="header flex">
           <span  v-if="title">{{ title }}</span>
           <el-button type="primary" plain round icon="el-icon-sort" size="mini" @click="nodeExpand(isExpandAll)">展开/折叠</el-button>
           <slot name="content"></slot>
      </header>
      <el-input clearable  v-model="name" size="small"  placeholder="输入名称搜索" prefix-icon="el-icon-search" class="filter-item" style="padding-bottom: 10px" />
      <el-tree ref="tree" 
        :data="treeList" 
        :show-checkbox="isShowCheck" 
        :check-strictly="isCheckStrictly"  
        default-expand-all
        :highlight-current="true"
        empty-text="暂无数据"
        :default-checked-keys="checkList"
        :props="defaultProps"
        node-key="id"
        @node-click="handleNodeClick"
        :filter-node-method="filterNode">
            <span class="node-wrapper" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span v-if="opt==1" class="hander-click">
                    <i class="el-icon-plus" title="新增子节点" @click="handleNodeAddClick(data)"></i>
                    <i class="el-icon-edit-outline" title="编辑节点" @click="handleNodeEditClick(data)"></i>
                    <i class="el-icon-remove-outline" title="删除节点" @click="handleNodeRemoveClick(node,data)"></i>
                </span>
            </span>
       </el-tree>
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
    opt:{
        type:Number,
        default:0,
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
    defaultSelectedKey:{
        type:Number,
        default:0
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
      isExpandAll:true,
    };
  },
  mounted() {
    this.setDefaultSelectedKey();
  },
  methods: {
    /**
     * 默认选中数据
     */
    setDefaultSelectedKey() {
      // 如果showCheckBox为false，则默认选中第一个节点
      if (!this.isShowCheck && this.treeList.length > 0) {
        const firstNodeId = this.defaultSelectedKey || this.treeList[0].id;
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(firstNodeId); // 设置默认选中
          // 手动触发@node-click事件
          const firstNodeData = this.findNodeById(this.treeList, firstNodeId);
          console.log(firstNodeData)
          if (firstNodeData) {
            this.handleNodeClick(firstNodeData);
          }
        });
      }
    },
    handleNodeClick(data) {
      this.$emit("change", data);
    },
    handleNodeAddClick(data){
      this.$emit('add',data);
    },
    handleNodeEditClick(data){
      this.$emit('edit',data);
    },
    handleNodeRemoveClick(node,data){
      this.$emit('remove',node,data);
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
    // 查找节点及其父节点
    findNodeById(nodes, id) {
        if (!nodes || nodes.length === 0) {
        return null; // 如果节点数组为空，直接返回 null
  }

  for (const node of nodes) {
    if (node.id === id) {
      return node; // 如果当前节点匹配，返回该节点
    }

    if (node.children && node.children.length > 0) {
      const found = this.findNodeById(node.children, id); // 递归查找子节点
      if (found) {
        return found; // 如果在子节点中找到，返回找到的节点
      }
    }
  }

  return null; // 如果遍历完所有节点仍未找到，返回 null
    },
    // 获取父节点路径的 keys
    getParentKeys(node) {
      const keys = [];
      let parent = node.parent;
      while (parent) {
        keys.push(parent.id);
        parent = parent.parent;
      }
      return keys;
    },
  },
  watch: {
    data(val, oldVal) {
      this.treeList = val;
      console.log(123)
      this.setDefaultSelectedKey();
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
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;

  .header {
    height: 45px;
    line-height: 45px;
    flex-shrink: 0;
  }

  .filter-item {
    flex-shrink: 0;
  }

  .el-tree {
    flex: 1;
    overflow: auto;
  }

  .node-wrapper {
    position: relative;
    padding-right: 100px;
  }

  .hander-click {
    position: absolute;
    right: 0;
    top: 0;
    display: none;
  }

  .node-wrapper:hover .hander-click {
    display: inline-block;
  }
}
</style>