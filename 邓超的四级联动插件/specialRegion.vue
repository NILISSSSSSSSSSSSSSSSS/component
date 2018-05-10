<template>
    <div class="specialRegion">
        <div class="page-content">
            <div>
                <select name="" @change="selectA" v-model="ma">
                    <option v-for="(item, index) in a" :key="index" :value="item">{{item}}</option>
                </select>
                <select name="" @change="selectB" v-model="mb">
                    <option v-for="(item, index) in b" :key="index" :value="item">{{item}}</option>
                </select>
                <select name="" @change="selectC" v-model="mc">
                    <option v-for="(item, index) in c" :key="index" :value="item">{{item}}</option>
                </select>
                <select name="" @change="selectD" v-model="md">
                    <option v-for="(item, index) in d" :key="index" :value="item">{{item | killStation}}</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script>
import regionData from "../../assets/region/regionData.json";
var _this;
export default {
  name: "specialRegion",
  data() {
    return {
        a: Object.keys(regionData), //所有省
        b: [], //所有市
        c: [], //所有县
        d: [], //所有街道
        reg: /.+\//,
        // --------------------
        ma: '四川省',//省 值, 默认显示四川省
        mb: '',//市 值
        mc: '',//县 值
        md: '',//街道 值
        selectAll: ''  //所有值
    }
  },
  filters: {
      killStation: function(value) {
          return value.replace(_this.reg, '');
      }
  },
  methods: {
      selectA() {
          _this.b = Object.keys(regionData[_this.ma]);//某个省下面的所有市
          _this.mb = _this.b[0];// 显示某个市的值
          _this.c = Object.keys(regionData[_this.ma][_this.mb]);//某个市下面的所有县
          _this.mc = _this.c[0];// 显示某个县的值
          _this.d = regionData[_this.ma][_this.mb][_this.mc];//某个县下面的所有街道
          _this.md = _this.d[0];//显示某个街道的值
          _this.selectAll = `${_this.ma}-${_this.mb}-${_this.mc}-${_this.md}`;//显示选中的所有省市县值
      },
      selectB() {
          _this.c = Object.keys(regionData[_this.ma][_this.mb]);//某个市下面的所有县
          _this.mc = _this.c[0];// 显示某个县的值
          _this.d = regionData[_this.ma][_this.mb][_this.mc];//某个县下面的所有街道
          _this.md = _this.d[0];//显示某个街道的值
          _this.selectAll = `${_this.ma}-${_this.mb}-${_this.mc}-${_this.md}`;//显示选中的所有省市县值
      },
      selectC() {
          _this.d = regionData[_this.ma][_this.mb][_this.mc];//某个县下面的所有街道
          _this.md = _this.d[0];//显示某个街道的值
          _this.selectAll = `${_this.ma}-${_this.mb}-${_this.mc}-${_this.md}`;//显示选中的所有省市县值
      },
      selectD() {  //点击街道的时候给整个地区赋值
          _this.selectAll = `${_this.ma}-${_this.mb}-${_this.mc}-${_this.md}`;
      }
  },
  created() {
      _this = this;
      _this.selectA();
  }
};
</script>
<style>
.area-class {
  width: 100%;
  height: 50%;
}
</style>
