<template>
    <!-- 新增弹框 -->
    <el-dialog title="选择定位" :visible.sync="mapDia" width="800px" top="100px" :before-close="handleClose" center
        append-to-body>
        <div class="sh-map">

            <div class="box">
                <div class="water"></div>
            </div>
            <div @click="location" class="location">
                <i class="icon-map-location"></i>
            </div>
            <div class="map-search">
                <input @focus="focusInp" @blur="blurInp" id="inpMap" v-model="searchName" class="inp" type="text"
                    placeholder="请输入定位信息">
                <input class="inp-none" v-model="searchName" type="text" id="suggestId">
            </div>

            <baidu-map :center="center" :zoom="zoom" class="bm-view" ak="qffXaE27nOHVv9jksAFD0WbOfLppme1i"
                @ready="readyMap">
            </baidu-map>
            <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;">
            </div>

            <div v-if="isResult" class="result-map">
                <div v-for="(item,index) in result" @click="locationBack(item)" class="result-item">
                    <div class="result-radio">
                        <input :id="index" v-model="address" :value="item.title" name="radio" type="radio">
                    </div>
                    <label :for="index" class="result-content">
                        <span class="title">{{item.title}}</span>
                        <p class="address">{{item.address}}</p>
                    </label>
                </div>
                <span v-if="result.length === 0" class="loading-txt">正在获取周边商圈信息...</span>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
    import { BmMarker } from 'vue-baidu-map/components/index'
    export default {
        props: {
            mapDia: {
                default: true,
            },
            shopsInfo: {
                default: {}
            },
            searchName: {
                default: ''
            }
        },
        components: {
            BaiduMap,
            BmMarker
        },
        data() {
            return {
                center: {
                    lng: this.shopsInfo.lng ? this.shopsInfo.lng : '104.07141371085',
                    lat: this.shopsInfo.lat ? this.shopsInfo.lat : '30.561773238218'
                },
                zoom: 20,
                cityName: "成都",
                searchName: "",
                myValue: "",
                point: null,
                marker: null,
                BMap: null,
                map: null,
                geolocation: null,
                address: this.$route.query.title ? this.$route.query.title : '',
                province: this.$route.query.province ? this.$route.query.province : '',
                city: this.$route.query.city ? this.$route.query.city : '',
                district: this.$route.query.district ? this.$route.query.district : '',
                result: [],
                searchList: [],
                isResult: true,
            }
        },
        methods: {
            handleClose(item) {
                let obj = {
                    lng: typeof item !== "function" ? item.point.lng : this.shopsInfo.lng,
                    lat: typeof item !== "function" ? item.point.lat : this.shopsInfo.lat,
                    searchName: typeof item !== "function" ? item.title : this.searchName
                }
                this.$emit("tellMapResults", obj);
                this.$emit("update:mapDia", false);
            },
            locationBack(item) {
                this.handleClose(item)
            },
            focusInp() {
                this.isResult = false;
            },
            blurInp() {
                this.isResult = true;
            },
            readyMap({ BMap, map }) {
                var that = this;
                [this.BMap, this.map] = [BMap, map];
                this.geolocation = new BMap.Geolocation();
                if (this.center.lat && this.center.lng) {
                    this.moveCenter(this.center);
                } else {
                    this.location();
                }
                //开启滚轮缩放
                this.map.enableScrollWheelZoom(true)
                function G(id) {
                    return document.getElementById(id);
                }
                var ac = new BMap.Autocomplete( //建立一个自动完成的对象
                    {
                        "input": "suggestId",
                        "location": map
                    });
                ac.addEventListener("onhighlight", function (e) { //鼠标放在下拉列表上的事件
                    var str = "";
                    var _value = e.fromitem.value;
                    var value = "";
                    if (e.fromitem.index > -1) {
                        value = _value.province + _value.city + _value.district + _value.street + _value.business;
                    }
                    str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

                    value = "";
                    if (e.toitem.index > -1) {
                        _value = e.toitem.value;
                        value = _value.province + _value.city + _value.district + _value.street + _value.business;
                    }
                    str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                    G("searchResultPanel").innerHTML = str;
                });
                ac.addEventListener("onconfirm", function (e) { //鼠标点击下拉列表后的事件
                    var _value = e.item.value;
                    that.myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                    that.searchName = that.myValue;
                    G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + that.myValue;
                    console.log(that.myValue);
                    that.setPlace(map, that);
                });
                // callNative('jsHiddenXKHUDView');
            },
            location() {
                let _this = this;
                this.$vux.loading.show("正在定位...");
                this.geolocation.getCurrentPosition(function (r) {
                    _this.moveCenter(r);
                    _this.$vux.loading.hide();

                }, { enableHighAccuracy: true })
            },
            moveCenter(r) {
                //将地图中心移动到可视区中点
                this.map.panTo(r.point);
                let centerPixel = this.map.pointToOverlayPixel(this.map.getCenter());
                //通过设置地图的中心点，使定位点显示在手机上部分区域
                this.map.setCenter(this.map.overlayPixelToPoint({ x: centerPixel.x, y: centerPixel.y }));
                this.resultPoint(this.map);
                this.localResult(this.map);
            },
            resultPoint(map) {
                let _this = this;
                map.addEventListener("dragend", function (e) {
                    console.log(e)
                    _this.isResult = true;
                    _this.result = [];
                    _this.localResult(map);
                })
            },
            createMarker(point, map) {
                this.marker = new BMap.Marker(point);// 创建标注
                map.addOverlay(this.marker);
                this.marker.enableDragging();
            },
            localResult(map) {
                console.log()
                let _this = this;
                map.clearOverlays();
                var pixel = map.pointToOverlayPixel(map.getCenter());
                //获得定位图标所在位置在地图上的地理位置，实际上定位图标的像素位置就在地图中心像素位置相应的偏移量处
                var point = map.overlayPixelToPoint({ x: pixel.x, y: pixel.y });
                var options = {
                    onSearchComplete: function (results) {
                        var s = [];
                        for (let item of results) {
                            // 判断状态是否正确
                            if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                                for (var i = 0; i < item.getCurrentNumPois(); i++) {
                                    if (item.getPoi(i).title == _this.address) {
                                        console.log(_this.address);
                                        console.log(item.getPoi(i).point);
                                        item.getPoi(i).isChecked = true;
                                    }
                                    s.push(item.getPoi(i));
                                }
                            }
                        }
                        _this.result = s;
                    },
                };
                let local = new BMap.LocalSearch(map, options);
                let keys = ["写字楼", "餐厅", "酒店", "KTV", "超市", "酒吧", "茶馆", "网吧", "美发", "健身房"];
                local.searchNearby(keys, point, 200);
            },
            setPlace(map, that) {

                map.clearOverlays(); //清除地图上所有覆盖物
                function myFun() {
                    console.log(local.getResults());
                    var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
                    map.centerAndZoom(pp, 18);
                    var marker2 = new BMap.Marker(pp);
                    map.addOverlay(marker2); //添加标注

                    marker2.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                    marker2.enableDragging(); //标注可拖动
                    that.shopsInfo.lng = pp.lng;
                    that.shopsInfo.lat = pp.lat;
                    that.isResult = true;
                    that.localResult(map);
                }
                var local = new BMap.LocalSearch(map, { //智能搜索
                    onSearchComplete: myFun
                });
                local.search(that.myValue);
            }
        }
    }
</script>
<style>
    .tangram-suggestion-main {
        z-index: 1111111111111111;
    }
</style>
<style lang="scss" scoped>
    @import "./map.scss";
</style>