<template>
      <div style="width:70%;margin:10px auto;">
        <el-tabs v-model="activeName" @tab-click="handleClick" style="background: #ffffff">
        <el-tab-pane label="基本信息" name="first">
          <div class="storeInfo">
            <div class="storeWapper">
              <div class="storeWapper-Item">
                <div class="text">门店头像</div>
                <div class="describe">
                  <el-image style="width: 45px; height: 45px" src="http://image.jxxqz.com:3001/f4585fd8169142ac8394d5540910acf5.jpeg"></el-image>
                </div>
              </div>
              <div class="operation">上传</div>
            </div>
            <div class="storeWapper">
              <div class="storeWapper-Item">
                <div class="text">门店名称</div>
                <div class="describe">{{ requestStore.storeName }}</div>
              </div>
              <div class="operation" @click="modifyShopEdit">
                <span v-html="getBtnText()"></span>
              </div>
            </div>
            <div class="storeWapper">
              <div class="storeWapper-Item">
                <div class="text">门店电话</div>
                <div class="describe">{{ requestStore.contactInfo }}</div>
              </div>
              <div class="operation">修改</div>
            </div>
            <div class="storeWapper">
              <div class="storeWapper-Item">
                <div class="text">门店地址</div>
                <div class="describe">{{ requestStore.address }}</div>
              </div>
              <div class="operation">
                <span v-html="getBtnText()"></span>
              </div>
            </div>
            <div class="storeWapper">
              <div class="storeWapper-Item">
                <div class="text">门店品类</div>
                <div class="describe"></div>
              </div>
              <div class="operation">
                  <span v-html="getBtnText()"></span>
              </div>
            </div>
            <div class="storeWapper">
              <div class="storeWapper-Item">
                <div class="text">门店照片</div>
                <div class="describe"></div>
              </div>
              <div class="operation">上传</div>
            </div>
            <div class="storeWapper">
              <div class="storeWapper-Item">
                <div class="text">门店二维码</div>
                <div class="describe"></div>
              </div>
              <div class="operation">保存二维码</div>
            </div>
            <div class="storeWapper">
              <div class="storeWapper-Item">
                <div class="text">门店号</div>
                <div class="describe">
                  {{ requestStore.id }}
                </div>
              </div>
            </div>
            <div class="storeWapper">
              <div class="storeWapper-Item">
                <div class="text">申请解除合作</div>
                <div class="describe"></div>
              </div>
              <div class="operation">申请解除</div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="营业信息" name="second">
          <div class="storeInfo">
            <div class="storeWapper">
              <div class="storeWapper-Item">
                <div class="text">营业时间</div>
                <div v-if="isEditBusinessTime">
                  <el-form ref="form" :model="form" size="mini" label-width="70px">
                    <div class="hours-bg" v-for="(item, index) in form.normalServingTimeList" :key="index">
                      <el-form-item label="营业日" prop="storeName">
                            <el-checkbox-group  v-model="item.weeks">
                                <el-checkbox size="mini" v-for="ditem in weekList" :key="ditem.value" :label="ditem.value" border>{{ ditem.name }}</el-checkbox>
                            </el-checkbox-group>
                      </el-form-item>
                      <el-form-item label="营业时段" v-for="(hItem, hindex) in item.buinessHours" :key="hindex">
                        <el-time-picker
                          size="mini"
                          v-model="hItem.startTime"
                          :clearable="false"
                          placeholder="选择时间"
                          format="HH:mm"
                          value-format="HH:mm"
                        >
                        </el-time-picker>
                        <span>至</span>
                        <el-time-picker
                          size="mini"
                          v-model="hItem.endTime"
                          :clearable="false"
                          placeholder="选择时间"
                          format="HH:mm"
                          value-format="HH:mm"
                        ></el-time-picker>
                        <el-link v-show="item.buinessHours.length > 1">
                          <i class="el-icon-delete" @click="removeBuinessHours(index, hindex)"></i></el-link>
                      </el-form-item>
                      <el-link
                        style="padding-left: 65px"
                        :underline="false"
                        type="primary"
                        icon="el-icon-plus"
                        v-show="item.buinessHours.length === maxBuinessHours ? false : true"
                        @click="addBuinessHours(index)">新增营业时段({{ item.buinessHours.length }}/{{maxBuinessHours}})</el-link>
                    </div>
                    <footer>
                      <div style="margin-bottom: 16px">
                        <el-link
                          :underline="false"
                          type="primary"
                          icon="el-icon-plus"
                          @click="addNormalServingTimeList"
                          v-show="isShowAddNormalServingTimeList"
                          >新增营业日</el-link
                        >
                      </div>
                      <el-button type="primary" :disabled="saveNormalServingTimeListDisabled" @click="saveNormalServingTime('form')">保存</el-button>
                      <el-button @click="isEditBusinessTime = false">取消</el-button>
                    </footer>
                  </el-form>
                </div>
                <div class="describe" v-else v-html="flexibleServingTimeStrList.toString().replaceAll(',',',<br />') || '未设置'"></div>
              </div>
              <div class="operation" v-if="!isEditBusinessTime" @click="editBusinessTime">
                修改
              </div>
            </div>
            <div class="storeWapper">
              <div class="storeWapper-Item">
                <div class="text">门店公告</div>
                <div class="describe">未设置</div>
              </div>
              <div class="operation">修改</div>
            </div>
            <div class="storeWapper">
              <div class="storeWapper-Item">
                <div class="text">门店简介</div>
                <div class="describe">未设置</div>
              </div>
              <div class="operation">修改</div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="资质认证" name="third"> 123123131 </el-tab-pane>
        <el-tab-pane label="调控记录" name="fourth"> 123123313 </el-tab-pane>
      </el-tabs>
      </div>
