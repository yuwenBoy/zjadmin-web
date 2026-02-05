<template>
    <div>
        <el-dropdown>
            <span class="el-dropdown-link">
                {{ storeInfo.storeName }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item,index) in storeList" :key="index"> {{item.storeName}}</el-dropdown-item>
            </el-dropdown-menu>   
        </el-dropdown>
        <el-popover width="280" trigger="click" placement="bottom" :visible-arrow="false" v-model="isPopoverVisible">
            <div class="storeMenuItem">
               <div class="store-name">
                  {{storeInfo.storeName}} 
                  <span v-show="storeInfo.online==1" class="online-up">门店已上线</span>
                  <span v-show="storeInfo.online==0" class="online-down">门店已下线</span>
                </div> 
                <div class="store-down-online-desc">
                        <div class="flex">
                            <div class="tipsLeft">
                                <img src="@/assets/icons/warning.png" />
                                <font>您的门店已经下线，无法正常营业</font> 
                            </div>  
                    </div>  
                </div>
                <div class="flex now-store-status">
                    <span class="text-no-job">
                        今日不营业
                    </span>
                    <span class="edit">修改</span>
                </div>
                <div class="divider"></div>
                <div class="flex order-settiing">
                    <div class="item-content">
                       <div>预订单设置</div>
                       <div style="color: #999;font-size:12px;">提前0-1天预订，支持休息时预订</div>
                    </div>
                    <span class="edit">修改</span>
                </div>
            </div>     
        <div slot="reference" class="store-status"><span class="span-line off-line"></span> 门店已下线</div>
        </el-popover> 
        <el-divider direction="vertical"></el-divider>
        <i class="el-icon-bell right-icon" @click="chatClick"></i>
        <i class="el-icon-question right-icon"></i>
    </div>
</template>
  
  <script>
  export default {
    data() {
      return {
        storeList:[],
        storeInfo:{},
        isPopoverVisible:false,
      }
    },
    watch: {
      $route(route) {
      
      }
    },
    created(){
        this.storeList =this.$store.state.user.user.business.store;
        this.storeInfo = this.$store.state.user.user.business.store.find(t=>t.isDefault==1)
    },
    mounted() {
     
    },
    methods: {
        chatClick(){
            this.$emit('chatClick')
        },
    }
  }
  </script>
  
  <style lang="scss">
      .business-store-container{
        display: inline-block;
        cursor: pointer;
        vertical-align: text-bottom;
        color: #333333;
        font-size: 14px;
        .el-dropdown{padding-right: 50px;.el-dropdown-link{
            color: #333333;
        }}
        .store-status{
           display: inline-block;
           .span-line{
              width: 4px;
              height: 4px;
              display: inline-block;
              border-radius: 50%;
              padding-bottom:3px;
              padding-right: 4px;
              vertical-align: middle;   
           }
           .on-line{
              background: #30B08F;
           }
           .off-line{
              background: #ff4949;
           }
        }
        .right-icon{
            vertical-align: middle; 
            font-size: 18px;
            padding-right: 20px;  
        }
      }

      .storeMenuItem{
        padding: 10px;
        .store-name{
           font-size: 14px;
           padding-right: 10px;
            .online-down{
                background-color: #fee;
                color: #f24e3e;
                margin-left: 5px;
                }
                .online-up{
                    color: #3ecef2;
                    background: #30B08F;
                    font-size: 12px;
                    margin-left: 5px;
                }
        }
        .store-down-online-desc{
            background-color: rgb(253, 246, 234);
            margin-top: 12px;
            border-radius:8px;
            font-size: 12px;
            padding: 6px 8px;
            .tipsLeft{
                img{
                    width: 12px;height: 12px;margin-right: 5px;vertical-align: middle;
                }
            }
            font{color: rgb(255, 145, 0);font-size: 12px;}
        }
        .now-store-status{
            margin-top: 15px;
            font-size: 14px;
            color: #333;
            .edit{
                color: #1a71ff;
                font-weight: 400;
                cursor: pointer;;
            }
        }
        .divider{
            height: 1px;
            width: 100%;
            vertical-align: middle;
            background-color: #dcdfe6;
            margin: 12px 0;
        }
        .order-settiing{
            font-size: 14px;
            color: #333;
            .item-content{
                flex-flow: column;
            }
            .edit{
                color: #1a71ff;
                font-weight: 400;
                cursor: pointer;;
            }
        }
        
     
      }
  </style>
  