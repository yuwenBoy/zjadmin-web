<template>
  <div class="app-container">
    <div class="head-container">
      <div class="content-box box-shadow">
        <div class="text item" style="padding:15px;">
          <h3 style="text-align:center;">
              {{ info.title }}
          </h3>
          <p style="text-align:right;font-size:12px;color:#999;"> 创建人:{{ info.createBy }} &nbsp;&nbsp;创建时间：{{ info.createtime.substr(0,10) }}</p>
          <div v-html="info.content"></div>
           <div style="text-align:center;">
             <el-button class="filter-item" size="mini" round type="primary" @click="$router.back(-1)">返回</el-button>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getNewsById } from "@/api/news/index"
export default {
  data() {
    return {
      newsId: 0,
      info: {}
    }
  },
  methods: {
    getNewsDetailApi(newsId) {
      getNewsById({ id: newsId })
        .then((res) => {
          if (res.success) {
            console.log(res)
            this.info = res.result
          }
        })
        .catch((error) => {
          reject(error)
        })
    }
  },
  mounted() {
    this.newsId = this.$route.query.id
    this.getNewsDetailApi(this.newsId)
  }
}
</script>
