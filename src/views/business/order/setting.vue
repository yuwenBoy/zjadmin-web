<template>
  <div class="setting-container">
    <el-card shadow="hover">
      <template slot="header">
        <div class="card-header">
          <span>订单设置</span>
        </div>
      </template>
      <el-form :model="settings" label-width="120px">
        <el-form-item label="自动接单">
          <el-switch v-model="settings.autoAccept" />
        </el-form-item>
        <el-form-item label="接单超时时间">
          <el-input-number v-model="settings.acceptTimeout" :min="1" :max="60" :step="1" />
          <span style="margin-left: 10px">分钟</span>
        </el-form-item>
        <el-form-item label="出餐超时时间">
          <el-input-number v-model="settings.processTimeout" :min="1" :max="60" :step="1" />
          <span style="margin-left: 10px">分钟</span>
        </el-form-item>
        <el-form-item label="配送超时时间">
          <el-input-number v-model="settings.deliverTimeout" :min="1" :max="120" :step="1" />
          <span style="margin-left: 10px">分钟</span>
        </el-form-item>
        <el-form-item label="订单自动取消时间">
          <el-input-number v-model="settings.autoCancelTimeout" :min="1" :max="60" :step="1" />
          <span style="margin-left: 10px">分钟</span>
        </el-form-item>
        <el-form-item label="退款处理时间">
          <el-input-number v-model="settings.refundProcessTimeout" :min="1" :max="120" :step="1" />
          <span style="margin-left: 10px">分钟</span>
        </el-form-item>
        <el-form-item label="订单通知方式">
          <el-checkbox-group v-model="settings.notificationMethods">
            <el-checkbox label="系统通知" />
            <el-checkbox label="短信通知" />
            <el-checkbox label="邮件通知" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="订单打印设置">
          <el-switch v-model="settings.autoPrint" />
          <span style="margin-left: 10px">自动打印订单</span>
        </el-form-item>
        <el-form-item label="打印模板">
          <el-select v-model="settings.printTemplate" placeholder="请选择打印模板">
            <el-option label="标准模板" value="standard" />
            <el-option label="简约模板" value="simple" />
            <el-option label="详细模板" value="detailed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveSettings">保存设置</el-button>
          <el-button @click="resetSettings">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "Setting",
  data() {
    return {
      settings: {
        autoAccept: false,
        acceptTimeout: 5,
        processTimeout: 15,
        deliverTimeout: 30,
        autoCancelTimeout: 30,
        refundProcessTimeout: 60,
        notificationMethods: ['系统通知'],
        autoPrint: true,
        printTemplate: 'standard'
      }
    };
  },
  methods: {
    saveSettings() {
      this.$msg.confirm('确定要保存设置吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 模拟API请求
        setTimeout(() => {
          this.$msg.success('设置保存成功');
        }, 500);
      }).catch(() => {});
    },
    resetSettings() {
      this.settings = {
        autoAccept: false,
        acceptTimeout: 5,
        processTimeout: 15,
        deliverTimeout: 30,
        autoCancelTimeout: 30,
        refundProcessTimeout: 60,
        notificationMethods: ['系统通知'],
        autoPrint: true,
        printTemplate: 'standard'
      };
    }
  },
};
</script>
<style scoped>
.setting-container {
  background-color: #ffffff;
  margin-top: 20px;
  padding: 15px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>