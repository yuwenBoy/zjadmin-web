<template>
  <el-drawer
    append-to-body
    :wrapperClosable="false"
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    direction="rtl"
    size="42%"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
  >
    <div class="xin-content">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-position="top"
        label-width="100px"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="特殊日期" prop="specialDate">
              <el-date-picker
                v-model="form.specialDate"
                style="width: 100%"
                type="date"
                clearable
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio-button :label="1">全天休息</el-radio-button>
                <el-radio-button :label="2">特殊营业时段</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 营业时段（仅 type=2 显示） -->
        <template v-if="form.type === 2">
          <el-divider content-position="left">营业时段</el-divider>
          <div
            class="hours-bg"
            v-for="(hItem, hindex) in form.businessHours"
            :key="hindex"
          >
            <el-form-item
              :label="'时段 ' + (hindex + 1)"
              :prop="'businessHours.' + hindex + '.startTime'"
              :rules="{
                required: true,
                message: '请选择开始时间',
                trigger: 'change'
              }"
            >
              <el-time-picker
                size="small"
                v-model="hItem.startTime"
                :clearable="false"
                placeholder="开始时间"
                format="HH:mm"
                value-format="HH:mm"
                @change="validateTimeRange(hindex)"
              >
              </el-time-picker>
              <span style="margin: 0 8px">至</span>
              <el-time-picker
                size="small"
                v-model="hItem.endTime"
                :clearable="false"
                placeholder="结束时间"
                format="HH:mm"
                value-format="HH:mm"
                @change="validateTimeRange(hindex)"
              ></el-time-picker>
              <el-link
                v-show="form.businessHours.length > 1"
                type="danger"
                :underline="false"
                style="margin-left: 12px"
              >
                <i class="el-icon-delete" @click="removeHours(hindex)"></i>
              </el-link>
            </el-form-item>
          </div>
          <el-link
            style="padding-left: 8px; margin-bottom: 12px"
            :underline="false"
            type="primary"
            icon="el-icon-plus"
            v-show="form.businessHours.length < maxHours"
            @click="addHours"
            >新增时段（{{ form.businessHours.length }}/{{ maxHours }}）</el-link
          >
        </template>

        <!-- 全天休息时的提示 -->
        <template v-if="form.type === 1">
          <el-alert
            title="当天将不接单，已存在的预约订单需人工处理"
            type="warning"
            :closable="false"
            show-icon
          />
        </template>

        <el-divider content-position="left">其他信息</el-divider>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="3"
            v-model="form.remark"
            maxlength="100"
            show-word-limit
            placeholder="如：国庆节、店庆、内部培训等"
          />
        </el-form-item>
      </el-form>
    </div>
    <footer class="xin-footer">
      <el-button
        :loading="crud.status.cu === 2"
        type="success"
        size="mini"
        icon="el-icon-circle-plus"
        @click="crud.submitCU"
        >保存</el-button
      >
      <el-button
        type="default"
        size="mini"
        icon="el-icon-remove-outline"
        @click="crud.cancelCU"
        >关闭</el-button
      >
    </footer>
  </el-drawer>
</template>

<script>
import { form } from '@crud/crud'
import CRUD from '@crud/crud'

const defaultForm = {
  id: null,
  storeId: null,
  specialDate: '',
  type: 2,
  businessHours: [{ startTime: '', endTime: '' }],
  remark: ''
}

export default {
  mixins: [form(defaultForm)],
  data() {
    return {
      maxHours: 3,
      pickerOptions: {
        disabledDate(time) {
          // 允许选择今天及以后的日期
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      rules: {
        specialDate: [
          { required: true, message: '请选择特殊日期', trigger: 'change' }
        ],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }]
      }
    }
  },
  methods: {
    // 新增/编辑前
    [CRUD.HOOK.afterToCU](crud, form) {
      // 新增时从查询条件中带出门店ID
      if (!form.id) {
        form.storeId = crud.query.storeId
        form.type = 2
        form.businessHours = [{ startTime: '', endTime: '' }]
      } else {
        // 编辑场景下补齐 businessHours 结构
        if (form.type === 2) {
          if (!Array.isArray(form.businessHours) || form.businessHours.length === 0) {
            form.businessHours = [{ startTime: '', endTime: '' }]
          }
        }
      }
    },
    // 提交前校验 storeId
    [CRUD.HOOK.beforeValidateCU](crud) {
      if (!crud.form.storeId) {
        this.$msg.alert('请先选择门店', 'warning')
        return false
      }
      return true
    },
    // 提交前校验
    [CRUD.HOOK.afterValidateCU](crud) {
      if (!crud.form.specialDate) {
        this.$msg.alert('请选择特殊日期', 'warning')
        return false
      }
      if (crud.form.type === 2) {
        if (!crud.form.businessHours || crud.form.businessHours.length === 0) {
          this.$msg.alert('请至少添加一个营业时段', 'warning')
          return false
        }
        for (let i = 0; i < crud.form.businessHours.length; i++) {
          const h = crud.form.businessHours[i]
          if (!h.startTime || !h.endTime) {
            this.$msg.alert(`时段 ${i + 1} 的时间不完整`, 'warning')
            return false
          }
          if (h.startTime >= h.endTime) {
            this.$msg.alert(`时段 ${i + 1} 的开始时间必须早于结束时间`, 'warning')
            return false
          }
        }
        // 校验时段之间不能重叠
        const sorted = [...crud.form.businessHours].sort(
          (a, b) => a.startTime.localeCompare(b.startTime)
        )
        for (let i = 0; i < sorted.length - 1; i++) {
          if (sorted[i].endTime > sorted[i + 1].startTime) {
            this.$msg.alert('营业时段之间存在重叠，请检查', 'warning')
            return false
          }
        }
      }
      // 全天休息时清空时段
      if (crud.form.type === 1) {
        crud.form.businessHours = []
      }
      return true
    },
    addHours() {
      this.form.businessHours.push({ startTime: '', endTime: '' })
    },
    removeHours(idx) {
      this.form.businessHours.splice(idx, 1)
    },
    validateTimeRange(idx) {
      const h = this.form.businessHours[idx]
      if (h.startTime && h.endTime && h.startTime >= h.endTime) {
        this.$msg.alert('开始时间必须早于结束时间', 'warning')
      }
    }
  }
}
</script>
<style scoped>
.xin-content {
  padding: 16px 20px;
}
.xin-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 20px;
  border-top: 1px solid #eee;
  background: #fff;
  text-align: right;
}
.hours-bg {
  background: #f5f7fc;
  border-radius: 4px;
  margin-bottom: 12px;
  padding: 12px;
}
.el-divider__text {
  font-size: 13px;
  color: #909399;
}
</style>
