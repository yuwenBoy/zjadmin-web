<template>
  <el-button
    class="tools-open"
    type="text"
    v-model="tools.isOpen"
    @click="change"
    :icon="tools.isOpen?'el-icon-arrow-up':'el-icon-arrow-down'"
  ><span v-show="tools.isOpen">{{ tools.fMessage }}</span>
  <span v-show="!tools.isOpen">{{ tools.tMessage }}</span>
  </el-button>
</template>
<script>
export default {
  props:{
    Ttext:{
      type:String,
      default(){
        return "展开"
      }
    },
    Ftext:{
      type:String,
      default(){
        return "收起"
      }
    }
  },
  name: "ToolsOpen",
  data() {
    return {
      tools: {
        tMessage: this.Ttext,
        fMessage:this.Ftext,
        isOpen: false,
      },
    };
  },
  created(){
    console.log(this.tools.message)
  },
  methods: {
    change() {
      if (this.tools.isOpen) {
        this.tools.tMessage;
        this.tools.isOpen = false;
      } else {
        this.tools.fMessage;
        this.tools.isOpen = true;
      }
      this.$emit("open",this.tools.isOpen)
    },
  },
};
</script>
<style scoped>
.tools-open{
     padding: 3px 0;
}
</style>