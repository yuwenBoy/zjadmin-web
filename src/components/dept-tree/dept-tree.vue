<template>
  <div>
    <el-input
      clearable
      size="small"
      placeholder="输入机构名称搜索"
      prefix-icon="el-icon-search"
      class="filter-item"
    />
    <el-tree
      style="height: calc(100vh - 200px)"
      :data="treeList"
      default-expand-all
      :props="defaultProps"
      @node-click="handleNodeClick"
    />
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
  },
  data() {
    return {
      defaultProps: { children: "children", label: "label", isLeaf: "leaf" },
      treeList:[]
    };
  },
  mounted() {
    // console.log("父组件调用子组件");
  },
  methods: {
    /**
     * 处理机构展示方式
     */
    arrayToTree(arr, pid) {
      return arr.reduce((res, current) => {
        if (current["parent_id"] === pid) {
          let obj = { name: "", label: "" };
          obj.name = current["department_name"];
          obj.label = current["department_name"];
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
  },
  watch: {
    data(val, oldVal) {
      console.log(val);
      this.treeList = this.arrayToTree(val, 0);
    },
    deep: true, // 深度监听
    immediate: true, // 第一次改变就执行
  },
};
</script>
