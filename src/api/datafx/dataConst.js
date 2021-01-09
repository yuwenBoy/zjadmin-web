
/**
 * datetime:2020年12月4日15:12:17
 * createBy：zhao.jian
 * descript:常用日期常量
 */
class EchartsDateBy {
    month() {
        var monthty = ["1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月"]
        return monthty
    }
    day() {
        let d = [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30
        ]
        return d;
    }
    week() {
        let w = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
        return w
    }
    quarterOne() {
        let one = ["一月", "二月", "三月"];
        return one
    }
    quarterTwo() {
        let two = ["四月", "五月", "六月"];
        return two
    }
    quarterThree() {
        let three = ["七月", "八月", "九月"];
        return three
    }
    quarterFour() {
        let four = ["十月", "十一月", "十二月"];
        return four
    }
}


/**
 * datetime:2020年12月4日15:19:10
 * createBy：zhao.jian
 * descript:常用业务名词常量
 */
class EchartsBussBy {
    deviceUseTitle() {
        let u = [
            {
                title: "全部设备",
                icon: "el-icon-s-home",
                num: 0,
                value: "deviceList"
            },
            { title: "AGV", icon: "el-icon-s-home", num: 4, value: "agv" },
            {
                title: "氦吹中央控制系统",
                icon: "el-icon-s-home",
                num: 1,
                value: "centerOpt"
            },
            {
                title: "导通绝缘测试仪",
                icon: "el-icon-s-home",
                num: 7,
                value: "privateTest"
            },
            {
                title: "总成测试仪",
                icon: "el-icon-s-home",
                num: 20,
                value: "countTest"
            },
            {
                title: "地面能源",
                icon: "el-icon-s-home",
                num: 21,
                value: "floorSource"
            },
            {
                title: "地面电源",
                icon: "el-icon-s-home",
                num: 10,
                value: "floorPower"
            },
            {
                title: "喷管工位",
                icon: "el-icon-s-home",
                num: 21,
                value: "workPosition"
            },
            {
                title: "自动化压装设备",
                icon: "el-icon-s-home",
                num: 1,
                value: "autoDevice"
            }
        ]
        return u;
    }
    dataTitle() {
        let t = [
            { label: "产量统计", value: "numberTotal" },
            { label: "计划完成率", value: "planTotal" },
            { label: "准时交付率", value: "punctual" },
            { label: "装调工时统计", value: "jobTimeTotal" },
            { label: "质量数据统计", value: "qualityTotal" },
            { label: "物料库存统计", value: "stockTotal" },
            { label: "告警数据统计", value: "reportTotal" }
        ];
        return t;
    }
    productName() {
        let p = ["产品1", "产品2", "产品3", "产品4", "产品5", "产品6", "产品7", "产品8"];
        return p
    }
    deviceName() {
        let d = [
            "设备1",
            "设备2",
            "设备3",
            "设备4",
            "设备5",
            "设备6",
            "设备7",
            "设备8"
        ]
        return d;
    }
    planName() {
        let p = [
            "计划1",
            "计划2",
            "计划3",
            "计划4",
            "计划5",
            "计划6",
            "计划7",
            "计划8"
        ]
        return p;
    }
    className() {
        let c = ["班组1", "班组2", "班组3", "班组4", "班组5", "班组6"];
        return c;
    }
    testNo() {
        let t = ["某型1", "某型2", "某型3", "某型4", "某型5"]
        return t;
    }

    deptName() {
        let p = [
            "事业部1",
            "事业部2",
            "事业部3",
            "事业部4",
            "事业部5",
            "事业部6",
            "事业部7",
            "事业部8"
        ]
        return p;
    }
    wuliaoName() {
        let w = ["物料1", "物料2", "物料3", "物料4", "物料5", "物料6", "物料7", "物料8"]
        return w;
    }
    ljName() {
        let l = ["零件1", "零件2", "零件3", "零件4", "零件5", "零件6", "零件7", "零件8"];
        return l;
    }
    jobName() {
        let j = ["任务1", "任务2", "任务3", "任务4", "任务5", "任务6", "任务7", "任务8"];
        return j;
    }

}


// 折线图设置
class SetLineEchart {
    tooltip() {
        let t = {
            trigger: "axis",
            axisPointer: {
                type: "shadow"
            },
            textStyle: {
                align: "left"
            }
        }
        return t;
    }
    legend() {
        var l = {
            show: true,
            icon: "circle",
            orient: "horizontal",
            top: "2.5%",
            right: "0",
            itemWidth: 15,
            itemHeight: 15,
            itemGap: 10,
            textStyle: {
                color: "#FFFFFF"
            }
        }
        return l;
    }

    // 折线颜色
    color() {
        return ["#9b52ff", "#73e2e2", "#ff7e85"] // 默认值
    }
    // x轴
    setX(xData) {
        let x = [
            {
                axisLine: { lineStyle: { color: "rgba(0, 0, 0, 0)" } },
                offset: 0,
                axisLabel: {
                    interval: 0,//控制坐标轴刻度标签的显示间隔.设置成 0 强制显示所有标签。
                    show: true, color: "#fff"
                },
                type: "category",
                axisTick: { show: false },
                data: xData
            }
        ]
        return x;
    }
    // y轴
    setY(yMax = 1) {
        let y = [
            {
                type: "value",
                axisLine: { lineStyle: { color: "rgba(0, 0, 0, 0)" } },
                axisLabel: { formatter: "{value}", color: "#fff", fontSize: 16 },
                axisTick: { show: false },
                splitLine: { show: false },
                min: 0,// 最小值
                max: yMax  // 最大值,默认为1
            }
        ]
        return y
    }
    // series
    setSeries(sName = "使用率", sData = [0.1, 0.2, 0.6, 0.8, 0.4, 0.3, 0.1, 0.9, 0.4, 0.6, 0.4, 0.8]) {
        let s = [
            {
                name: sName,
                type: "line",
                data: sData
            }
        ]
        return s;
    }
}

export default {
    EchartsDateBy: new EchartsDateBy(),
    EchartsBussBy: new EchartsBussBy(),
    SetLineEchart: new SetLineEchart()
}