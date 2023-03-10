<template>
  <div>
    <el-tree
      style="height: calc(100vh - 200px)"
      :data="deptDatas"
      default-expand-all
      :props="defaultProps"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script>
import { getDeptTree } from "@/api/system/department";
export default {
  name: "dept-tree",
  data() {
    return {
      defaultProps: { children: "children", label: "label", isLeaf: "leaf" },
      dataList: [],
    };
  },
  mounted() {
    this.getDeptTree();
    console.log('父组件调用子组件')
  },
  methods: {
    // 查询全部机构
    async getDeptTree() {
      let response_data = {};
      response_data = await getDeptTree();

      this.arrayToTree(response_data.result, 0);
    },
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
        this.dataList = res;
        return res;
      }, []);
    },
    handleNodeClick(data) {
      this.$emit("change", data);
    },
  },
};
</script>
