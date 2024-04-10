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
                  :style="
                    item === '已选'
                      ? 'font-size:12px;background-color:#c0c0c0'
                      : ''
                  "
                  v-for="(item, key) in red_numList"
                  @click="red_click(item, key)"
                >
                  {{ item }}
                </li>
                <li
                  class="item-list item-list-blue no-radios"
                  :style="
                    item === '已选'
                      ? 'font-size:12px;background-color:#c0c0c0'
                      : ''
                  "
                  v-for="(item, key) in blue_numList"
                  @click="blue_click(item, key)"
                >
                  {{ item }}
                </li>
              </ul>
              <div>
                已选号码：<span
                  v-for="(item, key) in emptList"
                  @click="reset(item, key)"
                  style="font-size: 18px; font-weight: 600"
                  >{{ item }}&nbsp;&nbsp;&nbsp;</span
                >
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save">保存</el-button>
                <el-button @click="cancel">关闭</el-button>
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

      red_numList: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
      ],
      blue_numList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      arr30List: [
        "11,12,15,18,29,33 + 02",
        "01,03,12,19,28,32 + 14",
        "02,07,08,10,26,31 + 06",
        "02,14,17,20,26,33 + 14",
        "01,07,11,12,16,18 + 04",
        "04,08,17,20,22,27 + 13",
        "11,19,23,24,26,33 + 15",
        "01,04,06,11,12,22 + 15",
        "09,11,17,19,30,31 + 11",
        "02,06,13,22,27,32 + 06",
        "10,17,22,26,30,33 + 11",
        "02,05,10,17,24,32 + 03",
        "08,14,15,18,23,33 + 08",
        "03,04,20,23,27,32 + 13",
        "05,06,09,10,15,26 + 12",
        "01,07,14,20,27,30 + 15",
        "03,04,05,08,12,17 + 06",
        "22,26,29,30,32,33 + 14",
        "02,07,09,14,22,23 + 05",
        "05,07,14,23,25,27 + 02",
        "02,03,10,24,28,30 + 08",
        "05,07,14,23,31,33 + 07",
        "06,08,17,25,26,28 + 03",
        "03,06,12,21,27,28 + 04",
        "02,08,15,22,24,26 + 16",
        "05,08,12,20,24,28 + 10",
        "10,17,20,23,27,30 + 10",
        "01,06,12,13,15,24 + 06",
        "09,16,17,24,29,31 + 08",
        "02,03,09,13,19,28 + 09",
      ],
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
    red_click(data, index) {
      if (this.emptList.length >= 6 && this.red_numList.filter(item=>typeof item === 'string').length >=6) {
        this.$msg.alert("红球只能选择6个", "error");
      } else {
        if (typeof data === "string") return false;
        this.emptList.push(data);
        this.red_numList[index] = "已选";
      }
    },
    blue_click(data, index) {
      if (this.emptList.length == 6 && this.blue_numList.filter(item=>typeof item === 'string').length == 0) {
        if (typeof data === "string") return false;
        this.emptList.push(data);
        this.blue_numList[index] = "已选";
      } else if (this.emptList.length == 7) {
        this.$msg.alert("已选完号码", "error");
      } else {
        this.$msg.alert("请先选择完红球", "error");
      }
    },
    clear_number() {
      this.chooseNumberList = [];
      this.emptList = [];
    },
    save() {
      if (this.emptList.length != 7) {
        this.$msg.alert("尚未选完号码，请选择完整后保存", "error");
      } else {
        this.dialogFormVisible = false;
        this.chooseNumberList = this.emptList;
        if (!this.dialogFormVisible) {
          this.emptList = [];
        }
        this.initData();
      }
    },
    initData() {
      this.red_numList = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
      ];
      this.blue_numList = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      ];
    },
    cancel() {
      this.dialogFormVisible = false;
      this.chooseNumberList = [];
      if (!this.dialogFormVisible) {
        this.emptList = [];
      }
      this.initData();
    },
    reset(data, index) {
      if (index == 6) {
        this.blue_numList = this.blue_numList.map((item, key) =>
          key == data - 1 ? data : item
        );
      } else {
        this.red_numList = this.red_numList.map((item, key) =>
          key == data - 1 ? data : item
        );
      }
      this.emptList.splice(index, 1);
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
