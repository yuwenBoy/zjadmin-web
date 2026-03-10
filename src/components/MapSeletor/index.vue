 <template>
  <div class="map-selector">
    <div class="search-box">
      <el-input
        style="width:300px"
        v-model="searchKeyword"
        placeholder="搜索位置"
        suffix-icon="el-icon-search"
        @input="handleSearchInput"
        @focus="showSuggestions = true"
      />
      <div v-if="showSuggestions && suggestions.length" class="suggestions-list">
        <div
          v-for="(item, index) in suggestions"
          :key="index"
          class="suggestion-item"
          @click="selectSuggestion(item)"
        >
          <i class="el-icon-location-outline" />
          <div class="suggestion-info">
            <div class="name">{{ item.name }}</div>
            <div class="address">{{ item.address }}</div>
          </div>
        </div>
      </div>
    </div>

    <div id="map-container" class="map-box" />

    <div class="map-controls">
      <div class="control-btn text-btn" @click="locateToTextPosition">文</div>
      <div class="zoom-controls">
        <div class="control-btn" @click="zoomIn">+</div>
        <div class="control-btn" @click="zoomOut">-</div>
      </div>
    </div>

    <div v-if="showBubble" class="confirm-bubble">
      <div class="bubble-content">
        <span>是否将该位置设置成门店位置？</span>
        <el-button type="primary" size="mini" class="orange-btn" @click="doSetLocation">确定</el-button>
      </div>
      <div class="bubble-arrow"></div>
    </div>
  </div>
</template>

<script>
import { load } from '@amap/amap-jsapi-loader'
window._AMapSecurityConfig = {
    securityJsCode: '01e416bbc5b83fe7bb77e5d648407d65',
  }
