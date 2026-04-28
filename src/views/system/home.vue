<template>
  <div class="dashboard-wrapper">
    <business-home v-if="isBusiness" />
    <admin-home v-else />
  </div>
</template>

<script>
import BusinessHome from '@/views/business/home'
import AdminHome from '@/views/system/admin-home'

export default {
  name: 'Dashboard',
  components: {
    BusinessHome,
    AdminHome
  },
  computed: {
    isBusiness() {
      // userType === 1 是系统管理员，其他是商家
      const userType = this.$store.state.user.user.userType
      return userType !== 1
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-wrapper {
  min-height: calc(100vh - 50px);
}
</style>