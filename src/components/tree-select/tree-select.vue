<template>
  <div>
    <treeselect
      :options="treeList"
      clearable
      :value="nodeId"
      v-model="nodeId"
      no-options-text="暂无可用选项"
      :load-options="loadMenus"
      :normalizer="normalizer"
      placeholder="选择机构"
      @select="treeChange"
      :show-count="true"
      clearValueText=""
    >
    </treeselect>
  </div>
</template>
  
  <script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
export default {
  name: "dept-tree",
  props: {
    data: {
      type: Array,
      default: [],
    },
    value:{
        type:Number,
        default:0
    }
  },
  components: { Treeselect },
  data() {
    return {
      treeList: [],
      nodeId:this.value
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
          current["children"] = this.arrayToTree(arr, current["id"]);
          if (arr.filter((t) => t.parent_id == current["id"]).length == 0) {
            current["children"] = undefined;
          }
          return res.concat(current);
        }
        return res;
      }, []);
    },
    //转换部门数据结构
    normalizer(node) {
      if (node.id> 0 && node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        pid: node.parent_id,
        label: node.department_name,
        name: node.department_name,
        children: node.children,
      };
    },
    treeChange(data) {
      this.$emit("select", data);
    },

    loadMenus({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        parentNode.children = this.arrayToTree(
          this.treeList,
          parentNode.id
        ).map(function (obj) {
          return obj;
        });
        setTimeout(() => {
          callback();
        }, 100);
      }
    },
    treeChange(data) {
      this.$emit("select", data);
    },
    // changeClear(){
    //     this.$emit('clear','');
    // }
  },
  watch: {
    data(val, oldVal) {
      if(this.nodeId>0){
        this.treeList = this.arrayToTree(val, 0);
      }
      else{
        this.treeList = [{id:0,department_name:'全部',children:[]}]
        this.treeList.forEach(item=>{
            item.children = this.arrayToTree(val, 0)
        })
      }
      
    },
    value(val,oldVal){
        this.nodeId = parseInt(val);
    },
    deep: true, // 深度监听
    immediate: true, // 第一次改变就执行
  },
};
</script>
  