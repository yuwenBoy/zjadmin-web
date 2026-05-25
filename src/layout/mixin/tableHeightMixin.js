export default {
  data() {
    return {
      windowHeight: window.innerHeight,
      headerHeight: 0,
      // 表格高度配置
      tableHeightConfig: {
        // 是否自动计算表格上方元素高度
        autoCalc: false,
        // 表格上方元素的选择器，用于自动计算高度
        headerSelector: '.search-container, .head-container, .content-box',
        // 额外的偏移量（用于表格下方的分页等元素）
        extraOffset: 60,
        // 手动设置的固定偏移量（当autoCalc为false时使用）
        fixedOffset: 280
      }
    };
  },
  computed: {
    tableMaxHeight() {
      const config = this.tableHeightConfig;
      if (config.autoCalc && this.headerHeight > 0) {
        // 自动计算模式：窗口高度 - 顶部元素高度 - 额外偏移
        return this.windowHeight - this.headerHeight - config.extraOffset;
      } else {
        // 固定偏移模式：窗口高度 - 固定偏移量
        return this.windowHeight - config.fixedOffset;
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    if (this.tableHeightConfig.autoCalc) {
      this.$nextTick(() => {
        this.calcHeaderHeight();
      });
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.windowHeight = window.innerHeight;
      if (this.tableHeightConfig.autoCalc) {
        this.calcHeaderHeight();
      }
    },
    calcHeaderHeight() {
      const config = this.tableHeightConfig;
      const selectors = config.headerSelector.split(',');
      let totalHeight = 0;
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector.trim());
        elements.forEach(el => {
          totalHeight += el.offsetHeight;
        });
      });
      
      // 如果找到了元素，使用计算值；否则使用默认值
      if (totalHeight > 0) {
        this.headerHeight = totalHeight;
      } else {
        // 默认值：导航栏50px + 标签页34px + 搜索区域约150px = 234px
        this.headerHeight = 234;
      }
    }
  }
};