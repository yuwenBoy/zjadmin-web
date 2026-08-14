export default {
  data() {
    return {
      windowHeight: window.innerHeight
    };
  },
  computed: {
    // 表格最大高度 - 返回很大值，由 CSS flex 控制实际高度
    tableMaxHeight() {
      return this.windowHeight - 100;
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.windowHeight = window.innerHeight;
    }
  }
};