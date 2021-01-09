
<template>
    <div style="position:relative">
    <div style="position:absolute;border-radius:50%;width:300px;height:300px;top:0;left:0;bottom:0;right:0;margin:0 auto;" :style="{background:background}"></div>
    </div>
</template>

<script>
import { randomColor } from '@/utils/random'
export default {
    name: 'Home',
    data() {
        return {
            background: "#ccc"
        }
    },
    created() {
        var that = this
        setInterval(function() {
            that.background = randomColor()
        }, 2000)
    }
}
</script>

<style scope>
.box {
    display: flex;
    width: 150px;
    height: 150px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    align-items: center;
    justify-content: space-evenly;
}

.row {
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
    border: 1px solid #ccc;
}
</style>
