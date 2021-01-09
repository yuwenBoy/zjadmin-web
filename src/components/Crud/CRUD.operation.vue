 <template>
   <div class="crud-opts">
    <span class="crud-opts-left">
      <!--左侧插槽-->
      <slot name="left" />
      <!-- <el-button
//         v-if="crud.optShow.add"
//         class="filter-item"
//         size="mini"
//         type="primary"
//         icon="el-icon-plus"
//         @click="crud.toAdd"
//         round
//       >
//         新增
//       </el-button>
//       <el-button
//         v-if="crud.optShow.edit"
//         class="filter-item"
//         size="mini"
//         type="success"
//         icon="el-icon-edit"
//         round
//         :disabled="crud.selections.length !== 1"
//         @click="crud.toEdit(crud.selections[0])"
//       >
//         修改
//       </el-button>
//       <el-button
//         v-if="crud.optShow.del"
//         slot="reference"
//         class="filter-item"
//         type="danger"
//         icon="el-icon-delete"
//         size="mini"
//         round
//         :loading="crud.delAllLoading"
//         :disabled="crud.selections.length === 0"
//         @click="toDelete(crud.selections)"
//       >
//         删除
//       </el-button> -->
       <!--右侧-->
       <slot name="right" />
     </span>
     <!-- <el-button-group class="crud-opts-right">
//       <el-button
//         size="mini"
//         plain
//         type="info"
//         icon="el-icon-search"
//         @click="toggleSearch()"
//       />
//       <el-button
//         size="mini"
//         icon="el-icon-refresh"
//         @click="crud.refresh()"
//       />
//       <el-popover
//         placement="bottom-end"
//         width="150"
//         trigger="click"
//       >
//         <el-button
//           slot="reference"
//           size="mini"
//           icon="el-icon-s-grid"
//         >
//           <i
//             class="fa fa-caret-down"
//             aria-hidden="true"
//           />
//         </el-button>
//         <el-checkbox
//           v-model="allColumnsSelected"
//           :indeterminate="allColumnsSelectedIndeterminate"
//           @change="handleCheckAllChange"
//         >
//           全选
//         </el-checkbox>
//         <el-checkbox
//           v-for="item in tableColumns"
//           :key="item.property"
//           v-model="item.visible"
//           @change="handleCheckedTableColumnsChange(item)"
//         >
//           {{ item.label }}
//         </el-checkbox>
//       </el-popover>
//     </el-button-group> -->
   </div>
 </template>
 