export default {
  name: 'MapSelector',
  props: {
    initialCenter: { type: Array, default: () => [116.407173, 39.90469] },
    // 接收地址详情，用于定位“文”标记的最终位置
    textAddress: { type: String, default: '' },
    textPosition: { type: Array, default: () => [116.407173, 39.90469] }
  },
  data() {
    return {
      searchKeyword: '',
      map: null,
      AMap: null,
      placeSearch: null,
      geocoder: null,
      autoComplete: null,
      suggestions: [],
      showSuggestions: false,
      selectedAddress: null,
      isConfirmed: false,
      showBubble: false,
      tempLng: null,
      tempLat: null,

      textMarker: null,
      userMarker: null,
      dashLine: null
    }
  },
  watch: {
    // 监听地址详情变化，更新“文”标记位置
    textAddress: {
      handler(newVal) {
        debugger
        if (newVal && this.geocoder) {
          this.geocodeAddress(newVal)
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.initMap()
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    if (this.map) this.map.destroy()
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    // ===== 恢复你丢失的 setMapCenter 函数 =====
    setMapCenter(lng, lat) {
      if (!this.map) return
      this.map.setCenter([lng, lat])
      // 同步更新临时坐标，保证气泡/虚线定位准确
      this.tempLng = lng
      this.tempLat = lat
      if (this.userMarker) {
        this.moveUserMarker(lng, lat)
        this.drawDashLine()
      }
    },

    // 根据地址详情解析坐标，更新“文”标记位置
    geocodeAddress(address) {
      this.geocoder.getLocation(address, (status, res) => {
        if (status === 'complete' && res.geocodes && res.geocodes.length > 0) {
          const { lng, lat } = res.geocodes[0].location
          // 更新“文”标记位置
          this.textPosition = [lng, lat]
          if (this.textMarker) {
            this.textMarker.setPosition([lng, lat])
          } else {
            this.addTextMarker()
          }
          // 可选：地图居中到“文”标记位置
          // this.setMapCenter(lng, lat)
        }
      })
    },

    async initMap() {
      try {
        const AMap = await load({
          key: 'ab12bbcc48266078eb07384768c2e5c2',
          version: '2.0',
          plugins: ['AMap.PlaceSearch', 'AMap.Geocoder', 'AMap.AutoComplete', 'AMap.Geolocation'],
        })
        this.AMap = AMap
        this.map = new AMap.Map('map-container', {
          zoom: 16,
          center: this.initialCenter,
          resizeEnable: true
        })

        this.geocoder = new AMap.Geocoder({radius: 1000,
            extensions: "all"})
        this.autoComplete = new AMap.AutoComplete({ city: '全国' })
        this.placeSearch = new AMap.PlaceSearch({ city: '全国' })

        // 点击地图
        this.map.on('click', (e) => {
          this.tempLng = e.lnglat.lng
          this.tempLat = e.lnglat.lat
          this.moveUserMarker(this.tempLng, this.tempLat)
          this.drawDashLine()
          this.showBubble = true

          this.$nextTick(() => {
            const pixel = this.map.lngLatToContainer([this.tempLng, this.tempLat])
            const bubble = document.querySelector('.confirm-bubble')
            if (bubble) {
              bubble.style.left = pixel.x + 'px'
              bubble.style.top = pixel.y - 60 + 'px'
            }
          })
        })

        // 优先根据地址详情初始化“文”标记，无地址则用默认坐标
        if (this.textAddress) {
          this.geocodeAddress(this.textAddress)
        } else {
          this.addTextMarker()
        }
        
        this.createUserMarker()
        this.regeoCode(this.initialCenter[0], this.initialCenter[1])
      } catch (err) {
        console.error('地图初始化失败', err)
      }
    },

    createUserMarker() {
      this.userMarker = new this.AMap.Marker({
        position: this.initialCenter,
        icon: this.getDefaultIcon(),
        offset: new this.AMap.Pixel(-18, -42)
      })
      this.map.add(this.userMarker)
    },

    moveUserMarker(lng, lat) {
      if (!this.userMarker) return
      this.userMarker.setPosition([lng, lat])
      this.userMarker.setIcon(this.getDefaultIcon())
      this.isConfirmed = false
    },

    // 虚线：文中心点 → 定位点中心点
    drawDashLine() {
      if (!this.textMarker || !this.userMarker) return
      const p1 = this.textMarker.getPosition()
      const p2 = this.userMarker.getPosition()

      if (this.dashLine) this.map.remove(this.dashLine)

      this.dashLine = new this.AMap.Polyline({
        path: [p1, p2],
        strokeColor: '#FF5000',
        strokeWeight: 2,
        strokeOpacity: 1,
        strokeStyle: 'dashed',
        strokeDasharray: [8, 4],
        zIndex: 90
      })
      this.map.add(this.dashLine)
    },

    addTextMarker() {
      this.textMarker = new this.AMap.Marker({
        position: this.textPosition,
        icon: new this.AMap.Icon({
          size: new this.AMap.Size(30, 30),
          image: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2230%22%20height%3D%2230%22%3E%3Ccircle%20cx%3D%2215%22%20cy%3D%2215%22%20r%3D%2212%22%20fill%3D%22%23ff5000%22%20stroke%3D%22%23fff%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%2215%22%20y%3D%2219%22%20text-anchor%3D%22middle%22%20fill%3D%22%23fff%22%20font-size%3D%2212%22%20font-weight%3D%22bold%22%3E%E6%96%87%3C%2Ftext%3E%3C%2Fsvg%3E',
          imageSize: new this.AMap.Size(30, 30)
        })
      })
      this.map.add(this.textMarker)
    },

    doSetLocation() {
      if (!this.tempLng || !this.tempLat) return
      this.map.setCenter([this.tempLng, this.tempLat])
      this.regeoCode(this.tempLng, this.tempLat)
      this.userMarker.setIcon(this.getConfirmedIcon())
      this.isConfirmed = true
      this.showBubble = false
    },

    locateToTextPosition() {
      if (!this.textPosition) return
      const [lng, lat] = this.textPosition
      this.tempLng = lng
      this.tempLat = lat
      this.moveUserMarker(lng, lat)
      this.drawDashLine()
      this.showBubble = true

      this.$nextTick(() => {
        const pixel = this.map.lngLatToContainer([lng, lat])
        const bubble = document.querySelector('.confirm-bubble')
        if (bubble) {
          bubble.style.left = pixel.x + 'px'
          bubble.style.top = pixel.y - 60 + 'px'
        }
      })
    },

    handleSearchInput() {
      if (!this.searchKeyword) {
        this.suggestions = []
        return
      }
      this.autoComplete.search(this.searchKeyword, (status, res) => {
        if (status === 'complete') {
          this.suggestions = res.tips
        }
      })
    },

    selectSuggestion(item) {
      this.showSuggestions = false
      const { lng, lat } = item.location
      this.tempLng = lng
      this.tempLat = lat
      this.moveUserMarker(lng, lat)
      this.drawDashLine()
      this.showBubble = true
      this.map.setZoom(18)

      this.$nextTick(() => {
        const pixel = this.map.lngLatToContainer([lng, lat])
        const bubble = document.querySelector('.confirm-bubble')
        if (bubble) {
          bubble.style.left = pixel.x + 'px'
          bubble.style.top = pixel.y - 60 + 'px'
        }
      })
    },

    regeoCode(lng, lat) {
      this.geocoder.getAddress([lng, lat], (status, res) => {
        if (status === 'complete' && res.regeocode) {
          this.selectedAddress = {
            name: res.regeocode.formattedAddress,
            address: res.regeocode.formattedAddress,
            lng, lat
          }
          this.geocodeAddress(this.selectedAddress.address)
          this.$emit('confirm', this.selectedAddress)
        }
      })
    }, 
    // 默认定位图标（红色+尖儿）
    getDefaultIcon() {
      return new this.AMap.Icon({
        size: new this.AMap.Size(36, 42),
        image: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2236%22%20height%3D%2242%22%20viewBox%3D%220%200%2036%2042%22%3E%3Cpath%20d%3D%22M18%200C8%200%200%208%200%2018c0%2010%2018%2024%2018%2024s18-14%2018-24c0-10-8-18-18-18z%22%20fill%3D%22%23ff5000%22%2F%3E%3Ccircle%20cx%3D%2218%22%20cy%3D%2218%22%20r%3D%2210%22%20fill%3D%22white%22%2F%3E%3C%2Fsvg%3E',
        imageSize: new this.AMap.Size(36, 42)
      })
    },

    // 确认后：红色+中间白对勾
    getConfirmedIcon() {
      return new this.AMap.Icon({
        size: new this.AMap.Size(36, 42),
        image: 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2236%22%20height%3D%2242%22%20viewBox%3D%220%200%2036%2042%22%3E%3Cpath%20d%3D%22M18%200C8%200%200%208%200%2018c0%2010%2018%2024%2018%2024s18-14%2018-24c0-10-8-18-18-18z%22%20fill%3D%22%23ff5000%22%2F%3E%3Ccircle%20cx%3D%2218%22%20cy%3D%2218%22%20r%3D%2210%22%20fill%3D%22white%22%2F%3E%3Cpath%20d%3D%22M11%2018L16%2023%2025%2016%22%20stroke%3D%22%23ff5000%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E',
        imageSize: new this.AMap.Size(36, 42)
      })
    },

    zoomIn() { this.map.zoomIn() },
    zoomOut() { this.map.zoomOut() },

    handleClickOutside(e) {
      if (!this.$el.contains(e.target)) {
        this.showSuggestions = false
        this.showBubble = false
      }
    }
  }
}
</script>

<style scoped>
.map-selector {
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
}
.search-box {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 100;
}
.suggestions-list {
  position: absolute;
  top: 45px;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  max-height: 300px;
  overflow-y: auto;
}
.suggestion-item {
  display: flex;
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}
.suggestion-item:hover {
  background: #f5f5f5;
}
.map-box {
  width: 100%;
  height: 100%;
}
.map-controls {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.control-btn {
  width: 32px;
  height: 32px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.text-btn {
  background: #fff;
  font-size: 12px;
  font-weight: bold;
  color:#333;
  margin-bottom: 8px;
}

.confirm-bubble {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 101;
  transform: translate(-50%, -100%);
}
.bubble-content {
  background: #fff;
  padding: 10px 16px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
}
.orange-btn {
  background: #ff5000 !important;
  border-color: #ff5000 !important;
}
.bubble-arrow {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 10px solid #fff;
  margin: 0 auto;
}

.confirm-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
}
</style>