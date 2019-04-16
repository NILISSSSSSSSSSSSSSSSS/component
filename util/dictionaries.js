import axios from '../axios/index'
import api from '../service/index'
import {getSession} from '../util/publicMehotds.js'
import {Message} from 'element-ui'

///临时清除省市区
export function checkUpdate() {
    localStorage.removeItem("xk-all-address");
    if(localStorage.getItem('updated')){
        cacheProvince();
        return false;
    }
    localStorage.setItem('updated', 1);
    localStorage.removeItem("provinceVersion")
    localStorage.removeItem("cityVersion")
    localStorage.removeItem("districtVersion")
    localStorage.removeItem("sh-province");
    localStorage.removeItem("sh-city");
    localStorage.removeItem("sh-district");
}

function getAddressData(level, version) {
    return new Promise((resolve, reject) => {
        axios.get(api.regionPage, {level: level, v: version, limit: 0, page: 1}, true).then(res => {
            if (res) {
                localStorage.setItem(level==3?"districtVersion": level==2? "cityVersion": "provinceVersion", res.v);
                let arr = [];
                for (let item of res.data) {
                    let obj = {
                        id:item.id,
                        name:item.name
                    }
                    level!=1? obj.parentCode = item.parentCode: null;
                    arr.push([item.code, obj])
                }
                localStorage.setItem(level==3?"xk-district": level==2? "xk-city": "xk-province", JSON.stringify(arr));
            }
            resolve(true);
        }).catch(err => {
            if(err.code!=415) {
                reject(err);
            }
        })
    })
}

export function getAddress() {
    checkUpdate();
    let version_p = JSON.parse(localStorage.getItem("provinceVersion")),
        version_c = JSON.parse(localStorage.getItem("cityVersion")),
        version_d = JSON.parse(localStorage.getItem("districtVersion"));

    let province = getAddressData(1, version_p ? version_p : ""),
        city = getAddressData(2, version_c ? version_c : ""),
        district = getAddressData(3, version_d ? version_d : "");

    Promise.all([province, city, district]).then(()=>{
        cacheProvince();
    })
    .catch(err=>{
        Message.error(err.message);
    })
}

function cacheProvince() {
    let result =[];
    let city = new Map(JSON.parse(localStorage.getItem('xk-city')));
    let district = new Map(JSON.parse(localStorage.getItem('xk-district')));
    city.forEach((item, code) => {
        let arr = {
            cities: []
        };
        district.forEach((subItem, subCode) => {
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
    cacheAllAddress(result)
}

function cacheAllAddress(params) {
    let cities = new Map(params);
    let result = [];
    let province = new Map(JSON.parse(localStorage.getItem('xk-province')))
    province.forEach((item, code) =>{
        let arr = {
            cities: []
        };
        cities.forEach((subItem, subCode) => {
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
    localStorage.setItem('xk-all-address', JSON.stringify(result));
}


//联盟商类型 AllianceMerchantType
function AllianceMerchantType() {
    let data = [
        {
            value: 'personal',
            label: '个人'
        },
        {
            value: 'anchor',
            label: '主播'
        },
        {
            value: 'shops',
            label: '商户'
        },
        {
            value: 'company',
            label: '公司（合伙人）'
        },
        {
            value: 'familyL1',
            label: '普通家族（家族长）'
        },
        {
            value: 'familyL2',
            label: '钻石家族（工会）'
        }];
    localStorage.setItem("AllianceMerchantType", JSON.stringify(data))
}
AllianceMerchantType()

/**
 * 需要用户信息
 */
export function loginRunFun() {
    checkUpdate();
    getAddress();
    // getProvince();
    // getAllCityList();
    // getDistrictCacheList();
    // getMshopqPage();
}

let user = getSession("sh-user") ? JSON.parse(getSession("sh-user")) : {};
if (user.id) {
    loginRunFun();
} else {
    // this.$message({
    //     message: '没有登录',
    //     type: 'warning'
    // });
    // alert('没登录')
}

/**
 * 不需要登录的初始化
 */