</template>
  <script>
import { updateShopServingTime,queryShopServingTime } from "@/api/business/store"; // 引入接口方法
export default {
  data() {
    return {
      activeName: "first",
      requestStore: {},
      isEditBusinessTime: false,
      maxBuinessHours: 3, // 最大设置三个营业时段
      normalServingTimeListMax: 7, // 最大营业日7个工作日
      saveNormalServingTimeListDisabled: false, // 保存按钮是否禁用
      isShowAddNormalServingTimeList: true, // 是否显示新增营业日按钮
      weekList:[ { value: 1, name: "周一" },
        { value: 2, name: "周二" },
        { value: 3, name: "周三" },
        { value: 4, name: "周四" },
        { value: 5, name: "周五" },
        { value: 6, name: "周六" },
        { value: 0, name: "周日" }], 
      form: {
        storeId: null,
        normalServingTimeList: [
        { weeks: [
       ], buinessHours: [{ startTime: "", endTime: "" }] },
        ],
      },
      flexibleServingTimeStrList:[],
    };
  },
  mounted() {
    this.requestStore = this.$store.state.user.user.business.store.find(
      (t) => t.isDefault == 1
    );
    this.activeName = this.$route.query.name || "first";
    if(this.activeName === 'second'){
       this.queryShopServingTime()
    }
  },
  methods: {
    handleClick(tab, event) {
      if(tab.name === 'second'){
        this.queryShopServingTime()
      }
    },
    modifyShopEdit(){
        this.$router.push({name:'modifyShopEdit',query:{storeId:this.requestStore.id,status:this.requestStore.status }})
    },
    getBtnText(){
        let _status = this.requestStore.status
        if(_status === 0) return '申请修改'
        else if(_status === 1) return '<span style="color:#333">审核中</span>'
        else if(_status === 2) return '<span style="color:#333">审核通过</span>'
        else if(_status === 6) return '<span style="color:#ff1a38">审核驳回</span>'
    },
    /***
     *新增营业日
     */
    addNormalServingTimeList() {
      this.form.normalServingTimeList.push({
        weeks: [],
        buinessHours: [{ startTime: "", endTime: "" }],
      });
    },

    /***
     *新增营业时段
     */
    addBuinessHours(index) {
      this.form.normalServingTimeList[index].buinessHours.push({
        startTime: "",
        endTime: "",
      });
    },
    /***
     *删除营业时段
     */
    removeBuinessHours(index, hIndex) {
      this.form.normalServingTimeList[index].buinessHours.splice(hIndex, 1);
    },
    /**
     * 修改营业时间
     */
    editBusinessTime() {
      this.isEditBusinessTime = true;
    },
    // 查询门店营业时间
    async queryShopServingTime(){
      const response = await queryShopServingTime()
      if(response.result.flexibleServingTimeStrList.length> 0 && response.result.normalServingTimeList.length > 0){
        this.flexibleServingTimeStrList = response.result.flexibleServingTimeStrList
        this.form.normalServingTimeList = response.result.normalServingTimeList
      }
      this.isEditBusinessTime = false
    },
    /***
     多个营业日限制不能重复选中
     */
    isDisabled() {
      // 遍历所有营业日
      for (let i = 0; i < this.form.normalServingTimeList.length; i++) {
        const currentServingTime = this.form.normalServingTimeList[i];
        // 遍历当前营业日的选中周
        for (let j = 0; j < currentServingTime.weeks.length; j++) {
          const currentWeek = currentServingTime.weeks[j];
          // 遍历其他营业日
          for (let k = 0; k < this.form.normalServingTimeList.length; k++) {
            if (k === i) continue; // 跳过当前营业日
            const otherServingTime = this.form.normalServingTimeList[k];
            // 遍历其他营业日的周
            for (let l = 0; l < otherServingTime.weeks.length; l++) {
              const otherWeek = otherServingTime.weeks[l];
              // 如果其他营业日的周与当前营业日的周相同，则禁用
            //   if (currentWeek === otherWeek) {
            //     this.$set(otherWeek, "disabled", true);
            //   } else {
            //     this.$set(otherWeek, "disabled", false);
            //   }
            }
          }
        }
      }
    },
    /**
     * 修改门店营业时间
     * @param form
     */
    saveNormalServingTime(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          updateShopServingTime(this.form)
            .then((response) => {
                this.$msg.success("提交成功")
                this.isEditBusinessTime = false
                this.queryShopServingTime()
            })
            .catch((error) => {
              console.error("Error submitting form:", error)
              this.$msg.error("操作失败，原因！" + error.msg)
            })
        }
      })
    },
  },
  watch: {
    // normalServingTimeList: {
    //   deep: true,
    //   handler(newVal,oldVal) {
    //     if (newVal.normalServingTimeList.length == 7) {
    //       this.isShowAddNormalServingTimeList = false; // 不显示
    //     } else {
    //       this.isShowAddNormalServingTimeList = true; // 显示
    //     }
    //     newVal.normalServingTimeList.forEach((item) => {
    //       if (item.weeks.length === 0 || item.buinessHours.filter((t) => !t.startTime || !t.endTime).length === 0) 
    //       {
    //         this.saveNormalServingTimeListDisabled = true;
    //       } else {
    //         this.saveNormalServingTimeListDisabled = false;
    //         if (item.weeks.length === 7) {
    //           this.isShowAddNormalServingTimeList = false; // 不显示
    //         }
    //       }
    //     });
    //     this.isDisabled();
    //   },
    // },
  },
};
</script>
  <style rel="stylesheet/scss" lang="scss">
