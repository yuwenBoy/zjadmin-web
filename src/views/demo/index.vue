 <template>
  <div>
   <table cellspacing=0 border=1 v-for="(item,index) in list"  :key="index" style="text-align: center;">
    <tr v-if="index==0">
        <td width="200" style="text-align: center;">区县名称</td>
        <td width="200" style="text-align: center;">区县id</td>
        <td width="200" style="text-align: center;">街道名称</td>
        <td width="200" style="text-align: center;">街道id</td>
    </tr>
    <tr v-for="(cItem,index) in item.children" :key="index">
                <td width="200" style="text-align: center;">{{ item.name }}</td>
                <td width="200" style="text-align: center;">{{ item.id }}</td>
                <td width="200" style="text-align: center;">{{ cItem.name }}</td>
                <td width="200" style="text-align: center;"> {{ cItem.id }}</td>
        </tr>
</table> 
  </div>
 </template>
<script>
 import { getCityDataApi } from '@/api/base';
 export default{
    data(){
        return {
            list:[],
        }
    },
    methods:{
        flattenRegions(regions) {  
  let flatData = [];  
  regions.forEach(region => {  
    // 添加地区本身作为一行  
    flatData.push([region.id, region.name, '']); // 第三个字段留空或用于其他目的  
  
    // 遍历子地区并添加为额外的行  
    if (region.children) {  
      region.children.forEach(child => {  
        flatData.push([child.id, child.name, region.name]); // 第一个字段留空表示子地区，第三个字段显示父地区名称  
      });  
    }  
  });  
  return flatData;  
},  
        async getCityData() {
      const res = await getCityDataApi();
      this.list =res.result
      console.log(this.list);
      res.result && console.table(this.flattenRegions(res.result))
    },
    },
    mounted(){
        this.getCityData();
    }
 }
</script>
