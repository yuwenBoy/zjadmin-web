<template>
  <el-drawer
    :title="crud.status.title"
    append-to-body
    :close-on-click-modal="false"
    :visible.sync="crud.status.cu > 0"
    :before-close="crud.cancelCU"
    size="50%"
  >
    <div
      class="demo-drawer__footer"
      style="text-align: center;margin-bottom:20px;"
    >
      <el-button
        :loading="crud.status.cu === 2"
        type="success"
        size="mini"
        icon="el-icon-circle-plus"
        @click="crud.submitCU"
      >提交</el-button>
      <el-button
        type="default"
        size="mini"
        icon="el-icon-remove-outline"
        @click="crud.cancelCU"
      >关闭</el-button>
    </div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item
            label="公告标题"
            prop="title"
          >
            <el-input
              v-model="form.title"
              clearable
              placeholder="请输入公告标题"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="公告类型"
            prop="type"
          >
            <el-select
              v-model="form.type"
              style="width: 208px"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="(val,key) in $enum.noticeTypeList"
                :key="key"
                :label="val.name"
                :value="val.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="级别">
            <el-radio-group v-model="form.priority">
              <el-radio-button label="0">紧急</el-radio-button>
              <el-radio-button label="1">高</el-radio-button>
              <el-radio-button label="2">普通</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="公告内容">
            <quill-editor
              ref="myQuillEditor"
              v-model="form.content"
              :options="editorOption"
              style="height:260px;width:96%"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @ready="onEditorReady($event)"
              @change="onEditorChange($event)"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-drawer>
</template>

<script>
import { form } from '@crud/crud'
import { quillEditor } from 'vue-quill-editor'
const defaultForm = {
  id: null,
  title: '',
  priority: '2',
  content: '',
  type: ''
}
export default {
  mixins: [form(defaultForm)],
  data() {
    return {
      rules: {
        title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }]
      },
      editorOption: {}
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  methods: {
    onEditorBlur(quiller) {},
    onEditorFocus(quiller) {},
    onEditorReady(quiiler) {},
    onEditorChange(quiiler) {}
  },
  // eslint-disable-next-line vue/order-in-components
  components: {
    // eslint-disable-next-line vue/no-unused-components
    quillEditor
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
