<template>
          <!-- 批量关联 -->
          <my-dialog append-to-body :close-on-click-modal="false" :visible.sync="dialogVisible" :key="dialogKey" @close="handleCancel"
                 :title="title" width="50%" @confirm="handleConfirm" @cancel="handleCancel" custom-class="xin-dialog">
                    <template #content>
                   <el-row :gutter="24">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">    
                        <div class="text item">
                            <el-table
                            ref="table"
                            :data="crud.data"
                            highlight-current-row
                            @selection-change="crud.selectionChangeHandler"
                        >
                            <el-table-column
                            type="selection"
                            align="center"
                            width="55"
                            />
                            <el-table-column prop="product_category.id" label="分类ID" width="80"/>
                            <el-table-column prop="product_category.name" label="分类名称" />
                            <el-table-column
                            prop="createdAt"
                            label="创建时间"
                            width="145"
                            />
                            <!--   编辑与删除   -->
                            <el-table-column label="操作" align="left" width="100">
                            <template slot-scope="scope">
                                <el-link
                                type="info"
                                :underline="false"
                                @click="remove(scope.row)"
                                >移除关联</el-link
                                >
                            </template>
                            </el-table-column>
                        </el-table>
                        <!--分页组件-->
                        <pagination />
                        </div>
                </el-col>
        </el-row>
     </template>
         <!-- 底部操作按钮 -->
         <template #footer>
        <slot name="footer">
          <el-button type="danger" icon="el-icon-delete" :loading="crud.delAllLoading" :disabled="crud.selections.length === 0" @click="remove(crud.selections)">批量移除</el-button>
          <el-button @click="handleCancel">关闭</el-button>
        </slot>
      </template>
        </my-dialog>
</template>
<script>
import MyDialog from '@/components/my-dialog';
import CRUD, { presenter } from "@crud/crud";
import pagination from "@crud/Pagination";
import {batchRemove} from "@/api/system/dynamicAttribute";
  export default {
    components: {MyDialog,pagination},
    props: {
        visible: {
        type: Boolean,
        default: false
        },
        attributeId:{
            type:[String,Number],
            value:'',
        },
        title:{
           type:String,
           default:"",
        }
   },
  cruds() {
        return CRUD({
            url: "productCategory/relevancePageQuery",
        });
    },
    mixins: [presenter()],
data(){
   return{
      _title:this.title
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
mounted(){
},
    methods: {
    // 表格刷新之后
    [CRUD.HOOK.beforeRefresh](crud, form) {
        crud.params.dynamicAttributeId = this.attributeId
    },
      handleClose() {
        this.dialogVisible = false; // 通过 setter 触发事件
        this.dialogKey-=1;
      },
      remove(datas) {
        let that = this;
            let params = {
                categories:[],
                attributeId:that.attributeId
            }
            if(datas instanceof Array){
                params.categories = datas.map(t=>t.product_category.id)
            }else{
                params.categories.push(datas.product_category.id);
            }
            this.$msg.confirm(`确认移除该分类吗?`, {
                ok: () => {

                    if(!params.attributeId){
                        this.$msg.alert('属性ID不能为空！',"error");
                        return false;
                    }

                    if(params.categories.length==0){
                        this.$msg.alert('请选择分类！',"error");
                        return false;
                    }
                    batchRemove(JSON.stringify(params)).then(response => {
                            // 处理响应
                            this.$msg.success('操作成功！');
                            that.crud.delAllLoading = false;
                            that.crud.toQuery();
                            // this.$emit('update:visible', false); // 关闭时同步状态
                    }).catch(error => {
                            this.$msg.error('操作失败，原因！'+error.msg);
            });
        },
    });
      },
      handleConfirm() {
      },
      handleCancel() {
        this.$emit('update:visible', false); // 关闭时同步状态
      },
    },
    watch:{
}
  }
  </script>
