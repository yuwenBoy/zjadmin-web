<!--
============Author:zhao.jian
============Date:2021年11月12日 21:02:43
============Describe：时钟组件
 -->
<template>
  <div>
    <canvas id="clock" width="200" height="200" />
  </div>
</template>
<script>
let dom, ctx, width, height, r, rem, timer

export default {
  name: 'Clock',
  props: {},
  data() {
    return {}
  },
  mounted() {
    timer = setInterval(() => {
      this.draw()
    }, 1000)
  },
  destroyed() {
    clearInterval(timer)
  },
  methods: {
    drawBackground() {
      ctx.save()
      r = width / 2
      // rem 缩放或放大比例
      rem = width / 200
      // 画外面的大圆
      ctx.translate(r, r)
      ctx.beginPath()
      ctx.lineWidth = 10 * rem
      ctx.arc(0, 0, r - ctx.lineWidth / 2, 0, 2 * Math.PI)
      ctx.stroke()
      // 画时针数
      var hourNumbers = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2]
      hourNumbers.forEach(function(number, i) {
        // rad弧度
        var rad = ((2 * Math.PI) / 12) * i
        var x = Math.cos(rad) * (r - 30 * rem)
        var y = Math.sin(rad) * (r - 30 * rem)
        ctx.font = 18 * rem + 'px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(number, x, y)
      })

      // 画秒针点
      for (var i = 0; i < 60; i++) {
        // rad弧度
        var rad = ((2 * Math.PI) / 60) * i
        var x = Math.cos(rad) * (r - 18 * rem)
        var y = Math.sin(rad) * (r - 18 * rem)
        ctx.beginPath()
        if (i % 5 == 0) {
          ctx.fillStyle = '#000'
          ctx.arc(x, y, 2 * rem, 0, 2 * Math.PI, false)
        } else {
          ctx.fillStyle = '#ccc'
          ctx.arc(x, y, 2 * rem, 0, 2 * Math.PI, false)
        }
        ctx.fill()
      }
    },
    // 画时针
    drawHour(hour, minute) {
      ctx.save()
      ctx.beginPath()
      // rad弧度
      var rad = ((2 * Math.PI) / 12) * hour
      // mrad分钟引起的弧度
      var mrad = ((2 * Math.PI) / 12 / 60) * minute
      ctx.rotate(rad + mrad)
      ctx.lineWidth = 6 * rem
      ctx.lineCap = 'round'
      ctx.moveTo(0, 10 * rem)
      ctx.lineTo(0, -r / 2)
      ctx.stroke()
      ctx.restore()
    },
    // 画分钟
    drawMinute(minute) {
      ctx.save()
      ctx.beginPath()
      // rad弧度
      var rad = ((2 * Math.PI) / 60) * minute
      ctx.rotate(rad)
      ctx.lineWidth = 3 * rem
      ctx.lineCap = 'round'
      ctx.moveTo(0, 10 * rem)
      ctx.lineTo(0, -r + 30 * rem)
      ctx.stroke()
      ctx.restore()
    },
    // 画秒针
    drawSecond(second) {
      ctx.save()
      ctx.beginPath()
      // rad弧度
      var rad = ((2 * Math.PI) / 60) * second
      ctx.rotate(rad)
      ctx.fillStyle = '#c14543'
      ctx.moveTo(-2 * rem, 20 * rem)
      ctx.lineTo(2 * rem, 20 * rem)
      ctx.lineTo(1, -r + 18 * rem)
      ctx.lineTo(-1, -r + 18 * rem)
      ctx.fill()
      ctx.restore()
    },
    // 画中间的点
    drawDot() {
      ctx.beginPath()
      ctx.fillStyle = '#fff'
      ctx.arc(0, 0, 3 * rem, 0, 2 * Math.PI, false)
      ctx.fill()
    },
    draw() {
      dom = document.getElementById('clock')
      ctx = dom.getContext('2d')
      width = ctx.canvas.width
      height = ctx.canvas.height
      ctx.clearRect(0, 0, width, height)
      var now = new Date()
      var hour = now.getHours()
      var minute = now.getMinutes()
      var second = now.getSeconds()
      this.drawBackground()
      this.drawHour(hour, minute)
      this.drawMinute(minute)
      this.drawSecond(second)
      this.drawDot()
      ctx.restore()
    }
  }
}
</script>
