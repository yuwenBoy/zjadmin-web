<template>
  <div>
    <el-cascader
      v-if="isLazy == true"
      :props="obj_lazyTrue"
      size="small"
      :show-all-levels="false"
      :placeholder="placeholder"
      v-model="deptId"
      clearable
      @change="change"
      @clear="clear"
      ref="sysCascader"
      style="width: 238px"
    ></el-cascader>
    <el-cascader
      v-if="isLazy == false"
      :props="{ expandTrigger: 'hover', checkStrictly: true }"
      :options="options"
      size="small"
      :style="{ width: width + 'px' }"
      :show-all-levels="false"
      :placeholder="placeholder"
      v-model="deptId"
      clearable
      @change="change"
      @clear="clear"
      ref="sysCascader"
    >
      <template slot-scope="{ node, data }">
        <span>{{ data.label }}</span>
        <span v-if="!node.isLeaf"
          >&nbsp;&nbsp;&nbsp;({{ data.children.length }})</span
        >
      </template>
    </el-cascader>
  </div>
</template>
<script>
import { getDepartmentAll, getDepartmentByid } from "@/api/system/department";
export default {
  name: "zj-department",
  props: {
    isLazy: {
      type: Boolean,
      default: false, // 默认不是懒加载方式
    },
    placeholder: {
      type: String,
      default: "请选择部门",
    },
    width: {
      type: String,
      default: "200",
    },
  },
  data() {
    return {
      deptId: {},
      options: [],
      obj_lazyTrue: {
        expandTrigger: "hover", // 鼠标浮动加载下一级
        checkStrictly: true, // 是否可选择任意一级
        lazy: true, // 是否懒加载方式
        lazyLoad(node, resolve) {
          setTimeout(() => {
            getDepartmentByid({
              id: node.value === undefined ? 0 : node.value,
            }).then((res) => {
              if (res.success) {
                const nodes = res.result.map((item) => ({
                  value: item.value,
                  label: item.label,
                  leaf: node.level >= 10,
                }));
                resolve(nodes);
              } else {
                alert(res.message);
              }
            });
          }, 1000);
        },
      },
    };
  },
  watch: {
    deptId(val, oldVal) {
      this.$refs.sysCascader.toggleDropDownVisible(); //监听值发生变化就关闭它
    },
  },
  mounted() {
    if (this.isLazy == false) {
      this.loadDeptData();
    }
    //点击文本就让它自动点击前面的input就可以触发选择。但是因组件阻止了冒泡，暂时想不到好方法来触发。
    setInterval(function () {
      document.querySelectorAll(".el-cascader-node__label").forEach((el) => {
        el.onclick = function () {
          this.previousElementSibling.click();
        };
      });
    }, 500);
  },
  methods: {
    toTree(data) {
      // 删除 所有 children,以防止多次调用
      data.forEach(function (item) {
        delete item.children;
      });

      // 将数据存储为 以 value 为 KEY 的 map 索引数据列
      var map = {};
      data.forEach(function (item) {
        map[item.value] = item;
      });
      //        console.log(map);
      var val = [];
      data.forEach(function (item) {
        // 以当前遍历项，的pid,去map对象中找到索引的id
        var parent = map[item.pid];
        // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
          val.push(item);
        }
      });
      return val;
    },
    loadDeptData() {
      var that = this;
      getDepartmentAll()
        .then((res) => {
          if (res.success) {
            var data = res.result;
            console.time();
            that.options = this.toTree(data);
            console.timeEnd();
          } else {
            alert(res.message);
          }
        })
        .catch((error) => {
          reject(error);
        });
    },
    change() {
      let pathvalue = this.$refs.sysCascader.getCheckedNodes()[0];
      if (pathvalue === undefined) {
        this.$emit("input", null);
      } else {
        let value = pathvalue.value;
        //let label = pathvalue.label;
        this.$emit("input", value); // department.vue 子组件向父组件传递数据使用this.$emit方法
      }
    },
    clear() {
      this.$emit("clear", null);
    },
  },
};
</script>