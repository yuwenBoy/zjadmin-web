<template>
  <div style="margin:20px 20px;">
    时间范围：
    <span v-for="(key,value) in textList" class="spClass" :class="{'active':value==active}" @click="selected(value)">
      {{ key }}
    </span>
  </div>
</template>
<script>
import users from '@/api/demo'
export default {
  name: '',
  data() {
    return {
      active: 0,
      textList: ['今天', '本周', '本月', '本季度', '上一年', '指定时间范围']
    }
  },
  methods: {
    selected(val) {
      this.active = val
    }
  },
  mouned() {
    users.list().then((res) => {
      alert(res)
    })
  }
}
</script>
<style>
.spClass{
    margin-right:10px;
    border-radius: 5px;
    font-size: 12px;
    padding: 10 5;
    padding: 5px 7px;
    color: #000;
}
.spClass.active{
   background: #13C2C2;
   color: #fff;
}
.spClass:hover{
  color: #13C2C2;
  cursor: pointer;
}
.spClass.active:hover{
  background: #13C2C2;
   color: #fff;
}
