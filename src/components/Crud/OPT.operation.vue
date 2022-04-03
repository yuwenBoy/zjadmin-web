<template>
   <span>
    <el-button class="filter-item" round size="mini" type="primary" icon="el-icon-search" @click="crud.toQuery">搜索</el-button>
    <el-button class="filter-item round-right" size="mini" type="primary" plain native-type="button" icon="el-icon-refresh-left" @click="crud.resetQuery">重置</el-button> 
  </span>
</template>
<script>
import { crud } from '@crud/crud'
export default {
  mixins: [crud()],
  methods: {
  }
}
</script>