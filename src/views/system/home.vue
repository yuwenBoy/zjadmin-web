<template>
  <div class="home">
    <div class="box flex">
      <div class="box-shadow left">
        <div class="title flex space-between">
          <span class="fs12">最新通知</span>
        </div>
      </div>
      <div class="box-shadow right">
        <div class="title flex space-between">
          <span class="fs12">系统当前时间</span>
          <i class="el-icon-alarm-clock" />
        </div>
        <div class="content">
          <Clock />
        </div>
      </div>
    </div>
    <div class="box flex">
      <div class="box-shadow left">bottom</div>
      <div class="box-shadow right">
        <div class="title flex space-between" style="margin-bottom: 0px">
          <span class="fs12">选号系统</span>
        </div>
        <div class="choose-context">
          选号方式：<el-radio-group v-model="type" size="small">
            <el-radio
              label="1"
              border
              size="medium"
              @click="choose_type(1)"
              style="margin-right: 0px"
              >自选</el-radio
            >
            <el-radio label="2" border size="medium" @click="choose_type(2)"
              >随机选号</el-radio
            >
          </el-radio-group>
          <el-button type="success" @click="choose_number" plain
            >选号</el-button
          >
          <el-button type="warning" @click="clear_number" plain>清空</el-button>
          <div class="choose-module">
            <ul class="item" v-if="chooseNumberList.length > 0">
              <li
                :class="[
                  key === chooseNumberList.length - 1
                    ? 'item-list-blue'
                    : 'item-list-red',
                  'item-list',
                ]"
                v-for="(item, key) in chooseNumberList"
              >
                {{ item }}
              </li>
            </ul>
            <div class="empty-data" v-else>
              <span>暂无选号内容</span>
            </div>
            <el-dialog title="自选号码" :visible.sync="dialogFormVisible">
              <ul class="item">
                <li
                  class="item-list item-list-red no-radios"
                  v-for="(item, key) in 33"
                  @click="item_click(item, false)"
                >
                  {{ item }}
                </li>
                <li
                  class="item-list item-list-blue no-radios"
                  v-for="(item, key) in 16"
                  @click="item_click(item, true)"
                >
                  {{ item }}
                </li>
              </ul>
              <div>
                已选号码：
                <span v-for="item in emptList"
                  >{{ item }}&nbsp;&nbsp;&nbsp;</span
                >
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">关闭</el-button>
              </div>
            </el-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Clock from "@/components/Clock/index.vue";
import { randomRang } from "@/utils/random";
export default {
  components: {
    Clock,
  },
  data() {
    return {
      chooseNumberList: [],
      type: "",
      dialogFormVisible: false,
      emptList: [],
    };
  },
  methods: {
    /**
     * 机选号码
     */
    choose_number() {
      if (this.type == 1) {
        this.dialogFormVisible = true;
      } else {
        if (!this.type) {
          this.$msg.alert("请先选择选号方式", "error");
          console.log(this.$enum.noticeTypeList);
          return false;
        }
        this.chooseNumberList = [];

        function getRandomNumbers(count) {
          const numbers = new Set();
          while (numbers.size < count) {
            let red_number = randomRang(1, 33);
            numbers.add(red_number);
          }
          return Array.from(numbers);
        }

        // 获取红球
        this.chooseNumberList = getRandomNumbers(6);

        // 排序
        this.chooseNumberList.sort((a, b) => a - b);

        // 获取篮球
        let blue_number = randomRang(1, 16);

        this.chooseNumberList.push(blue_number);
      }
    },
    /**
     * 手动选号
     * @param {*} data
     */
    item_click(data, flag) {
      debugger;
      this.emptList.push(data);
      if (this.emptList.length == 7) {
        this.$msg.confirm("确认选定此注号码？", {
          ok:()=>{
            this.dialogFormVisible = false;
            this.chooseNumberList = this.emptList;
            this.emptList = [];
          },
          cancel:()=> {
            console.log("取消操作");
          },
        });
      }
    },
    clear_number() {
      this.chooseNumberList = [];
      this.emptList = [];
    },

    /***
     * 选号方式 1.自选2.机选
     *
     */
    choose_type(data) {
      this.type = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  margin: 10px;
  .box {
    height: 300px;
    border-radius: 5px;
    .left {
      width: 70%;
      margin: 5px;
      background-color: #ffffff;
    }
    .right {
      width: 30%;
      margin: 5px;
      background-color: #ffffff;
      .content {
        text-align: center;
      }

      .choose-context {
        padding: 10px;
        min-height: 200px;
        font-size: 12px;
        .choose-module {
          margin-top: 10px;
          text-align: center;
          .item {
            text-align: center;
            margin: 0px auto;
            flex-wrap: wrap;
            padding: 0px;
            list-style: none;
            display: inline-flex;
            align-content: center;
            justify-items: center;
            &-list {
              height: 40px;
              width: 40px;
              line-height: 40px;
              font-size: 22px;
              font-weight: 600;

              color: #ffffff;
              margin-top: 10px;
              margin-right: 5px;
              border-radius: 20px;
            }

            &-list-red {
              background: red;
            }
            &-list-blue {
              background: blue;
            }
            .no-radios {
              border-radius: 0px;
            }
          }
        }

        .empty-data {
          line-height: 130px;
          text-align: center;
          span {
            color: #ccc;
          }
        }
      }
    }
  }
}
</style>
