<template>
    <div class="province-cascader">
        <el-cascader
            @active-item-change="handleItemChange"
            @change="getValue"
            v-model="rigion"
            :disabled="disabled"
            :props="propsCascader"
            :change-on-select="more"
            size="small"
            :options="options"></el-cascader>
    </div>
</template>
<script>
    export default {
        props: {
            more: {
                type: Boolean,
                default: false
            },
            clearable: {
                type: Boolean,
                default: false
            },
            value: {},
            all: {
                type: Boolean,
                default: false
            },
            onlyRegion:{
                type: Array,
                default: []
            },
            disabled:{
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                propsCascader: {
                    value: 'code',
                    label: 'name',
                    children: 'cities'
                },
                rigion: '',
                options: []
            }
        },
        created() {
            localStorage.getItem('xk-all-address')?this.getAllAddress():this.cacheData();
            this.rigion = this.value
        },
        methods: {
            cacheData() {
                let result =[];
                let city = new Map(JSON.parse(localStorage.getItem('xk-city')));
                let district = new Map(JSON.parse(localStorage.getItem('xk-district')));
                city.forEach((item, code, array) => {
                    let arr = {
                        cities: []
                    };
                    district.forEach((subItem, subCode, subArr) => {
                        if(subItem.parentCode == code) {
                            let obj = subItem;
                            obj.code = subCode;
                            obj.parentCode = code;
                            arr.cities.push(obj)
                        }
                    })
                    arr.code= code;
                    arr.name = item.name;
                    arr.parentCode = item.parentCode;
                    result.push([code, arr]);
                })
                this.cacheProvince(result);
            },
            cacheProvince(params) {
                let cities = new Map(params);
                let result = [];
                let province = new Map(JSON.parse(localStorage.getItem('xk-province')));
                province.forEach((item, code, array) =>{
                    let arr = {
                        cities: []
                    };
                    cities.forEach((subItem, subCode, subArr) => {
                        if(subItem.parentCode == code) {
                            let obj = subItem;
                            obj.code = subCode;
                            arr.cities.push(obj)
                        }
                    })
                    arr.code= code;
                    arr.name = item.name;
                    result.push(arr);
                })
                localStorage.setItem('xk-all-address', JSON.stringify(result))
                this.getAllAddress();
            },
            //获取省份
            getAllAddress() {
                this.options = JSON.parse(localStorage.getItem('xk-all-address'));
                if(this.all){
                    this.options.unshift({code: '000000', name:'全国'})
                }
            },
            handleItemChange(val) {
                this.more? this.rigion = val: null;
            },
            getValue(val) {
                this.$emit("input", val)
            }
        },
        watch: {
            value(val, oldVal) {
                if(val !== oldVal && val) {
                    this.rigion = val;
                }
                if(!val) {
                    this.rigion = [];
                }
            },
            onlyRegion(val){
                this.rigion = val;
            }
        }
    }
</script>
<style lang="scss" scoped>
    .province-cascader {
        /deep/ .el-cascader {
            width: 100%!important;
        }
    }
</style>