.el-tabs {
  background: transparent !important;
  .el-tabs__content {
    background: rgb(255, 255, 255);
    border-radius: 8px;
    height: 76vh;
    overflow-y: auto;
  }
  .el-tabs__item {
    font-size: 16px !important;
    font-weight: 500 !important;
  }
  .el-tabs__active-bar {
    color: #1971ff !important;
  }
  .el-tabs__header {
    background: rgb(255, 255, 255);
    border-radius: 8px;
    height: 60px;
    line-height: 60px;
    padding: 0 16px;
    .el-tabs__item.is-active {
      color: #1989fa !important;
    }
    .el-tabs__nav-wrap::after {
      background: transparent !important;
      height: 3px !important;
    }
  }
}
.storeInfo {
  .storeWapper:first-child {
    border: none;
  }
  .storeWapper {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    border-top: 1px solid #eee;
    &-Item {
      display: flex;
      align-items: center;
    }
    .text {
      width: 100px;
      padding-left: 15px;
    }
    .describe {
      color: #6e6f70;
      line-height: 24px;
    }
    .hours-bg {
      background: rgb(245, 247, 252);
      border-radius: 4px;
      margin-bottom: 12px;
      padding: 12px;
      position: relative;
      .el-checkbox.is-bordered.el-checkbox--mini {
        margin-right: 0px !important;
      }
    }
  }

  .operation {
    width: 100px;
    color: #1989fa;
    cursor: pointer;
  }
  .operation:hover {
    opacity: 0.8;
  }
}
</style>