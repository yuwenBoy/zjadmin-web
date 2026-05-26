<template>
    <!-- 批量关联 -->
    <my-dialog append-to-body :close-on-click-modal="false" :visible.sync="dialogVisible" @close="handleCancel" :key="dialogKey"
           :title="title" width="50%" @cancel="handleCancel" custom-class="xin-dialog">
        <template #content>
             <el-row :gutter="24">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">    
                  <div class="text item" style="margin-bottom:10px;">
                      <el-row :gutter="24">
                          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                              <el-button type="info" round icon="el-icon-sort" size="mini" @click="toggleExpandAll">展开/折叠</el-button>
                          </el-col>
                    
                      </el-row>
                  </div>
                  <el-table
                       v-if="refreshTable"
                        ref="table"
                        :data="crud.data"
                        row-key="id"
                        :default-expand-all="!isExpandAll"
                        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
                        @select="crud.selectChange"
                        @select-all="crud.selectAllChange"
                  >
                      <el-table-column
                      type="selection"
                      align="center"
                      :selectable="isLastLevelCategory"
                      width="55"
                      />
                      <el-table-column prop="name" label="分类名称" />
                      <el-table-column
                      prop="createdAt"
                      label="创建时间"
                      width="145"
                      />
                      <!--   编辑与删除   -->
                      <el-table-column label="操作" align="left" width="80">
                      <template slot-scope="scope">
                          <el-link
                          type="info"
                          :underline="false" v-if="!scope.row.children"
                          @click="toRelevanceProductCategory(scope.row)"
                          >关联</el-link
                          >
                      </template>
                      </el-table-column>
                  </el-table>
          </el-col>
  </el-row>
</template>
   <!-- 底部操作按钮 -->
   <template #footer>
  <slot name="footer">
    <el-button  type="primary" icon="el-icon-plus" :loading="crud.delAllLoading" :disabled="crud.selections.length === 0" @click="toRelevanceProductCategory(crud.selections)">批量关联</el-button>
    <el-button @click="handleCancel">关闭</el-button>
  </slot>
</template>
</my-dialog>
</template>
<script>
import MyDialog from '@/components/my-dialog';
import CRUD, { presenter } from "@crud/crud";
import {relevanceProductCategory} from "@/api/system/dynamicAttribute";
export default {
components: {MyDialog},
props: {
visible: {
type: Boolean,
default: false
},
attributeId:{
    type:Number,
    value:0,
},
title:{
    type:String,
    default:"",
}
},
cruds() {
  return CRUD({
      url: "productCategory/getByCondition",
  });
},
mixins: [presenter()],
data(){
    return {
          // 是否展开，默认全部展开
        isExpandAll: true,
        refreshTable:true,
        attribute_id:null,
        _title:this.title,
    }
},
computed: {
    dialogVisible: {
        get() {
            return this.visible; // 读取 prop 的值
        },
            set(newVal) {
            this.$emit('update:visible', newVal); // 修改时通知父组件
        }
    },
    dialogKey:{
        get() {
            return this.dKey; // 读取 prop 的值
        },
        set(newVal) {
            this.$emit('update:dKey', newVal); // 修改时通知父组件
        }
    }
},
methods: {
    /**
     * 
     * @param row 只能选中最后一级否则禁用
     */
    isLastLevelCategory(row) {
      // 如果 isLastLevel 为 true，则允许选择，否则禁用复选框
      return !row.children;
    },
    handleClose() {
      this.dialogVisible = false; // 通过 setter 触发事件
      this.dialogKey-=1;
   }, 
    /** 展开/折叠操作 */
    toggleExpandAll() {
            this.refreshTable = false;
            this.isExpandAll = !this.isExpandAll;
            this.$nextTick(() => {
                this.refreshTable = true;
            });
    },       
    toRelevanceProductCategory(datas) {
            let that = this;
            let params = {
                categories:[],
                attributeId:that.attributeId
            }
            if(datas instanceof Array){
                params.categories = datas.map(t=>t.id)
            }else{
                params.categories.push(datas.id);
            }
            this.$msg.confirm(`确认关联该分类吗?`, {
                ok: () => {

                    if(!params.attributeId){
                        this.$msg.alert('属性ID不能为空！',"error");
                        return false;
                    }

                    if(params.categories.length==0){
                        this.$msg.alert('请选择分类！',"error");
                        return false;
                    }
                    relevanceProductCategory(JSON.stringify(params)).then(response => {
                            // 处理响应
                            this.$msg.success('保存成功！');
                            that.crud.delAllLoading = false;
                            this.$emit('update:visible', false); // 关闭时同步状态
                    }).catch(error => {
                            this.$msg.error('操作失败，原因！'+error.msg);
            });
        },
    });
},
handleCancel() {
  this.$emit('update:visible', false); // 关闭时同步状态
},
},
watch:{
    attributeId(val, oldVal) {
      this.attribute_id = val;
    },
}
}
</script>
